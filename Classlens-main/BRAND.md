# Lens — Brand & Design System

> Biometric Attendance & Spatial Intelligence, packaged as infrastructure.

This document defines the brand identity for **Lens** and the design system for its two distinct surfaces:

1. **Marketing Surface** — the public landing page, sold as a premium developer-first SaaS product.
2. **Application Surface** — the internal dashboard, sold as a fast, trustworthy operational tool.

Both surfaces share one DNA (color, type, iconography, voice) but flex their density and tone for different jobs: one **sells the API**, the other **runs the room**.

---

## 1. Brand Foundation

### 1.1 Name & Meaning

**Lens** — the point through which light resolves into recognition. It implies precision optics, not surveillance. Never abbreviate to an acronym. Always capitalized as "Lens," never "LENS" or "lens" in prose (code identifiers are lowercase, e.g. `lens-api`).

### 1.2 Mission Statement

> Turn a single photograph into verified presence — instantly, accurately, and at API speed.

### 1.3 Brand Positioning

Lens sits at the intersection of two categories the market treats as separate:

| Category                                          | What competitors look like                        | Where Lens sits                                                                                      |
| ------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Biometric / attendance software                   | Beige, bureaucratic, "enterprise school software" | Rejected — feels like 2009                                                                           |
| Developer infrastructure (Stripe, Vercel, Twilio) | Dark, precise, technical, confident               | **Adopted** — Lens borrows this visual grammar even though its buyer is often a registrar, not a CTO |

The bet: making attendance software _look_ like a Series B infra company signals accuracy and trustworthiness better than making it look "friendly."

### 1.4 Personality

Five adjectives, in priority order:

1. **Precise** — every number has a decimal place; every claim is measurable (99.38%, 128-d, <300ms).
2. **Quiet** — no exclamation points, no mascots, no gradients-for-gradient's-sake. Confidence doesn't shout.
3. **Technical** — comfortable showing code, JSON payloads, and latency graphs to a non-technical buyer, because it signals rigor.
4. **Fast** — motion and copy both imply speed: instant recognition, sub-second response.
5. **Accountable** — this product touches biometric data of minors and employees; the tone never hides that responsibility. Security and privacy language is treated as a first-class feature, not a footnote.

**Anti-personality** — Lens is never: playful, cartoonish, "fun," loud, cluttered, or vague. No stock photography of smiling students. No emoji in product copy.

### 1.5 Voice & Tone

| Surface            | Voice                                    | Example                                                                                                                           |
| ------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Marketing headline | Declarative, short, technical confidence | "Attendance, resolved in one frame."                                                                                              |
| Marketing body     | Explains the _how_, not just the _what_  | "Each face is projected into a 128-dimensional embedding and matched via nearest-neighbor search — no ID cards, no manual entry." |
| Dashboard UI copy  | Terse, operational, zero adjectives      | "3 unrecognized faces · Review"                                                                                                   |
| Error states       | Honest, specific, never cute             | "Match confidence below threshold (62%). Face not logged." — never "Oops! We couldn't find that person 🙈"                        |
| Empty states       | Instructional, not apologetic            | "No sessions yet. Upload a class photo to generate your first attendance record."                                                 |

**Writing rules:**

- Lead with the noun, not the adjective. "128-dimensional embedding," not "powerful embedding technology."
- Numbers are always specific: "99.38% LFW benchmark accuracy," never "highly accurate."
- No em-dash-stacked marketing copy ("faster — smarter — better"). One claim per sentence.
- Never use "AI-powered" as a floating buzzword without a mechanism attached in the same sentence or the next.

---

## 2. Visual Identity

### 2.1 Logo Concept

Wordmark-first, no icon dependency for MVP.

- **Wordmark:** "Lens" set in the primary display typeface (see §3.1), medium weight, tight tracking (-2%).
- **Mark (optional, for favicon/avatar):** a single **aperture ring** — a circle built from 6–8 overlapping arcs (literal camera aperture blades), rendered in one color, no gradient. This is the only illustrative brand asset permitted; it should never appear alongside decorative photography.
- **Lockup spacing:** mark sits at cap-height of the wordmark, 12px gap at 24px logo height, scaling proportionally.
- **Clear space:** minimum clear space around any lockup = the height of the aperture mark.

Do not: render the wordmark in a gradient, add a drop shadow, place it on busy photography, or pair it with a tagline in the same lockup.

### 2.2 Color System

Color is the single biggest lever separating the two surfaces. The **token names are shared**; the **values differ by surface theme** (marketing = permanent dark; app = light-first with dark mode).

#### Core palette (raw values — these feed both themes)

| Token        | Hex       | Usage                                                                                    |
| ------------ | --------- | ---------------------------------------------------------------------------------------- |
| `ink-950`    | `#08090B` | Marketing background, deepest surface                                                    |
| `ink-900`    | `#111318` | Marketing panel background                                                               |
| `ink-800`    | `#1A1D24` | Marketing card / code block background                                                   |
| `ink-700`    | `#272B33` | Marketing borders, dividers                                                              |
| `paper-0`    | `#FFFFFF` | App background (light mode)                                                              |
| `paper-50`   | `#F7F8FA` | App surface / cards                                                                      |
| `paper-100`  | `#EEF0F3` | App borders, dividers, hover fills                                                       |
| `slate-500`  | `#6B7280` | Secondary text (both surfaces)                                                           |
| `slate-300`  | `#9AA1AC` | Placeholder / disabled text                                                              |
| `signal-500` | `#4F6BFF` | **Primary brand accent** — indigo-blue, used for CTAs, active states, focus rings, links |
| `signal-400` | `#7389FF` | Hover state of primary accent                                                            |
| `signal-100` | `#E8ECFF` | Accent tint background (badges, selected rows)                                           |
| `match-500`  | `#1AAE6F` | Success / high-confidence match (green)                                                  |
| `match-100`  | `#DEF7EA` | Success tint background                                                                  |
| `flag-500`   | `#E2A400` | Warning / low-confidence match, review needed                                            |
| `flag-100`   | `#FBF0D4` | Warning tint background                                                                  |
| `error-500`  | `#E5484D` | Error, unrecognized, failed enrollment                                                   |
| `error-100`  | `#FBE1E1` | Error tint background                                                                    |

**Why blue-indigo (`signal-500`) as the single accent:** it reads as neutral-technical (not "school green," not "corporate red") and gives enough contrast against both a near-black marketing background and a near-white dashboard background without re-tinting.

**Confidence-score color mapping (used throughout the app on bounding boxes, badges, and tables):**

| Range            | Token       | Meaning                |
| ---------------- | ----------- | ---------------------- |
| ≥ 90%            | `match-500` | Confirmed match        |
| 70–89%           | `flag-500`  | Needs review           |
| < 70% / no match | `error-500` | Unknown / unrecognized |

This three-tier mapping is a core piece of the product's visual language — it should appear identically in bounding-box overlays, table rows, badges, and charts, everywhere a confidence score is shown.

#### Surface theming

**Marketing (permanent dark theme, no light mode):**

```
background:      ink-950
surface/card:     ink-900
surface/elevated: ink-800
border:           ink-700
text/primary:     #F5F6F8
text/secondary:   slate-300
accent:           signal-500
```

**Application (light-first, dark mode optional/phase 2):**

```
background:       paper-0
surface/card:      paper-50
border:            paper-100
text/primary:      ink-950
text/secondary:    slate-500
accent:            signal-500
```

### 2.3 Typography

Two-typeface system: one humanist sans for UI/marketing prose, one mono for anything that is — or wants to look like — code, data, or a metric.

| Role                                       | Typeface           | Fallback stack                                     |
| ------------------------------------------ | ------------------ | -------------------------------------------------- |
| Display / UI sans                          | **Inter**          | `Inter, -apple-system, "Segoe UI", sans-serif`     |
| Monospace (code, metrics, IDs, timestamps) | **JetBrains Mono** | `"JetBrains Mono", "SF Mono", Consolas, monospace` |

**Type scale (rem, 16px base):**

| Token        | Size            | Line-height | Weight | Usage                                                     |
| ------------ | --------------- | ----------- | ------ | --------------------------------------------------------- |
| `display-xl` | 3.5rem / 56px   | 1.05        | 600    | Marketing hero headline                                   |
| `display-lg` | 2.5rem / 40px   | 1.1         | 600    | Marketing section headers                                 |
| `display-md` | 1.75rem / 28px  | 1.2         | 600    | App page titles                                           |
| `heading`    | 1.25rem / 20px  | 1.3         | 600    | Card titles, modal headers                                |
| `body-lg`    | 1.125rem / 18px | 1.6         | 400    | Marketing lead paragraphs                                 |
| `body`       | 1rem / 16px     | 1.5         | 400    | Default UI/app text                                       |
| `body-sm`    | 0.875rem / 14px | 1.5         | 400    | Table cells, secondary UI text                            |
| `caption`    | 0.75rem / 12px  | 1.4         | 500    | Labels, timestamps, badges (uppercase, +2% tracking)      |
| `mono-data`  | 0.875rem / 14px | 1.5         | 500    | JetBrains Mono — confidence scores, IDs, embeddings, code |

**Rule:** any number that represents a _measurement_ (confidence %, latency ms, vector dimensions, IDs, timestamps) is always set in JetBrains Mono, even inline in a sentence of Inter prose. This is the single strongest recurring visual signature of the brand — it's what makes the product feel "measured" rather than "described."

### 2.4 Spacing, Radius, Elevation

**Spacing scale (4px base unit):**
`4, 8, 12, 16, 24, 32, 48, 64, 96` — no arbitrary values outside this scale.

**Radius:**
| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Badges, chips, inline controls |
| `radius-md` | 10px | Buttons, inputs, table rows |
| `radius-lg` | 16px | Cards, modals, code blocks |
| `radius-full` | 999px | Avatars, status pills |

**Elevation (app surface only — marketing uses borders/glow instead of shadow, see §4):**
| Token | Value |
|---|---|
| `shadow-sm` | `0 1px 2px rgba(16,20,30,0.06)` |
| `shadow-md` | `0 4px 12px rgba(16,20,30,0.08)` |
| `shadow-lg` | `0 12px 32px rgba(16,20,30,0.12)` |

### 2.5 Iconography

- Icon set: **Lucide** (matches stroke-based, technical aesthetic; open source; already common in Next.js/Tailwind stacks).
- Stroke width: 1.5px consistently.
- Icons are always single-color (`currentColor`) — never multi-color or filled, to preserve the "instrument, not illustration" feel.
- No custom illustration style for MVP. If custom icons are ever introduced (e.g., a face-scan glyph for enrollment), they must follow the same aperture/optics geometric motif as the logo mark — concentric arcs and crosshairs, not organic shapes.

### 2.6 Imagery & Data Visualization Style

- **No stock photography of people.** This is a deliberate, permanent rule — the product's subject matter (faces, biometric data, minors) makes generic stock photography of "smiling students" feel either dishonest or uncomfortable. Ever.
- Marketing imagery is instead: abstract bounding-box overlays on blurred/anonymized or synthetic crowd shapes, code snippets, terminal output, latency graphs, and the aperture motif.
- Bounding boxes in any real product screenshot use the confidence color mapping (§2.2) with a 2px stroke and a small `caption`-scale label (Name · Confidence%) in JetBrains Mono, anchored to the top-left corner of the box.
- Charts (attendance-over-time, latency percentiles): line charts on the marketing site use `signal-500` on `ink-900`, thin 1.5px strokes, no fill/area unless showing a range. In the app, bar/line charts use `signal-500` as primary series and grayscale for comparison series — the three confidence colors are reserved exclusively for confidence-related data, never repurposed for unrelated charts.

---

## 3. Design System — Marketing Surface (Landing Page)

**Job to be done:** convince a technical evaluator (or a registrar who asked their IT person to "look into it") that this is a serious, accurate, well-engineered product — in under 30 seconds of scrolling.

### 3.1 Layout Language

- **Dark canvas, high contrast, generous negative space.** `ink-950` background throughout — no white sections breaking up the page.
- Max content width: 1200px, centered, with 24px gutters on mobile, 64px+ on desktop.
- Section rhythm: 96–128px vertical spacing between major sections (hero, proof, features, code, pricing/CTA, footer).
- Grid: standard 12-column, but feature content favors **bento-box asymmetry** — one large tile (e.g., live demo or code block) paired with 2–3 smaller metric tiles, rather than uniform 3-up grids everywhere.

### 3.2 Signature Components

**Hero**

- Left: `display-xl` headline (max 8 words) + `body-lg` subhead (max 25 words) + primary CTA button + secondary "View docs" ghost button.
- Right or below: a live-feeling **code mockup** — a terminal/editor window (see below) showing an actual `POST /api/v1/attendance/scan` request/response pair.
- A single thin `signal-500` underglow (radial gradient, low opacity, blurred) behind the code mockup is the _only_ gradient permitted on the page — used once, in the hero, nowhere else.

**Code Mockup Window**

- Styled like a minimal code editor: `ink-800` background, `radius-lg`, `ink-700` 1px border, `shadow-lg`.
- Fake window chrome: three 8px dots (no traffic-light colors — render them in `ink-700`, not red/yellow/green, to avoid looking like a cheap template).
- Content in JetBrains Mono, 14px, with syntax highlighting restricted to 3 colors max: `signal-400` (keys/methods), `match-500` (string values), `slate-300` (punctuation/comments) — never a rainbow syntax theme.
- Include a blinking cursor or a subtle "streaming" animation on load to reinforce "live API," but only once per page load, never looping indefinitely (avoid distraction).

**Metric / Bento Tiles**

- `ink-900` background, `radius-lg`, 1px `ink-700` border, 32px padding.
- Each tile: one `mono-data` styled number (e.g., "99.38%", "<280ms", "128-d") as the focal point, with a `body-sm` slate-300 label beneath it. No icons inside metric tiles — the number _is_ the icon.
- On hover: border transitions from `ink-700` to `signal-500` at 40% opacity, no scale/transform (avoid "SaaS template" bounce effects).

**Feature Rows**

- Alternating text-left/visual-right and text-right/visual-left, not stacked cards. Each feature gets its own full-width row with generous breathing room — this is what separates "premium infra" from "generic SaaS grid."
- Visual side shows either an annotated bounding-box screenshot or a minimal architecture diagram (nodes connected by 1px `ink-700` lines, active node highlighted in `signal-500`).

**Buttons (marketing)**

- Primary: `signal-500` fill, white text, `radius-md`, 44px height, no shadow, subtle brightness-up on hover (no scale transform).
- Secondary/Ghost: transparent fill, `ink-700` border, `text/primary` color, border brightens to `slate-300` on hover.
- Never use gradient-filled buttons.

**Footer**

- Minimal, `ink-950`, single row of text links, no newsletter signup forms, no social icon soup. A footer for an infra product looks like `/status`, `/docs`, `/security`, `/changelog` — not marketing fluff.

### 3.3 Motion (Marketing only)

- Entrance: content fades up 8px on scroll into view, 200ms ease-out, staggered 60ms between siblings. Never more than that — no parallax, no 3D tilt, no confetti.
- The one exception is the hero code mockup's streaming-text effect described above.

---

## 4. Design System — Application Surface (Dashboard)

**Job to be done:** let an administrator enroll a student or upload a class photo and get to a trustworthy answer ("who was here, who wasn't, who needs review") in the fewest possible clicks, with zero ambiguity about confidence.

This surface deliberately looks and behaves like an **operations console**, not a marketing product — closer in spirit to a Stripe Dashboard or Linear than to the landing page's terminal aesthetic.

### 4.1 Layout Language

- **Light theme, `paper-0` background**, persistent left sidebar (240px, collapsible to 64px icon rail), top bar reserved only for breadcrumbs/search/account — no marketing chrome.
- Content max-width is fluid (dashboards use full width for tables), not capped at 1200px like marketing.
- Density over whitespace: 16–24px internal padding on cards (vs. 32px+ on marketing tiles) — this surface optimizes for scanning many rows, not admiring one hero.

### 4.2 Navigation

Sidebar sections, in order:

1. **Overview** — attendance summary, recent sessions
2. **Sessions** — upload a class photo → review results
3. **Roster** — enroll/manage students
4. **Courses** — map sessions to courses/departments
5. **Logs** — historical attendance records, exportable
6. **Settings** — API keys, thresholds, integrations

Active nav item: `signal-100` background pill, `signal-500` text/icon, `radius-md`. Inactive: `slate-500` text, `currentColor` Lucide icon, no background.

### 4.3 Signature Components

**Session Upload / Review Screen** (the core workflow)

- Left: uploaded classroom photo, full bleed within a `radius-lg` frame.
- Bounding boxes drawn directly on the image using the confidence color mapping (§2.2), 2px stroke, corner label in `mono-data` caption size showing `Name · 94%` or `Unknown` for unmatched faces.
- Right: a scrollable results list mirroring each detected face as a row — avatar crop, name (or "Unknown"), confidence badge, and a manual override control (dropdown to reassign/confirm identity).
- Sticky summary bar above the list: `mono-data` counts — "24 recognized · 2 review · 1 unknown" — using `match-500`, `flag-500`, `error-500` dots respectively.
- Primary action: "Confirm Session" button, disabled until all `flag`/`error` rows are either confirmed or explicitly marked "guest/absent" — the UI should never let an admin silently ignore a low-confidence match.

**Confidence Badge** (reused everywhere: tables, review screen, logs)

```
[ ● 96% ]   → match-100 bg, match-500 dot + text, radius-full, mono-data caption size
[ ● 78% ]   → flag-100 bg, flag-500 dot + text
[ ● —   ]   → error-100 bg, error-500 dot, text "Unknown"
```

**Data Tables** (Roster, Logs)

- `paper-0` background, `paper-100` 1px row dividers, no zebra striping (relies on hover state instead: `paper-50` row hover).
- Header row: `caption` style, `slate-500`, uppercase, sticky on scroll.
- Row height: 48px default, 40px "compact" mode toggle for power users reviewing long logs.
- IDs, timestamps, embedding-dimension counts, and confidence scores are always `mono-data` — this is the same rule as marketing (§2.3), and is what visually ties the two surfaces together despite the light/dark split.

**Enrollment Flow**

- Stepped form (not a single long page): 1) Student metadata → 2) Reference photo capture/upload → 3) Embedding confirmation preview (show the cropped, aligned face the model actually used, so admins can catch a bad photo before it pollutes the database).
- Step indicator: simple numbered dots connected by a line, active step in `signal-500`, completed steps in `match-500` checkmarks.

**Cards (Overview metrics)**

- `paper-50` background, `paper-100` border, `radius-lg`, `shadow-sm`.
- Structurally similar to marketing's metric tiles but denser (16px padding vs 32px) and multiple per row (up to 4 on desktop) since the job here is quick scanning, not a single hero stat.

**Buttons (app)**

- Primary: `signal-500` fill, white text, `radius-md`, 36–40px height (smaller than marketing's 44px — app buttons are workhorses, not hero CTAs), `shadow-sm`.
- Destructive (e.g., "Delete student record"): `error-500` fill or `error-500` text with `error-100` hover background for lower-emphasis destructive actions.
- Disabled state: `paper-100` fill, `slate-300` text, no pointer cursor.

**Toasts / Inline Alerts**

- Success: `match-100` bg, `match-500` left border accent (4px), `match-500` icon.
- Warning ("3 faces need review"): `flag-100` / `flag-500`.
- Error: `error-100` / `error-500`.
- Position: top-right, stacked, auto-dismiss success after 4s; warnings/errors persist until dismissed.

### 4.4 States & Feedback Principles

- **Never show a bare percentage without its color mapping** — a number alone ("87%") is ambiguous; the badge/dot is mandatory context every time a confidence score appears anywhere in the app.
- **Loading states** for ML processing (face detection/matching) should show real progress language, not generic spinners where avoidable: "Detecting faces…" → "Matching 24 faces against roster…" → "Done." This reflects the multi-step pipeline honestly and reinforces the "precise" personality trait even in a loading state.
- **Empty states** always include the specific next action, never just an illustration: "No students enrolled. Add your first student to begin taking attendance."

### 4.5 Motion (App only)

- Functional only: 120–150ms ease for hover/focus transitions, no entrance animations on data (tables/cards render immediately — animating in rows on every load feels slow at scale).
- The one deliberate animated moment in the entire app is the bounding-box draw-on for the Session Review screen: boxes draw in with a quick 300ms stroke animation when results first return, because that moment _is_ the product's core value proposition made visible, and it's worth half a second of delight.

---

## 5. Component Token Summary (for Tailwind config)

```js
// tailwind.config.js — color extension (excerpt)
colors: {
  ink: {
    950: '#08090B', 900: '#111318', 800: '#1A1D24', 700: '#272B33',
  },
  paper: {
    0: '#FFFFFF', 50: '#F7F8FA', 100: '#EEF0F3',
  },
  slate: {
    300: '#9AA1AC', 500: '#6B7280',
  },
  signal: {
    100: '#E8ECFF', 400: '#7389FF', 500: '#4F6BFF',
  },
  match: { 100: '#DEF7EA', 500: '#1AAE6F' },
  flag:  { 100: '#FBF0D4', 500: '#E2A400' },
  error: { 100: '#FBE1E1', 500: '#E5484D' },
},
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
},
borderRadius: {
  sm: '6px', md: '10px', lg: '16px', full: '999px',
},
```

---

## 6. What Ties It All Together

If every other section of this document were deleted, these three rules should survive, because they _are_ the brand:

1. **Every measured number (confidence, latency, dimensions, IDs, timestamps) is set in JetBrains Mono, everywhere, on both surfaces.**
2. **The three-tier confidence color system (`match` / `flag` / `error`) is the only place color carries meaning beyond brand accent — it is never reused for anything unrelated to recognition confidence.**
3. **No stock photography of people, no gradients beyond the single hero underglow, no mascots, no exclamation points.** Precision is the aesthetic.
