# Old → New Redirect Map (OLLI at Hampton University)

> **This file documents server-side work that cannot be performed from this
> repository.** The old site is a separate WordPress/Apache installation at
> `home.hamptonu.edu/osher/`. Nothing in this repo can create those redirects —
> they must be applied by the Hampton University web/server team.

## Goal

Consolidate `https://home.hamptonu.edu/osher/` (and its ~139 legacy URLs) into
`https://osher.hamptonu.edu/` so Google transfers the old site's accumulated
relevance and stops treating the old URL as a competing candidate.

## Confirmed old-site platform

| Fact | Value |
|---|---|
| Server | Apache/2.4.58 (Ubuntu) |
| CMS | WordPress 6.9.7 **multisite subsite (site ID 68)** |
| Page builder | Elementor 4.2.3 |
| SEO plugin | Yoast SEO v28.5 |
| Redirect plugin | "Redirection" (johnny5) v5.7.5 — **already installed** |
| IP | 137.198.11.10 (direct A record) |
| Nameservers | `ns1.solutrix.net`, `ns2.solutrix.net` |
| Behind Cloudflare? | **No** — so Cloudflare Redirect Rules are not available |

Old URL inventory (from the subsite's own Yoast sitemap index): **139 URLs**,
all currently returning HTTP 200.

| Source sitemap | URLs |
|---|---|
| `post-sitemap.xml` | 46 |
| `page-sitemap.xml` | 29 |
| `mc-events-sitemap.xml` | 32 |
| `mc-locations-sitemap.xml` | 15 |
| `3d-flip-book-sitemap.xml` | 9 |
| `category-sitemap.xml` | 3 |
| `mc-event-category-sitemap.xml` | 3 |
| `post_tag-sitemap.xml` | 1 |
| `author-sitemap.xml` | 1 |

## Step 0 — two Apache-level fixes (prerequisite)

### 0a. Malformed no-slash redirect 🚨

Confirmed live: `http://home.hamptonu.edu/osher` 301s to
`https://home.hamptonu.eduosher` — the host and path are concatenated with no
separator, producing a hostname that does not resolve. Every plain-HTTP,
no-trailing-slash legacy inbound link currently dead-ends.

```apache
# Repair a previously-mangled redirect target, then proceed normally.
RewriteCond %{HTTP_HOST} ^home\.hamptonu\.eduosher$ [NC]
RewriteRule ^$ https://home.hamptonu.edu/osher/ [R=301,L]
```

Also locate and correct the original directive. The likely malformed form is:

```apache
# WRONG — missing slash
Redirect 301 /osher https://home.hamptonu.eduosher
```

```apache
# RIGHT
Redirect 301 /osher https://osher.hamptonu.edu/
```

### 0b. Case-sensitivity duplicate

`https://home.hamptonu.edu/OSHER/About/` currently returns **200 with no
redirect**, creating a case-variant duplicate of `/osher/about/`.

```apache
# Normalise the /OSHER/ prefix to lowercase /osher/ before other rules run.
RewriteCond %{REQUEST_URI} ^/OSHER/(.*)$ [NC]
RewriteRule ^/OSHER/(.*)$ /osher/$1 [R=301,L]
```

## Delete these first

Three pre-existing Redirection-plugin rules create redirect chains. **Delete
them before adding anything below**, or old → old → new two-hop chains will
form.

## Where to apply

1. **Primary:** WordPress "Redirection" plugin on the old subsite (already
   installed). Use the GUI table for literal rules; use regex mode for the
   pattern rules.
2. **Fallback / preferred:** Apache `.htaccess` in the `/osher/` document root.
3. Fix Step 0 at the vhost / load-balancer level — the plugin cannot express it.

**Not Cloudflare** (no proxy). **Not** `_redirects` on the new site (those only
apply to requests that already reach `osher.hamptonu.edu`; legacy paths never
do).

## Rule ordering (must be preserved)

```
Step 0a, Step 0b
  → Group A (literal rules, 11)
    → Group B (regex → 301, 5)
      → Group C (regex → 410 Gone, 5)
        → Group D (catch-all, 1)   ← MUST BE LAST
```

**Critical:** rule **A9** (`/osher/2021/09/14/giving/` → `/giving/`) must appear
**before** rule **B5** (`^/osher/20\d\d/\d\d/\d\d/.*` → `/courses/`). Otherwise
B5 matches the dated giving post first and sends it to the wrong page.

## Group A — literal rules (11) — Regex OFF

| # | From | To |
|---|---|---|
| A1 | `/osher/` | `/` |
| A2 | `/osher/about/` | `/about/` |
| A3 | `/osher/courses/` | `/courses/` |
| A4 | `/osher/activities/` | `/activities/` |
| A5 | `/osher/frequently-asked-questions/` | `/faq/` |
| A6 | `/osher/contact/` | `/faq/` |
| A7 | `/osher/volunteering/` | `/faq/` |
| A8 | `/osher/giving/` | `/giving/` |
| A9 | `/osher/2021/09/14/giving/` | `/giving/` |
| A10 | `/osher/osher-donors/` | `/donors/` |
| A11 | `/osher/osher-lifelong-learning-institute/` | `/about/` |

**Why A6 → `/faq/` and not the homepage:** the new site has no `/contact/`
route. The FAQ carries the office hours, phone, email, and mailing address, so
it is the true equivalent. Sending contact traffic to the homepage would drop
users on unrelated content.

**Why A7 → `/faq/`:** the new site has no `/volunteering/` route. The FAQ
answers "How can members volunteer?", which is the closest genuine match.

## Group B — pattern rules → 301 (5)

| # | Regex | To | Rationale |
|---|---|---|---|
| B1 | `^/osher/mc-events/.*` | `/activities/` | Event calendar entries map to activities |
| B2 | `^/osher/mc-locations/.*` | `/activities/` | Venue pages have no standalone equivalent |
| B3 | `^/osher/mc-event-category/.*` | `/activities/` | Event taxonomy archives |
| B4 | `^/osher/3d-flip-book/.*` | `/courses/` | These are the flipped course catalogs |
| B5 | `^/osher/20\d\d/\d\d/\d\d/.*` | `/courses/` | Dated course/event posts |

## Group C — pattern rules → 410 Gone (5)

These have no equivalent on the new site and should retire rather than
redirect, so Google drops them cleanly instead of following them to an
unrelated page.

| # | Regex | Response |
|---|---|---|
| C1 | `^/osher/(category\|tag\|author)/.*` | 410 |
| C2 | `^/osher/sample-page/?$` | 410 |
| C3 | `^/osher/start/?$` | 410 |
| C4 | `^/osher/elementor-\d+/?$` | 410 |
| C5 | `^/osher/(wp-admin\|wp-login\|kiosk\|dashboard).*` | 410 |

In the Redirection plugin, set the action to **410 – Gone** (`[G,L]` in
Apache).

## Group D — catch-all (1) — MUST BE LAST

| # | Regex | To |
|---|---|---|
| D1 | `^/osher/.*` | `https://osher.hamptonu.edu/` |

Anything not matched above lands on the new homepage. This is the safety net,
not the strategy — the specific rules above exist so most legacy traffic lands
on genuinely equivalent content.

## `.htaccess` equivalent

For the `/osher/` document root, replacing the plugin entirely:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On

  # ── Step 0a: repair the malformed host/path concatenation ──
  RewriteCond %{HTTP_HOST} ^home\.hamptonu\.eduosher$ [NC]
  RewriteRule ^$ https://home.hamptonu.edu/osher/ [R=301,L]

  # ── Step 0b: normalise the /OSHER/ case variant ──
  RewriteCond %{REQUEST_URI} ^/OSHER/(.*)$ [NC]
  RewriteRule ^/OSHER/(.*)$ /osher/$1 [R=301,L]

  # ── Group A: literal rules ──
  RewriteRule ^osher/?$                        https://osher.hamptonu.edu/           [R=301,L]
  RewriteRule ^osher/about/?$                  https://osher.hamptonu.edu/about/     [R=301,L]
  RewriteRule ^osher/courses/?$                https://osher.hamptonu.edu/courses/   [R=301,L]
  RewriteRule ^osher/activities/?$             https://osher.hamptonu.edu/activities/ [R=301,L]
  RewriteRule ^osher/frequently-asked-questions/?$ https://osher.hamptonu.edu/faq/   [R=301,L]
  RewriteRule ^osher/contact/?$                https://osher.hamptonu.edu/faq/       [R=301,L]
  RewriteRule ^osher/volunteering/?$           https://osher.hamptonu.edu/faq/       [R=301,L]
  RewriteRule ^osher/giving/?$                 https://osher.hamptonu.edu/giving/    [R=301,L]
  RewriteRule ^osher/2021/09/14/giving/?$      https://osher.hamptonu.edu/giving/    [R=301,L]
  RewriteRule ^osher/osher-donors/?$           https://osher.hamptonu.edu/donors/    [R=301,L]
  RewriteRule ^osher/osher-lifelong-learning-institute/?$ https://osher.hamptonu.edu/about/ [R=301,L]

  # ── Group B: pattern rules -> 301 ──
  RewriteRule ^osher/mc-events/.*          https://osher.hamptonu.edu/activities/ [R=301,L]
  RewriteRule ^osher/mc-locations/.*       https://osher.hamptonu.edu/activities/ [R=301,L]
  RewriteRule ^osher/mc-event-category/.*  https://osher.hamptonu.edu/activities/ [R=301,L]
  RewriteRule ^osher/3d-flip-book/.*       https://osher.hamptonu.edu/courses/    [R=301,L]
  RewriteRule ^osher/20[0-9][0-9]/[0-9][0-9]/[0-9][0-9]/.* https://osher.hamptonu.edu/courses/ [R=301,L]

  # ── Group C: retired paths -> 410 Gone ──
  RewriteRule ^osher/(category|tag|author)/.*  - [G,L]
  RewriteRule ^osher/sample-page/?$            - [G,L]
  RewriteRule ^osher/start/?$                  - [G,L]
  RewriteRule ^osher/elementor-[0-9]+/?$       - [G,L]
  RewriteRule ^osher/(wp-admin|wp-login|kiosk|dashboard).* - [G,L]

  # ── Group D: catch-all (LAST) ──
  RewriteRule ^osher/.*  https://osher.hamptonu.edu/  [R=301,L]
</IfModule>
```

Place this **before** the WordPress rewrite block already present in the file,
so these rules win.

## Verification

Run these after applying the rules. Expect the stated result exactly.

```bash
curl.exe -s -I https://home.hamptonu.edu/osher/
# expect: 301  Location: https://osher.hamptonu.edu/

curl.exe -s -I http://home.hamptonu.edu/osher
# expect: 301  Location: https://osher.hamptonu.edu/   (NOT ...eduosher)

curl.exe -s -I https://home.hamptonu.edu/osher/about/
# expect: 301  Location: https://osher.hamptonu.edu/about/

curl.exe -s -I https://home.hamptonu.edu/osher/contact/
# expect: 301  Location: https://osher.hamptonu.edu/faq/

curl.exe -s -I https://home.hamptonu.edu/osher/2021/09/14/giving/
# expect: 301  Location: https://osher.hamptonu.edu/giving/   (NOT /courses/)

curl.exe -s -o NUL -w "%{http_code}" https://home.hamptonu.edu/osher/sample-page/
# expect: 410

curl.exe -s -I https://home.hamptonu.edu/osher/anything-unlisted/
# expect: 301  Location: https://osher.hamptonu.edu/
```

Confirm **no chains**: every rule above should resolve in one hop. If any
response has two `Location` headers in sequence, delete the stale rule causing
it.
