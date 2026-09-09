# Portfolio capture guide

## Direction and priorities

Show managers and clients what they can hire me to build. Lead with a short, recognizable action and its visible result. Include currencies, leaderboards, shops, monetization, inventory/chests, weather, and saved progress alongside the distinctive mechanics. Technical questions can lead to personal enquiries; probe screenshots, solver graphs, and scheduler overlays are optional follow-up evidence.

This guide supersedes the capture priorities in `../Final/` and the earlier highlights reports for this website revision. Those source documents remain untouched. See [EDITORIAL_EVIDENCE.md](EDITORIAL_EVIDENCE.md) for the claim-to-report map and exclusions. Source-reviewed implementation and current runtime verification are separate: every active slot is still a placeholder.

The active website plan has **12 short videos and no required photos**: six core gameplay clips and six supporting feature clips. Record the six core clips first, then the breadth clips. Do not delay clean footage to build diagnostics. Longer raw takes are welcome; the listed durations are targets, not a reason to rush an unreadable action. If a feature cannot be reproduced, leave its slot pending and report the actual blocker.

| Priority | ID | Demonstration | Target | Website placement |
| --- | --- | --- | --- | --- |
| Core | GD-01 | Gravity traversal through connected course rooms | 12–16 s | Homepage and Gravity Dash lead |
| Core | TT-01 | Aim, preview, dash, land | 8–12 s | Homepage and Time Tag lead |
| Core | TT-02 | Movement rewind | 7–10 s | Time Tag supporting |
| Core | AN-01 | One ant drags, another joins, release | 10–14 s | Homepage and ANTS! lead |
| Core | AN-02 | Ragdoll, recovery, immediate movement | 8–12 s | ANTS! supporting |
| Core | AP-01 | Working island and a companion job change | 12–16 s | Homepage and AniPal lead |
| Breadth | GD-04 | Currency → rotating crate → collection | 10–14 s | Gravity Dash supporting |
| Breadth | TT-05 | Round leaderboard and currency reward | 8–12 s | Time Tag supporting |
| Breadth | TT-06 | Currency offer and real purchase prompt | 6–10 s | Time Tag supporting |
| Breadth | TT-07 | Owned trail and currency after returning | 10–14 s | Time Tag supporting |
| Breadth | AP-06 | Inventory-to-chest transfer | 8–12 s | AniPal supporting |
| Breadth | AP-07 | Visible weather transition | 6–10 s | AniPal supporting |

## Recording standards

- Landscape 16:9, at least 1080p; ideally 60 fps for movement and physics. Keep the subject, relevant geometry, and result readable at phone size.
- Use the actual game and normal supported interactions. Retain the real HUD or menu when it proves a balance, inventory change, result, or selection. Hide unrelated Studio panels and diagnostics in public takes.
- Show cause → action → result. Hold important balances and final states briefly. No cuts during gravity transitions, dash execution, rewind, shared hauling, or recovery. A menu transition or real reconnect can be edited if the cut is clear.
- Do not invent telemetry, animate substitute gameplay, edit balances, fake checkout, or use decorative website models as evidence. Normal gameplay footage does not prove invisible network authority, save durability, or server synchronization.
- For every take, record date, build/place, environment (Studio test or published game), relevant configuration, player role, setup, and any cuts in a sidecar note. Label test grants and developer-triggered events honestly. Keep originals without music or baked-in portfolio titles.

## Gravity Dash

### GD-01 — Traversal and course in one clip

Find a generated route with visible room joins and floor/wall/ceiling surfaces. Begin already moving, cross the surfaces continuously, pass through connected rooms, and end under control with enough surrounding geometry to read the route. Use medium third-person framing; aim to show two room joins and a direction or elevation change where practical.

This absorbs the old GD-02 course footage. Do not lengthen the hero just to fit three rooms. If the continuous route cannot show the course clearly, retain the uncut traversal and record a separate 3–5 second wide course view as optional GD-02. Clearly separate that view from the traversal if edited together. Walking through a finished route shows its layout, not the generation process; only claim visible runtime assembly if it actually occurs in the recording. Verify the route and generation configuration in the intended released build.

### GD-04 — Currency, crate shop, collection

Use a normal test profile without the owner's automatic full-catalog grants. Start with the real wallet and an affordable rotating crate. Open it through the in-game currency-spend path, hold on the resulting reward and changed balance, then show that reward in the collection. Equip it only if the normal supported flow fits clearly. No need to wait for a rare item or a rotation boundary.

The source audit reports `FREE_GRANT_MODE` enabled for the currency shop. A free currency grant must not look like paid monetization or earned race income. This clip demonstrates spending currency and collecting an item. If extra currency is needed for setup, document the test grant outside the excerpt. Current UI behavior still needs runtime checking; do not imply a duplicate roll adds a new collectible if that is not the actual result.

## Time Tag

### TT-01 — Dash

Choose a target across an obstacle or ledge. Aim and hold the normal route preview long enough to read, activate the dash, and show the complete movement ending at the target. Keep start, obstacle, and landing visible where possible. No solver graph or edge-type labels are required. The arena is authored; do not label it procedurally generated.

### TT-02 — Rewind

Move through a short turn and elevation change. Activate rewind, keep the ghost/tether and reverse movement visible, then hold briefly on the end position. Keep the rewind uncut. No networking overlay is needed; the public caption should describe what the character does.

### TT-05 — Round results, leaderboard, and reward

Record a real multiplayer round with enough participants for a readable result. Keep the full round privately, but excerpt the final tag/survival result, round leaderboard, and wallet reward. Capture the pre-reward balance in the raw take so the increase can be checked. Keep names/ranks and currency legible; a clear cut between results and wallet is acceptable.

Use the round leaderboard as the primary evidence. Global OrderedDataStore boards are described in Pass 1, but their current display/update behavior was not individually re-verified in Pass 2; a separate global-board claim needs its own check. Do not claim usable round-reward `TrailCrates`: the deep pass found no consumption path. A wallet increase alone does not demonstrate saving.

### TT-06 — Monetization purchase flow

Open the currency shop, select one developer-product offer, and show the genuine Roblox purchase prompt with the correct item and amount. Stop or cancel the prompt for the public excerpt; no purchase is needed merely to film this step. A prompt proves the offer/checkout entry, not payment completion or delivery.

Before recording, verify the chosen product belongs to the current experience and that the current configuration uses the intended purchase path. Pass 1 reports `FREE_GRANT_MODE = false`; Pass 2 verifies purchase-receipt handling, not a current end-to-end paid checkout. Subscription IDs still point at the older game in the audit, so subscriptions are excluded from this shot until corrected and tested. Do not substitute Gravity Dash's free grants or AniPal's unregistered product router as monetization proof.

If a full grant demonstration is later desired, use an appropriate test environment or an explicitly authorized real purchase. Keep genuine receipt/grant verification privately and label any test transaction. Never fabricate a success popup; leave the slot pending if the intended product cannot open correctly.

### TT-07 — Inventory and saved progress

Use one identifiable, already-owned trail and a known coin/key balance. Open inventory, select/equip that trail, then show the character wearing it. Allow the normal save path to complete; leave and return through the intended profile-loading path. Show the same owned item and compare the actual saved balance. Show the equipped selection too if it is restored in the current build.

Keep before/after originals and an account/build/time note. A labeled reconnect cut is expected. Account for any genuine login/reward changes; do not hide them or claim an identical balance if it changed. Avoid owner auto-grants or promo codes that could recreate the same state and masquerade as persistence. Re-equipping after return can demonstrate the retained collection but must not be captioned as automatic equipment restoration. This is the main saved-progress example; it does not depend on AniPal's offline simulation.

## ANTS!

### AN-01 — Shared hauling

Use two player-controlled ants and a carryable prop in a clear area with familiar objects that establish the ant scale. The first ant grabs and drags; the second joins; show the change in hauling; then one lets go. Keep both ants, tethers, and prop in frame in one take. Include a struggle only if it remains readable; tear-off is not required.

### AN-02 — Ragdoll and recovery

Start walking. Trigger a supported knockdown, show the body tumble and the procedural legs, then recover and immediately walk or turn. Keep recovery and movement continuous. Use a close three-quarter view with the entire body visible. No authority overlay is required. Confirm the selected trigger/recovery path in the current build and retain ANTS!'s unconfirmed release label.

## AniPal Archipelago

### AP-01 — Working island and job change

Set up at least two companions doing different supported jobs, with work sites and storage close enough to share a readable frame. Start with production or a delivery in view. Select one companion, change its job using the ordinary UI, and show it beginning the new activity while the other keeps working. Use only assignable jobs; Guard/invasion content is excluded.

This incorporates the player-visible part of AP-02. Frame the selected companion closely enough to follow the change. If menus and travel make the combined take too long, use a brief establishing view followed by a clearly cut, continuous job-change sequence. Keep the full raw job transition. Do not speed up or cut away unfinished work to imply instant completion. The visible change does not prove generation counters or stale-task rejection; those remain optional technical evidence.

### AP-06 — Inventory and chest transfer

Open a placed chest beside the player. Show one identifiable fish or supply in inventory, transfer it to storage, then hold on the updated inventory and chest quantities. If clear within the target length, withdraw it again or show an existing filter choice. Do not cram placement, shopping, capacity, filtering, and transport into one clip. The main result is an item moving between the two containers.

The source verifies ledger/chest ownership and transfer handling. Verify the chosen UI action at runtime. A successful transfer does not prove every failure path preserves resources, and persistent chest restoration is not established by opening the chest in the same session.

### AP-07 — Weather

Hold a stable island view with readable sky, water, and companions or buildings for context. Record an actual transition into a working weather condition, such as rain, then hold on its visible result. Use the game's normal event application path; if a supported developer control triggers it, disclose that setup in the capture note and caption. Do not merely recolor Lighting to imitate a game event.

Keep the full wait in the original; a clearly marked wait cut or separate before/after views are acceptable if the natural change is slow. A single-server recording supports weather presentation only. Do not imply lightning damage, every configured weather modifier, or synchronized servers without separate evidence.

## Optional and deferred material

These IDs retain their old meaning; they are not active placeholders in `src/data/media.json`. Do not silently reuse an old ID for a different feature.

| ID | Decision |
| --- | --- |
| GD-02 | Optional short course view only if GD-01 cannot show the route clearly. |
| GD-03 | Gravity probe still: optional for a technical enquiry. Use real probes; retain EmilyBendsSpace attribution. |
| TT-03 | Solver graph still: optional for a technical enquiry. No invented graph or telemetry. |
| TT-04 | Sweep-tag micro-clip: optional after the main gameplay and breadth coverage. |
| AN-03 | Human physgun: optional if another clear gameplay example is useful. |
| AP-02 | Scheduler/lifecycle diagnostics: optional. Job-change gameplay moves into AP-01; counters and rejection logs must come from real instrumentation. |
| AP-03 | Offline return: deferred. Not required for the main portfolio. |
| AP-04 | Interrupted delivery: optional technical follow-up after the normal transfer/haul clips. |
| AP-05 | Clothing pickup/redeployment: optional after verifying one outfit/species/age and labeling the opt-in route. |

Only revisit AP-03 after verifying or resolving the audited `PosterHandler` Script/Module mismatch in the leave-checkpoint path. It needs a known before-state, real absence interval, intended restore path, confirmed return report, and matching world/storage result. If that causal result cannot be understood quickly, keep it out of the public media set and discuss the source architecture on enquiry. Do not substitute a larger number or an isolated report for end-to-end evidence. No crash-proof, lossless, exact-position, or cross-server-lock guarantee follows from this footage.

## Delivery and integration

Use IDs as filenames (`GD-01.mp4`, `TT-07-before.mp4`, `TT-07-return.mp4`) plus a short capture note. Store raw media outside `public/`, preferably in ignored `_media-source/`. Only reviewed genuine footage becomes a website asset. Update captions to describe what the selected take actually shows, including narrower outcomes when needed.

The manifest owns titles, durations, paths, and review status. Active IDs are referenced by each project's `hero` and `supporting` arrays. Optional media should only be added to both the manifest and a deliberate page location after review. Transcode with the existing `media:video` command, check the actual output, and then set `verified-capture`; the command assumes its input was already reviewed. Run the production build and browser checks after integrating real media. No gameplay was captured or fabricated as part of this editorial revision.
