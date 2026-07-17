# Design System — OLLI at Hampton University

## Palette

| Role | Value | Usage |
|------|-------|-------|
| `--brand` | `#004ADD` | Primary actions, links, accents |
| `--brand-dark` | `#02275A` | Dark backgrounds, hero overlay, footer, headings |
| `--surface` | `#ffffff` | Card backgrounds, modal |
| `--surface-muted` | `#F8FAFC` | Alternate section backgrounds |
| `--page-bg` | `#F3F8FC` | Main page background (light blue tint) |
| `--text` | `#25303B` | Body color (dark slate) |
| `--text-muted` | `#475569` | Secondary text |
| `--accent-light` | `#93C5FD` | Footer link/icon accent, label color |
| `--border` | `#e2e8f0` | Subtle borders (Tailwind slate-200) |
| White: `#ffffff`; near-black text: `#353A3C` (on body), `#02275A` (headings)

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
