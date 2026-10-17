# Codex guidance for this repository

## Goal

A one-page personal portfolio at afroz.co.uk with a polished, interactive "living cloud brain" demo and genuinely personal editorial sections. The architecture animation is a **simulation**, not a real production cloud. Never claim requests are truly sent to an external backend.

## Constraints

- Keep it a **static site** for Netlify or GitHub Pages. No bundler, framework, npm dependencies, APIs, telemetry or credentials unless explicitly approved.
- Preserve the scrolling brain-to-architecture reveal, including immediate reveal on request and a reduced-motion static fallback.
- Maintain a dark restrained visual language: navy background, muted cyan/teal lines, mint success cues and refined typography.
- SVG and vanilla JS handle packets and dynamic topology. Preserve keyboard controls and accessible text status.
- Keep burst-mode behaviour deterministic and graceful, including packet concurrency, autoscale activation, and proper cleanup.
- Honour `prefers-reduced-motion`; avoid autoplaying an overwhelming animation.
- Mobile should have an intentionally laid-out architecture, not illegible scaled-down desktop labels.
- Avoid inventing facts about Afroz's education, employers, experience, or achievements. Story sections are intentionally placeholders until facts are provided.

## Verify each change

1. `node --check script.js`
2. Open at desktop and mobile widths; ensure no horizontal overflow, cut-off nodes, or overlapping text.
3. Click once: should finish at green **200 OK** with `sent = completed = 1` and `in flight = queue = 0`.
4. Click 5× quickly: count five, activate 3 API replicas while busy, then settle back to one.
5. Test keyboard navigation and reduced-motion behaviour.

## Future enhancements, not V1 blockers

- Add an optional fault-injection scenario and retry / dead-letter queue.
- Add a real request/event trace backend **only** if and when actual infrastructure is desired.
- Replace draft biography and contact address with user-approved content.