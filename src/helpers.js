import { labels } from './labels.js';
import { bg, ca, cs, da, de, en, es, fr, hu, it, nl, pl, pt, sk, sv, el } from './translations.js';

export function hexToRgba(hex, alpha = 1) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
        c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

// Event titles and descriptions come from the model, and camera names from
// users: they are text, never markup.
export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Labels are free text, so look them up as own keys only ("constructor" is a
// label, not Object.prototype.constructor).
function ownValue(obj, key) {
    return obj && typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key)
        ? obj[key]
        : undefined;
}

// The icon of label among a category's known labels: the whole label, else its
// words from last to first, since the last is usually the main one ("gray
// squirrel", "domestic cat", "scrub jay").
function knownLabelIcon(categoryData, label) {
    const known = categoryData?.labels;
    if (!known || typeof label !== 'string') return undefined;
    const text = label.trim().toLowerCase();
    const exact = ownValue(known, text);
    if (exact) return exact;
    const words = text.split(/[^a-z0-9]+/).filter(Boolean);
    for (let i = words.length - 1; i >= 0; i--) {
        const icon = ownValue(known, words[i]);
        if (icon) return icon;
    }
    return undefined;
}

// Icon and color of an event: the icon of its label in its category, else the
// category's icon, both in the category color. Generic without a known category.
export function getIcon(category, label) {
    const categoryData = ownValue(labels, category);
    if (categoryData) {
        return {
            icon: knownLabelIcon(categoryData, label) || categoryData.icon,
            color: categoryData.color,
        };
    }
    return { icon: 'mdi:motion-sensor', color: '#757575' };
}

// The category a label belongs to: category when the label is known there (or
// is the category itself), else the first category that knows it, else
// category. "raccoon" is an animal label even in a person event.
export function labelCategory(label, category) {
    const text = typeof label === 'string' ? label.trim().toLowerCase() : '';
    if (!text || text === category || knownLabelIcon(ownValue(labels, category), text)) return category;
    if (ownValue(labels, text)) return text;
    for (const [name, categoryData] of Object.entries(labels)) {
        if (knownLabelIcon(categoryData, text)) return name;
    }
    return category;
}

// Icon of one label chip: the label's icon in the event's category, else in any
// category, else a generic tag.
export function getLabelIcon(label, category) {
    const inCategory = knownLabelIcon(ownValue(labels, category), label);
    if (inCategory) return inCategory;
    for (const categoryData of Object.values(labels)) {
        const icon = knownLabelIcon(categoryData, label);
        if (icon) return icon;
    }
    return 'mdi:tag-outline';
}

// The event's labels, most important first. Integrations without the labels
// field send only label.
export function eventLabels(item) {
    if (Array.isArray(item?.labels) && item.labels.length) {
        return item.labels.filter((l) => l !== null && l !== undefined && l !== '').map(String);
    }
    return item?.label ? [String(item.label)] : [];
}

// ---- Label styles (card option label_styles) ----
//
// label_styles:
//   slightly cute: { color: "#DB2777", fill: light, icon: "mdi:heart-outline" }
//   very cute: { color: "#DB2777", fill: solid }
//
// color is a hex color or [r, g, b]; fill is light (default), medium or
// solid; icon is optional. Labels match case-insensitively.

const FILL_ALPHA = { light: 0.18, medium: 0.35 };

// [r, g, b] of "#rgb", "#rrggbb" or [r, g, b], or null
function parseColor(color) {
    if (Array.isArray(color) && color.length === 3 && color.every((c) => Number.isFinite(Number(c)))) {
        return color.map((c) => Math.max(0, Math.min(255, Math.round(Number(c)))));
    }
    if (typeof color !== 'string') return null;
    const rgb = color.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgb) return rgb.slice(1, 4).map((c) => Math.min(255, Number(c)));
    let hex = color.trim().replace(/^#/, '');
    if (/^[0-9a-f]{3}$/i.test(hex)) hex = hex.split('').map((x) => x + x).join('');
    if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// White or near-black, whichever reads better on rgb
function textColorOn([r, g, b]) {
    const lin = (c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return luminance > 0.4 ? '#1f1f1f' : '#ffffff';
}

// label_styles as { lowercased label: { background, color, icon } }. Entries
// without a valid color are dropped; an invalid icon is left out.
export function normalizeLabelStyles(config) {
    const result = {};
    if (!config || typeof config !== 'object' || Array.isArray(config)) return result;
    for (const [label, style] of Object.entries(config)) {
        const rgb = parseColor(style?.color);
        if (!rgb) continue;
        const fill = String(style.fill || 'light').toLowerCase();
        const icon = typeof style.icon === 'string' && /^[a-z0-9-]+:[a-z0-9-]+$/i.test(style.icon) ? style.icon : '';
        // solid: the full color, for marks other than the chip (box outlines)
        const solid = `rgb(${rgb.join(',')})`;
        result[String(label).trim().toLowerCase()] = fill === 'solid'
            ? { background: solid, color: textColorOn(rgb), icon, solid }
            : { background: `rgba(${rgb.join(',')},${FILL_ALPHA[fill] ?? FILL_ALPHA.light})`, color: '', icon, solid };
    }
    return result;
}

// The style of label from normalizeLabelStyles, or null
export function labelStyle(styles, label) {
    if (!styles || label === null || label === undefined) return null;
    const key = String(label).trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(styles, key) ? styles[key] : null;
}

// A color as a solid CSS color plus the text color that reads on it, or null
export function solidColor(color) {
    const rgb = parseColor(color);
    return rgb ? { color: `rgb(${rgb.join(',')})`, text: textColorOn(rgb) } : null;
}

// Inline CSS of a label chip: its label style, else the fallback background
export function labelChipCss(style, fallbackBackground = '') {
    if (style) return `background-color:${style.background};${style.color ? `color:${style.color};` : ''}`;
    return fallbackBackground ? `background-color:${fallbackBackground};` : '';
}

// Whether an event has details worth showing: not null, '', {} or []
export function hasDetails(details) {
    if (details === null || details === undefined || details === '') return false;
    if (Array.isArray(details)) return details.length > 0;
    if (typeof details === 'object') return Object.keys(details).length > 0;
    return true;
}

// "trouble_level" or "troubleLevel" -> "Trouble level"
function detailKey(key) {
    const text = String(key)
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .trim()
        .toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isPlain(value) {
    return value === null || typeof value !== 'object';
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Text longer than this makes a column a "long" one, placed after the short
// ones: "Species, Count, Age, Appearance" and "Level, Reason".
const LONG_TEXT = 40;

function isLong(value) {
    return typeof value === 'string' && value.length > LONG_TEXT;
}

// The keys of rows, in first-seen order, short columns before long ones
function columnsOf(rows) {
    const keys = [];
    for (const row of rows) {
        for (const key of Object.keys(row)) {
            if (!keys.includes(key)) keys.push(key);
        }
    }
    const long = new Set(keys.filter((key) => rows.some((row) => isLong(row[key]))));
    return [...keys.filter((key) => !long.has(key)), ...keys.filter((key) => long.has(key))];
}

function renderCell(value, depth) {
    if (value === null || value === undefined || value === '') {
        return '<span class="details-empty">–</span>';
    }
    if (Array.isArray(value) && value.length && value.every(isPlain)) {
        return escapeHtml(value.join(', '));
    }
    return isPlain(value) ? escapeHtml(value) : renderDetails(value, depth + 1);
}

// rows as a table, one column per key. With rowNames, each row starts with
// its name as a row header.
function renderTable(rows, depth, rowNames = null) {
    const columns = columnsOf(rows);
    const head = `<tr>${rowNames ? '<td></td>' : ''}${columns
        .map((key) => `<th scope="col">${escapeHtml(detailKey(key))}</th>`)
        .join('')}</tr>`;
    const body = rows
        .map((row, i) => `<tr>${rowNames ? `<th scope="row">${escapeHtml(detailKey(rowNames[i]))}</th>` : ''}${columns
            .map((key) => `<td>${renderCell(row[key], depth)}</td>`)
            .join('')}</tr>`)
        .join('');
    return `<div class="details-table-wrap"><table class="details-table"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}

// An event's details (any JSON value, often the model's structured response)
// as escaped HTML. Top-level keys become headings. A list of objects is a
// table with a row per item; an object of objects is a table with a row per
// key; any other object is a two-column name/value table.
export function renderDetails(value, depth = 0) {
    if (value === null || value === undefined || value === '') {
        return '<span class="details-empty">–</span>';
    }
    if (depth > 6) {
        return `<span class="details-text">${escapeHtml(JSON.stringify(value))}</span>`;
    }
    if (Array.isArray(value)) {
        if (!value.length) return '<span class="details-empty">None</span>';
        if (value.every(isPlain)) {
            return `<span class="details-text">${escapeHtml(value.join(', '))}</span>`;
        }
        if (value.every(isRecord)) return renderTable(value, depth);
        return `<ol class="details-list">${value
            .map((item) => `<li>${renderDetails(item, depth + 1)}</li>`)
            .join('')}</ol>`;
    }
    if (isRecord(value)) {
        const entries = Object.entries(value);
        if (!entries.length) return '<span class="details-empty">–</span>';
        if (depth === 0) {
            return entries
                .map(([k, v]) => `<section class="details-section"><h4>${escapeHtml(detailKey(k))}</h4>${renderDetails(v, depth + 1)}</section>`)
                .join('');
        }
        if (entries.every(([, v]) => isRecord(v) && Object.keys(v).length)) {
            return renderTable(entries.map(([, v]) => v), depth, entries.map(([k]) => k));
        }
        return `<div class="details-table-wrap"><table class="details-table details-pairs"><tbody>${entries
            .map(([k, v]) => `<tr><th scope="row">${escapeHtml(detailKey(k))}</th><td>${renderCell(v, depth)}</td></tr>`)
            .join('')}</tbody></table></div>`;
    }
    return `<span class="details-text">${escapeHtml(value)}</span>`;
}

const translations = {
    bg: bg.text,
    ca: ca.text,
    cs: cs.text,
    da: da.text,
    de: de.text,
    en: en.text,
    es: es.text,
    fr: fr.text,
    hu: hu.text,
    it: it.text,
    nl: nl.text,
    pl: pl.text,
    pt: pt.text,
    sk: sk.text,
    sv: sv.text,
    el: el.text,
};

export function translate(key, language) {
    return translations[language] && translations[language][key] ? translations[language][key] : translations['en'][key];
}
