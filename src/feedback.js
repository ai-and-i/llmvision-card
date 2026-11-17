// The user's feedback on an event's analysis, in the popup: "Everything
// correct" or "Something's wrong" with a comment. Stored by the integration
// (POST llmvision/timeline/event/<id>/feedback) for scoring the model later.
// It stays editable: picking the other verdict changes it, picking the same
// one again clears it, and the comment saves as it is typed. Analyzing the
// event again moves the feedback to the event's history.

const AUTOSAVE_MS = 800;
const MAX_COMMENT = 4000;

export function feedbackCss(prefix) {
    return `
    .${prefix}-feedback {
        margin: 4px 0 8px; font-family: var(--ha-font-family-body, Roboto, sans-serif);
    }
    .${prefix}-feedback-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .${prefix}-feedback-question { color: var(--secondary-text-color); margin-right: 4px; }
    .${prefix}-feedback-row button {
        display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 18px;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.2)); background: transparent;
        color: var(--primary-text-color); font: inherit; cursor: pointer; --mdc-icon-size: 18px;
    }
    .${prefix}-feedback-row button[aria-pressed="true"].correct {
        background: rgba(22,163,74,0.15); border-color: #16A34A; color: var(--primary-text-color);
    }
    .${prefix}-feedback-row button[aria-pressed="true"].incorrect {
        background: rgba(220,38,38,0.12); border-color: #DC2626; color: var(--primary-text-color);
    }
    .${prefix}-feedback-row button.correct ha-icon { color: #16A34A; }
    .${prefix}-feedback-row button.incorrect ha-icon { color: #DC2626; }
    .${prefix}-feedback-comment { margin-top: 8px; }
    .${prefix}-feedback-comment[hidden] { display: none; }
    .${prefix}-feedback-comment textarea {
        box-sizing: border-box; width: 100%; min-height: 72px; resize: vertical; padding: 8px 10px;
        border-radius: 8px; border: 1px solid var(--divider-color, rgba(0,0,0,0.2));
        background: var(--card-background-color, transparent); color: var(--primary-text-color);
        /* 16px keeps iOS from zooming in on focus */
        font: 16px/1.4 var(--ha-font-family-body, Roboto, sans-serif);
    }
    .${prefix}-feedback-actions { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
    .${prefix}-feedback-actions button {
        padding: 6px 14px; border-radius: 16px; border: none; cursor: pointer; font: inherit;
        background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
    }
    .${prefix}-feedback-status { color: var(--secondary-text-color); font-size: 0.9em; }
    .${prefix}-feedback-status.error { color: var(--error-color, #DC2626); }
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
        <div class="${prefix}-feedback-comment" hidden>
            <textarea maxlength="${MAX_COMMENT}" placeholder="What's wrong? For example: it's a raccoon, not a cat; the box misses the animal; there is nothing there."></textarea>
            <div class="${prefix}-feedback-actions">
                <button type="button" class="save">Save</button>
            </div>
        </div>
    </div>`;
}

// Wires the block built by feedbackHtml inside root. save(verdict, comment)
// stores the feedback and resolves to the saved feedback (or null);
// formatTime(iso) formats its time; onSaved(feedback) is told of each save.
export function attachFeedback(root, prefix, { feedback, save, formatTime, onSaved }) {
    const block = root.querySelector(`.${prefix}-feedback`);
    if (!block) return;
    const correct = block.querySelector('button.correct');
    const incorrect = block.querySelector('button.incorrect');
    const commentBox = block.querySelector(`.${prefix}-feedback-comment`);
    const textarea = commentBox.querySelector('textarea');
    const saveButton = commentBox.querySelector('button.save');
    const status = block.querySelector(`.${prefix}-feedback-status`);

    let current = feedback && feedback.verdict ? feedback : null;
    let savedComment = current?.comment || '';
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
    const render = () => {
        const verdict = current?.verdict || '';
        correct.setAttribute('aria-pressed', String(verdict === 'correct'));
        incorrect.setAttribute('aria-pressed', String(verdict === 'incorrect'));
        commentBox.hidden = verdict !== 'incorrect';
    };

    // Saves run one after another, so the last one wins
    const store = (verdict, comment) => {
        clearTimeout(timer);
        setStatus('Saving…');
        pending = pending.then(async () => {
            try {
                current = await save(verdict, comment);
                savedComment = current?.comment ?? comment;
                setStatus(current ? savedText() : 'Feedback cleared');
                if (onSaved) onSaved(current);
            } catch (e) {
                setStatus(`Couldn't save: ${e?.body?.message || e?.message || e}`, true);
            }
            render();
        });
        return pending;
    };

    const pick = (verdict) => {
        // The selected verdict again clears the feedback
        const next = current?.verdict === verdict ? null : verdict;
        store(next, textarea.value.trim());
        // Show the choice now, not after the save
        current = next ? { ...(current || {}), verdict: next } : null;
        render();
        if (next === 'incorrect' && !textarea.value) textarea.focus();
    };
    correct.addEventListener('click', () => pick('correct'));
    incorrect.addEventListener('click', () => pick('incorrect'));

    textarea.addEventListener('input', () => {
        clearTimeout(timer);
        if (textarea.value.trim() === savedComment) {
            setStatus(savedText());
            return;
        }
        setStatus('Not saved yet');
        timer = setTimeout(() => store('incorrect', textarea.value.trim()), AUTOSAVE_MS);
    });
    const saveNow = () => {
        if (textarea.value.trim() !== savedComment || current?.verdict !== 'incorrect') {
            store('incorrect', textarea.value.trim());
        }
    };
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
