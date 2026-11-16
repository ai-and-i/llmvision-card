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

// details without the boxes and frame rate, for the details table
export function withoutBoxes(details) {
    if (!isRecord(details)) return details;
    const copy = { ...details };
    delete copy.frame_rate;
    for (const [key] of GROUPS) {
        if (Array.isArray(copy[key])) {
            copy[key] = copy[key].map((e) => {
                if (!isRecord(e)) return e;
                const { boxes, ...rest } = e;
                return rest;
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
}

export const boxOverlayCss = `
    .llmvision-boxes-media { position: relative; }
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
    .llmvision-boxes-toggle {
        position: absolute; top: 18px; right: 8px; width: 36px; height: 36px; padding: 0;
        display: flex; align-items: center; justify-content: center; border: none; border-radius: 50%;
        background: rgba(0,0,0,0.55); color: #fff; cursor: pointer; --mdc-icon-size: 20px;
    }
    .llmvision-boxes-toggle[aria-pressed="false"] { color: rgba(255,255,255,0.6); }
`;

// Draws the tracks over video, which must be inside media (a positioned
// element), with a button to show or hide them. Stops when video leaves the
// page.
export function attachBoxOverlay(media, video, { rate, tracks }) {
    if (!media || !video || !tracks.length) return;
    const step = 1 / rate;
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
    const button = document.createElement('button');
    button.className = 'llmvision-boxes-toggle';
    button.innerHTML = '<ha-icon icon="mdi:vector-square"></ha-icon>';
    media.append(layer, button);

    let shown = readShown();
    const setShown = (value) => {
        shown = value;
        layer.hidden = !shown;
        button.setAttribute('aria-pressed', String(shown));
        button.title = shown ? 'Hide boxes' : 'Show boxes';
        draw();
    };
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        setShown(!shown);
        saveShown(shown);
    });

    function draw() {
        if (!shown || !video.videoWidth) return;
        // The picture inside the element: object-fit contain leaves bars
        const ew = video.clientWidth;
        const eh = video.clientHeight;
        const scale = Math.min(ew / video.videoWidth, eh / video.videoHeight);
        const w = video.videoWidth * scale;
        const h = video.videoHeight * scale;
        Object.assign(layer.style, {
            left: `${video.offsetLeft + (ew - w) / 2}px`,
            top: `${video.offsetTop + (eh - h) / 2}px`,
            width: `${w}px`,
            height: `${h}px`,
        });
        tracks.forEach((track, i) => {
            const box = boxAt(track, video.currentTime, step);
            const el = els[i];
            el.hidden = !box;
            if (!box) return;
            const [ymin, xmin, ymax, xmax] = box;
            Object.assign(el.style, {
                left: `${(xmin / 1000) * w}px`,
                top: `${(ymin / 1000) * h}px`,
                width: `${((xmax - xmin) / 1000) * w}px`,
                height: `${((ymax - ymin) / 1000) * h}px`,
            });
            // Keep the name inside the picture for boxes at the top edge
            el.classList.toggle('below', (ymin / 1000) * h < 18);
        });
    }

    // Every presented frame while playing; on seeks and resizes otherwise
    const onFrame = () => {
        if (!video.isConnected) return;
        draw();
        if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(onFrame);
        else if (!video.paused) requestAnimationFrame(onFrame);
    };
    if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(onFrame);
    else video.addEventListener('play', () => requestAnimationFrame(onFrame));
    ['loadedmetadata', 'seeked', 'timeupdate'].forEach((type) => video.addEventListener(type, draw));
    if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => (video.isConnected ? draw() : observer.disconnect()));
        observer.observe(video);
    }
    setShown(shown);
}
