// The user's feedback on an event's analysis, in the popup, stored by the
// integration (POST llmvision/timeline/event/<id>/feedback) for scoring the
// model later.
//
// "Everything correct" says every part of the analysis is right. "Something's
// wrong" turns on marking: a small button next to each part (the title, the
// description, each animal's and person's row and fields, each rating)
// cycles unmarked -> minor -> wrong. A row's own button, at its start, marks
// the whole row as not really there. "Missed animal" / "Missed person" add a
// mark for something the model didn't report, and "Something else" covers
// the rest. Every part left unmarked counts as correct, and the verdict is
// the worst mark ("wrong", else "minor"). A comment can add detail.
//
// It all stays editable and saves as it changes. Tapping the selected
// verdict again clears the feedback. Analyzing the event again moves the
// feedback to the event's history.

const SAVE_MS = 500;
const AUTOSAVE_MS = 800;
const MAX_COMMENT = 4000;
const NEXT = { '': 'minor', minor: 'wrong', wrong: '' };
// A missed thing is always a mark: its button switches minor <-> wrong
const NEXT_MISSED = { minor: 'wrong', wrong: 'minor' };
const SINGULAR = { animals: 'animal', people: 'person' };
// What a marked value should be: the choices for fields with a fixed set
// (matching the automation's response schema), free text or a number
// otherwise. The corrections make the feedback ground truth for scoring.
const AGES = { animals: ['adult', 'young'], people: ['adult', 'child'] };
const LEVELS = {
    funny: ['ordinary', 'slightly funny', 'funny', 'hilarious'],
    cute: ['ordinary', 'slightly cute', 'cute', 'adorable'],
    unusual: ['ordinary', 'notable', 'unusual', 'extraordinary'],
    trouble: ['none', 'close call or rescued', 'needs help', 'hurt'],
};

// The kind of correction a part takes: {type: 'text' | 'number' | 'choice',
// choices}, or null when it takes none (such as the title or an appearance)
function correctionFor(part, isRow) {
    const [section, item, field] = part.split('.');
    if (isRow) return section === 'ratings' && LEVELS[item] ? { type: 'choice', choices: LEVELS[item] } : null;
    if (field === 'species') return { type: 'text', placeholder: 'species' };
    if (field === 'count') return { type: 'number', placeholder: 'count' };
    if (field === 'age' && AGES[section]) return { type: 'choice', choices: AGES[section] };
    return null;
}

// An input for a correction; onChange(value, typing) gets '' / text / a number
function correctionInput(kind, value, onChange, label) {
    let input;
    if (kind.type === 'choice') {
        input = document.createElement('select');
        input.innerHTML = `<option value="">should be…</option>${kind.choices
            .map((c) => `<option value="${c}">${c}</option>`).join('')}`;
        input.value = kind.choices.includes(value) ? value : '';
        input.addEventListener('change', () => onChange(input.value, false));
    } else {
        input = document.createElement('input');
        input.type = kind.type === 'number' ? 'number' : 'text';
        if (kind.type === 'number') { input.min = '1'; input.step = '1'; input.inputMode = 'numeric'; }
        input.placeholder = kind.placeholder || 'should be…';
        input.value = value ?? '';
        input.addEventListener('input', () => {
            const v = input.value.trim();
            onChange(kind.type === 'number' ? (v ? Math.max(1, Math.round(Number(v))) || '' : '') : v, true);
        });
    }
    input.className = 'fb-fix-input';
    input.setAttribute('aria-label', label);
    input.addEventListener('click', (e) => e.stopPropagation());
    return input;
}

// The badge the timeline shows for an event's feedback, by verdict:
// [icon, text, icon colour, background]
const VERDICT_BADGES = {
    correct: ['mdi:check-circle', 'Correct', '#16A34A', 'rgba(22,163,74,0.15)'],
    minor: ['mdi:alert-circle', 'Minor issues', '#D97706', 'rgba(245,158,11,0.18)'],
    wrong: ['mdi:close-circle', 'Wrong', '#DC2626', 'rgba(220,38,38,0.14)'],
    incorrect: ['mdi:close-circle-outline', "Something's wrong", '#DC2626', 'rgba(220,38,38,0.14)'],
};

// A badge for the feedback given on an event, '' without feedback
export function feedbackBadgeHtml(feedback, badgeClass) {
    const badge = VERDICT_BADGES[feedback?.verdict];
    if (!badge) return '';
    const [icon, text, color, background] = badge;
    return `<span class="${badgeClass}" data-feedback-badge style="background-color:${background};" title="Your feedback: ${text}"><ha-icon icon="${icon}" style="color:${color};"></ha-icon><span class="text" style="text-transform:none;">${text}</span></span>`;
}

export function feedbackCss(prefix) {
    const p = `.${prefix}`;
    return `
    ${p}-feedback {
        margin: 4px 0 8px; font-family: var(--ha-font-family-body, Roboto, sans-serif);
    }
    ${p}-feedback-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    ${p}-feedback-question { color: var(--secondary-text-color); margin-right: 4px; }
    ${p}-feedback-row button, ${p}-feedback-add {
        display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 18px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.2)); background: transparent;
        color: var(--primary-text-color); font: inherit; cursor: pointer; --mdc-icon-size: 18px;
    }
    ${p}-feedback-row button[aria-pressed="true"].correct {
        background: rgba(22,163,74,0.15); border-color: #16A34A;
    }
    ${p}-feedback-row button[aria-pressed="true"].incorrect {
        background: rgba(220,38,38,0.12); border-color: #DC2626;
    }
    ${p}-feedback-row button.correct ha-icon { color: #16A34A; }
    ${p}-feedback-row button.incorrect ha-icon { color: #DC2626; }
    ${p}-feedback-marking { margin-top: 8px; }
    ${p}-feedback-marking[hidden] { display: none; }
    ${p}-feedback-hint { margin: 0 0 6px; color: var(--secondary-text-color); font-size: 0.9em; line-height: 1.4; }
    ${p}-feedback-grade { font-weight: 500; }
    ${p}-feedback-grade.minor { color: #B45309; }
    ${p}-feedback-grade.wrong { color: #DC2626; }
    ${p}-feedback-other { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    ${p}-feedback-marking textarea {
        box-sizing: border-box; width: 100%; min-height: 64px; resize: vertical; padding: 8px 10px;
        border-radius: 8px; border: 1px solid var(--divider-color, rgba(0,0,0,0.2));
        background: var(--card-background-color, transparent); color: var(--primary-text-color);
        /* 16px keeps iOS from zooming in on focus */
        font: 16px/1.4 var(--ha-font-family-body, Roboto, sans-serif);
    }
    ${p}-feedback-actions { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
    ${p}-feedback-actions button {
        padding: 6px 14px; border-radius: 16px; border: none; cursor: pointer; font: inherit;
        background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
    }
    ${p}-feedback-status { color: var(--secondary-text-color); font-size: 0.9em; }
    ${p}-feedback-status.error { color: var(--error-color, #DC2626); }

    /* Mark buttons, shown only while marking */
    .fb-mark {
        display: none; vertical-align: middle; margin-left: 6px; padding: 0 7px; height: 22px;
        min-width: 26px; box-sizing: border-box; align-items: center; justify-content: center; gap: 3px;
        border-radius: 11px; border: 1px dashed var(--secondary-text-color, #888); background: transparent;
        color: var(--secondary-text-color); cursor: pointer; white-space: nowrap;
        font: 500 12px/1 var(--ha-font-family-body, Roboto, sans-serif); --mdc-icon-size: 14px;
    }
    .fb-marking .fb-mark { display: inline-flex; }
    .fb-mark.minor { border: 1px solid #D97706; background: #F59E0B; color: #1f1f1f; }
    .fb-mark.wrong { border: 1px solid #B91C1C; background: #DC2626; color: #fff; }
    .fb-mark-cell { display: none; width: 1px; padding-right: 0 !important; }
    .fb-marking .fb-mark-cell { display: table-cell; }
    .fb-mark-cell .fb-mark { margin-left: 0; }
    .fb-marking [data-fb="minor"]:not(tr), .fb-marking tr[data-fb="minor"] > * { background: rgba(245,158,11,0.16); }
    .fb-marking [data-fb="wrong"]:not(tr), .fb-marking tr[data-fb="wrong"] > * { background: rgba(220,38,38,0.13); }
    .fb-marking tr[data-row="item"][data-fb] > :not(.fb-mark-cell) { text-decoration: line-through; }
    .fb-fix { display: none; align-items: center; gap: 4px; margin: 4px 0 0 6px; font-size: 12px; color: var(--secondary-text-color); text-decoration: none; }
    .fb-marking .fb-fix.on { display: inline-flex; }
    .fb-fix-input {
        box-sizing: border-box; height: 26px; padding: 0 6px; border-radius: 6px; max-width: 160px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.25)); background: var(--card-background-color, #fff);
        color: var(--primary-text-color); font: 14px var(--ha-font-family-body, Roboto, sans-serif);
    }
    input.fb-fix-input[type="number"] { width: 64px; }
    .fb-missed { display: none; margin-top: 6px; }
    .fb-marking .fb-missed { display: block; }
    .fb-missed-item { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 4px 0; }
    .fb-missed-item .fb-mark { margin-left: 0; }
    .fb-missed-remove {
        border: none; background: transparent; color: var(--secondary-text-color); cursor: pointer;
        padding: 2px; --mdc-icon-size: 16px; display: inline-flex;
    }
    ${p}-feedback-add { padding: 3px 10px; font-size: 0.9em; --mdc-icon-size: 16px; }
    `;
}

export function feedbackHtml(prefix) {
    return `
    <div class="${prefix}-feedback">
        <div class="${prefix}-feedback-row">
            <span class="${prefix}-feedback-question">Is this right?</span>
            <button type="button" class="correct" aria-pressed="false"><ha-icon icon="mdi:check-circle-outline"></ha-icon><span>Everything correct</span></button>
            <button type="button" class="incorrect" aria-pressed="false"><ha-icon icon="mdi:close-circle-outline"></ha-icon><span>Something's wrong</span></button>
            <span class="${prefix}-feedback-status" role="status"></span>
        </div>
        <div class="${prefix}-feedback-marking" hidden>
            <p class="${prefix}-feedback-hint">Tap <ha-icon icon="mdi:flag-outline" style="--mdc-icon-size:14px"></ha-icon> next to anything wrong: once for a minor issue, twice for wrong. The button at the start of a row means it isn't really there. Everything left unmarked counts as correct. Where you can, say what it should be: that lets future versions be checked against your answer.</p>
            <div><span class="${prefix}-feedback-grade" role="status"></span></div>
            <div class="${prefix}-feedback-other"><span>Something else</span></div>
            <textarea maxlength="${MAX_COMMENT}" placeholder="Anything to add? (optional)"></textarea>
            <div class="${prefix}-feedback-actions">
                <button type="button" class="save">Save</button>
            </div>
        </div>
    </div>`;
}

function markButton(title) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'fb-mark';
    b.dataset.title = title;
    return b;
}

function paintButton(b, severity) {
    b.classList.toggle('minor', severity === 'minor');
    b.classList.toggle('wrong', severity === 'wrong');
    b.innerHTML = severity
        ? `<span>${severity === 'minor' ? 'Minor' : 'Wrong'}</span>`
        : '<ha-icon icon="mdi:flag-outline"></ha-icon>';
    const what = b.dataset.title;
    b.title = severity ? `${what}: marked ${severity} (tap to change)` : `Mark: ${what}`;
    b.setAttribute('aria-label', b.title);
}

// The grade the marks give: "wrong", "minor" or '' (nothing marked)
export function gradeOf(marks) {
    const severities = [...marks.values()];
    if (severities.includes('wrong')) return 'wrong';
    return severities.length ? 'minor' : '';
}

// Wires the block built by feedbackHtml. root is the popup content, holding
// the parts to mark: elements with data-part (the title, the description,
// details rows and cells) and details sections (data-section, for missed
// things). save({verdict, comment, marks}) stores the feedback and resolves
// to the saved feedback (or null); formatTime(iso) formats its time;
// onSaved(feedback) is told of each save.
export function attachFeedback(root, prefix, { feedback, save, formatTime, onSaved }) {
    const block = root.querySelector(`.${prefix}-feedback`);
    if (!block) return;
    const correct = block.querySelector('button.correct');
    const incorrect = block.querySelector('button.incorrect');
    const marking = block.querySelector(`.${prefix}-feedback-marking`);
    const grade = block.querySelector(`.${prefix}-feedback-grade`);
    const textarea = marking.querySelector('textarea');
    const saveButton = marking.querySelector('button.save');
    const status = block.querySelector(`.${prefix}-feedback-status`);
    const details = block.closest('details');

    let current = feedback && feedback.verdict ? feedback : null;
    let savedComment = current?.comment || '';
    // part -> 'minor' | 'wrong', and part -> what it should be (when given)
    const given = (Array.isArray(current?.marks) ? current.marks : [])
        .filter((m) => m && m.part && (m.severity === 'minor' || m.severity === 'wrong'));
    const marks = new Map(given.map((m) => [m.part, m.severity]));
    const values = new Map(given.filter((m) => m.value !== undefined).map((m) => [m.part, m.value]));
    // part -> its correction element, shown while the part is marked
    const fixes = new Map();
    let timer = null;
    let pending = Promise.resolve();
    textarea.value = savedComment;

    const setStatus = (text, error = false) => {
        status.textContent = text;
        status.classList.toggle('error', error);
    };
    const savedText = () => {
        if (!current) return '';
        const when = current.updated ? formatTime(current.updated) : '';
        return `Saved${when ? ` · ${when}` : ''}`;
    };
    const somethingWrong = () => Boolean(current && current.verdict !== 'correct');

    // Mark buttons for every part, each painted from marks
    const buttons = new Map();
    const paint = (part) => {
        const b = buttons.get(part);
        if (b) paintButton(b, marks.get(part) || '');
        fixes.get(part)?.classList.toggle('on', marks.has(part));
        // Parts are [a-z0-9_.] only, safe in a selector
        root.querySelectorAll(`[data-part="${part}"]`).forEach((el) => {
            if (marks.has(part)) el.dataset.fb = marks.get(part);
            else delete el.dataset.fb;
        });
    };
    const addButton = (part, title, place) => {
        const b = markButton(title);
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            setMark(part, NEXT[marks.get(part) || '']);
        });
        buttons.set(part, b);
        place(b);
        paint(part);
    };
    const setValue = (part, value, typing) => {
        if (value === '' || value === null || value === undefined) values.delete(part);
        else values.set(part, value);
        storeSoon(typing ? AUTOSAVE_MS : SAVE_MS);
    };
    const addFix = (part, isRow, place) => {
        const kind = correctionFor(part, isRow);
        if (!kind) return;
        const fix = document.createElement('span');
        fix.className = 'fb-fix';
        fix.innerHTML = '<span>→</span>';
        fix.appendChild(correctionInput(kind, values.get(part), (v, typing) => setValue(part, v, typing), `${part} should be`));
        place(fix);
        fixes.set(part, fix);
        fix.classList.toggle('on', marks.has(part));
    };
    for (const el of root.querySelectorAll('[data-part]')) {
        const part = el.dataset.part;
        if (el.tagName === 'TR') {
            const title = el.dataset.row === 'item' ? 'not really there' : `${el.querySelector('th')?.textContent || part} is off`;
            const cell = document.createElement('td');
            cell.className = 'fb-mark-cell';
            el.insertBefore(cell, el.firstChild);
            addButton(part, title, (b) => cell.appendChild(b));
            // A rating's correct level goes in its level cell
            addFix(part, true, (fix) => (el.querySelector('td[data-column="Level"]') || el.lastElementChild).appendChild(fix));
            // Header rows of the same table get an empty cell to match
            const table = el.closest('table');
            if (table && !table.dataset.fbCells) {
                table.dataset.fbCells = '1';
                table.querySelectorAll('thead tr').forEach((tr) => {
                    const th = document.createElement('td');
                    th.className = 'fb-mark-cell';
                    tr.insertBefore(th, tr.firstChild);
                });
            }
        } else {
            const title = el.dataset.column ? `${el.dataset.column.toLowerCase()} is wrong` : `${part} is wrong`;
            addButton(part, title, (b) => el.appendChild(b));
            addFix(part, false, (fix) => el.appendChild(fix));
        }
    }
    const otherRow = marking.querySelector(`.${prefix}-feedback-other`);
    addButton('other', 'something else', (b) => otherRow.appendChild(b));

    // Missed things: a list under each list section, with an add button
    const missedLists = new Map();
    const renderMissed = (section) => {
        const list = missedLists.get(section);
        if (!list) return;
        const items = list.querySelector('.fb-missed-items');
        items.innerHTML = '';
        const noun = SINGULAR[section] || 'item';
        const parts = [...marks.keys()].filter((part) => part.startsWith(`${section}.missed.`));
        parts.forEach((part, i) => {
            const row = document.createElement('div');
            row.className = 'fb-missed-item';
            row.innerHTML = `<span>Missed ${noun}${parts.length > 1 ? ` ${i + 1}` : ''}</span>`;
            const b = markButton(`missed ${noun}`);
            b.style.display = 'inline-flex';
            paintButton(b, marks.get(part));
            b.addEventListener('click', () => setMark(part, NEXT_MISSED[marks.get(part)] || 'wrong'));
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'fb-missed-remove';
            remove.title = 'Remove';
            remove.setAttribute('aria-label', `Remove missed ${noun}`);
            remove.innerHTML = '<ha-icon icon="mdi:close"></ha-icon>';
            remove.addEventListener('click', () => { values.delete(part); setMark(part, ''); });
            // What was missed: species and count for an animal, count and
            // age for a person
            const fields = section === 'people'
                ? [['count', { type: 'number', placeholder: 'count' }], ['age', { type: 'choice', choices: AGES.people }]]
                : [['species', { type: 'text', placeholder: 'species' }], ['count', { type: 'number', placeholder: 'count' }]];
            const value = { ...(values.get(part) || {}) };
            const inputs = fields.map(([field, kind]) => correctionInput(kind, value[field], (v, typing) => {
                if (v === '') delete value[field];
                else value[field] = v;
                setValue(part, Object.keys(value).length ? { ...value } : '', typing);
            }, `missed ${noun} ${field}`));
            row.append(b, ...inputs, remove);
            items.appendChild(row);
        });
    };
    for (const section of root.querySelectorAll('[data-section][data-kind="list"]')) {
        const key = section.dataset.section;
        const noun = SINGULAR[key] || 'item';
        const list = document.createElement('div');
        list.className = 'fb-missed';
        list.innerHTML = `<div class="fb-missed-items"></div><button type="button" class="${prefix}-feedback-add"><ha-icon icon="mdi:plus"></ha-icon><span>Missed ${noun}</span></button>`;
        list.querySelector('button').addEventListener('click', () => {
            const used = [...marks.keys()]
                .filter((part) => part.startsWith(`${key}.missed.`))
                .map((part) => Number(part.split('.').pop()));
            setMark(`${key}.missed.${used.length ? Math.max(...used) + 1 : 1}`, 'wrong');
        });
        section.appendChild(list);
        missedLists.set(key, list);
        renderMissed(key);
    }

    const render = () => {
        const wrong = somethingWrong();
        correct.setAttribute('aria-pressed', String(current?.verdict === 'correct'));
        incorrect.setAttribute('aria-pressed', String(wrong));
        marking.hidden = !wrong;
        root.classList.toggle('fb-marking', wrong);
        const g = gradeOf(marks);
        grade.className = `${prefix}-feedback-grade ${g}`;
        const counts = ['wrong', 'minor']
            .map((s) => [s, [...marks.values()].filter((v) => v === s).length])
            .filter(([, n]) => n)
            .map(([s, n]) => `${n} ${s}`)
            .join(', ');
        grade.textContent = g ? `${g === 'wrong' ? 'Wrong' : 'Minor issues'} (${counts})` : 'Nothing marked yet';
    };

    // Saves run one after another, so the last one wins
    const store = (verdict) => {
        clearTimeout(timer);
        setStatus('Saving…');
        const comment = textarea.value.trim();
        const list = verdict && verdict !== 'correct'
            ? [...marks].map(([part, severity]) => (values.has(part)
                ? { part, severity, value: values.get(part) }
                : { part, severity }))
            : [];
        pending = pending.then(async () => {
            try {
                const saved = await save({ verdict, comment, marks: list });
                current = saved;
                savedComment = saved?.comment ?? comment;
                setStatus(saved ? savedText() : 'Feedback cleared');
                if (onSaved) onSaved(saved);
            } catch (e) {
                setStatus(`Couldn't save: ${e?.body?.message || e?.message || e}`, true);
            }
            render();
        });
        return pending;
    };
    const storeSoon = (delay) => {
        clearTimeout(timer);
        setStatus('Not saved yet');
        timer = setTimeout(() => store('incorrect'), delay);
    };

    function setMark(part, severity) {
        if (severity) marks.set(part, severity);
        else marks.delete(part);
        paint(part);
        const section = part.split('.')[0];
        if (part.startsWith(`${section}.missed.`)) renderMissed(section);
        render();
        storeSoon(SAVE_MS);
    }

    const clearMarks = () => {
        const parts = [...marks.keys()];
        marks.clear();
        values.clear();
        fixes.forEach((fix) => fix.querySelectorAll('input, select').forEach((i) => { i.value = ''; }));
        parts.forEach(paint);
        missedLists.forEach((_, key) => renderMissed(key));
    };
    const hasWork = () => marks.size > 0 || textarea.value.trim() !== '';

    correct.addEventListener('click', () => {
        if (current?.verdict === 'correct') {
            current = null;
            store(null);
        } else {
            if (marks.size && !confirm('Discard your marks and say everything is correct?')) return;
            clearMarks();
            current = { ...(current || {}), verdict: 'correct' };
            store('correct');
        }
        render();
    });
    incorrect.addEventListener('click', () => {
        if (somethingWrong()) {
            if (hasWork() && !confirm('Clear your feedback on this event?')) return;
            clearMarks();
            textarea.value = '';
            current = null;
            store(null);
        } else {
            current = { ...(current || {}), verdict: 'incorrect' };
            store('incorrect');
            // Everything there is to mark is in view
            if (details) details.open = true;
        }
        render();
    });

    textarea.addEventListener('input', () => {
        clearTimeout(timer);
        if (textarea.value.trim() === savedComment) {
            setStatus(savedText());
            return;
        }
        storeSoon(AUTOSAVE_MS);
    });
    const saveNow = () => store('incorrect');
    saveButton.addEventListener('click', saveNow);
    textarea.addEventListener('blur', () => {
        if (textarea.value.trim() !== savedComment) saveNow();
    });
    textarea.addEventListener('keydown', (e) => {
        // Escape would close the popup: keep the text, save it first
        if (e.key === 'Escape' && textarea.value.trim() !== savedComment) saveNow();
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            saveNow();
        }
    });

    render();
    setStatus(savedText());
}
