import { VERSION } from "./version.js";
import { translate, hexToRgba, escapeHtml, isLocalMedia, eventLabels, getIcon, getLabelIcon, labelCategory, solidColor, hasDetails, renderDetails, normalizeLabelStyles, labelStyle, labelChipCss } from './helpers.js';
import { boxTracks, withoutBoxes, attachBoxOverlay, boxOverlayCss, keyFrameNumber } from './boxes.js';
import { feedbackCss, feedbackHtml, attachFeedback, feedbackBadgeHtml } from './feedback.js';
import { keepCss, keepHtml, attachKeep } from './keep.js';
export { feedbackBadgeHtml };

// Lifetime of the signed URLs that media_source/resolve_media returns
const MEDIA_URL_TTL_S = 60 * 60 * 3;
// Resolve again this long before a cached URL expires
const MEDIA_URL_RENEW_S = 60 * 10;

function __logLLMVisionBadge(context) {
    if (!window.__LLMVISION_BADGE_LOGGED) {
        console.log(
            `%cLLM Vision Card%c v${VERSION}`,
            'background:#0071FF;color:#fff;padding:2px 6px 2px 8px;border-radius:4px 0 0 4px;font-weight:600;',
            'background:#0058c7;color:#fff;padding:2px 4px;font-weight:500;',
            'background:#0058c7;color:#fff;padding:2px 8px 2px 6px;border-radius:0 4px 4px 0;font-weight:600;'
        );
        window.__LLMVISION_BADGE_LOGGED = true;
    }
}

// Name of a camera entity for display: its device's name when the device has
// no other camera (e.g. "Back C Cam 3" for its "Back C Cam 3 Snapshot"
// entity), else the entity's friendly name, else its entity ID.
function cameraDisplayName(hass, entityId) {
    if (!entityId) return '';
    const entity = hass.states[entityId];
    const friendlyName = entity?.attributes?.friendly_name || entityId;
    const deviceId = hass.entities?.[entityId]?.device_id;
    const device = deviceId ? hass.devices?.[deviceId] : undefined;
    const deviceName = device ? (device.name_by_user || device.name) : '';
    if (!deviceName) return entity ? friendlyName : '';
    const cameras = Object.values(hass.entities || {}).filter(
        (e) => e.device_id === deviceId && e.entity_id.startsWith('camera.')
    );
    return cameras.length === 1 ? deviceName : (entity ? friendlyName : '');
}

// An API event's retention fields, or null from an integration without them
// (the popup then has no Keep switch)
function retentionState(item) {
    if (!item || typeof item.keep !== 'boolean') return null;
    return { keep: item.keep, reviewed: Boolean(item.reviewed), purgeAfter: item.purge_after || null };
}

export class BaseLLMVisionCard extends HTMLElement {
    imageCache = new Map();
    _lastEventHash = null;
    _lastFetch = 0;
    _fetchPromise = null;
    _cachedEvents = null;

    connectedCallback() {
        if (!this._badgeLogged) {
            __logLLMVisionBadge(this.badgeContext || 'Card');
            this._badgeLogged = true;
        }
    }

    setCommonConfig(config, { requireEventLimits = false } = {}) {
        this.config = config;
        this.category_filters = config.category_filters || [];
        this.camera_filters = config.camera_filters || [];
        this.language = config.language;
        this.number_of_events = config.number_of_events;
        this.number_of_days = config.number_of_days;
        this.custom_colors = config.custom_colors || {};
        // Colors and icons of specific labels (see normalizeLabelStyles)
        this.label_styles = normalizeLabelStyles(config.label_styles);
        this.default_icon = config.default_icon || 'mdi:motion-sensor';
        this.default_color = config.default_color || '#929292';
        this.time_format = config.time_format || '24h';
        this.filter_false_positives = config.filter_false_positives !== false;
        this.refresh_interval = Math.max(1, Number(config.refresh_interval || 15));
        if (requireEventLimits) {
            if (!this.number_of_events && !this.number_of_days) {
                throw new Error('Either number_of_events or number_of_days needs to be set.');
            }
            if (this.number_of_events && this.number_of_events < 1) {
                throw new Error('number_of_events must be greater than 0.');
            }
        }
    }

    async fetchEvents(hass, {
        limit = 10,
        days = null,
        hours = null,
        cameras = [],
        categories = [],
        includeNoActivity = false
    } = {}) {
        const now = Date.now();
        const refreshMs = (this.refresh_interval || 15) * 1000;
        if (this._fetchPromise) return this._fetchPromise;
        if (this._cachedEvents && now - this._lastFetch < refreshMs) return this._cachedEvents;

        this._lastFetch = now;
        this._fetchPromise = this._fetchEvents(hass, { limit, days, hours, cameras, categories, includeNoActivity });
        try {
            this._cachedEvents = await this._fetchPromise;
            return this._cachedEvents;
        } finally {
            this._fetchPromise = null;
        }
    }

    async _fetchEvents(hass, {
        limit = 10,
        days = null,
        hours = null,
        cameras = [],
        categories = [],
        includeNoActivity = false
    } = {}) {
        try {
            const params = new URLSearchParams();
            if (limit) params.set('limit', limit);
            if (cameras?.length) {
                params.set('cameras', cameras.join(','));
            }
            if (days) params.set('days', days);
            if (hours) params.set('hours', hours);
            if (categories?.length) {
                params.set('categories', categories.join(','));
            }
            params.set('include_no_activity', includeNoActivity ? 'true' : 'false');

            const path = `llmvision/timeline/events${params.toString() ? '?' + params.toString() : ''}`;
            const data = await hass.callApi('GET', path);
            const items = Array.isArray(data?.events) ? data.events : [];

            return items.map((item) => {
                const cameraEntityId = item.camera_name || '';
                const cameraFriendlyName = cameraDisplayName(hass, cameraEntityId);
                const labels = eventLabels(item);
                return {
                    title: item.title || '',
                    description: item.description || '',
                    category: item.category || '',
                    // The primary label, which picks the event's icon
                    label: labels[0] || '',
                    labels,
                    keyFrame: (item.key_frame || ''),
                    clip: (item.clip || ''),
                    // Extra structured data (any JSON value), or null
                    details: item.details ?? null,
                    // The user's verdict on the analysis, or null
                    feedback: item.feedback ?? null,
                    // Retention: kept by the user, reviewed (always kept), and
                    // when retention would otherwise remove the event
                    retention: retentionState(item),
                    cameraName: cameraFriendlyName,
                    startTime: item.start || null,
                    endTime: item.end || null,
                    id: item.uid || '',
                };
            });
        } catch (err) {
            console.error('Error fetching events from API:', err);
            return null;
        }
    }

    async deleteEvent(hass, eventId) {
        try {
            await hass.callApi('DELETE', `llmvision/timeline/event/${encodeURIComponent(eventId)}`);
            return true;
        } catch (err) {
            console.error('Error deleting event from API:', err);
            return false;
        }
    }

    _hashState(base) {
        return JSON.stringify(base);
    }

    _sort(details) {
        return details.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    }

    _limit(details) {
        if (this.number_of_days) {
            // number_of_events acts as secondary limiter only after hours filter
            if (this.number_of_events) return details.slice(0, this.number_of_events);
            return details;
        }
        if (this.number_of_events) return details.slice(0, this.number_of_events);
        return details;
    }

    formatDateLabel(dateObj) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (dateObj.toDateString() === today.toDateString()) return translate('today', this.language) || "Today";
        if (dateObj.toDateString() === yesterday.toDateString()) return translate('yesterday', this.language) || "Yesterday";
        return dateObj.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    }

    formatTime(dateObj) {
        const format = this.time_format || '24h';
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        if (format === '12h') {
            const hours = dateObj.getHours();
            const normalized = hours % 12 || 12;
            const suffix = hours >= 12 ? 'PM' : 'AM';
            return `${normalized.toString().padStart(2, '0')}:${minutes} ${suffix}`;
        }
        return `${dateObj.getHours().toString().padStart(2, '0')}:${minutes}`;
    }

    formatDateTimeShort(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const options = { month: 'short', day: 'numeric' };
        if (date.toDateString() === today.toDateString()) {
            return translate('today', this.language) || "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return translate('yesterday', this.language) || "Yesterday";
        }
        return date.toLocaleDateString('en-US', options);
    }

    formatDateTimeFull(dateStr) {
        const d = new Date(dateStr);
        const options = { month: 'short', day: 'numeric' };
        const datePart = d.toLocaleDateString('en-US', options);
        const timePart = this.formatTime(d);
        return `${datePart}, ${timePart}`;
    }

    // Turns a file under /media/ (a key frame or a clip) into a signed URL.
    // Only Home Assistant's own media is shown: an event's key frame or clip
    // given as an absolute URL elsewhere is not loaded (see isLocalMedia).
    resolveMedia(hass, path, { fallback = path } = {}) {
        if (!path || !isLocalMedia(path)) return Promise.resolve('');
        // An inline image is already here
        if (/^data:/i.test(path.trim())) return Promise.resolve(path.trim());
        const mediaContentID = path.replace('/media/', 'media-source://media_source/local/');
        const cached = this.imageCache.get(mediaContentID);
        if (cached && cached.renewAt > Date.now()) {
            return Promise.resolve(cached.url);
        }
        return hass.callWS({
            type: "media_source/resolve_media",
            media_content_id: mediaContentID,
            expires: MEDIA_URL_TTL_S
        }).then(result => {
            const url = result.url;
            this.imageCache.set(mediaContentID, {
                url,
                renewAt: Date.now() + (MEDIA_URL_TTL_S - MEDIA_URL_RENEW_S) * 1000,
            });
            return url;
        }).catch(err => {
            console.error("Error resolving media content ID:", err);
            return fallback;
        });
    }

    resolveKeyFrame(hass, keyFrame) {
        return this.resolveMedia(hass, keyFrame);
    }

    // Shows url in imgEl once it is fully downloaded and decoded. A key frame
    // is a ~200 KB baseline JPEG; shown while loading, it is painted top to
    // bottom, and Safari can leave it half painted (the rest blank) in a
    // scrolled card. Retries once after a failed load, then gives up and
    // leaves the image hidden.
    showImageWhenLoaded(imgEl, url, display = '', attempt = 0) {
        if (!imgEl || !url) return;
        const loader = new Image();
        loader.src = url;
        const show = () => {
            if (!imgEl.isConnected) return;
            imgEl.src = url;
            imgEl.style.display = display;
        };
        const decoded = typeof loader.decode === 'function'
            ? loader.decode()
            : new Promise((resolve, reject) => { loader.onload = resolve; loader.onerror = reject; });
        decoded.then(show).catch(() => {
            if (attempt < 1) setTimeout(() => this.showImageWhenLoaded(imgEl, url, display, attempt + 1), 1000);
        });
    }

    // '' when the clip can't be resolved, so that the popup shows the key frame
    resolveClip(hass, clip) {
        return this.resolveMedia(hass, clip, { fallback: '' });
    }

    // Resolves the event's key frame and clip, then opens its popup
    openEventPopup(hass, d, icon) {
        return Promise.all([
            this.resolveKeyFrame(hass, d.keyFrame),
            this.resolveClip(hass, d.clip),
        ]).then(([keyFrameUrl, clipUrl]) => {
            this.showPopup({
                event: d.title,
                summary: d.description,
                startTime: d.startTime,
                keyFrame: keyFrameUrl,
                clip: clipUrl,
                cameraName: d.cameraName,
                category: d.category,
                label: d.label,
                labels: d.labels,
                details: d.details,
                feedback: d.feedback,
                // Keep the event's feedback current for the next popup
                onFeedback: (feedback) => {
                    d.feedback = feedback;
                    this.feedbackChanged?.(d);
                },
                retention: d.retention,
                onRetention: (retention) => { d.retention = retention; },
                icon: icon,
                prefix: 'popup',
                eventId: d.id
            }, hass);
        });
    }

    computeColors(category, defaultColor) {
        const customColors = this.custom_colors || {};
        let color;
        if (category === undefined || category === null) {
            if (this.default_color !== undefined) color = this.default_color;
            else color = defaultColor;
        } else {
            color = (customColors[category] !== undefined) ? customColors[category] : defaultColor;
        }
        let bgColorRgba, iconColorRgba;
        if (Array.isArray(color) && color.length === 3) {
            bgColorRgba = `rgba(${color[0]},${color[1]},${color[2]},0.2)`;
            iconColorRgba = `rgba(${color[0]},${color[1]},${color[2]},1)`;
        } else {
            bgColorRgba = hexToRgba(color, 0.2);
            iconColorRgba = hexToRgba(color, 1);
        }
        return { bgColorRgba, iconColorRgba };
    }

    // The full color of a label, as its badge shows it: its style's color, else
    // the color of the category it belongs to (see labelCategory). Bounding
    // boxes use it so that a box matches its label. {color, text} or null.
    labelColor(label, category) {
        const style = labelStyle(this.label_styles, label);
        if (style) return solidColor(style.solid);
        const own = labelCategory(label, category);
        return solidColor(this.computeColors(own, getIcon(own, '').color).iconColorRgba);
    }

    // An event's category and label badges: the category (unless a label
    // already says it) with its icon, then each label with its style's
    // icon or its known icon. A label with a style has its colors; the others
    // are tinted in the color of the category they belong to ("raccoon" in
    // the animal color even in a person event), with the icon in full color.
    // Used by the popup and the timeline list, with their own badge class.
    labelBadgesHtml(category, labels, badgeClass) {
        const normalize = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value);
        const labelList = Array.isArray(labels) ? labels : [];
        const showCategory = Boolean(category && !labelList.some((l) => normalize(l) === normalize(category)));
        const { icon: categoryIcon, color: categoryColor } = getIcon(category, '');
        const { bgColorRgba, iconColorRgba } = this.computeColors(category, categoryColor);
        const badge = (icon, text, css, iconColor = '') => `<span class="${badgeClass}" style="${css}"><ha-icon icon="${escapeHtml(icon)}"${iconColor ? ` style="color:${iconColor};"` : ''}></ha-icon><span class="text">${escapeHtml(text)}</span></span>`;
        const categoryBadge = (icon, text) => badge(icon, text, labelChipCss(null, bgColorRgba), iconColorRgba);
        return (showCategory ? categoryBadge(categoryIcon, category) : '') + labelList.map((l) => {
            const style = labelStyle(this.label_styles, l);
            const icon = style?.icon || getLabelIcon(l, category);
            if (style) return badge(icon, l, labelChipCss(style));
            const own = labelCategory(l, category);
            if (own === category) return categoryBadge(icon, l);
            const colors = this.computeColors(own, getIcon(own, '').color);
            return badge(icon, l, labelChipCss(null, colors.bgColorRgba), colors.iconColorRgba);
        }).join('');
    }

    showPopup({ event, summary, startTime, keyFrame, clip, cameraName, category, label, labels, details, feedback, onFeedback, retention, onRetention, icon, prefix, eventId }, hassArg) {
        const hass = hassArg || this.hass;
        const formattedTime = this.formatDateTimeFull(startTime);
        const secondaryText = cameraName ? `${formattedTime} • ${cameraName}` : formattedTime;
        const overlayClass = `${prefix}-overlay`;
        const contentClass = `${prefix}-content`;
        const closeBtnClass = `close-${prefix}`;
        // New menu-related classes
        const headerRowClass = `${prefix}-header-row`;
        const titleRowClass = `${prefix}-title-row`;
        const menuWrapperClass = `${prefix}-menu`;
        const menuBtnClass = `${prefix}-menu-btn`;
        const menuListClass = `${prefix}-menu-list`;
        const menuItemClass = `${prefix}-menu-item`;
        const menuDeleteClass = `${prefix}-menu-item-delete`;

        const labelList = Array.isArray(labels) ? labels : (label ? [label] : []);
        const hasSnapshot = typeof keyFrame === 'string' ? keyFrame.trim().length > 0 : Boolean(keyFrame);
        // Bounding boxes from the details, drawn over the clip
        const boxes = clip ? boxTracks(details, (l, c) => this.labelColor(l, c)) : { rate: 1, tracks: [] };
        // The clip when there is one, with the key frame as its poster
        const mediaBlock = clip
            ? `<div class="llmvision-boxes-media"><video controls playsinline webkit-playsinline preload="metadata"${hasSnapshot ? ` poster="${escapeHtml(keyFrame)}"` : ''} src="${escapeHtml(clip)}"></video></div>`
            : `<img src="${escapeHtml(keyFrame)}" alt="Event Snapshot" onerror="this.style.display='none'">`;

        const htmlBlock = `
                <div>
                    <div class="${headerRowClass}">
                        <button class="${closeBtnClass}" title="Close" style="font-size:30px">
                            <ha-icon icon="mdi:close"></ha-icon>
                        </button>
                        <div class="${prefix}-title-main">
                            <h2 data-part="title">${escapeHtml(event)}</h2>
                        </div>
                        ${eventId ? `
                            <div class="${menuWrapperClass}">
                            <button class="${menuBtnClass}" title="Menu" style="font-size:26px">
                                <ha-icon icon="mdi:dots-vertical"></ha-icon>
                            </button>
                            <div class="${menuListClass}" hidden>
                                <button class="${menuItemClass} ${menuDeleteClass}" title="Delete event">
                                    <ha-icon icon="mdi:trash-can-outline"></ha-icon>
                                    <span>${translate('delete', this.language) || 'Delete'}</span>
                                </button>
                            </div>
                        </div>` : `<div class="${prefix}-menu-placeholder"></div>`}
                    </div>
                    <div class="${titleRowClass}">
                        <div class="${prefix}-title-secondary">
                            <p class="secondary"><span>${escapeHtml(secondaryText)}</span></p>
                        </div>
                        <div class="${prefix}-title-tertiary">
                            <div class="${prefix}-badges-row">
                                ${this.labelBadgesHtml(category, labelList, `${prefix}-badge`)}
                            </div>
                        </div>
                    </div>
                    ${mediaBlock}
                    <p class="summary" data-part="description">${escapeHtml(summary)}</p>
                    ${eventId && retention ? keepHtml(prefix, Boolean(clip)) : ''}
                    ${eventId || hasDetails(withoutBoxes(details)) ? `
                    <details class="${prefix}-details">
                        <summary>${escapeHtml(translate('additional_details', this.language) || 'Additional details')}</summary>
                        <div class="${prefix}-details-body">${eventId ? feedbackHtml(prefix) : ''}${hasDetails(withoutBoxes(details)) ? renderDetails(withoutBoxes(details)) : ''}</div>
                    </details>` : ''}
                </div>
            `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
                <div class="${overlayClass}">
                    <div class="${contentClass}">
                        ${htmlBlock}
                    </div>
                </div>
                <style>
                    .${overlayClass} {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                    }
                    .${overlayClass}.show { opacity: 1; }
                    .${contentClass} {
                        position: relative;
                        background: var(--ha-card-background, var(--card-background-color, #f3f3f3));
                        color: var(--primary-text-color);
                        padding: 20px;
                        border-radius: var(--ha-card-border-radius, 25px);
                        max-width: 900px;
                        width: calc(100vw - 48px);
                        box-sizing: border-box;
                        max-height: 90vh;
                        overflow-y: auto;
                        overscroll-behavior: contain;
                        transform: scale(0.9);
                        transition: transform 0.2s ease;
                    }
                    .${overlayClass}.show .${contentClass} { transform: scale(1); }
    
                    .${headerRowClass} {
                        display: flex;
                        /* Buttons line up with the title's first line */
                        align-items: flex-start;
                        gap: 8px;
                        margin-bottom: 4px;
                    }
                    /* Same width on both sides of the title keeps it centered.
                       All three are centered as boxes: the menu button is
                       centered in its wrapper rather than set on a text line. */
                    .${headerRowClass} > .${closeBtnClass},
                    .${headerRowClass} > .${menuWrapperClass},
                    .${headerRowClass} > .${prefix}-menu-placeholder {
                        flex: 0 0 40px;
                        height: 40px;
                    }
                    .${headerRowClass} > .${menuWrapperClass} {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .${headerRowClass} .${closeBtnClass},
                    .${headerRowClass} .${menuBtnClass} {
                        width: 40px;
                        height: 40px;
                        padding: 0;
                        margin: 0;
                        line-height: 0;
                    }
    
                    /* Title row: icon + title */
                    .${titleRowClass} {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 6px;
                    }
                    /* Title, between the close and menu buttons */
                    .${prefix}-title-main {
                        flex: 1 1 auto;
                        min-width: 0;
                        display: flex;
                        justify-content: center;
                    }
                    .${prefix}-title-main h2 {
                        flex: 1 1 auto;
                        min-width: 0;
                        max-width: 100%;
                        overflow: visible;
                        white-space: normal;
                        word-break: break-word;
                        margin: 0;
                        line-height: 1.25;
                        /* Centers the first line on the 40px buttons */
                        padding-top: calc((40px - 1.25em) / 2);
                        font-family: var(--ha-font-family-heading, "Roboto");
                        text-align: center;
                    }
                    .${prefix}-title-secondary {
                        width: 100%;
                        text-align: center;
                    }
                    .${prefix}-title-secondary .secondary {
                        font-weight: var(--ha-font-weight-medium, 500);
                        margin-top: 4px;
                        color: var(--primary-text-color);
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${prefix}-title-tertiary {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                    }
                    .${prefix}-badges-row {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 8px;
                        width: 100%;
                    }
                    .${prefix}-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 4px 10px;
                        border-radius: 9px;
                        background: var(--table-header-background-color, rgba(0,0,0,0.08));
                        color: var(--primary-text-color);
                        font-size: 0.9em;
                        line-height: 1;
                    }
                    .${prefix}-badge .text {
                        text-transform: capitalize;
                    }
                    .${prefix}-badge ha-icon {
                        --mdc-icon-size: 18px;
                    }
    
                    ${boxOverlayCss}
                    ${feedbackCss(prefix)}
                    ${keepCss(prefix)}

                    /* Image or clip, and text */
                    .${contentClass} img, .${contentClass} video {
                        width: 100%;
                        height: auto;
                        border-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
                        margin-top: 10px;
                    }
                    .${contentClass} video {
                        display: block;
                        max-height: 60vh;
                        background: #000;
                    }
                    .${contentClass} .summary {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-l, 16px);
                        line-height: 22px;
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
    
                    /* Additional details, collapsed until opened */
                    .${prefix}-details {
                        margin-top: 4px;
                        border-top: 1px solid var(--divider-color, rgba(0,0,0,0.12));
                        font-family: var(--ha-font-family-body, "Roboto");
                    }
                    .${prefix}-details > summary {
                        cursor: pointer;
                        padding: 10px 0;
                        font-weight: var(--ha-font-weight-medium, 500);
                        color: var(--primary-text-color);
                        list-style: none;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .${prefix}-details > summary::-webkit-details-marker { display: none; }
                    .${prefix}-details > summary::before {
                        content: '';
                        border-style: solid;
                        border-width: 0.35em 0.35em 0 0.35em;
                        border-color: currentColor transparent transparent transparent;
                        transform: rotate(-90deg);
                        transition: transform 0.2s;
                    }
                    .${prefix}-details[open] > summary::before { transform: rotate(0); }
                    .${prefix}-details-body {
                        color: var(--secondary-text-color);
                        font-size: var(--ha-font-size-m, 14px);
                        line-height: 1.4;
                        padding-bottom: 8px;
                        overflow-wrap: anywhere;
                    }
                    .${prefix}-details-body .details-table-wrap {
                        overflow-x: auto;
                    }
                    .${prefix}-details-body .details-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: inherit;
                        overflow-wrap: normal;
                    }
                    .${prefix}-details-body .details-table th,
                    .${prefix}-details-body .details-table td {
                        text-align: left;
                        vertical-align: top;
                        padding: 6px 10px;
                        border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.12));
                    }
                    .${prefix}-details-body .details-table td {
                        color: var(--primary-text-color);
                    }
                    .${prefix}-details-body .details-table thead th {
                        font-weight: var(--ha-font-weight-medium, 500);
                        font-size: 0.9em;
                        color: var(--secondary-text-color);
                        white-space: nowrap;
                    }
                    .${prefix}-details-body .details-table thead tr {
                        background: var(--table-header-background-color, rgba(127,127,127,0.08));
                    }
                    .${prefix}-details-body .details-table tbody th {
                        font-weight: var(--ha-font-weight-medium, 500);
                        color: var(--primary-text-color);
                        white-space: nowrap;
                        width: 1%;
                    }
                    .${prefix}-details-body .details-table tbody tr:last-child > * {
                        border-bottom: none;
                    }
                    .${prefix}-details-body .details-table .details-table-wrap {
                        margin: -2px 0;
                    }
                    .${prefix}-details-body .details-list {
                        margin: 0;
                        padding-left: 1.2em;
                    }
                    .${prefix}-details-body .details-list > li + li { margin-top: 6px; }
                    .${prefix}-details-body .details-empty { opacity: 0.6; }
                    .${prefix}-details-body .details-section + .details-section { margin-top: 12px; }
                    .${prefix}-details-body h4 {
                        margin: 0 0 4px;
                        font-size: inherit;
                        font-weight: var(--ha-font-weight-bold, 600);
                        color: var(--primary-text-color);
                    }

                    /* Buttons */
                    .${closeBtnClass}, .${menuBtnClass} {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: var(--primary-text-color);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
    
                    /* Menu */
                    .${menuWrapperClass} {
                        position: relative;
                    }
                    .${menuListClass} {
                        position: absolute;
                        right: 0;
                        top: calc(100% + 6px);
                        background: var(--ha-card-background, var(--card-background-color, #f3f3f3));
                        color: var(--primary-text-color);
                        border-radius: 10px;
                        box-shadow: 0 6px 18px rgba(0,0,0,0.2);
                        padding: 6px;
                        min-width: 160px;
                        z-index: 10;
                    }
                    .${menuItemClass} {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        background: none;
                        border: none;
                        color: inherit;
                        cursor: pointer;
                        padding: 8px 10px;
                        border-radius: 8px;
                    }
                    .${menuItemClass}:hover {
                        background: rgba(0,0,0,0.06);
                    }
                    .${menuDeleteClass} {
                        color: var(--error-color, #d32f2f);
                    }
    
                    @media (max-width: 768px) {
                        .${contentClass} {
                            max-width: 100%;
                            width: 100%;
                            max-height: 100%;
                            box-sizing: border-box;
                            /* Full screen: keep clear of the notch, status bar
                               and home indicator */
                            padding: max(15px, env(safe-area-inset-top))
                                max(15px, env(safe-area-inset-right))
                                max(15px, env(safe-area-inset-bottom))
                                max(15px, env(safe-area-inset-left));
                            border-radius: 0;
                            height: 100%;
                        }
                        .${headerRowClass} {
                            padding-top: 10px;
                        }
                    }
                </style>
            `;

        if (!history.state || !history.state.popupOpen) {
            history.pushState({ popupOpen: true }, '');
        }
        const overlayEl = wrapper.querySelector(`.${overlayClass}`);
        const popstateHandler = () => this.closePopup(wrapper, overlayClass, popstateHandler);
        window.addEventListener('popstate', popstateHandler);
        wrapper.querySelector(`.${closeBtnClass}`).addEventListener('click', () =>
            this.closePopup(wrapper, overlayClass, popstateHandler)
        );
        overlayEl.addEventListener('click', (ev) => {
            if (ev.target === overlayEl) this.closePopup(wrapper, overlayClass, popstateHandler);
        });
        const escHandler = (ev) => {
            if (ev.key === 'Escape') this.closePopup(wrapper, overlayClass, popstateHandler, escHandler);
        };
        document.addEventListener('keydown', escHandler);
        wrapper._escHandler = escHandler;

        // Menu toggle and outside-click close
        const menuBtn = wrapper.querySelector(`.${menuBtnClass}`);
        const menuList = wrapper.querySelector(`.${menuListClass}`);
        if (menuBtn && menuList) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuList.hidden = !menuList.hidden;
            });
            wrapper.addEventListener('click', (e) => {
                if (!menuList.hidden && !e.target.closest(`.${menuWrapperClass}`)) {
                    menuList.hidden = true;
                }
            });
        }

        // Wire up Delete inside menu
        const deleteItem = wrapper.querySelector(`.${menuDeleteClass}`);
        if (deleteItem && eventId) {
            deleteItem.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (deleteItem.disabled) return;
                const confirmMsg = translate('confirm_delete_event', this.language) || "Are you sure you want to delete this event?";
                if (!confirm(confirmMsg)) {
                    if (menuList) menuList.hidden = true;
                    return;
                }
                deleteItem.disabled = true;
                const success = await this.deleteEvent(hass, eventId);
                if (success) {
                    this.closePopup(wrapper, overlayClass, popstateHandler, escHandler);
                } else {
                    alert(translate('error_delete_event', this.language) || "Failed to delete the event. Please try again.");
                    deleteItem.disabled = false;
                    if (menuList) menuList.hidden = true;
                }
            });
        }

        document.body.appendChild(wrapper);
        this.lockPageScroll(wrapper);
        if (eventId) {
            const eventPath = `llmvision/timeline/event/${encodeURIComponent(eventId)}`;
            const keep = retention ? attachKeep(wrapper, prefix, {
                state: retention,
                save: async (value) => retentionState((await hass.callApi('POST', `${eventPath}/keep`, { keep: value }))?.event),
                formatTime: (iso) => this.formatDateTimeFull(iso),
                onChange: (state) => onRetention?.(state),
            }) : null;
            attachFeedback(wrapper, prefix, {
                feedback,
                save: async ({ verdict, comment, marks }) => {
                    const res = await hass.callApi('POST', `${eventPath}/feedback`, { verdict, comment, marks });
                    // Feedback makes the event reviewed, which locks Keep on
                    if (keep && res?.event) {
                        const state = retentionState(res.event);
                        keep.update(state);
                        onRetention?.(state);
                    }
                    return res?.event?.feedback ?? null;
                },
                formatTime: (iso) => this.formatDateTimeFull(iso),
                onSaved: (saved) => onFeedback?.(saved),
            });
        }
        // Every clip gets the card's viewer, with boxes when the event has them
        if (clip) {
            wrapper._boxOverlay = attachBoxOverlay(wrapper.querySelector('.llmvision-boxes-media'), wrapper.querySelector('.llmvision-boxes-media video'), boxes, { posterFrame: hasSnapshot ? keyFrameNumber(keyFrame) : null });
        }
        requestAnimationFrame(() => overlayEl.classList.add('show'));
    }

    // The page under a popup doesn't scroll: wheel and touch scrolling over
    // the popup used to move the timeline behind it. Locks nest, so the page
    // scrolls again once the last popup closes. Only <html> is locked: HA's
    // body is height:100%, so overflow:hidden on it clipped the page to one
    // screen and the timeline jumped to the top. The scroll position is put
    // back on unlock in case a browser still moved it.
    lockPageScroll(wrapper) {
        if (wrapper._scrollLocked) return;
        wrapper._scrollLocked = true;
        window.__llmvisionScrollLocks = (window.__llmvisionScrollLocks || 0) + 1;
        if (window.__llmvisionScrollLocks === 1) {
            const root = document.documentElement;
            window.__llmvisionScrollRestore = {
                overflow: root.style.overflow,
                x: window.scrollX,
                y: window.scrollY,
            };
            root.style.overflow = 'hidden';
        }
    }

    unlockPageScroll(wrapper) {
        if (!wrapper._scrollLocked) return;
        wrapper._scrollLocked = false;
        window.__llmvisionScrollLocks = Math.max(0, (window.__llmvisionScrollLocks || 1) - 1);
        const saved = window.__llmvisionScrollRestore;
        if (window.__llmvisionScrollLocks === 0 && saved) {
            document.documentElement.style.overflow = saved.overflow;
            window.__llmvisionScrollRestore = null;
            if (window.scrollX !== saved.x || window.scrollY !== saved.y) {
                window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
            }
        }
    }

    closePopup(wrapper, overlayClass, popstateHandler, escHandler) {
        // The clip back from full screen, then stopped now rather than when
        // the fade-out ends
        wrapper._boxOverlay?.close();
        wrapper.querySelectorAll('video').forEach((video) => video.pause());
        this.unlockPageScroll(wrapper);
        const overlay = wrapper.querySelector(`.${overlayClass}`);
        overlay.classList.remove('show');
        overlay.addEventListener('transitionend', () => {
            if (wrapper._escHandler) document.removeEventListener('keydown', wrapper._escHandler);
            try {
                document.body.removeChild(wrapper);
            } catch (err) {
                // already removed
            }
        }, { once: true });
        if (history.state && history.state.popupOpen) {
            history.replaceState(null, '');
        }
        window.removeEventListener('popstate', popstateHandler);
    }
}