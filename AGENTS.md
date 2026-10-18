# Codex guidance — Cloud Cortex

## Goal
Refine a single-page, dependency-free personal portfolio at afroz.co.uk. The animated cloud architecture is a **browser-only simulation**, not a real backend. Avoid claiming otherwise.

## Requirements
- Keep static HTML, CSS, SVG and vanilla JavaScript. No framework, npm dependencies, analytics, API calls or credentials without approval.
- Preserve the scroll-driven brain-to-architecture reveal and subtle background brain projection, including reduced-motion behaviour.
- Keep **Send request** and **5× burst** inside the architecture panel (on-canvas for desktop, adjacent strip on mobile). The hero should direct visitors to the system instead of triggering transactions off-screen.
- Preserve dynamic node states: idle, processing, retrying, complete, failed and standby for inactive API replicas. Node state accounting must handle overlapping requests so one request's timeout doesn't clear another's status. Do not reintroduce bottom-edge underlines or heavy idle animations.
- Independently sample request outcomes: 60% direct 200; 10% recovered 200; 10% 403; 10% 429; 10% 503. Do not add an outcome picker. Burst mode scales 1→3→1 API replicas as load rises and settles.
- Keep the event feed, counters, live textual trace, keyboard support and mobile layout readable, with no horizontal overflow.
- Do not invent personal biography, education, employment or achievements.
- Pan/zoom is deferred; prioritise readability and consider focused node inspection before adding free-form zoom.

## Testing
Use `node --check script.js` on modular source. Browser-check all five probability buckets, node transitions, concurrency, 5× scaling and cleanup at 1440px and 390px widths. Test both reduced-motion and ordinary animation. The deployed root currently contains a single inlined `index.html`; keep it deployable when making changes.
