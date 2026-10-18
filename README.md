# Cloud Cortex · afroz.co.uk

A lightweight, responsive one-page personal portfolio with a scroll-revealed **living cloud brain**. All packets, metrics, failures, load balancing and autoscaling are **browser-side simulations**, not connected production systems.

## Run

Open `index.html` directly or serve the root with `python3 -m http.server 8000`. No build step or API credentials are needed. The GitHub version is intentionally a self-contained `index.html` with embedded CSS, JavaScript and SVG assets for simple Netlify/GitHub Pages deployment. A modular source ZIP accompanies the development conversation.

## V1.4

- **Scroll reveal:** neural illustration fades away while a quiet projection remains behind the living infrastructure.
- **Request controls inside the diagram:** `Send request` and `5× burst` overlay the top-left of the architecture canvas on desktop and appear in a dedicated strip above the nodes on mobile. The main hero now offers a jump link to the demo.
- **Node lifecycle:** each component displays its current state using a restrained status colour and temporary subtitle: **processing**, **retrying**, **complete** or **failed**. Idle nodes show their usual description; inactive API replicas say **STANDBY**. Concurrent requests update each node independently.
- **Expected outcomes:** 60% direct 200, 10% 200 after a retry, 10% 403 security rejection, 10% 429 rate limit and 10% 503 unavailable. Independent sampling means **70% success / 30% failure** *over many requests*, not necessarily in any short burst.
- **Burst:** five rapid requests activate three API replicas; the system scales down again once traffic settles.
- **Accessibility:** keyboard accessible buttons, textual trace, live metrics, reduced-motion support and a separately composed mobile topology.

The network illustrates security, rate limits, traffic balancing, API gateway, authentication, API replicas, cache, message queue, background workers, retries, dead-letter queue, database shards, WebSocket delivery, telemetry and autoscaling. It is an illustrative architecture, not a reference implementation.

## Next design choice

Full freeform pan/zoom has been deferred. A future **click a node to focus and inspect its dependencies** interaction is probably a better fit for a portfolio than unrestricted map navigation.

## Before public launch

Replace biography placeholders and the unverified `hello@afroz.co.uk` contact address with confirmed details.
