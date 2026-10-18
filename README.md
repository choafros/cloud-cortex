# Cloud Cortex · afroz.co.uk

A responsive, dependency-free, single-page portfolio with a scroll-revealed living brain and an **illustrative cloud architecture simulation**. Packets, error codes, scaling, node states, metrics and paths are simulated locally in the browser; no production backend is contacted.

## Getting started

Open `index.html` in a modern browser, or serve the repository root with `python3 -m http.server 8000`. No build step, npm packages or environment secrets. Deploy the repository root on Netlify or GitHub Pages once you're ready to launch; the IONOS domain can be connected separately.

## V1.7 — one request, three perspectives

- **Overview:** a transaction animates through high-level domains (trust boundary, routing, compute, asynchronous processing, data and, for recoverable faults, resilience).
- **System:** the detailed WAF → limiter → balancer → gateway → auth → stateless API replica → cache → queue → worker → sharded data → WebSocket trace continues unchanged.
- **Deep Dive:** the same request is projected over engineering concepts such as request context, policy, idempotency, handler, cache strategy, outbox, message broker, worker, retry controls, shard routing and notification. This is a **conceptual projection**; the diagram is educational, not a claim that each pattern is running in real infrastructure.
- **No forced zoom reset:** start a transaction at any level. Zoom in/out using the +/- controls or the wheel over the SVG on desktop while it runs. The same request ID and outcome are preserved; no resampling or restart.
- **Independent concurrent requests:** a five-request burst is visible at all depths while System continues to simulate 1 → 2 → 3 → 1 API replicas as traffic increases and settles.
- **Visible results:** success, retries and failure signals appear as a colour change and brief status on the signal, with the outcome in the event feed and the result metric.
- **Node inspector:** click a node for a technical explanation; its title/status/close controls remain visible while the explanatory text scrolls.
- **Accessibility:** keyboard-operable controls, textual status and event stream, reduced-motion support and deliberately laid-out mobile diagrams.

Outcome sampling is independent per request: 60% direct 200, 10% 200 after recovery, 10% 403, 10% 429 and 10% 503. This yields an *expected* 70% eventual success and 30% failure, not a guaranteed ratio in a small burst.

## Source files

- `index.html` — page structure, metadata and interactive panels
- `styles.css` — responsive visual system, motion and states
- `script.js` — shared simulation engine, semantic projections, node inspector, autoscaling
- `assets/brain.svg` and `assets/favicon.svg` — original vector assets
- `tests/v17_check.py` — desktop/mobile, in-flight zoom, errors and scaling smoke tests
- `tests/v17_outcomes.py` — deterministic sampling boundaries exercised in each view
- `AGENTS.md` — guidelines for iterative work with Codex

Run `node --check script.js`. Browser tests use Playwright and an available Chromium binary; they are optional development dependencies, not part of the deployed site.

## Before public launch

Replace draft biography content and the placeholder `hello@afroz.co.uk` address with user-confirmed details. Do not present the architecture as a live cloud deployment or claim it runs real transactions.