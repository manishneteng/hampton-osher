---
target: entire website
total_score: 20
p0_count: 0
p1_count: 3
p2_count: 3
p3_count: 1
timestamp: 2026-07-17T20-39-03Z
slug: entire-website
---
# Full-Site UX Critique — OLLI at Hampton University

## Design Health Score: 20/40

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No loading states for Jotform embeds; catalog modal has no close-feedback beyond the X button |
| 2 | Match Between System and Real World | 3 | Language is generally plain, but "Osher Lifelong Learning Institute" as primary header label is institution-speak |
| 3 | User Control and Freedom | 2 | No way to close catalog modal with Esc on first open; no back-to-top on long pages |
| 4 | Consistency and Standards | 2 | Every page reuses the same hero template; card radius inconsistency; same hover animation everywhere |
| 5 | Error Prevention | 2 | No form validation visible on embedded Jotforms; no confirmation before destructive nav actions |
| 6 | Recognition Rather Than Recall | 3 | Navigation labels are clear; "Make a Gift" button is a dropdown not a direct CTA |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts; no skip-to-content; no search across 80+ donor names |
| 8 | Aesthetic and Minimalist Design | 2 | Every section has the same card+shadow+1px-border+lift-on-hover pattern |
| 9 | Error Recovery | 1 | No form error recovery visible; no undo for mistaken actions |
| 10 | Help and Documentation | 2 | FAQ is thorough but hidden behind generic layout; no contextual help on forms |

## Anti-Patterns Verdict

Does this look AI-generated? Yes — strongly.

Identical hero template on all 8 pages (blurred image + gradient overlay + radial glow + eyebrow + serif H1 + curved SVG separator). Every card uses the same `border border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md` pattern. Playfair Display + Inter is the #1 most common AI font pairing (both on reflex-reject list). Kicker/eyebrow on every section. 1px border + shadow on same elements. Over-rounded corners (rounded-2xl on cards, rounded-3xl on mobile nav).

## Priority Issues

1. [P1] Template sameness — every page uses identical hero and card patterns
2. [P1] Playfair Display + Inter is the most generic AI font pairing
3. [P1] Hover-lift pattern on every element makes nothing special
4. [P2] "Quick Stats" panel is the hero-metric cliché
5. [P2] Curved SVG separator overused on every hero
6. [P2] Button hierarchy is flat — ghost and primary CTAs look similar
7. [P3] Donors page is a wall of 60+ identical cards

## Persona Red Flags

Margaret (prospective member, 62): Catalog is a PDF modal, not searchable. No imagery of real classes. Only one distinctive brand line.

Robert (current member, 68): Course cards don't link to registration. No way to see what's new since last semester.

Alisha (administrator): Site relies on 5+ Jotform embeds. Donor list is hardcoded markup, not data-driven.

## Cognitive Load: Moderate (2/8 failures)

## Minor Observations

- Footer has invisible SVG spacer for second phone number
- alt text on catalog images renders literal `$${idx+1}` syntax
- Volunteer page disconnected from homepage VolunteerCards
- Brand glow at opacity-[0.2] is barely perceptible
