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
