// Bounding boxes from an event's details, drawn over its clip.
//
// details.animals[i].boxes (and details.people[i].boxes) is a list of
// {frame, box_2d}: frame 1 is the clip's first second, and frames are
// 1 / details.frame_rate seconds apart (1 when not given). box_2d is
// [ymin, xmin, ymax, xmax] scaled to 0-1000, the format Gemini detects in.

const FALLBACK_COLOR = { color: '#ffd600', text: '#1f1f1f' };
const STORAGE_KEY = 'llmvision-card-show-boxes';
// [details key, the label of an entry (as the event's labels name it), its category]
const GROUPS = [
    ['animals', (a) => String(a.species || 'animal').trim().toLowerCase(), 'animal'],
    ['people', (p) => (p.age === 'child' ? 'child' : 'person'), 'person'],
];

function validBox(b) {
    return b && Number.isFinite(Number(b.frame)) && Array.isArray(b.box_2d)
        && b.box_2d.length === 4 && b.box_2d.every((n) => Number.isFinite(Number(n)));
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// {rate, tracks}: one track per animal or person entry that has boxes.
// colorFor(label, category) gives a track its label's {color, text}.
export function boxTracks(details, colorFor = () => null) {
    const tracks = [];
    if (!isRecord(details)) return { rate: 1, tracks };
    const rate = Number(details.frame_rate) > 0 ? Number(details.frame_rate) : 1;
    for (const [key, name, category] of GROUPS) {
        for (const entry of Array.isArray(details[key]) ? details[key] : []) {
            if (!isRecord(entry) || !Array.isArray(entry.boxes)) continue;
            const boxes = entry.boxes.filter(validBox)
                .map((b) => ({ t: (Number(b.frame) - 1) / rate, box: b.box_2d.map(Number) }))
                .sort((x, y) => x.t - y.t);
            if (!boxes.length) continue;
            const label = name(entry);
            const count = Number(entry.count) > 1 ? ` ×${Number(entry.count)}` : '';
            const { color, text } = colorFor(label, category) || FALLBACK_COLOR;
            tracks.push({ label: `${label}${count}`, color, text, boxes });
        }
    }
    return { rate, tracks };
}

// "frames 4-19" (or "frame 3", or "frames 2-5, 9") for a list of boxes
function framesText(boxes) {
    const frames = [...new Set(boxes.filter(validBox).map((b) => Number(b.frame)))].sort((a, b) => a - b);
    if (!frames.length) return '';
    const runs = [];
    for (const f of frames) {
        const last = runs[runs.length - 1];
        if (last && f === last[1] + 1) last[1] = f;
        else runs.push([f, f]);
    }
    const text = runs.map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)).join(', ');
    return `${frames.length === 1 ? 'frame' : 'frames'} ${text}`;
}

// details without the box coordinates (each entry's boxes become a short
// "frames 4–19" summary) and frame rate, for the details table
export function withoutBoxes(details) {
    if (!isRecord(details)) return details;
    const copy = { ...details };
    delete copy.frame_rate;
    for (const [key] of GROUPS) {
        if (Array.isArray(copy[key])) {
            copy[key] = copy[key].map((e) => {
                if (!isRecord(e)) return e;
                const { boxes, ...rest } = e;
                return Array.isArray(boxes) ? { ...rest, boxes: framesText(boxes) } : rest;
            });
        }
    }
    return copy;
}

// Boxes at most this many frames apart belong to one stretch of a track
const MAX_GAP_FRAMES = 2;

// The box on the line through boxes a and b at time t, kept inside the
// picture; null when nothing of it is left inside
function along(a, b, t) {
    const k = (t - a.t) / (b.t - a.t);
    const [ymin, xmin, ymax, xmax] = a.box.map((v, i) => Math.min(1000, Math.max(0, v + (b.box[i] - v) * k)));
    return ymax > ymin && xmax > xmin ? [ymin, xmin, ymax, xmax] : null;
}

// The track's box at time t (seconds). Within a stretch of boxes it moves
// linearly from box to box. For half a frame before a stretch's first box and
// after its last, it keeps moving the way it moves between the first two (or
// last two) boxes, so that it follows an animal walking in or out instead of
// waiting for it. A box on its own shows still for half a frame either side.
export function boxAt(track, t, step) {
    const boxes = track.boxes;
    const gap = MAX_GAP_FRAMES * step + 1e-6;
    let i = boxes.findIndex((b) => b.t > t);
    if (i === -1) i = boxes.length;
    const prev = boxes[i - 1];
    const next = boxes[i];
    if (prev && next && next.t - prev.t <= gap) return along(prev, next, t);
    if (prev && t - prev.t <= step / 2) {
        const before = boxes[i - 2];
        return before && prev.t - before.t <= gap ? along(before, prev, t) : prev.box;
    }
    if (next && next.t - t <= step / 2) {
        const after = boxes[i + 1];
        return after && after.t - next.t <= gap ? along(next, after, t) : next.box;
    }
    return null;
}

function readShown() {
    try {
        return localStorage.getItem(STORAGE_KEY) !== 'off';
    } catch (e) {
        return true;
    }
}

function saveShown(shown) {
    try {
        localStorage.setItem(STORAGE_KEY, shown ? 'on' : 'off');
    } catch (e) {
        // not remembered, still toggled
    }
    // Thumbnails follow the popup's toggle
    window.dispatchEvent(new CustomEvent(TOGGLE_EVENT, { detail: { shown } }));
}

// Sent on window with {shown} when the boxes are toggled
export const TOGGLE_EVENT = 'llmvision-card-boxes-toggled';
export const boxesShown = readShown;

// The frame number a key frame shows, or null. The integration names key
// frames <id>-<frame>.jpg, frame 1 being the first frame sent to the model.
export function keyFrameNumber(path) {
    const m = /-(\d+)\.jpe?g(?:$|[?#])/i.exec(String(path || ''));
    return m ? Number(m[1]) : null;
}

// SVG markup with the tracks' boxes in the given frame, to lay over an image
// of natural size width x height shown with object-fit: cover. '' when the
// frame has no boxes.
export function frameBoxesSvg(tracks, rate, frame, width, height) {
    if (!frame || !(width > 0) || !(height > 0)) return '';
    const t = (frame - 1) / rate;
    const rects = [];
    for (const track of tracks) {
        for (const b of track.boxes) {
            if (Math.abs(b.t - t) > 1e-6) continue;
            const [ymin, xmin, ymax, xmax] = b.box.map((v) => Math.min(1000, Math.max(0, v)));
            if (ymax <= ymin || xmax <= xmin) continue;
            const x = (xmin / 1000) * width, y = (ymin / 1000) * height;
            const w = ((xmax - xmin) / 1000) * width, h = ((ymax - ymin) / 1000) * height;
            const color = String(track.color).replace(/[^#\w(),.%\s-]/g, '');
            rects.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" stroke="${color}"/>`);
        }
    }
    if (!rects.length) return '';
    return `<svg class="llmvision-thumb-boxes" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${rects.join('')}</svg>`;
}

export const thumbBoxesCss = `
    .llmvision-thumb-boxes {
        position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
    }
    .llmvision-thumb-boxes rect {
        fill: none; stroke-width: 1.5px; vector-effect: non-scaling-stroke;
    }
    .llmvision-thumb-boxes[hidden] { display: none; }
`;

export const boxOverlayCss = `
    /* media clips the stage (the clip), which zooms and pans. The boxes are
       drawn unzoomed on top at the zoomed positions, so lines and names stay
       sharp and keep their size. */
    .llmvision-boxes-media {
        position: relative; overflow: hidden; margin-top: 10px;
        --llmvision-video-radius: calc(var(--ha-card-border-radius, 25px) - 10px);
        border-radius: var(--llmvision-video-radius);
    }
    /* Touches on the clip are ours (pinch, pan): with pan-x pan-y a browser
       may take a two-finger move for a scroll and cancel the pinch */
    .llmvision-boxes-stage { position: relative; transform-origin: 0 0; touch-action: none; }
    .llmvision-boxes-media .llmvision-boxes-stage > video { display: block; margin: 0; border-radius: 0; cursor: pointer; }
    .llmvision-boxes-zoomed .llmvision-boxes-stage { touch-action: none; }
    .llmvision-boxes-zoomed .llmvision-boxes-stage > video { cursor: grab; }
    .llmvision-boxes-layer { position: absolute; pointer-events: none; overflow: hidden; }
    .llmvision-boxes-layer[hidden] { display: none; }
    .llmvision-box {
        position: absolute; box-sizing: border-box; border: 1px solid var(--box-color);
        border-radius: 2px;
    }
    .llmvision-box > span {
        position: absolute; left: -1px; bottom: 100%; padding: 1px 6px; border-radius: 3px 3px 3px 0;
        background: var(--box-color); color: var(--box-text, #1f1f1f); font: 600 12px/16px var(--ha-font-family-body, Roboto, sans-serif);
        white-space: nowrap; text-transform: capitalize;
    }
    .llmvision-box.below > span { bottom: auto; top: 100%; border-radius: 0 3px 3px 3px; }

    /* Our controls, along the bottom of the clip. They fade while it plays
       and nothing moves over it. */
    .llmvision-boxes-controls {
        position: absolute; left: 0; right: 0; bottom: 0; box-sizing: border-box;
        display: flex; align-items: center; gap: 2px; padding: 6px 8px;
        /* No tint over the clip: a shadow keeps icons and text readable on
           bright footage */
        color: #fff; font: 500 13px/1 var(--ha-font-family-body, Roboto, sans-serif);
        text-shadow: 0 0 3px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.8);
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.75));
        transition: opacity 0.25s;
    }
    .llmvision-boxes-idle > .llmvision-boxes-controls { opacity: 0; pointer-events: none; }
    .llmvision-boxes-idle, .llmvision-boxes-idle > video { cursor: none; }
    .llmvision-boxes-controls button {
        flex: none; width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center;
        border: none; border-radius: 50%; background: transparent; color: #fff; cursor: pointer; --mdc-icon-size: 22px;
    }
    .llmvision-boxes-controls button:hover { background: rgba(255,255,255,0.15); }
    .llmvision-boxes-controls button[aria-pressed="false"] { color: rgba(255,255,255,0.55); }
    .llmvision-boxes-controls .llmvision-boxes-zoom {
        width: auto; min-width: 40px; padding: 0 8px; border-radius: 20px; font: inherit; font-weight: 600;
        background: rgba(255,255,255,0.18);
    }
    .llmvision-boxes-controls button[hidden] { display: none; }
    .llmvision-boxes-seek {
        flex: 1; min-width: 40px; margin: 0 8px; cursor: pointer; accent-color: var(--primary-color, #03a9f4);
    }
    .llmvision-boxes-time { flex: none; padding: 0 4px; white-space: nowrap; font-variant-numeric: tabular-nums; }

    /* Full screen with the boxes: the Fullscreen API on the clip and its
       boxes where the browser has it for any element, else (iPhone) the
       clip and boxes fixed over the whole page. The clip is centered on the
       whole screen; the controls keep clear of the notch, the status bar
       and the home indicator (safe areas). The rules
       are separate because a browser drops a whole rule with a selector it
       doesn't know. */
    .llmvision-boxes-media.llmvision-boxes-expanded {
        position: fixed; inset: 0; z-index: 10000; margin: 0; border-radius: 0; background: #000;
        overscroll-behavior: contain;
    }
    .llmvision-boxes-media:fullscreen { background: #000; border-radius: 0; }
    .llmvision-boxes-media:-webkit-full-screen { background: #000; border-radius: 0; }
    .llmvision-boxes-expanded > .llmvision-boxes-stage { width: 100%; height: 100%; touch-action: none; }
    .llmvision-boxes-media:fullscreen > .llmvision-boxes-stage { width: 100%; height: 100%; touch-action: none; }
    .llmvision-boxes-media:-webkit-full-screen > .llmvision-boxes-stage { width: 100%; height: 100%; touch-action: none; }
    .llmvision-boxes-expanded .llmvision-boxes-stage > video { width: 100%; height: 100%; max-height: none; object-fit: contain; }
    .llmvision-boxes-media:fullscreen .llmvision-boxes-stage > video { width: 100%; height: 100%; max-height: none; object-fit: contain; }
    .llmvision-boxes-media:-webkit-full-screen .llmvision-boxes-stage > video { width: 100%; height: 100%; max-height: none; object-fit: contain; }
    .llmvision-boxes-expanded > .llmvision-boxes-controls {
        border-radius: 0; left: env(safe-area-inset-left, 0px); right: env(safe-area-inset-right, 0px);
        bottom: env(safe-area-inset-bottom, 0px); padding-bottom: 10px;
    }
    .llmvision-boxes-media:fullscreen > .llmvision-boxes-controls { border-radius: 0; padding-bottom: 12px; }
    .llmvision-boxes-media:-webkit-full-screen > .llmvision-boxes-controls { border-radius: 0; padding-bottom: 12px; }
    /* Touch screens: also keep off the bottom edge when the page reports no
       safe area, where a swipe is a system gesture */
    @media (pointer: coarse) {
        .llmvision-boxes-expanded > .llmvision-boxes-controls { bottom: max(env(safe-area-inset-bottom, 0px), 24px); }
    }
`;

// The element in full screen (Fullscreen API), if any
function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
}

const icon = (name) => `<ha-icon icon="${name}"></ha-icon>`;

// "1:05" for 65.3 seconds
function clock(seconds) {
    const s = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// The clip viewer of the popup, for every clip: draws the tracks (if any)
// over video, which must be inside media (a positioned element), and
// replaces the browser's controls with ours: play, seek, zoom, mute, show
// or hide the boxes (when there are any), and full screen. The browser's own controls
// can't show the boxes (iPhone plays in its own player, desktop browsers
// put only the video in full screen or picture-in-picture) and put buttons
// where they clash with ours and with system gestures. Stops when video
// leaves the page.
// posterFrame is the frame number the video's poster (the key frame) shows:
// until playback or a seek replaces the poster, its boxes are drawn.
export function attachBoxOverlay(media, video, { rate, tracks }, { posterFrame = null } = {}) {
    if (!media || !video) return null;
    const step = 1 / rate;
    // The poster shows until the video plays or seeks. Its size stands in
    // for the video's until the video's is known (iOS loads no metadata
    // before playing).
    let onPoster = Boolean(posterFrame && video.getAttribute('poster'));
    const poster = new Image();
    if (onPoster) {
        poster.addEventListener('load', () => draw());
        poster.src = video.getAttribute('poster');
    }
    const leavePoster = () => {
        if (!onPoster) return;
        onPoster = false;
        draw();
    };
    video.addEventListener('play', leavePoster);
    video.addEventListener('seeking', leavePoster);
    const layer = document.createElement('div');
    layer.className = 'llmvision-boxes-layer';
    const els = tracks.map((track) => {
        const el = document.createElement('div');
        el.className = 'llmvision-box';
        el.style.setProperty('--box-color', track.color);
        el.style.setProperty('--box-text', track.text);
        el.hidden = true;
        const tag = document.createElement('span');
        tag.textContent = track.label;
        el.appendChild(tag);
        layer.appendChild(el);
        return el;
    });

    video.controls = false;
    video.removeAttribute('controls');
    video.disablePictureInPicture = true;
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('disableremoteplayback', '');

    const control = (className, iconName) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = className;
        if (iconName) b.innerHTML = icon(iconName);
        return b;
    };
    const label = (b, text) => {
        b.title = text;
        b.setAttribute('aria-label', text);
    };
    const bar = document.createElement('div');
    bar.className = 'llmvision-boxes-controls';
    const playButton = control('llmvision-boxes-play');
    const time = document.createElement('span');
    time.className = 'llmvision-boxes-time';
    const seek = document.createElement('input');
    seek.type = 'range';
    seek.className = 'llmvision-boxes-seek';
    seek.min = '0';
    seek.max = '0';
    seek.step = 'any';
    seek.value = '0';
    seek.setAttribute('aria-label', 'Seek');
    const muteButton = control('llmvision-boxes-mute');
    const button = control('llmvision-boxes-toggle', 'mdi:vector-square');
    const fsButton = control('llmvision-boxes-fullscreen');
    const zoomButton = control('llmvision-boxes-zoom');
    zoomButton.hidden = true;
    bar.append(playButton, time, seek, zoomButton, muteButton, button, fsButton);
    // No boxes, no button for them
    button.hidden = !tracks.length;
    // The stage holds the clip and is what zooms; the boxes are drawn on a
    // layer over it at the zoomed positions
    const stage = document.createElement('div');
    stage.className = 'llmvision-boxes-stage';
    video.before(stage);
    stage.append(video);
    media.append(layer, bar);
    // Clicks on the controls are not clicks on the video
    ['click', 'dblclick', 'pointerdown'].forEach((t) => bar.addEventListener(t, (e) => e.stopPropagation()));

    let shown = readShown();
    const setShown = (value) => {
        shown = value;
        layer.hidden = !shown;
        button.setAttribute('aria-pressed', String(shown));
        label(button, shown ? 'Hide boxes' : 'Show boxes');
        draw();
    };
    button.addEventListener('click', () => {
        setShown(!shown);
        saveShown(shown);
    });

    // Play, seek and mute
    let seeking = false;
    const updatePlay = () => {
        const paused = video.paused || video.ended;
        playButton.innerHTML = icon(paused ? 'mdi:play' : 'mdi:pause');
        label(playButton, paused ? 'Play' : 'Pause');
    };
    const updateTime = () => {
        if (Number.isFinite(video.duration)) seek.max = String(video.duration);
        if (!seeking) seek.value = String(video.currentTime);
        time.textContent = `${clock(video.currentTime)} / ${clock(video.duration)}`;
    };
    const updateMute = () => {
        muteButton.innerHTML = icon(video.muted ? 'mdi:volume-off' : 'mdi:volume-high');
        label(muteButton, video.muted ? 'Unmute' : 'Mute');
    };
    const togglePlay = () => {
        if (video.paused || video.ended) {
            const playing = video.play();
            if (playing && playing.catch) playing.catch(() => {});
        } else {
            video.pause();
        }
    };
    playButton.addEventListener('click', togglePlay);
    muteButton.addEventListener('click', () => {
        video.muted = !video.muted;
        updateMute();
    });
    seek.addEventListener('input', () => {
        seeking = true;
        video.currentTime = Number(seek.value);
        updateTime();
        draw();
    });
    seek.addEventListener('change', () => { seeking = false; });
    ['play', 'pause', 'ended'].forEach((t) => video.addEventListener(t, () => { updatePlay(); wake(); }));
    ['timeupdate', 'durationchange', 'loadedmetadata'].forEach((t) => video.addEventListener(t, updateTime));
    video.addEventListener('volumechange', updateMute);

    // The controls fade 2.5 s after the last movement while the clip plays
    let idleTimer = null;
    const wake = () => {
        media.classList.remove('llmvision-boxes-idle');
        clearTimeout(idleTimer);
        if (!video.paused && !video.ended) {
            idleTimer = setTimeout(() => media.classList.add('llmvision-boxes-idle'), 2500);
        }
    };
    ['pointermove', 'pointerdown', 'keydown'].forEach((t) => media.addEventListener(t, wake));

    // A tap or click on the video plays or pauses it; on a touch screen the
    // first tap after the controls faded only brings them back. A
    // double-click goes full screen, so a single click waits to see whether
    // a second one follows.
    let pointerType = 'mouse';
    let idleAtPointer = false;
    let clickTimer = null;
    video.addEventListener('pointerdown', (e) => {
        pointerType = e.pointerType || 'mouse';
        idleAtPointer = media.classList.contains('llmvision-boxes-idle');
    });
    video.addEventListener('click', (e) => {
        e.preventDefault();
        if (gestured) {
            gestured = false;
            return;
        }
        if (idleAtPointer && pointerType === 'touch') return;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(togglePlay, 250);
    });

    function draw() {
        const vw = video.videoWidth || (onPoster ? poster.naturalWidth : 0);
        const vh = video.videoHeight || (onPoster ? poster.naturalHeight : 0);
        if (!shown || !vw || !vh) return;
        // The poster's frame while it shows, else the frame playing
        const t = onPoster ? (posterFrame - 1) / rate : video.currentTime;
        // The layer covers the stage's (unzoomed) box
        Object.assign(layer.style, {
            left: `${stage.offsetLeft}px`,
            top: `${stage.offsetTop}px`,
            width: `${stage.offsetWidth}px`,
            height: `${stage.offsetHeight}px`,
        });
        // The picture inside the video element: object-fit contain leaves bars
        const ew = video.clientWidth;
        const eh = video.clientHeight;
        const scale = Math.min(ew / vw, eh / vh);
        const w = vw * scale;
        const h = vh * scale;
        const left = video.offsetLeft + (ew - w) / 2;
        const top = video.offsetTop + (eh - h) / 2;
        // A picture point (0-1000) on the layer, zoomed and panned
        const x = (v) => tx + (left + (v / 1000) * w) * zoom;
        const y = (v) => ty + (top + (v / 1000) * h) * zoom;
        tracks.forEach((track, i) => {
            const box = boxAt(track, t, step);
            const el = els[i];
            el.hidden = !box;
            if (!box) return;
            const [ymin, xmin, ymax, xmax] = box;
            Object.assign(el.style, {
                left: `${x(xmin)}px`,
                top: `${y(ymin)}px`,
                width: `${x(xmax) - x(xmin)}px`,
                height: `${y(ymax) - y(ymin)}px`,
            });
            // Keep the name in view for boxes at the top edge
            el.classList.toggle('below', y(ymin) < 18);
        });
    }

    // Zoom and pan: pinch with two fingers (or a trackpad, or Ctrl + wheel;
    // any wheel in full screen), drag with one finger or the mouse while
    // zoomed. The stage is scaled from its top left corner and kept covering
    // its own box, so no empty space shows at the edges.
    const MAX_ZOOM = 8;
    let zoom = 1;
    let tx = 0;
    let ty = 0;
    let gestured = false;
    const applyZoom = () => {
        const w = stage.offsetWidth;
        const h = stage.offsetHeight;
        zoom = Math.min(MAX_ZOOM, Math.max(1, zoom));
        if (zoom < 1.02) {
            zoom = 1;
            tx = 0;
            ty = 0;
        }
        tx = Math.min(0, Math.max(w * (1 - zoom), tx));
        ty = Math.min(0, Math.max(h * (1 - zoom), ty));
        stage.style.transform = zoom === 1 ? '' : `translate(${tx}px, ${ty}px) scale(${zoom})`;
        media.classList.toggle('llmvision-boxes-zoomed', zoom > 1);
        zoomButton.hidden = zoom === 1;
        zoomButton.textContent = `${zoom < 10 ? zoom.toFixed(1) : Math.round(zoom)}×`;
        label(zoomButton, 'Reset zoom');
        draw();
    };
    const resetZoom = () => {
        zoom = 1;
        applyZoom();
    };
    zoomButton.addEventListener('click', resetZoom);
    // A client point in the stage's own (unzoomed) coordinates
    const origin = () => {
        const r = media.getBoundingClientRect();
        return [r.left + media.clientLeft + stage.offsetLeft, r.top + media.clientTop + stage.offsetTop];
    };
    // Zoom to z keeping the stage point under client point p0 under p1
    const zoomAround = (z, p0, p1, start) => {
        const [ox, oy] = start.origin;
        const cx = (p0[0] - ox - start.tx) / start.zoom;
        const cy = (p0[1] - oy - start.ty) / start.zoom;
        zoom = Math.min(MAX_ZOOM, Math.max(1, z));
        tx = p1[0] - ox - cx * zoom;
        ty = p1[1] - oy - cy * zoom;
        applyZoom();
    };
    const pointers = new Map();
    let gesture = null;
    const startGesture = () => {
        const points = [...pointers.values()];
        const start = { origin: origin(), zoom, tx, ty };
        if (points.length >= 2) {
            const [a, b] = points;
            gesture = { ...start, kind: 'pinch', distance: Math.hypot(a[0] - b[0], a[1] - b[1]), mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
        } else if (points.length === 1 && zoom > 1) {
            gesture = { ...start, kind: 'pan', point: points[0] };
        } else {
            gesture = points.length === 1 ? { ...start, kind: 'none', point: points[0] } : null;
        }
    };
    stage.addEventListener('pointerdown', (e) => {
        if (pointers.size === 0) gestured = false;
        pointers.set(e.pointerId, [e.clientX, e.clientY]);
        if (pointers.size >= 2 || zoom > 1) {
            for (const id of pointers.keys()) {
                try { stage.setPointerCapture(id); } catch (err) { /* already up */ }
            }
        }
        startGesture();
    });
    stage.addEventListener('pointermove', (e) => {
        if (!pointers.has(e.pointerId) || !gesture) return;
        pointers.set(e.pointerId, [e.clientX, e.clientY]);
        const points = [...pointers.values()];
        if (gesture.kind === 'pinch' && points.length >= 2) {
            const [a, b] = points;
            const distance = Math.hypot(a[0] - b[0], a[1] - b[1]);
            const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            zoomAround(gesture.zoom * (distance / (gesture.distance || 1)), gesture.mid, mid, gesture);
            gestured = true;
            e.preventDefault();
        } else if (gesture.kind === 'pan') {
            const dx = e.clientX - gesture.point[0];
            const dy = e.clientY - gesture.point[1];
            if (Math.hypot(dx, dy) > 6) gestured = true;
            tx = gesture.tx + dx;
            ty = gesture.ty + dy;
            applyZoom();
            e.preventDefault();
        } else if (gesture.kind === 'none' && Math.hypot(e.clientX - gesture.point[0], e.clientY - gesture.point[1]) > 10) {
            gestured = true;
        }
    });
    const endPointer = (e) => {
        if (!pointers.delete(e.pointerId)) return;
        startGesture();
    };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => stage.addEventListener(t, endPointer));
    stage.addEventListener('wheel', (e) => {
        if (!e.ctrlKey && !isFull()) return;
        e.preventDefault();
        const p = [e.clientX, e.clientY];
        zoomAround(zoom * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), p, p, { origin: origin(), zoom, tx, ty });
    }, { passive: false });
    // Safari's own pinch zoom of the page
    stage.addEventListener('gesturestart', (e) => e.preventDefault());

    // Full screen: the Fullscreen API on media where it works, else media
    // fixed over the page ("expanded"). Expanded, media moves to the page
    // body, out of the popup (whose transform, scrolling and stacking would
    // offset or clip a fixed element), and a placeholder keeps its place.
    // Moving it within one task doesn't stop the clip.
    let expanded = false;
    let placeholder = null;
    const isFull = () => expanded || fullscreenElement() === media;
    const updateFsButton = () => {
        const full = isFull();
        fsButton.innerHTML = icon(full ? 'mdi:fullscreen-exit' : 'mdi:fullscreen');
        label(fsButton, full ? 'Exit full screen' : 'Full screen');
    };
    const setExpanded = (value) => {
        if (value === expanded) return;
        expanded = value;
        if (expanded) {
            placeholder = document.createElement('div');
            placeholder.style.height = `${media.offsetHeight}px`;
            placeholder.style.marginTop = getComputedStyle(media).marginTop;
            media.before(placeholder);
            document.body.append(media);
        } else if (placeholder) {
            if (placeholder.isConnected) placeholder.replaceWith(media);
            else media.remove();
            placeholder = null;
        }
        media.classList.toggle('llmvision-boxes-expanded', expanded);
        resetZoom();
        updateFsButton();
        draw();
    };
    const enterFull = async () => {
        const request = media.requestFullscreen || media.webkitRequestFullscreen;
        if (request) {
            try {
                const pending = request.call(media);
                // Older WebKit returns nothing: give it a moment to switch
                await (pending || new Promise((resolve) => setTimeout(resolve, 300)));
            } catch (e) {
                // not allowed here: expand instead
            }
            if (fullscreenElement() === media) return;
        }
        setExpanded(true);
    };
    const exitFull = () => {
        if (fullscreenElement() === media) {
            (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
        }
        setExpanded(false);
    };
    const toggleFull = () => (isFull() ? exitFull() : enterFull());
    fsButton.addEventListener('click', toggleFull);
    video.addEventListener('dblclick', (e) => {
        e.preventDefault();
        clearTimeout(clickTimer);
        toggleFull();
    });
    // iPhone's own player, should it still open, shows no boxes
    video.addEventListener('webkitbeginfullscreen', () => {
        setTimeout(() => {
            try { video.webkitExitFullscreen(); } catch (e) { /* already out */ }
            setExpanded(true);
        }, 0);
    });
    const onFullscreenChange = () => {
        if (!media.isConnected && !(placeholder && placeholder.isConnected)) {
            ['fullscreenchange', 'webkitfullscreenchange'].forEach((t) => document.removeEventListener(t, onFullscreenChange));
            document.removeEventListener('keydown', onKeydown, true);
            return;
        }
        // A browser's own full screen of the video: ours instead
        if (fullscreenElement() === video) {
            (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
            setExpanded(true);
        }
        resetZoom();
        updateFsButton();
        draw();
    };
    // Escape leaves the expanded view before it closes the popup
    const onKeydown = (e) => {
        if (expanded && e.key === 'Escape') {
            e.stopPropagation();
            e.preventDefault();
            setExpanded(false);
        }
    };
    ['fullscreenchange', 'webkitfullscreenchange'].forEach((t) => document.addEventListener(t, onFullscreenChange));
    document.addEventListener('keydown', onKeydown, true);

    // Every presented frame while playing; on seeks and resizes otherwise
    const onFrame = () => {
        if (!video.isConnected) return;
        draw();
        updateTime();
        if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(onFrame);
        else if (!video.paused) requestAnimationFrame(onFrame);
    };
    if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(onFrame);
    else video.addEventListener('play', () => requestAnimationFrame(onFrame));
    ['loadedmetadata', 'seeked', 'timeupdate'].forEach((type) => video.addEventListener(type, draw));
    if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => {
            if (!video.isConnected) return observer.disconnect();
            applyZoom();
            draw();
        });
        observer.observe(video);
    }
    updatePlay();
    updateTime();
    updateMute();
    updateFsButton();
    setShown(shown);
    // For the popup: put the clip back before the popup closes
    return {
        close() {
            video.pause();
            if (fullscreenElement() === media) {
                (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
            }
            setExpanded(false);
        },
    };
}
