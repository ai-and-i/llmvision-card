// Per category: its icon when the event's label has none of its own, the
// icons of known labels, and the category color (see custom_colors).
export const labels = {
    "person": {
        "icon": "mdi:walk",
        "labels": {
            "person": "mdi:walk",
        },
        "color": "#3B82F6"
    },
    "vehicle": {
        "icon": "mdi:car",
        "labels": {
            "car": "mdi:car",
            "truck": "mdi:truck",
            "van": "mdi:van-utility",
            "bus": "mdi:bus",
            "bicycle": "mdi:bike",
            "motorcycle": "mdi:motorbike"
        },
        "color": "#64748B"
    },
    "delivery": {
        "icon": "mdi:package-variant-closed",
        "labels": {
            "delivery": "mdi:package-variant-closed"
        },
        "color": "#EA580C"
    },
    "animal": {
        "icon": "mdi:paw",
        "labels": {
            "dog": "mdi:dog",
            "cat": "mdi:cat",
            "bird": "mdi:bird",
            "animal": "mdi:paw"
        },
        "color": "#00dd51"
    },
    "entity": {
        "icon": "mdi:cctv",
        "labels": {
            "door": "mdi:door-closed",
            "camera": "mdi:cctv",
            "sensor": "mdi:access-point",
            "light": "mdi:lightbulb",
            "key": "mdi:key",
            "lock": "mdi:lock",
            "alarm": "mdi:alarm-light",
        },
        "color": "#8B5CF6"
    },
    "nature": {
        "icon": "mdi:tree",
        "labels": {
            "tree": "mdi:tree",
            "plant": "mdi:flower",
        },
        "color": "#16A34A"
    }
}
