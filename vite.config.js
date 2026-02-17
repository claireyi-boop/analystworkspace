import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
// Use relative base so opening dist/index.html locally works (file://).
// GitLab CI sets VITE_BASE_URL for Pages (e.g. /project-path/).
const base = process.env.VITE_BASE_URL ?? './';
export default defineConfig({
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: { '@': path.resolve(__dirname, './src') },
    },
});
