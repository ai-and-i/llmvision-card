// The popup's "Keep clip" switch. Retention removes events (with their
// key frame and clip) some days after they start; a kept event stays until
// the switch is turned off. Reviewed events (with feedback, now or on an
// earlier analysis) are always kept, so for them the switch is on and locked.

export function keepCss(prefix) {
    const p = `.${prefix}-keep`;
    return `
        ${p} { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; margin: 10px 0 0; font-size: var(--ha-font-size-s, 13px); color: var(--secondary-text-color); }
        ${p} label { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; color: var(--primary-text-color); font-weight: var(--ha-font-weight-medium, 500); }
        ${p} input { appearance: none; -webkit-appearance: none; margin: 0; flex-shrink: 0; width: 34px; height: 20px; border-radius: 10px; position: relative; cursor: pointer; background: var(--disabled-color, #bdbdbd); transition: background 0.15s; }
        ${p} input::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); transition: transform 0.15s; }
        ${p} input:checked { background: var(--primary-color, #03a9f4); }
        ${p} input:checked::after { transform: translateX(14px); }
        ${p} input:disabled { opacity: 0.6; cursor: default; }
        ${p} input:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
        ${p} label:has(input:disabled) { cursor: default; }
        ${p}-note { display: inline-flex; align-items: center; gap: 4px; }
        ${p}-note ha-icon { --mdc-icon-size: 14px; display: flex; }
        ${p}-note.error { color: var(--error-color, #db4437); }
    `;
}

export function keepHtml(prefix, hasClip) {
    return `
    <div class="${prefix}-keep">
        <label><input type="checkbox" role="switch"><span>${hasClip ? 'Keep clip' : 'Keep event'}</span></label>
        <span class="${prefix}-keep-note" role="status"></span>
    </div>`;
}

// state: {keep, reviewed, purgeAfter}. save(keep) resolves to the new state
// or throws. Returns {update(state)} for changes made elsewhere (feedback).
export function attachKeep(root, prefix, { state, save, formatTime, onChange }) {
    const box = root.querySelector(`.${prefix}-keep`);
    if (!box) return { update() {} };
    const input = box.querySelector('input');
    const note = box.querySelector(`.${prefix}-keep-note`);
    let current = { ...state };
    let busy = false;

    const expired = () => current.purgeAfter && new Date(current.purgeAfter) <= new Date();

    function paint(error) {
        input.checked = Boolean(current.keep || current.reviewed);
        input.disabled = Boolean(current.reviewed) || busy;
        note.classList.toggle('error', Boolean(error));
        let icon = '';
        let text = '';
        if (error) {
            text = error;
        } else if (current.reviewed) {
            icon = 'mdi:lock-outline';
            text = 'Reviewed clips are always kept';
        } else if (current.keep) {
            text = 'Kept until you turn this off';
        } else if (expired()) {
            text = 'Past the retention time: deleted at the next refresh';
        } else if (current.purgeAfter) {
            text = `Deleted after ${formatTime(current.purgeAfter)}`;
        }
        note.innerHTML = `${icon ? `<ha-icon icon="${icon}"></ha-icon>` : ''}<span></span>`;
        note.querySelector('span').textContent = text;
        const what = input.closest('label').textContent.trim();
        input.title = current.reviewed ? `${what}: on, because you reviewed it` : what;
    }

    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('change', async () => {
        const keep = input.checked;
        if (!keep && expired() && !confirm('This clip is past the retention time, so it will be deleted at the next refresh. Stop keeping it?')) {
            input.checked = true;
            return;
        }
        busy = true;
        paint();
        try {
            const saved = await save(keep);
            current = { ...current, ...saved };
            busy = false;
            paint();
            onChange?.(current);
        } catch (err) {
            busy = false;
            paint(`Couldn't save: ${err?.body?.message || err?.message || 'unknown error'}`);
            input.checked = !keep;
        }
    });

    paint();
    return {
        update(next) {
            current = { ...current, ...next };
            if (!busy) paint();
        },
    };
}
