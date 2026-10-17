# Codex guide — Cloud Cortex

## Goal

A refined, static, single-page portfolio for afroz.co.uk. The interactive SVG is an **illustrative browser simulation**, not a live production cloud. Avoid representing simulated transactions or metrics as real.

## Principles

- No framework, build system, backend, analytics, network dependencies or secrets unless explicitly requested.
- Keep the visual system restrained: dark navy, muted teal pathways, mint success; warm amber retry and soft red failure.
- Preserve the brain-to-architecture scroll reveal **and the faint brain projection after reveal**, including reduced-motion fallback.
- **Do not reintroduce node-bottom meters/underlines** or always-animated wires and decorative blinking across all boxes. Only active request routes should have strong movement.
- All statuses must be sampled *per request*. Do not add a status selector. Current outcome weights: 60% direct 200, 10% retry-recovered 200, 10% 403, 10% 429, 10% 503; 70% eventual success, 30% eventual failure.
- Burst traffic uses independently sampled results and temporarily scales API replicas from one to three. Keep counters, queue depth and event stream accurate, even for failures and retries.
- Honour `prefers-reduced-motion`; support keyboard interaction and live textual feedback.
- Layout the architecture intentionally for mobile; avoid horizontal overflow, clipped labels, or a tiny desktop diagram.
- Don't invent personal history, companies, education or awards. Draft text remains placeholders until the owner provides the facts.

## Repository arrangement

The deployed public GitHub repository currently stores a self-contained `index.html` (inline CSS, JS and SVG). A separate modular source archive is maintained in the ChatGPT development handoff. If migrating the repository to modular files, commit every dependency together and confirm the root `index.html` still loads on Netlify/GitHub Pages without a build step.

## Verify each iteration

- Check syntax and browser console for JavaScript errors.
- Test deterministic probability boundaries by temporarily overriding `Math.random` in browser tests: .12 → direct 200; .65 → recovered 200; .75 → 403; .85 → 429; .95 → 503.
- Test five rapid requests for autoscale expansion and final scale-down, and ensure in-flight / queue return to zero.
- Check 1440px and 390px layouts, reduced motion, scrolling reveal and absence of bottom node meters.
- Keep documentation consistent with the current implementation.
