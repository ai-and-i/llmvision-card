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

// Icon and color of an event: the icon of its label in its category, else the
// category's icon, both in the category color. Generic without a known category.
export function getIcon(category, label) {
    const categoryData = ownValue(labels, category);
    if (categoryData) {
        return {
            icon: ownValue(categoryData.labels, label) || categoryData.icon,
            color: categoryData.color,
        };
    }
    return { icon: 'mdi:motion-sensor', color: '#757575' };
}

// Icon of one label chip: the label's icon in the event's category, else in any
// category, else a generic tag.
export function getLabelIcon(label, category) {
    const inCategory = ownValue(ownValue(labels, category)?.labels, label);
    if (inCategory) return inCategory;
    for (const categoryData of Object.values(labels)) {
        const icon = ownValue(categoryData.labels, label);
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
