import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(
    readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

export default defineConfig({
    define: {
        __LLMVISION_VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                "llmvision-card": "src/llmvision-card.js",
                "llmvision-preview-card": "src/llmvision-preview-card.js",
                "llmvision-horizontal-card": "src/llmvision-horizontal-card.js",
            },
            output: {
                // llmvision-card.js is the resource HACS registers, with a
                // version query that changes on every update. The preview card
                // is only imported by it, so its name carries a content hash:
                // Home Assistant lets browsers cache /local files for 31 days,
                // and an unchanged URL would keep serving an old popup.
                entryFileNames: (chunk) =>
                    chunk.name === "llmvision-preview-card"
                        ? "assets/[name]-[hash].js"
                        : "[name].js",
                // The chunk the entries share: lit plus the card's helpers.
                // Its name changes with its content, so a new build never
                // asks for a file name a browser may have cached a 404 for
                // (Home Assistant serves /local 404s with a 31-day max-age).
                chunkFileNames: "assets/shared-[hash].js",
                format: "es",
            },
        },
    },
});