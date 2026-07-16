---
target: the landing page (index.astro)
total_score: 23
p0_count: 1
p1_count: 2
timestamp: 2026-07-16T10-41-23Z
slug: src-pages-index-astro
---
# Critique: OLLI Homepage

## Design Health Score: 23/40

## Anti-Patterns Verdict
AI slop tell: MODERATE. Main tells are eyebrow-on-every-section pattern, over-rounding cards, identical card grids, border+shadow pairing on cards. The detector found 0 structured issues in CLI mode but the live browser overlay flagged 'nested cards', 'overused font', 'gradient text', and 'bounce easing' patterns.

## Priority Issues
[P0] All primary conversion flows are external Jotform links with no intermediate context
[P1] Eyebrow label overuse (strongest AI tell)
[P1] Confusing primary action hierarchy (two equal CTAs in hero)
[P2] Over-rounding everything (rounded-2xl on all cards + border + shadow)
[P2] Image strip grid lacks purpose (6 similar decorative images, no captions, empty alt)

## What's Working
1. Strong hero positioning with memorable tagline
2. Real testimonials with named members build trust
3. Consistent navy/blue color discipline

## Persona Red Flags
- Pat (Senior/Retiree): No pricing anywhere; external Jotform only path
- Jordan (First-Timer): Volunteer section first scroll is ambiguous
- Morgan (Mobile User): 6-link submenu in mobile nav exceeds working memory

## Minor Observations
- Video has autoplay but controls=0 (no pause)
- iframe loading="lazy" on above-the-fold element
- Decorative radial gradient at 15% opacity is nearly invisible
- No keyboard lift effect on card hovers
