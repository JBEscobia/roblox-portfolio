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

## Scroll-freeze investigation and gated entrance

The reported symptom was that scrolling froze, and that waiting before scrolling appeared to help. Waiting was measured and does not help: with the page completely idle there were no animation-frame callbacks and no long tasks across six ten-second windows, and the first gesture took about the same time to move the page cold (2,701 ms) as after twenty seconds of waiting (2,652 ms). The entrance starts on the first downward gesture whenever it arrives, so a wait only changes whether that gesture has already been spent.

Two causes were separated by ablation. First, `descent.ts` registered non-passive `wheel` and `touchmove` listeners on `window` to hold the page still during the entrance, and only removed them from the hot-module-replacement disposer, so in a production build they stayed attached for the life of the page. A non-passive listener prevents Chromium from scrolling on the compositor, so every later wheel event had to wait for the main thread even though both branches of the handler were unreachable once the phase was `complete`. `eligible()` also measured the section before testing the phase, forcing a synchronous layout on every downward wheel event and discarding the result. Second, the homepage carried 8,961 elements, 8,493 of them SVG primitives; five decorative wallpaper strips accounted for 3,745 of those on their own.

The listeners are now released in `complete()` and on the paths that skip the entrance, `eligible()` tests the phase before measuring, and `WorldTransition.astro` emits one tiled `<pattern>` per row instead of seventeen separate bricks. Each row was already a single flat colour, so the artwork is unchanged; the strips fell from 749 to 50 nodes each, the homepage from 8,961 to 5,475 elements and from 690 KB to 453 KB, and the pattern also covers viewports wider than the previous fixed seventeen-column run. Captured strips were compared pixel by pixel: differences are confined to antialiasing, at most 5/255 on any channel.

Measured with a screencast from the compositor rather than from page script, because polling `scrollY` runs on the main thread and a blocked main thread would otherwise fake a freeze. Under sixfold CPU throttling and six seconds of continuous wheel input, the original build left the picture standing still for about 4,630 ms across three runs, with a p95 gap of 282 ms and a worst stall of 305 ms; the current build averages 1,450 ms across five runs, with a p95 gap of 146 ms and a worst stall of 179 ms. Stalls over 100 ms fell from 24 to 11, and the same 75 wheel events took 9,895 ms to get through the page originally against 7,566 ms now. The original figure was re-measured after the change on the same machine and reproduced, so the comparison is not drift. These are throttled diagnostics, not general performance promises. The "time frozen" figure counts gaps over 100 ms and is sensitive near that threshold; the p95 gap and worst stall are the more stable numbers.

A second report followed: after the wall formed, the entrance paused and the headline appeared without a transition. Two causes were found. The final still is `display:none` until the swap, so a 2,700x900 image could not be decoded until the moment it was needed; the worst frame gap of the entire entrance landed exactly on that handover, alongside a 23 ms decode. And the reveal was interpolated in JavaScript every frame, while `update()` stops as soon as the phase leaves `playing` and `complete()` snaps progress to 1, so any early completion jumped the copy straight to full opacity.

The entrance is now gated. `IntroGate.astro` shows sky, a tumbling brick and a "Loading" label until the film is playable, the final still has been through `decode()`, and fonts are ready, with a 1,200 ms minimum so it cannot flash and a 4,000 ms cap so a slow connection cannot strand anyone. A gesture made during the gate is remembered and honoured when it lifts, and Escape skips out of it. Reduced motion and viewports at or below 760 px never load the film and never see the gate. The reveal is now a CSS transition enabled only once the entrance actually runs, so a dropped frame or an early completion cannot skip it: sampled across six CPU and network combinations, including eightfold throttling with a 100 KB/s connection, the copy took 39 distinct opacity values with a largest single step of 0.06.

`wall-scene.ts` now starts the bricks above the camera's visible top so the wall assembles out of empty sky, which is what the gate reveals. The film was re-rendered from the existing pipeline. `intro-last.webp` is byte-identical by SHA-256, so every fallback path keeps the exact original artwork; `intro-wall.webm` fell from 1,715 KB to 934 KB and `intro-first.webp` from 103 KB to 4.6 KB because the opening frames are now empty.

Two regressions were caught by re-measuring rather than by assumption. Closing the gate did not repaint, so the scroll cue kept the zero opacity it was given while the gate was up and the first view after loading was an empty sky with no affordance; `closeGate()` now schedules a frame. The new cue animation was also left running forever on three elements that are invisible once the entrance has played, which cost about 1,500 ms of the frozen budget on its own; it is now scoped to the idle state.

Also in this pass: the scroll cue is a downward cascade of bobbing chevrons rather than three static ones, and is centred properly; "Skip introduction" appears only while the entrance is playing, with focus still revealing it for keyboard users; `site.ts` carries the username and it now appears in the header wordmark, the homepage eyebrow, the About eyebrow, the footer wordmark and the footer rule; and a missing space meant the mobile hero read "interactions,and" once the line break was hidden.

Remaining lever, not taken here: about 4,900 SVG primitives are still emitted by `illustrations.ts`, dominated by roughly 730 brick studs at four elements each. A shared `<defs>` stud referenced by `<use>` would remove around 2,000 nodes without changing the artwork.

## Brick-built sky and a design iteration pass

The sun was a perfect circle carrying nine faint studs in a floating 3x3 grid. It was the only round object in a scene whose wall, ground horizon and contact call-to-action are all rectangles, the studs covered about a fifth of the plate, and two smooth arcs across it reinforced the roundness. It is now a mosaic of rectangular plates on a fixed 20-unit module: a 12x12 stepped disc split into 2- and 4-wide pieces with staggered seams, every module studded, ringed by eight detached rays.

Two attempts were needed. Stepping the row widths evenly (4, 6, 8, 10 ...) chamfers all four corners at 45 degrees and the disc reads as a diamond; the widths now used are the ones a circle of radius 6 actually covers on the grid, so the steps are large at the poles and flat at the equator. Rays attached to the body extended that diamond into a gem, so they sit off the disc with a clear module of sky around them. A 45 degree ray cannot be built on a square grid at all, and a stepped one attached to the octagon read as a lumpy corner, so the diagonals are single detached studs.

The clouds were rebuilt the same way, because a hard-edged sun beside smooth bezier clouds reads as a mistake rather than a contrast. Each is a wide flat base under bumps of unequal width sitting off-centre; symmetrical bumps on a stepped stack read as a ziggurat, not as weather. Cloud opacities were raised, since sky showing through the studs of a hard-edged brick reads as a rendering fault rather than distance.

`plateBuild` in `illustrations.ts` lays plates onto the module grid: one flat dark under-layer whose union supplies the silhouette edge and the bottom thickness, then each plate's face inset by a pixel so the under-layer reads through as a seam. Studs are one `<defs>` shape reused through `<use>`, which is the reduction the previous session's notes recommended and had not yet applied; drawing the sun's 124 studs inline would cost roughly three times the nodes. The homepage sits at 6,032 elements against about 5,680 before this pass, a 6% increase for a completely rebuilt sky.

Cloud placement lives in `descent.css`, not `earth.css`. Landscape is only rendered inside `.descent`, so `body .descent .cloud-one` beats the base `.cloud-one` and editing the base rules changes nothing visible. That cost a round of edits that appeared to do nothing; `earth.css` now says so at the top of its cloud block. `cloud-two` had been bisecting the sun horizontally, its shelf line cutting through the middle of the disc, and now starts below it.

Also in this pass, checked against screenshots at 360, 390, 430, 600, 768, 900, 1024, 1280, 1440 and 1920:

- The About section's left column held nothing but its eyebrow, leaving about 45% of the section empty. It now carries a facts panel built as a plate: a lighter top face with raised stud caps along it, then three figures drawn from the copy beside it. A stud lit from below reads as a drilled hole, so the highlight sits on top with the shadow underneath and the cap is lighter than the face it sits on. On phones the panel stacks between the section label and the headline; that order was left as it is.
- The four project shortcut cards were identical sand rectangles distinguished only by a 15px dot. Each now carries its own accent as a 6px top edge and a tint of the same colour.
- Six services in a four-column grid left two empty cells and a hole on the right; the grid is three columns, and the `↗` after each heading no longer wraps onto a line of its own.
- Below 1100px the desktop sky landed on the copy: the wide left cloud sat behind the eyebrow and the right cloud under the Contact link. Both breakpoints now push the clouds to the edges and below the buttons, and the sun steps down to 200px and then 128px.
- Four project cards and three service columns both stop being readable at tablet width, so both drop to two columns at 900px before the phone layout takes over.
- `.brand-role` in the header measured 2.54:1 against the header's `#77bce8` at 9.5px, failing axe on all eight routes. This predates the pass - the declaration is untouched in the diff - but it was failing `npm run test`, so it is now `#264652` at 4.88:1.

No horizontal page overflow at any width tested. Validation after the pass: production build green, `npm run test` 303 checks across 8 routes including axe WCAG A/AA at 390px and 320px, and `npm run test:explore` green against both the development server and the production preview. The intro film, its first and final frames, the wall geometry and the project content were not touched.

## Student line removed from the About copy

The user asked for the "third-year Computer Science student" framing to go, as likely irrelevant to what the portfolio is for. It appeared twice, both in the homepage About section directly under the intro: the facts panel's middle row (`03` / "Third year, Computer Science") is removed from `index.astro`, and `site.introduction` now opens "I enjoy making games." where it read "I’m a third-year Computer Science student who enjoys making games." The rest of that string is unchanged. `site.introduction` is shared, so the About page lead changes with it; that page's h1 is "Making games out of curiosity.", which the new opening now echoes. The "Early About Me section" entry above still lists the student fact among the user-supplied facts. That entry is history, not current copy; do not reintroduce it.

The panel keeps its plate, its six studs and two rows. Every figure in it was drawn from the copy beside it, and without the student sentence that copy supports only `04` games and `01` developer, so no replacement figure was invented. At 1440 and 900 the three-row panel's bottom had sat level with the end of the text column; the two-row panel ends about 80px above it, beside the second paragraph. The text column now sets the row height at both widths (303px; at 900 the taller panel had set it, at 326px). On phones the stacked strip is 94px shorter, 710 to 616. No horizontal overflow at 1440, 900 or 390, no page errors, and the old wording appears nowhere in the build output or the served pages.

`artifacts/check-about-intro.mjs` from the earlier pass asserts the old sentence and will now fail. It is a one-off, not wired into any npm script.

Validation: production build green (claims, media, `astro check`), the preview on 4322 confirmed serving the new build, `npm run test` 303 checks across 8 routes including axe WCAG A/AA, and `npm run test:explore` green against the development server.

## Projectiles, abilities, inventories, weather and shared shops

The user asked for five systems to be shown, each verified before it went in: Gravity Dash projectiles and abilities, AniPal as the inventory example, AniPal weather, and AniPal shared stores.

Three were already established by the source audits. Gravity Dash's twelve Lucky Block power-ups and their position-weighted odds are in the mechanics map and the deep pass, and CombatAuthService, the server-side authorization behind them, was read in full by the deep pass and is Final claim GD-C07. The highlights report had recommended keeping it; the site had dropped it. AniPal's chests and storage were already a feature, so the Inventories service card now points at AniPal instead of Time Tag, and its copy credits the chests, transfers and resource ledger rather than the custom backpack, which includes borrowed package code. AniPal weather was already a feature and the AP-07 clip; it now also has a service card and a technical case limited to AP-C18's source-verified structure.

Projectiles and shared stores appear in the audits only in passing: a Homing Projectile tool and a projectile-warning remote, and GlobalRotationManager named as a time-keyed rotation authority. Roblox Studio was not running, so every MCP call timed out. Both places had Studio auto-recovery files, so the code was read from those: Gravity Dash from 2026-09-08 07:03, the day of the audit, and AniPal from 2026-08-14. A small read-only decoder for the binary place format dumped every script with its full instance path; it is kept at `~/.claude/tools/rbxl-dump.cjs`. The dumps match the audits' own inventories, 326 scripts for Gravity Dash and 363 for AniPal with 148,447 lines against the audit's 148,674, which is what shows the decoder and the snapshots can be trusted.

What the code showed, and therefore what the site claims:

- Projectiles. TargetingSystem locks on to the candidate nearest the aim point inside a screen radius that shrinks with distance, after range, line-of-sight, visibility and health checks. BezierProjectile recomputes a quadratic Bezier's control point every frame from the target's current position, builds the arc's offset from the thrower's current gravity direction, and flattens it as the shot closes; the Homing Projectile and Gravity Distortion share it. The power-up companion flies the same server-clock-timed trajectory for other players, and the server tags hostile throws so that homing shots warn only the locked target and bombs warn players near the landing point. DamageHandler, which the deep pass had not re-read, checks round state, range, damage bounds and a per-target cooldown, then consumes a matching CombatAuthService grant. The stated limitation: hits are detected on the thrower's client and the server does not re-simulate the flight.
- Shared shops. GlobalRotationManager derives the hourly fish market and the five-minute bait stock from a seeded hash of the UTC time slot, so any server computes the same rotation on its own; a DataStore UpdateAsync that will not replace a newer record, MessagingService and a periodic poll share it. BaitShopManager keeps purchase allowances per player and per rotation, checks inventory space before charging, re-checks after the Doubloon deduction and refunds on a race. None of this has been exercised across live servers, and it is in-game currency only.

Neither new technical case has a Final claim ID. Their `claims` point at the new rows in `EDITORIAL_EVIDENCE.md`, which also records the method and the snapshot dates, and the earlier exclusion of AniPal's economy is narrowed to match.

Services are now nine cards. Three columns fill exactly; the two-column breakpoint (900px and below, phones included) lets an odd last card take the whole row instead of sitting beside a gap. The card was first titled "Power-ups, abilities & projectiles", which at 1440 pushed its ↗ onto a line of its own, so it is "Abilities & projectiles". Time Tag's currency card and saved-progress card merged. Tags: Gravity Dash "Cosmetic inventory" became "Abilities & projectiles", Time Tag "Saved inventory" became "Saved progress", and AniPal "Job changes" became "Shared shops". GD-05, power-ups in a race, is a new placeholder, so the capture plan is now 13 clips.

After the project JSON changed, `npm run test:explore` failed because the development server kept serving the old project records while `site.ts` hot-reloaded, so the pages looked half-updated. This is the persisted `.astro/data-store.json` problem from "Development-server content cache repair" again; the production build was correct throughout. The dev server was stopped, the cache moved to `artifacts/data-store.stale-2026-09-10.json`, and `npm run dev` started again as a hidden process.

Validation: production build green (claims; media with 13 placeholders; `astro check` 0 errors and 0 warnings), the preview on 4322 confirmed serving the rebuilt pages, `npm run test` 311 checks across 8 routes including axe WCAG A/AA, and `npm run test:explore` green against the restarted development server. The services grid, both project pages' features and the Gravity Dash supporting media were checked in screenshots at 1440, 900 and 390: three full rows of three at 1440, the odd ninth card spanning its row at 900 and 390, and no horizontal overflow at any of them.

## Real captures, AniPal hidden (2026-09-27)

Media went from 13 placeholders to 11 real captures across the three visible games. Everything was recorded with Roblox's own `CaptureService` from temporary Studio-only probe scripts (all deleted afterwards from Gravity Dash, Time Tag and ANTS!); the video recorder has no UI and a 30 s cap, screenshots do include UI. Originals and a capture note per item live in `_media-source/` (ignored). Staged clips are captioned "Studio demonstration" and each note says what was real and what was scripted.

- Gravity Dash: GD-06 (JB's run through the Factory course, now the lead), GD-01 (gravity controller walking a test box, now supporting), GD-05 (homing projectile lock-on and curve onto an NPC; no damage because DamageHandler only accepts players in a live round), GD-04 now an image (crate shop).
- Time Tag: TT-01 (seeker dash, real E key), TT-02 (runner rewind, real E key), TT-05 and TT-06 images (round results with reward; coin shop). TT-07 was removed entirely at JB's request.
- ANTS!: AN-01 (JB's take: hauling a ladybug, then a sugar cube; single ant, ~15 fps), AN-02 (ragdoll and recovery through RagdollAdapter, developer-triggered), new AN-04 (JB's wall-stick climb across the cave ceiling). AN-03 stays reserved for the human physgun.

The homepage now shows every recorded gameplay video for a project under its lead clip (`ProjectSummary` `more-clips`), not only the hero.

AniPal Archipelago is hidden, not deleted: `HIDDEN_PROJECTS` in `src/data/site.ts` filters it out of `getProjects()` and out of the services list (its four service cards). Counts and copy follow the visible projects (facts panel `0{projects.length}`, "Three independently developed", section hand-off text computed from the next visible project, the last world transition uses the last visible accent, and a project whose `next` is hidden falls through to the following visible one). `public/projects/anipal/` moved to `artifacts/hidden-projects/anipal-public` so its README is not published. `test-site.mjs` and `test-explore.mjs` no longer route to AniPal. To bring it back: empty `HIDDEN_PROJECTS`, move the public folder back, and restore the two test entries.

Stale copy removed: "recordings are still to be added" lines, the free-grant shop note (FREE_GRANT_MODE is false now), and the save-and-return promises. Media processing: `media:video` needs ffprobe, which is not installed; the same encode steps were run with the bundled ffmpeg-static.

Validation: production build green (claims, media 14 references / 11 captures / 3 AniPal placeholders not rendered, astro check), `npm run test` 261 checks across 7 routes including axe, `npm run test:explore` green. The services grid now holds five cards (3 + 2 at desktop).

## UI/UX polish pass (2026-09-28)

JB compared his own UI/UX review (plus outside feedback) against an independent one. Fixed in this pass:

- The header is sticky (`ui-polish.css`, imported last and body-prefixed so it beats global.css's own rules), with `scroll-padding-top` so anchor jumps land below it. Screenshots taken straight after a programmatic `scrollTo` can show the header offset; that is `scroll-behavior:smooth` mid-flight, not a bug. Real wheel scrolling and instant scrolls hold it at 0.
- The ANTS! shortcut card had no accent top edge: `earth.css` `body .project-index a:last-child` was written for the four-card row (AniPal last) and outranked the accent rule. The row is now `repeat(var(--cards),1fr)` from the visible project count, and one column on phones (<=600px).
- Hero "Contact" secondary button removed (the nav already has it). "Systems" nav link removed (it only went to the top of the homepage). Breadcrumbs say "Home" everywhere instead of Workshop/Portfolio.
- Video cards, the Gameplay/How it works switch and the enquiry panel are no longer rotated.
- About facts rows are centre-aligned and the panel is centred against the copy on desktop; on phones it follows the copy.
- On phones the illustration's mechanic button sits below the drawing instead of on top of it.
- Media headers no longer show internal IDs (GD-06 etc.). Staged clips are headed "STUDIO DEMONSTRATION" and the caption drops its "Studio demonstration:" prefix; images are headed "SCREENSHOT FROM THE GAME".
- A status whose evidence is `status-confirmation-required` (ANTS!) is not rendered. The "Source review and testing notes" block is gone from project pages; `notes` stays in the JSON.
- About page: removed the AniPal companion-jobs sentence and "inventory transfers".

Still open, needs JB: the desktop hero copy is hidden until the first wheel gestures (intro design, not changed); no "Play on Roblox" links (need game URLs, ANTS! status); defensive disclaimer copy; no og:image; tall world-transition walls on phones.

Validation: production build green, `npm run test` 253 checks across 7 routes incl. axe (fewer than before because the removed links/sections no longer generate checks), `npm run test:explore` green on 4322, screenshots at 1440 and 390.

## Follow-up decisions (2026-09-28)

JB approved: headline visible from the start, Play on Roblox for Gravity Dash only, softer caveats moved under How it works, shorter phone walls. The link-preview image (og:image) is not made yet; JB wasn't sure what it was.

- **Hero.** `.hero-copy` is visible from the first paint (`ui-polish.css`; `descent.ts` `revealed` is always true). The film no longer waits for a scroll: when the loading gate closes it plays by itself behind the headline, and the loading brick is not shown. Any scroll, swipe or down key skips to the finished wall, and the page is never held: all gesture listeners are passive, including the early inline script in `Base.astro`. `test-site.mjs` and `test-intro-resilience.mjs` were rewritten for this; the old ones asserted that the first gesture must not scroll. Intro resilience has a new `skip` mode. Its `film` mode failed once on a cold preview server, when the stall guard fell back to the final still, then passed on two runs in a row.
- **Play on Roblox.** New optional `playUrl` in the project schema. It renders a button on the project page and a link in the homepage section footer. It is **not set yet**: place 76443130781048 shows as "Title Unavailable" publicly, so JB needs to supply the public link. `test-explore.mjs` now clicks the `/projects/` link specifically, because the footer can hold two links.
- **Caveats.** Feature `note`s are no longer rendered in the front feature list (the data is kept). The How it works "Limitations and testing" section is now "Limitations". Nine tradeoffs were reworded in plain language, keeping every real limitation (no re-simulation, not a complete anti-cheat, endpoint-only checks, prototype trading) and dropping stale "still needs a capture" lines and internal source-audit wording. No new claims were added.
- **Phone walls.** At <=760px the world transitions show rows 0 and 3 (136px instead of 272px), so both edge colours still match the sections they join.
- Feature-list titles on project pages are top-aligned with their descriptions. "Explore X" links lost their ↗ (they are internal).

Validation: build green (0 errors, 0 warnings), `npm run test` 250 checks incl. axe, `test:explore` green, intro resilience 6/6 modes, screenshots of hero at 200 ms / 2.6 s / 4.5 s, phone wall, features list.

## Intro holds the page again; About facts (2026-09-28)

- JB asked that nobody can scroll while the wall animation plays. The headline is still visible from the first paint and the film still plays by itself, but while the loading gate is up or the film is playing, wheel, touch and navigation keys are held (non-passive listeners in `descent.ts` and the early inline script in `Base.astro`). Escape and the "Skip introduction" link still end it early. Phones and reduced motion never load the film, so they are never held. The worst-case hold is about 4 s of gate plus 2.4 s of film. Tests: `test-site.mjs` asserts a wheel during the intro leaves scrollY at 0; intro resilience mode `skip` became `held`.
- About facts panel is now three rows, as JB specified: `01` Developer — builds, UI and code; `02` Years of experience; `03` Games designed and built (`0{projects.length}`).

Validation: build green, `npm run test` 251 checks, intro resilience 6/6, `test:explore` green, About panel checked at 1440 and 390.

## Assets made section (2026-09-28)

JB asked for a new "Assets made" section in the old AniPal slot: the orc, tauren, troll and goblin (models and animation), the villager houses, the Gen 2 tools and his two Eden screenshots, with room for an ANTS! set later.

- Data: `src/data/assets.ts` lists the sets; the next set (ANTS!) is one more entry. Media are `AS-*` records in `media.json` with `project: 'assets'`; headers read "RECORDED IN STUDIO" / "CAPTURED IN STUDIO".
- Homepage: `AssetsMade.astro` after ANTS! (between two sea-green world transitions), four creature reels, a card per other set linking to `/assets/#set`, and a dashed reserved card for "ANTS! creatures and props". The project shortcut row has a fourth card (04 / ASSETS); ANTS!'s hand-off reads "NEXT: ASSETS MADE". Header nav gains Assets.
- `/assets/` page: every set with its full gallery; added to `test-site.mjs` routes.
- Capture method and provenance: `_media-source/AS-capture-note.md`. Only the original clips are used for the Orc and Tauren (no delayed or combo versions, per JB). The Tauren's brute idle (pass 3d, left unpublished when the previous session hit its limit) was exported alone and published as 114883737491499.

Validation: build green (31 media references), `npm run test` 297 checks across 8 routes incl. axe, `test:explore` green, intro resilience 6/6, screenshots at 1440 and 390.

## Intro: loading screen back, no snap (2026-09-28)

JB saw the intro "stop halfway and snap to the full page". Cause: `filmFailure()` removed `data-render-mode` in one frame, so a mid-film decoder stall of over 0.4 s cut straight from the half-built wall to the finished still. Since the film now starts without a scroll, it was decoding while the rest of the page (posters, images, fonts) was still loading, which made stalls more likely.

- The loading gate (tumbling brick, "LOADING") is back on desktop. The headline stays hidden during the gate and fades in (0.6 s) as the film starts. Phones and reduced motion still get the headline from the first paint. The gate now also waits for `window.load` (still capped at 4 s).
- Stall tolerance: `startWait` 1500 ms and `stallWait` 1200 ms (both were 400). On a real failure the finished still fades in over the stalled frame (550 ms Web Animation) before the film is dropped.
- Verified by frame capture: a normal run shows the gate for about 1.2 s, then the film with the headline fading in. A forced mid-film pause shows the fade, not a cut. Tests: `npm run test` 297 checks, intro resilience 6/6, `test:explore` green.

## ANTS! asset sets (2026-09-28)

Four sets from the ANTS! place (92769540947878) replace the reserved "next set" card: Ant costumes (AS-40..45, all 18 costumes in threes), Ant castes (AS-50/51, the Opus worker/resource/ranged/warrior/tank only), Garden creatures (AS-55/56, the RecentCreatureProbes), and ANTS! maps (AS-60..64, interiors shot from inside the rooms: living room, kitchen, cafeteria, fast-food dining room, backyard). Stills were shot from clones on a temporary stage (`Workspace.PortfolioStage_ANTS`, deleted); maps with the camera only. Originals in `_media-source/ants-assets/`.

- The procedural-leg video was dropped at JB's request. In the lobby the ant has no Role and ignored both a ControlModule override and `Humanoid:Move`.
- Cleanup in Studio: the temp LocalScript `PortfolioLegs_TEMP` (it set the camera to Scriptable, which JB noticed in his own playtest) and the stage were deleted. The map route/nest parts hidden with `LocalTransparencyModifier` were restored (6721 parts).
- Validation: build green (46 media references), `npm run test` 301 checks, `test:explore` green, intro resilience 6/6.
