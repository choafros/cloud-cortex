# Cloud Cortex · afroz.co.uk

A bespoke, responsive, static portfolio built around an interactive **living cloud-brain**. All requests, traffic, metric values, failures and autoscaling are **simulated locally in the browser**; no production infrastructure is involved.

## V1.6: Semantic zoom + fixed inspector controls

- **Three detail levels:** `− / +` controls and desktop mouse-wheel zoom inside the SVG switch between **Overview** (7 connected architectural domains), **System** (23 interactive nodes and live animated request packets), and **Deep dive** (15 internal engineering decisions such as idempotency, outbox, retries, circuit breakers, sharding and client replay). This is *semantic zoom* rather than simply enlarging text. The brain projection stays behind the architecture at every depth.
- **Wheel behaviour:** only scrolling directly over the architecture changes depth. At the highest or lowest level the document scrolls normally. Zooming is disabled while a request is in flight to preserve the visible trace. Mobile uses large `− / +` controls and keeps vertical page scrolling natural.
- **Inspector:** title, current state and the close button stay **fixed inside the card**; only the technical explanation scrolls. It applies to both the existing 23 nodes and the 7+15 semantic nodes. The inspector has keyboard support, Escape-to-close and an independent scroll surface.
- **Transactions:** sending a new request from Overview or Deep dive returns to System so packet routes stay visible. Request outcomes remain independent draws: 60% immediate 200, 10% recovered 200, 10% blocked 403, 10% limited 429, and 10% unavailable 503; 70% success / 30% error in expectation over many requests.
- **Elastic API nodes:** load grows from 1 → 2 → 3 instances, with the first box moving upward, later replicas fading in, and reverse scaling after cooldown.
- **Accessible defaults:** static assets; no frameworks or build process; reduced-motion rules; meaningful aria labels; keyboard-operable depth buttons and nodes; mobile-specific diagram compositions.

## Running

Open `index.html` or serve the directory with `python3 -m http.server 8000`. Hosting on Netlify or GitHub Pages requires only serving this repository's root. Domain DNS at IONOS can be configured after the personal copy is finalised.

Files: `index.html`, `styles.css`, `script.js`, `assets/brain.svg`, `assets/favicon.svg`, and `tests/v16_check.py` / `tests/v16_zoom_smoke.py`. To run browser smoke tests, install Playwright with Chromium and run the tests from the repository root.

## Before launch

The biographical sections and `hello@afroz.co.uk` are still placeholders. Replace them with verified personal details and a confirmed address before promoting the site. No analytics, tracking, external API calls or real cloud infrastructure are used.