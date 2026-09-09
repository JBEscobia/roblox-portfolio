# Roblox Systems Portfolio

An Astro portfolio with a pre-rendered brick assembly, four themed project environments, and accessible Gameplay / How it works explanations.

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:4321/. Astro 7 also supports `npm run dev -- --background`; use `npm exec astro dev stop` to stop that server.

```powershell
npm run build
npm run preview -- --port 4322
npx playwright install chromium
npm test
```

The build checks claims, media references, TypeScript, and Astro output. The browser suite targets http://127.0.0.1:4322/ and requires the preview server to be running. Generated screenshots and test results are kept in the ignored `artifacts/` directory.

Read [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md) for media replacement, unresolved evidence, configuration, and deployment.
