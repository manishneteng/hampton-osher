---
name: impeccable
description: Design, redesign, critique, audit, polish, or improve frontend UI. Covers UX, visual hierarchy, accessibility, typography, layout, motion, responsive. Not for backend-only tasks.
version: 3.9.1
---

Produces production-grade frontend code. Setup: 1) Run `node .agents/skills/impeccable/scripts/context.mjs` once/session. 2) Read sub-command reference from `reference/<command>.md` if invoked. 3) Read existing design tokens. 4) Read register ref (brand.md or product.md). 5) Run `palette.mjs` for new projects.

Color: ≥4.5:1 contrast body text. OKLCH throughout.
Typography: 65-75ch line length. Pair fonts on contrast axis. `text-wrap: balance` on headings.
Layout: semantic z-index scale. Cards are lazy. Flexbox 1D, Grid 2D.
Motion: intentional, ease-out curves. `prefers-reduced-motion` required.

Full docs: .agents/skills/impeccable/SKILL.md
Refs: .agents/skills/impeccable/reference/
