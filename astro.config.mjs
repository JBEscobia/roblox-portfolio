import { defineConfig } from 'astro/config';
export default defineConfig({ output: 'static', trailingSlash: 'always', site: process.env.SITE_URL || 'https://floppyside-dev.vercel.app', devToolbar: { enabled: false } });
