# Design System — OLLI at Hampton University

## Palette

**Strategy:** restrained "Committed." Hampton blue stays the primary brand color; warmth and energy are layered in through a coordinated set of complementary accents and warmer surfaces — never a rainbow. Tokens are defined in `src/styles/global.css` as Tailwind v4 `@theme` colors (usable as `bg-brand`, `text-gold`, `bg-teal-soft`, …).

**Hierarchy:** 1 brand · 2 gold (secondary) · 3 teal (learning/community) · 4 terracotta (occasional energy) · 5 surfaces · 6 ink/text.

| Role | Value | Usage |
|------|-------|-------|
| **Brand** `--color-brand` | `#004ADD` | Primary actions, links, accents |
| **Brand dark** `--color-brand-dark` | `#02275A` | Draw backgrounds, hero overlay, footer, headings |
| **Brand deep** `--color-brand-deep` | `#031A42` | Deepest navy — text emphasis on light |
| **Brand soft** `--color-brand-soft` | `#E8F0FE` | Light blue tint — subtle brand section bg |
| **Gold** `--color-gold` | `#C1922F` | Highlights, CTA accents (warmth + energy) |
| **Gold strong** `--color-gold-strong` | `#A87A1E` | Gold as text/border on light (AA-safe) |
| **Gold deep** `--color-gold-deep` | `#8A5F10` | Accessible gold text/borders |
| **Gold soft** `--color-gold-soft` | `#F5EBD2` | Warm tinted fill |
| **Teal** `--color-teal` | `#1F7A6E` | Learning / community sections |
| **Teal strong** `--color-teal-strong` | `#16645C` | Teal as text/border on light |
| **Teal deep** `--color-teal-deep` | `#10514A` | Teal text on light / small fills |
| **Teal soft** `--color-teal-soft` | `#E0EFEA` | Sage section bg |
| **Terracotta** `--color-terracotta` | `#C2603B` | Occasional energy accent (small doses) |
| **Terracotta strong** `--color-terracotta-strong` | `#A84B2A` | Terracotta as text/border on light |
| **Terracotta deep** `--color-terracotta-deep` | `#83371E` | Terracotta text on light |
| **Terracotta soft** `--color-terracotta-soft` | `#F6E2D8` | Warm coral tinted fill |
| **Cream** `--color-cream` | `#FAF5EC` | Warm off-white section background |
| **Ivory** `--color-ivory` | `#FEFCF7` | Card surface (warm near-white) |
| **Sky** `--color-sky` | `#EDF3F9` | Light blue-gray subtle bg |
| **Mist** `--color-mist` | `#F5F8FD` | Main page background (cool light) |
| **Ink** `--color-ink` | `#1E262F` | Body text (deep navy/charcoal) |
| **Ink soft** `--color-ink-soft` | `#3E4A58` | Secondary text |
| **Ink faint** `--color-ink-faint` | `#5C6B7A` | Muted text |
| **Line** `--color-line` | `#E6E0D4` | Warm neutral border |
| **Line cool** `--color-line-cool` | `#DCE3EC` | Cool border (existing slate) |
| White: `#ffffff` (hero/dark text only); legacy `--surface`/`--surface-muted` now resolve to ivory/cream.

**Distribution guide (for later steps, not applied yet):**
- **Brand blue** → primary buttons, links, active nav, headings, dark hero/footer.
- **Gold** → primary CTA accents, small highlights/labels, hover states, decorative line work. ≤10% of surface.
- **Teal** → learning/course/community section backgrounds and cards.
- **Terracotta** → one or two strategic energy accents (a highlight, an icon, a callout) — never repeated across every section.
- **Cream/Ivory/Sky/Mist** → alternate section backgrounds instead of flat white everywhere; gives rhythm.
- **Ink** → body and headings on light backgrounds.

## Typography

- **Display/Headings**: Playfair Display (extra-bold 800–900 weight, serif). Imported via Google Fonts with italics.
- **Body/UI**: Inter (system font stack: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif).
- **Hero H1**: `text-5xl md:text-7xl lg:text-8xl` font-black, tracking-[-0.02em], text-shadow for contrast.
- **Section headings**: `text-3xl sm:text-4xl` font-extrabold.
- **Upper-case labels**: `text-xs` font-bold tracking-[0.25em] (footer headings); `text-sm font-semibold uppercase tracking-[0.18em]` (nav items).
- **Body**: `text-base` (16px) or `text-lg` (18px), line-height 1.6.
- **Kickers**: `text-sm font-medium` in `text-slate-300` (CTA section) or `text-[#93C5FD]` (footer).

## Corner radii

- **Buttons**: `rounded-full` (pill shape)
- **Cards/sections**: `rounded-xl` (12px)
- **Dropdowns**: `rounded-2xl` (16px)
- **Mobile nav**: `rounded-3xl` (24px)

## Shadows

- **Card/panel**: `shadow-sm` (subtle), `shadow-md`, `shadow-lg`, `shadow-xl`
- **Card hover**: `shadow-md` + `hover:-translate-y-0.5`
- **CTA section**: `shadow-2xl` on side panel

## Layout

- **Max width**: `max-w-7xl` (1280px), centered mx-auto
- **Content max**: `max-w-4xl` (hero), `max-w-5xl` (testimonials, video), `max-w-2xl` (paragraphs)
- **Hero**: Full-viewport (min-h-[80vh] lg:min-h-[90vh]), background image with blur + gradient overlay from `#02275A`
- **Grid patterns**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (consistent section wrapper)
- **Header**: sticky, `bg-white/95 backdrop-blur-xl`, border-b, shadow-sm
- **Footer**: `bg-[#02275A]` dark section, 3-column grid on md+

## Motion

- **Hover transitions**: `transition hover:-translate-y-0.5` on buttons and cards
- **View transitions**: crossfade via Astro view-transition API (fade-out 350ms, fade-in 500ms)
- **Hover color**: smooth `transition-colors` on links
- **Lazy loading**: `loading="lazy"` on images
- **Reduced motion**: `prefers-reduced-motion: reduce` resets all animation/transition duration to 0.01ms

## Buttons

- **Primary**: `rounded-full bg-[#004ADD] text-white px-6 py-3 shadow-sm hover:bg-[#02275A] hover:shadow-lg hover:-translate-y-0.5 transition`
- **Hero CTA**: `rounded-full bg-white text-[#02275A] px-10 py-4 text-lg font-semibold shadow-lg hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5`
- **Outlined/ghost**: `rounded-full border border-white bg-white/10 text-white px-8 py-4 hover:bg-white/20`

## Focus & Accessibility

- `:focus-visible`: 2px solid `rgba(0, 68, 221, 0.9)`, 4px offset
- `::selection`: `--brand` background, white text
- `scroll-margin-top: 5rem` on all elements (accounts for sticky header)
- `text-wrap: balance` on h1-h3

## Nav structure

- Desktop: horizontal bar with `<details>` dropdowns triggered on hover (100ms delay on close)
- Mobile: `<details>` hamburger, fixed full-width dropdown with rounded-3xl panel
- Z-index: header at z-50, dropdowns at z-50, modal at z-[100]
