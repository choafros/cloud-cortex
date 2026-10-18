# Codex notes — Cloud Cortex

## Intent

A performant, polished one-page portfolio for `afroz.co.uk` with a locally simulated infrastructure. **Never claim the browser animation drives real cloud services.** Keep HTML/CSS/SVG/vanilla JavaScript without dependencies, bundlers or secrets unless the owner approves a bigger project.

## V1.6 contracts

- Preserve the faint brain projection behind the infrastructure, the initial scroll-to-reveal, the on-canvas Send request + 5× burst controls, and the 1 → 2 → 3 → 1 API autoscaling choreography.
- Three semantic zoom levels: `overview`, `system`, `deep`. Clicking `− / +` changes one level; wheel over the SVG changes one level with a debounce and allows normal page scroll at limits. Overview represents 7 domains; System has 23 real simulation nodes; Deep dive has 15 detailed design boxes. Use accessible keyboard-operated controls, and do not make page scrolling difficult on mobile.
- Semantic layers are illustrative design diagrams. When a request begins, switch to System so the existing packet animation is always visible. Do not leave hidden SVG elements tabbable. If a zoom change would interrupt active transactions, defer/disallow it with visible feedback.
- The inspector's title, state and close button **must remain visible** while the long explanation scrolls in `.inspector-scroll`. Both desktop and mobile should have internally scrollable cards; the header should not move. Opening a different node resets the scroll position. Close via button or Escape; restore focus when practical.
- Preserve 70% expected success (60% direct and 10% after retry) and 30% failure (10% 403, 10% 429, 10% 503) independently sampled per request; do not add a user-operated error selector.
- Keep node states and overlapping request accounting accurate. Avoid underlined node meters or excessive idle animations. Honor `prefers-reduced-motion` and avoid horizontal page overflow.
- Do not invent biography, credentials, employers, education or awards. Replace placeholders only when approved by the owner.

## Verify

- `node --check script.js`
- Run `python tests/v16_check.py` and `python tests/v16_transactions.py` with Playwright and Chromium available. Test 390px and 1440px viewports, scrollable inspector heading, all semantic zoom nodes, five-click scaling and recovery, and console errors.
- Check wheel zoom with the pointer over the diagram and natural page scroll elsewhere. Verify keyboard focus and reduced-motion mode.