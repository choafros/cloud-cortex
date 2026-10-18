# Codex development notes — Cloud Cortex

## Purpose

Build an elegant one-page personal portfolio and a playful **browser-only simulation** of backend/cloud infrastructure. Never represent browser-simulated packets, failures, counters or scaling as live production traffic.

## Technology

Plain HTML, CSS, SVG and vanilla JS. Static root deployment, no bundler, packages, APIs, analytics or secrets unless the user asks. Work from the modular `index.html`, `styles.css`, `script.js` and `assets/` files; do not revert to an enormous inline HTML file.

## V1.5 behaviours to preserve

- Retain the scroll reveal with a faint brain projection behind the network; honour `prefers-reduced-motion` and keyboard operation.
- Control buttons live *inside the architecture panel*. Keep the layout responsive, free of clipped/underlined boxes and horizontal page scrolling.
- **Staged scaling:** 1 idle API / 01 in the centre; burst→move API / 01 top→show API / 02 middle; higher load→show API / 03 bottom. On mobile, position API A left, API B middle, API C right. Hide unused replicas **and their links** completely. Scale down C→B→recentre A. Preserve readable state for concurrent requests and cooldown stability.
- **Inspector:** every node must have substantive and technically accurate explanation, design complexity, resilience/failure notes and direct connections. Keep SVG nodes keyboard-selectable with Enter/Space, close on Escape or ×. Unprovisioned replicas must not be tabbable. Show live state in the inspector when its selected node changes.
- Independently random outcomes: 60% direct success (200), 10% successful retry (200), 10% edge block (403), 10% throttle (429), 10% exhausted worker retries (503). Total eventual success expectation 70%; no dropdown. Do not guarantee percentages per short burst.
- Preserve metrics, events, in-flight/queue cleanup and node state precedence for overlapping requests.
- Do not invent education, employers, awards or career milestones; current biographical copy is draft.

## Verification

- `node --check script.js`
- `python tests/v15_check.py` where Playwright and Chromium are available.
- Test desktop and 390px mobile, ordinary animation and reduced motion, pointer and keyboard inspection, 1→2→3→1 replica choreography and 70/30 outcome buckets.
- Verify the default root index loads directly on GitHub Pages or Netlify without build dependencies.