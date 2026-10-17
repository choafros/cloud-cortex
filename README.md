# Cloud Cortex · afroz.co.uk

A bespoke, responsive static portfolio centred on a **living cloud-brain animation**. The architecture, packets, metrics, error codes and scaling are **browser-side simulations**, not production cloud traffic.

## Run

Open `index.html` directly or serve the repository root using `python3 -m http.server 8000`. No build step, npm or secrets required. Deploy the repository root on Netlify or GitHub Pages, then configure your IONOS domain separately.

## V1.2 interactions

- **Scroll reveal:** the initial neural image dissolves, leaving a very faint projected brain behind the interactive SVG map.
- **Send a request:** follow a successful request through WAF → rate limiter → load balancer → gateway → identity → selected API replica → Redis cache → message queue → worker → a data shard → WebSocket → 200 OK.
- **Try a 5× burst:** five concurrent simulated requests fan out across three API replicas. Four finish successfully (one after recovering from a transient worker failure); one exhausts its retries and ends at 503 after entering a dead-letter queue. Capacity returns to one replica when idle.
- **Scenario picker:** choose Healthy (200), Security blocked (403), Rate limited (429), Retry and recover (200), or Service failure (503). Outcomes are deterministic, not randomized.
- **Living nodes:** understated idle heartbeats; temporary activity, retry and error highlights; counters for requests, successes, failures, in-flight, queue, retries, and replicas; plus a recent event stream.
- **Responsive and accessible:** separate mobile node coordinates, accessible buttons and select, textual live trace, reduced-motion support.

Components shown include WAF, limiter, load balancer, API gateway, identity, API replicas, Redis, queue, worker, retry policy, dead-letter queue, three data shards, WebSocket, telemetry and autoscaler. Not every component is on every transaction path. This is an explorable metaphor, not an endorsed production architecture.

## Files

- `index.html` — page layout, controls, metadata (favicon currently embedded as a small SVG)
- `styles.css` — colours, responsive layout, effects
- `script.js` — SVG topology, deterministic simulation and counters
- `assets/brain.svg` — custom neural artwork
- `AGENTS.md` — Codex guidelines

## Before public portfolio launch

The biography, story sections and `hello@afroz.co.uk` are placeholders. Replace them with confirmed information before sharing widely. Copyright © Afroz; all rights reserved until a license is chosen.
