# Implementation notes

## Implemented experience

This is a standalone static Astro project. The approved Final documents were used as the initial specification; the later implementation feedback governs the final visual direction and copy. No planning documents or original project reports were edited.

The entrance begins in a blue sky with clouds and studded construction bricks. The first downward wheel, touch, or keyboard gesture is intercepted to start an approximately 2.4-second assembly **without moving the page**. Additional scroll input is ignored during playback; scrolling resumes after it finishes. No programmatic scrolling advances the visitor. The headline appears during the latter part of the assembly. The intro fits the viewport beneath the header. Skip navigation and Escape can end the introduction early. This behavior implements the user's final correction and supersedes both the long scrubbed sequence and the automatic playback that allowed the page to scroll away.

Homepage loads disable browser scroll restoration before rendering. On a homepage **reload**, a retained section fragment such as `#projects` is removed with `history.replaceState` before the browser can jump to it; the query string is preserved. Fresh direct anchor navigation and clicked project links retain their normal purpose. Initial intro/navigation dimensions are established before the interaction module loads to avoid layout jumps. A small early-input handler captures a first gesture even before the main module loads, with a timeout that restores normal access if initialization fails.

The original Three.js scene is now **pre-rendered locally** into a 2.4-second transparent WebM animation, with high-resolution first/last-frame images. The geometry, lighting, colors, camera, and formation are retained. A wide render preserves the original camera framing across ordinary desktop aspect ratios. Visitors load an optimized animation instead of initializing shaders or running a live renderer. Playback is prepared before movement begins and drives the text reveal from the video's actual time. A brief loading status appears if the first gesture precedes media readiness; waiting is bounded and uses the same final-frame artwork on failure. Mobile, reduced-motion, unsupported-video, and failure paths use the original film?s final-frame image. The older angled SVG fallback has been removed. Decorative animation assets are isolated in `public/decorative/` and never presented as gameplay evidence.

Project order retains the established visual sequence. The September 2026 editorial revision leads with recognizable game features and short demonstrations, with engineering optional:

1. Gravity Dash: custom gravity and procedural courses; space with brick-built spacecraft and a constructed planet.
2. Time Tag: dash/rewind, round rewards and leaderboards, shop purchase flow, and saved inventory; subdued cyberpunk colors and flowing time trails, without a bar-like skyline.
3. ANTS!: networked grabbing, ownership handoffs, and ragdoll / IK authority; excavated brick terrain.
4. AniPal Archipelago: companion jobs and job changes, inventory/chests, weather, and source-reviewed saved state; blue water plates and constructed islands.

Flat, front-facing brick-wallpaper transitions connect the local palettes. Each row has a uniform color, changing progressively between environments; sparse accent-colored bricks were removed at the user's request. Angled protruding transition strips were also removed. The project index, services, about, contact, and footer use warm construction materials rather than large white backgrounds. The readability pass uses **Gameplay / How it works** and **Explore [project]** rather than case-study terminology. Main summaries, feature tags, and service descriptions use plain language; exact mechanisms remain in optional technical details. Feature tags sit above the footage with opaque backgrounds, and text near decorative models has solid reading surfaces.

Transitions use the earlier restrained edge shading and stud highlights rather than the later pronounced face gradients. The four full case-study pages continue their corresponding space, temporal, underground, and sea themes through the headers, body backgrounds, technical panels, and supporting media.

## Pages and content

- `/`
- `/projects/gravity-dash/`
- `/projects/time-tag/`
- `/projects/ants/`
- `/projects/anipal-archipelago/`
- `/about/`
- `/services/`
- `/contact/`
- Custom 404 page.

Each project has one schema-validated JSON record in `src/content/projects/`. Homepage summaries and full case studies use that record. Technical cases carry source-verification status and IDs from the Final claims document. New feature overviews include report/section references and material limitations. The website-local EDITORIAL_EVIDENCE.md maps broader claims without inventing Final claim IDs. Gameplay and supporting media precede the optional engineering disclosure; the networking diagram is inside technical details. Attribution remains visible.

`src/content.config.ts` validates the records. `src/data/site.ts` owns identity/contact configuration and service-to-project links. `src/data/media.json` owns capture IDs, metadata, paths, and placeholder/review status. Adding a project requires a record matching the schema, media entries, and its visual theme; the route and homepage list are generated automatically.

## Component and motion structure

- `layouts/Base.astro`: semantic shell, navigation, metadata, footer, font imports.
- `components/Workshop.astro`, `Landscape.astro`: sky entrance and complete SVG fallback.
- `scripts/descent.ts`: one-gesture animation timing, delayed copy, reduced-motion behavior.
- `scripts/wall-scene.ts`: original Three.js scene retained exclusively for local asset generation.
- `scripts/render-intro-film.mjs`: renders the scene frame-by-frame and encodes the transparent video using the development FFmpeg dependency. Run against the dev server when changing the intro art. It creates/removes its temporary capture page automatically; raw frames stay in ignored `artifacts/`.
- `public/decorative/`: optimized intro animation and first/last still frames, approximately 1.7 MB for the current video.
- `components/ProjectSummary.astro`: shared homepage case presentation.
- `components/PlayExplode.astro`, `scripts/interactions.ts`: accessible mode buttons and reversible, project-specific model changes.
- `components/ProjectEnvironment.astro`, `WorldTransition.astro`: constructed environments and section handoffs.
- `lib/illustrations.ts`, `lib/environments.ts`: original SVG construction geometry. These are explanatory/decorative assets, never gameplay.
- `components/Media.astro`: deliberate placeholders or reviewed video/picture assets, responsive image variants, optional mobile video source, playback fallback, and offscreen pause.
- `styles/`: base editorial layout, motion, terrain materials, project environments, and the final entrance/transition treatment. `global.css` imports the specialized sheets; later environment rules override the original light design system.

There is no React, GSAP, physics engine, database, tracking script, or runtime WebGL requirement. Real gameplay and the clearly separate decorative intro use normal HTML media. Three.js is a development dependency for rendering assets and is not loaded by visitors. Browser timing checks found no mid-playback buffering events or frame gaps over 150 ms in the delayed-load video test; these are local observations, not a general hardware-performance guarantee.

## Accessibility and fallbacks

All main navigation and controls are keyboard accessible, with visible focus states. Hidden introductory copy is inert until revealed. Gameplay / How it works uses real buttons with pressed states. Technical content remains semantic HTML.

With JavaScript disabled, the original assembled-wall still, headline, navigation, player explanation, technical explanation, and static diagrams are available. Reduced-motion mode skips the entrance animation and renders the final state immediately. Mobile uses the original film?s assembled-wall still. A video failure shows that same still and releases the page without switching artwork. Playback stops when complete or offscreen and pauses in a hidden tab.

## Run and validate

Use Node 22.12+ compatible with the installed Astro version (implementation was built using Node 24.12.0):

```powershell
cd "C:\Users\JB\Documents\Roblox Portfolio\Website"
npm ci
npm run dev
```

Development URL: `http://127.0.0.1:4321/`.

```powershell
npm run build
npm run preview -- --port 4322
npx playwright install chromium
npm test
```

`npm run build` runs claim checks, media checks, Astro TypeScript diagnostics, and the production build. `npm test` runs Playwright route/link/asset checks, keyboard and mode interactions, 390/320px layouts, reduced-motion/no-JavaScript checks, and axe WCAG A/AA scans. Browser results are saved in `artifacts/validation.json`; screenshots are also in `artifacts/`. Automated accessibility checks do not replace an assistive-technology review. `scripts/inspect.mjs` captures development screenshots for visual review.

September 2026 editorial validation: the production build passed with zero errors, warnings, or hints; all 12 media references remain explicit placeholders. The browser suite passed 303 checks across eight routes, including desktop, 390/320px mobile, interactions, links/assets, reduced motion, no JavaScript, and axe A/AA scans. Additional checks passed for feature/media ordering, closed engineering disclosures, technical deep links, expanded mobile layout, no-JavaScript disclosures, and repeated homepage anchor reloads. Desktop/mobile captures were visually reviewed. Hash comparison confirmed all 17 Final/original reports, shared styles, interaction/animation scripts, and decorative assets in the preservation snapshot were unchanged (33 files total). Earlier intro cold-start tests found the first gesture was captured without page movement, playback completed, and scrolling resumed afterward. Those historical timing observations are not new performance measurements. Real gameplay playback and transcoding remain pending real captures.

## Replace gameplay placeholders

See [MEDIA_CAPTURE_GUIDE.md](MEDIA_CAPTURE_GUIDE.md) for the exact setup, actions, framing, and evidence needed for every requested video/photo.

All twelve active capture slots are explicitly placeholders: six core clips and six breadth clips. No real gameplay was recorded or fabricated during the editorial revision. The decorative brick models remain labeled as illustrations.

| Capture | Destination | Required visible result |
| --- | --- | --- |
| GD-01 | `public/projects/gravity-dash/` | Continuous gravity traversal with connected course context |
| GD-04 | same | Currency-spend crate opening and collected item |
| TT-01 | `public/projects/time-tag/` | Aim, preview, dash, landing |
| TT-02 | same | Recorded movement rewind |
| TT-05 | same | Round leaderboard and confirmed wallet reward |
| TT-06 | same | Currency offer and genuine purchase prompt; not proof of a completed sale |
| TT-07 | same | Owned trail and currency before/after a real return |
| AN-01 | `public/projects/ants/` | Solo drag, shared haul, release |
| AN-02 | same | Ragdoll, recovery, immediate control |
| AP-01 | `public/projects/anipal/` | Working island plus a visible job change |
| AP-06 | same | Inventory/chest transfer and updated contents |
| AP-07 | same | Actual weather transition in one server |

GD-02 course context is absorbed into GD-01 where practical. The player-visible AP-02 job-change action is absorbed into AP-01. GD-03 probes, TT-03 graphs, and AP-02 diagnostic overlays are optional and absent from active page/manifest slots. AP-03 offline return is deferred until its checkpoint path and visible causal result are verified. IDs keep their historical meanings; optional shots are documented in the guide and are not mandatory launch assets. Time Tag supplies the planned saved-progress demonstration.

Keep raw source recordings outside `public/`, preferably in an ignored `_media-source/` directory. For an approved real capture:

```powershell
npm run media:video -- GD-01 "C:\captures\gravity-traversal.mp4" 2 12
npm run media:video -- AP-06 "C:\captures\chest-transfer.mp4" 0 10
```

The video command requires local FFmpeg and FFprobe on PATH. It trims the selected interval, strips audio, encodes H.264 MP4 plus a smaller mobile copy, creates a JPEG poster, reads actual metadata, and updates the manifest. The image command uses Sharp, respects orientation, does not upscale, and emits AVIF/WebP/JPEG responsive variants. These commands assume the input has been reviewed as genuine gameplay. Their transcoding paths remain to be exercised on the real supplied media; no fabricated gameplay fixtures were added.

Alternatively, place preprocessed assets in the appropriate folder and update `src/data/media.json`: set `src`, `poster` for video, actual dimensions, duration, optional `mobileSrc`/image `variants`, and `status: "verified-capture"`. Run `npm run build`. Missing references, empty files, oversized media, and unreviewed statuses fail validation. If audio carries necessary information, provide a transcript. Videos do not autoplay.

Review the associated project descriptions and evidence notes after successful runtime verification; replacing a file alone does not verify a technical claim. Update any remaining "captures pending" copy when the corresponding captures are complete.

## Outstanding publication inputs and evidence

- Public name and contact email have not been supplied. Set `site.name`/branding and `site.email` in `src/data/site.ts` when confirmed. The contact page currently says enquiries are not sent and provides a local copyable brief; it never pretends to submit a message.
- ANTS! public release status is unresolved. It remains **Status to confirm**.
- Real gameplay and derived share images are still required. Technical captures are optional follow-ups.
- Gravity Dash's adapted surface sampling retains EmilyBendsSpace attribution. Its audited currency-shop free-grant mode must not be shown as paid monetization.
- Time Tag is local execution with server endpoint checks, not server-driven movement or rollback netcode. Purchase handling is source-reviewed; current product ownership, prompt, and grants need runtime verification. Audited subscription IDs still reference the prior universe. Round-reward TrailCrates have no verified consumption path.
- ANTS! multi-ant item ownership returns to Roblox automatic ownership; ragdoll body and procedural legs have separate authorities.
- AniPal's source audit identifies a PosterHandler Script/Module mismatch in the leave checkpoint. Verify/fix the current path before using reconnect footage as checkpoint proof. Staged publication is local; no cross-server lease, universal losslessness, crash guarantee, arbitrary login-partition invariance, or measured NPC capacity is claimed.
- No private game source excerpts were published. Algorithm/dependency attribution review is still advisable before adding excerpts.

## Next polish

Integrate the core and breadth gameplay first, then review the entrance speed and transitions on the intended desktop and phones. Fine-tune the illustrative spacecraft/islands against real device screenshots, add actual project share images, and run a screen-reader review. Benchmark AniPal only if performance/capacity language is desired. Measure website performance separately after real media is integrated.

## GitHub and Vercel

The project contains a lockfile and `.gitignore`; it can be a standalone repository. No remote repository was created and nothing was deployed.

1. Initialize a repository inside `Website` if desired, review the files, and commit the site. Exclude `node_modules`, `dist`, `.astro`, `artifacts`, raw captures, and secrets.
2. Create the intended GitHub repository and push after reviewing public content and dependencies.
3. Import the repository into Vercel using the Astro preset, build command `npm run build`, output directory `dist`, and a compatible Node version.
4. Set `SITE_URL` to the real HTTPS domain to emit correct canonical and Open Graph URLs. No invented domain is currently emitted.
5. Review a preview deployment and then configure the production domain. Add real gameplay-derived Open Graph images before public launch.

## References consulted during implementation

The user authorized design-reference research. Bruno Simon's portfolio informed the idea of maintaining one constructed visual world; Lusion's work was reviewed for scene-led transitions and separation of visual spectacle from readable information. No source/assets from either site were copied.

- https://bruno-simon.com/
- https://lusion.co/
- Astro collection documentation: https://docs.astro.build/en/reference/content-loader-reference/

## September 2026 editorial revision

The current user direction supersedes earlier Final/highlights recommendations to omit shops, currencies, inventories, weather, and ordinary progression. The source reports remain the evidence basis and are unchanged. Homepage copy, tags, services, project feature overviews, media metadata, and folder READMEs now share the revised direction. The entrance headline/copy, animation scripts, decorative film assets, project environments, and shared styles were preserved.

Detailed engineering is available through closed disclosures or personal enquiries. Historical technical section anchors still open their containing disclosure when linked directly. The original contact setup remains pending real identity/contact inputs; the site does not pretend to send an enquiry.

## Development-server content cache repair

The Explore links returned HTTP 500 on port 4321 after the feature schema change, even though the production preview at port 4322 passed. Inspection found the generated `.astro/data-store.json` contained the updated project records without their `features` arrays. A server restart reused that persisted store. Stopping the dev server, removing only the generated data-store file (backed up in ignored artifacts), and starting it again rebuilt complete records and resolved the error. No feature content was hidden or replaced with an empty-array fallback.

Run `npm run test:explore` against the running development server after future content/schema changes. It clicks all four homepage Explore links and checks HTTP success, project titles, full feature headings, supporting media, and browser errors. Use `TEST_URL` to target a different server. The check now passes against both development (4321) and production preview (4322). The earlier production-only validation missed this stale development cache.

## Startup / playback investigation and correction

Reproduced on the preview as well as the development site. The original playback code locked scrolling before media readiness and required readyState 4 / canplaythrough, with no bounded waiting path. At 180 KB/s and 80 ms simulated latency, the 2.4-second intro took about 11 seconds from input to completion and still emitted waiting events during playback. canplaythrough is an estimate, not a full-download guarantee.

A separate CPU-throttled trace found inherited custom-property writes on the intro every animation frame invalidated its large SVG subtree, even while the video hid the fallback. At 4? CPU throttling, the original trace spent about 1,992 ms in style recalculation; an isolation run suppressing just those writes took about 77 ms. This is diagnostic evidence under artificial throttling, not a general performance promise.

The animation now updates transform/opacity directly on the copy, clouds, ground, and cue. The film downloads to a complete local blob before playback, so live network buffering cannot interrupt it. Preparation and detected playback stalls have a 400 ms bound before completing with the existing original front-facing final frame and releasing scrolling. Early-input handling also respects Escape/navigation and does not restart/relock a late-loading intro after its timeout.

An initial attempt reused the older angled SVG fallback, changing the visible design under slow loading. The user rejected that change. The SVG fallback was removed from Workshop; all fallback paths use the exact original intro-last.webp artwork. Video, first/last-frame image files, camera, brick geometry, and materials were not changed. Mobile/reduced-motion/unsupported-video paths show the matching still immediately. No angular replacement animation remains.

Validation: production build passed. test-intro-resilience.mjs verifies actual film playback, delayed/failed download, interrupted playback, mobile and reduced-motion paths, matching final-frame artwork, visible text, and released scrolling. Screenshots of normal playback and forced fallback were visually compared. The main browser suite and input checks are run separately. Investigation traces are local artifacts, not public benchmark claims.

Final checks for this correction: 303 browser checks passed; wheel/keyboard and immediate mobile-still checks passed; the actual-film test recorded 142 presented frames with no waiting events or frame gaps over 150 ms; cold-start and repeated homepage reload checks passed. Original film/poster images and Final/game reports remain unchanged by hash comparison.

## Early About Me section

Moved the homepage About section directly below the intro, ahead of the project overview and shortcuts. The Projects/Explore anchor includes this short introduction so visitors encounter the hobby context before the four games. User-supplied facts: third-year Computer Science student; all four projects were personal hobby games made for fun; responsibility includes builds, UI, and code. Shared identity/ownership copy in site.ts also updates the About page and project ownership captions. Specific library/adapted-technique credits remain accurate. Intro artwork and animation were not changed in this update.
