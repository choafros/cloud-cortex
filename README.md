# Cloud Cortex — afroz.co.uk

A bespoke, dependency-free, responsive personal portfolio concept for Afroz. Its centerpiece is an interactive, **browser-side simulation** of a cloud request flowing through security, traffic routing, APIs, replicas, an event queue, workers, database shards and WebSocket delivery. The site is static and does **not** connect to or simulate real production infrastructure.

## Run locally

Open `index.html` directly in a modern browser, or run `python3 -m http.server 8000` from this directory and visit `http://localhost:8000`.

No packages, build process, credentials, trackers, cloud account or API tokens are required.

## Brain → cloud scroll reveal

The opening artwork is a bespoke, animated SVG (`assets/brain.svg`). Scrolling progressively dissolves the translucent brain layer and uncovers the full interactive SVG infrastructure map. Running a request also reveals the architecture immediately. The reveal is reversible when scrolling back up, and reduced-motion visitors see the architecture without a transition. No image libraries or external requests are used.

## Interactions

- **Send a request:** follow a packet across WAF → load balancer → API gateway → selected API replica → message queue → worker → database shard → WebSocket → 200 OK.
- **Click quickly**, or use **Try a 5× burst:** multiple packets are animated concurrently. At 3 requests within 1.6 seconds (or 4 in flight), additional application replicas activate and requests fan out.
- **Readouts:** local counters for sent, completed, in-flight, queue depth, active replicas and last result.
- **Responsive diagram:** recomposed topology for mobile, not just a squashed desktop diagram.
- **Reduced motion:** animates minimally when the operating system's `prefers-reduced-motion` setting is enabled.

## Edit before publishing

1. Replace the introductory biography with your preferred summary.
2. Replace the **STORY TO COME** sections with your actual beginnings, professional development and ambitions. The current text intentionally makes no unverified career claims.
3. Replace the `hello@afroz.co.uk` placeholder if the mailbox does not exist; the CTA should never lead to an unmonitored address.
4. Add social links and your CV when you are ready.
5. Review the simulation labels if your desired architecture narrative changes.

## Structure

```
index.html         page structure, accessible buttons, SEO metadata
styles.css         responsive design, theme and reduced motion
script.js          SVG graph, independent packet animations and scaling logic
assets/favicon.svg logo favicon
assets/brain.svg    custom animated neural illustration
AGENTS.md          instructions for future Codex iterations
```

## Host

**Netlify:** import the GitHub repository; use the repository root as the publish directory (`.`), and leave the build command blank. Add `afroz.co.uk` as a custom domain; update IONOS DNS records using the values Netlify provides. Configure HTTPS after DNS is verified.

**GitHub Pages:** Settings → Pages → Deploy from a branch → `main` → `/ (root)`. Set `afroz.co.uk` under Custom domain, and configure the domain DNS according to GitHub's current documentation. Verify HTTPS and www/non-www redirects.

Do not point DNS at both hosts. Keep the registration with IONOS; hosting and registrar need not be the same company.

## License

Copyright © Afroz. All rights reserved until a license is explicitly chosen.