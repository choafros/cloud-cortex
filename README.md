# Cloud Cortex · afroz.co.uk

A responsive, dependency-free personal website centred on the **living cloud brain**: an animated, inspectable cloud architecture. Every request, packet, status, node, retry and autoscale event is **simulated in the browser**—there is no connected backend or production cloud traffic.

## Run locally

Open `index.html` directly, or from the repository root run `python3 -m http.server 8000`. The site uses ordinary HTML, CSS, SVG and JavaScript: no build pipeline, package manager, secrets or runtime API. Deploy the root to Netlify or GitHub Pages and connect the IONOS domain separately.

## V1.5: elastic architecture + node inspection

**Staged replica scaling**

- At idle, only `API / 01` exists and it is centred in the application column; API / 02 and API / 03 (and their wiring) are absent, not just dimmed.
- When a rapid burst calls for a second replica, API / 01 smoothly moves to the top, making room for API / 02 to appear in the middle.
- Under further load, API / 03 fades into the lower slot. The capacity counter follows the instances as they become available: **1 → 2 → 3**.
- After traffic drains and a cooldown, API / 03 and API / 02 fade out sequentially, then API / 01 moves to the centre again.
- On mobile, the same sequence reflows horizontally: middle → left, plus middle, then right. With `prefers-reduced-motion`, movement is immediate.
- This is a conceptual demonstration of horizontal scaling, **not an actual Kubernetes/autoscaling system**.

**Inspectable components**

- Select any of the 23 nodes by mouse, touch, Enter or Space to inspect its role, design considerations, failure modes, and direct connections.
- Nodes are highlighted in the diagram while their details are open; the detail panel shows the node’s evolving idle / processing / retrying / complete / failed state.
- On desktop the compact inspector overlays the diagram; on mobile it appears below the diagram. Close with × or Escape.
- The two unprovisioned replica nodes are not focusable or clickable until they appear.

**Existing behaviours preserved**

- Scroll-driven brain reveal, with a faint neural projection retained behind the topology.
- `Send request` and `5× burst` controls inside the system visualisation.
- Independently sampled outcomes: 60% direct 200; 10% retry-recovered 200; 10% 403; 10% 429; 10% 503. That is **70% eventual success, 30% failure across many requests**, with no status picker.
- Node status feedback, packet trails, retry / dead-letter paths, queue depth, counters, event stream, and accessibility/reduced-motion support.

The diagram covers WAF, rate limiting, load balancing, API gateway, identity checks, stateless APIs, Redis, a queue, workers, backoff, DLQ, sharded databases, WebSocket, metrics and autoscaling. It intentionally simplifies many operational details. Not all nodes participate in every request.

## Repo files

- `index.html` — page and inspector markup
- `styles.css` — responsive look, scaling appearance, brain projection and panels
- `script.js` — node map, animated transaction routes, weighted outcomes, scaling state machine and node inspector content
- `assets/brain.svg`, `assets/favicon.svg` — original artwork
- `tests/v15_check.py` — browser smoke test (Playwright + Chromium needed locally)
- `AGENTS.md` — Codex development guidance

## Before public portfolio launch

The personal journey sections and `hello@afroz.co.uk` are placeholders. Replace them with approved factual information. Do not claim that the illustrated system or transaction statistics run on real cloud infrastructure.