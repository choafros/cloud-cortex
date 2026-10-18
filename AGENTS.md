# Cloud Cortex — Codex guidance

## Purpose

A thoughtful, static one-page personal portfolio at afroz.co.uk. Its living cloud brain is a **browser-only educational simulation**. Never describe the animated requests, metrics or scaling as actual cloud traffic.

## Stack and deployment

Keep source in HTML/CSS/SVG/vanilla JS and static-deployable via GitHub Pages or Netlify. Avoid introducing build tooling, a backend, dependencies, secrets, analytics or external network calls without explicit approval. Keep `index.html`, `styles.css`, `script.js` and vector assets in the repo root / `assets`.

## Nonnegotiable behaviour

- Three semantic depth levels: Overview (7 domains), System (23 nodes) and Deep Dive (15 design concepts).
- **Every level must show active transactions.** Use a single shared request engine and preserve request IDs, progress and outcomes when switching levels mid-flight. Do not force requests back to System or disable zoom while active.
- Render semantic-level animations as conceptual mappings of *the same* simulation, not unrelated replays. Failures and retries should be visible and explainable at every depth.
- Per-request weighted outcomes: 60% direct 200, 10% recovered 200, 10% 403, 10% 429 and 10% 503. Do not restore a scenario dropdown. Burst outcomes remain independently sampled.
- Preserve elastic API instances 1 → 2 → 3 → 1 at System depth; maintain accurate concurrent metrics, queue depth and event stream.
- Preserve the subtle brain projection after scroll reveal, gentle motion, clearly visible active nodes, and **short signal trails** that do not underline or obscure labels.
- Keep the in-diagram Send request and 5× burst controls, the independently scrolling inspector with fixed name/status/close controls, and keyboard accessibility.
- Reduced-motion mode must remain readable and functional; mobile architecture must remain composed and free of horizontal overflow. Wheel zoom should capture only appropriate input over the diagram.
- Personal biography and contact details are placeholders until confirmed. Avoid fictional employers, qualifications or achievements.

## Verification

1. `node --check script.js`
2. Run `python tests/v17_check.py` and `python tests/v17_outcomes.py` where Chromium + Playwright are available.
3. At desktop and mobile sizes, start a request in Overview, zoom into System/Deep **while it runs**, and confirm its ID and progress continue rather than resetting.
4. Test first-try success, retry recovery, 403, 429 and 503. Make sure the semantic packet and result styling match the sampled outcome.
5. Test five concurrent clicks for scaling, completion and cleanup; check no JavaScript errors, overflow, obscured labels or lost inspector controls.
6. Keep README documentation aligned to the actual implementation.