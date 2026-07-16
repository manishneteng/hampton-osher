---
timestamp: 2026-07-16T11-37-16Z
slug: s-astro-src-pages-faq-astro-src-pages-giving-astro
---
---
target: src/pages/about.astro, courses.astro, faq.astro, giving.astro
total_score: 22
p0_count: 0
p1_count: 2
p2_count: 3
timestamp: 2026-07-16T11-35-00Z
slug: s-astro-src-pages-faq-astro-src-pages-giving-astro
---
# Critique: OLLI Remaining Pages (About, Courses, FAQ, Giving)

## Design Health Score: 22/40

## Method: dual-agent (A: Explore · B: Explore)

## Anti-Patterns Verdict

**AI slop: MODERATE overall.** The hero template is cloned verbatim across all 4 pages (same gradient background, radial overlay, uppercase eyebrow, heading structure). The card grid pattern repeats monotonously. Courses page is the worst offender (11 identical cards). About and Giving follow the same template structure.

**CLI detector**: 0 structured findings (regex-only scan on .astro source).

**Browser overlay** (injected on all 4 pages):
- `/about` — "hero eyebrow / pill chip", "overused font: Inter (91%)"
- `/courses` — "repeated section kicker labels" (11 identical category eyebrows), "overused font: Inter (84%)", gradient text false positive
- `/faq` — "skipped heading level: h1→h3 (missing h2)", "overused font: Inter (78%)"
- `/giving` — "skipped heading level: h2→h4 (missing h3)", "overused font: Inter (87%)"

The "gradient text" and "bounce easing" overlay findings are false positives — the project uses Tailwind utility classes, not actual gradient text or bounce animations. The heading level skips in FAQ and Giving are real accessibility issues.

## Heuristic Scores

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 0.5 | No active/upcoming course indicators |
| 2 | Match System / Real World | 1.0 | "Welcome to OLLI HU" on /courses doesn't match expected label |
| 3 | User Control and Freedom | 1.0 | No course filters, no search on Courses page |
| 4 | Consistency and Standards | 2.75 | Hero template cloned identically across all pages, button radius mismatch (rounded-2xl vs rounded-full) |
| 5 | Error Prevention | 1.0 | External links open in same tab with no indicator |
| 6 | Recognition Rather Than Recall | 1.25 | 11 identical course cards with no visual category grouping |
| 7 | Flexibility and Efficiency | 1.0 | No keyboard shortcuts, no search |
| 8 | Aesthetic and Minimalist Design | 2.75 | Decorative dividers, template-driven sameness, over-rounding |
| 9 | Error Recovery | 0 | n/a (no forms to error on) |
| 10 | Help and Documentation | 0.75 | FAQ is good, no contextual help elsewhere |
| **Total** | | **22/40** | **Needs improvement** |

## What's Working

1. **FAQ is the standout page.** The accordion interaction is clean, membership pricing scenarios are thoughtful, sidebar CTAs are well-placed. Best emotional journey of the four.

2. **Strong color discipline.** Navy/blue palette is consistent everywhere. No palette drift, no unlicensed colors.

3. **Footer is excellent.** Address/mailing/phone/hours/social all in one organized layout. The `bg-[#02275A]` dark footer provides strong visual closure.

## Priority Issues

### [P1] Hero template cloned identically across all 4 pages
**Why it matters**: Every page feels templated, not crafted. The visitor experiences the same gradient hero with radial overlay and uppercase eyebrow on every navigation click. No page has its own visual identity.
**Fix**: Vary hero treatment by purpose — image background for Courses, human photo for About, simple header for FAQ, testimonial-led for Giving.
**Suggested command**: `$impeccable craft page-specific hero sections`

### [P1] Courses page — 11 identical cards with no hierarchy, no filtering, no schedule info
**Why it matters**: Pat (50+) has to visually scan all 11 cards to find a course. No category groupings, no schedule, no "upcoming" vs "past" indicators. On mobile this is ~15 scrolls of identical blocks.
**Fix**: Group by category with visible headings, add color coding, consider featured/staff-pick treatment for the first card, add schedule info inline.
**Suggested command**: `$impeccable layout src/pages/courses.astro`

### [P2] About page buries local chapter info — foundation history comes first
**Why it matters**: Jordan (first-timer) arrives wanting to know "what is OLLI at Hampton?" but reads 2 cards about Bernard Osher's 1977 foundation history before reaching the local chapter card. Information architecture failure.
**Fix**: Reorder cards: local chapter → nationwide network → foundation history. Or integrate foundation context into the sidebar.
**Suggested command**: `$impeccable clarify src/pages/about.astro`

### [P2] Giving page emotional arc is pushy → flat → warm — should be warm → inspiring → grateful
**Why it matters**: The hero's bold orange urgency and exclamation point clash with the gentle brand. Impact cards are redundant ("Show Your Appreciation", "Sustain Our Programs", "Support Our Community" say the same thing). Complex planned giving options listed before a simple "donate now."
**Fix**: Lead with a simple giving ask at any level, layer planned giving below, soften the hero tone.
**Suggested command**: `$impeccable distill src/pages/giving.astro`

### [P2] Heading level skips on FAQ and Giving pages
**Why it matters**: FAQ jumps from h1 → h3 (missing h2). Giving jumps from h2 → h4 (missing h3). This breaks screen reader navigation and accessibility compliance.
**Fix**: Fix heading hierarchy — wrap sidebar/hub sections in appropriately-leveled headings.
**Suggested command**: `$impeccable audit`

## Persona Red Flags

**Pat (50+/Retiree)**: Courses page is the biggest problem — no schedule info, no difficulty level, no filtering. 11 identical cards to scan. About page's foundation-first ordering buries the local relevance.

**Jordan (First-Timer)**: Courses H1 says "Welcome to OLLI HU" instead of "Course Catalog" — confusing. About page takes too long to say "here's what this means for you." No pricing in the hero flow (though the homepage now has it).

**Morgan (Mobile User)**: Courses page is a 15-scroll unfiltered card wall. About and Giving stack cleanly. FAQ accordion works well.

## Minor Observations

- About page hero subtitle: "adults 50 and better" in hero, but "over fifty years of age" in card 3 — inconsistency.
- Courses hero has encoding corruption: `empower�no tests` (broken em-dash).
- FAQ sidebar "Join OLLI-HU" button uses `rounded-2xl` while all other primary CTAs use `rounded-full`.
- FAQ has redundant membership pricing (sidebar + bottom section).
- About page "Osher Institute Legacy" sidebar card uses `rounded-2xl` vs `rounded-xl` on content cards.
- Giving page's "Make a Donation" CTA has hover motion on the wrapper card, making the CTA feel secondary.
- "Engaging" appears 4+ times across pages — AI-copy default word.

## Questions to Consider

- "What if each page header matched its purpose visually — not just textually?"
- "What if Courses showed 3 featured courses large and the rest in an expandable grid?"
- "What if Giving led with a donor story instead of an ask?"
- "What if About started with a member's voice, not a foundation's history?"

---

## Run Notes

- Target slug: s-astro-src-pages-faq-astro-src-pages-giving-astro
- Ignore list: none (ignore.md doesn't exist)
- Assessment independence: Dual-agent ✅ (A: Explore, B: Explore)
- CLI detector: 0 findings (regex scan on .astro files)
- Browser visibility: ✅ All 4 pages navigated
- Overlay injection: ✅ Successful on all pages via live-server:8400
- Live server cleanup: Killed after injection
- Snapshot written: pending
