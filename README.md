# Cloud Cortex · afroz.co.uk

A bespoke, responsive one-page personal portfolio with a scroll-revealed **living cloud-brain** architecture. Its packets, routing, failures, metrics and autoscaling are **browser-side simulations**, not real infrastructure or production requests.

## Run and deploy

Open `index.html` in a browser or serve the repository root with `python3 -m http.server 8000`. No build system, frameworks, network calls, npm packages, API tokens or credentials are needed. Deploy the root to Netlify or GitHub Pages; configure the IONOS domain separately.

The public repository currently serves a **self-contained `index.html`** containing the stylesheet, JavaScript and inline SVG assets. A modular source package (separate HTML/CSS/JS/assets and Playwright smoke tests) is also available from the ChatGPT development conversation.

## V1.3 — Less noise, more meaningful activity

- **Brain projection:** the scroll reveal dissolves the main brain graphic while retaining a quiet neural projection behind the cloud topology. Running a request reveals the diagram immediately.
- **Clean nodes:** removed the small bars below every component (which appeared as underlines), and reduced ambient twinkling and wire movement. Request packets and activated paths take priority.
- **Random outcomes:** every button press samples an outcome independently; there is no dropdown for choosing a status.
  - 60%: first-try success, 200 OK.
  - 10%: transient worker error, retry, then 200 OK.
  - 10%: edge security rejection, 403.
  - 10%: quota/rate-limit rejection, 429.
  - 10%: worker failure after retries, dead-letter queue, 503.
- **Expected totals:** 70% eventual success and 30% failure over many requests. A five-click burst is *not* guaranteed to contain a particular mixture.
- **Scaling:** a burst activates three API replicas; once traffic settles, replicas return to one.
- **Visibility:** event stream, recent result, in-flight count, queue depth, failures, retries and active replicas.
- **Responsive and accessible:** intentional mobile layout, semantic buttons, textual trace and reduced-motion support.

The diagram includes WAF, rate limiter, load balancer, API gateway, identity, API replicas, Redis, messaging queue, worker pool, retry policy, dead-letter queue, three sharded databases, WebSocket, telemetry and autoscaler. Not every request visits every component.

## Before publishing the personal site

Replace the placeholder biographical details and `hello@afroz.co.uk` with approved real information. Do not present the architecture as a real system or claim particular professional achievements without confirmation.
