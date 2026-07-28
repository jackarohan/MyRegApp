# MyRegApp — Claude Project Context

## What This Is

MyRegApp is a free Progressive Web App (PWA) — a searchable reference guide to U.S. banking capital and liquidity regulations. It covers 20 regulations across capital, liquidity, structural/prudential, and legislative categories. The app is a side project by Jack Rohan (jackarohan@gmail.com), deployed as a static site on Netlify.

**Live features:** cross-references between regulations, calculation deep dives with worked examples, structured data tables, a glossary with tooltip system, a regulatory Timeline (historical + outlook), the Basel III Endgame Explorer (a labeled snapshot of the March 2026 reproposal), dark/light mode, print stylesheet, PWA/offline support.

**Current version:** v8.0.0 (content as of July 2026 — see `META` in `data/regulations.js`).

**Design stance:** the site is a *static reference through time*, not a news site. Content is written to stay true without maintenance (see `docs/content-style-guide.md`). There is exactly one freshness anchor — `META.asOf` — and no "new"/"pending"-style live signals.

---

## Architecture

### Stack
- **Frontend:** React 18 (via CDN) with in-browser Babel compilation — no build step
- **Entry point:** Single `index.html` (~1,640 lines) containing all CSS, React components, and app logic
- **Data files:** Three JS files loaded via `<script>` tags, each exporting a global variable:
  - `data/regulations.js` → `const META = {version, asOf}` + `const R = [...]` (array of regulation objects)
  - `data/glossary.js` → `const G = {...}` (term → definition map, ~101 terms)
  - `data/basel3explorer.js` → `const B3E = {...}` (Endgame Explorer sections/changes data)
- **PWA:** `sw.js` (service worker) + `manifest.json` + icon PNGs at root
- **Fonts:** DM Sans + DM Mono via Google Fonts CDN
- **Hosting:** Netlify static deployment (no server, no database)

### Deployment File Structure

> **CRITICAL:** Data files must live ONLY in `data/`. Duplicating them at root causes black-screen deployment failures. The service worker's `APP_SHELL` array references `/data/regulations.js`, `/data/glossary.js`, `/data/basel3explorer.js`.

### Views
`RegulationsView` (browse + detail), `TimelineView` (single chronology, built from `reg.timeline` data), `BaselExplorer`, `GlossaryView`. Desktop nav: Regulations · Timeline · Basel Explorer · Glossary. Mobile bottom tabs: Regs · Timeline · Glossary · More (Explorer lives in the More sheet). Legacy `#/changing` hashes redirect to the Timeline.

---

## Key Patterns & Conventions

### Cross-References
Regulation content uses `{{ref:regId}}` tags in text strings. The `SmartText` component parses these and renders them as clickable links that navigate to the referenced regulation. A `stripRefTags()` utility strips them for plain-text contexts (search, print).

### Glossary Tooltips
Terms in content are wrapped in `<span class="gterm">` elements. The tooltip system uses `ReactDOM.createPortal` with `getBoundingClientRect()`-based positioning and an inline arrow `<span>` (not CSS `::after` pseudo-elements).

### Navigation
- Hash-based routing (`#regId` and `#regId/subsectionIndex`)
- A `navTick` state counter pattern prevents cursor-flickering `useEffect` bugs — increment `navTick` to trigger navigation side effects rather than depending on the target ID directly
- `navTarget` ref holds the pending regulation ID for cross-view navigation

### State Persistence
- `usePersistedState` hook wraps `localStorage` with `mra_` key prefix
- Persisted: theme, font size, last viewed regulation
- The `ls()` / `lsSet()` helpers handle JSON parse/stringify with try/catch

### Subsection Navigation
Uses multi-layer defensive guards: clamping, fallbacks, and null checks to prevent out-of-bounds crashes when navigating subsections.

### Subsection Badges
`SUB_BADGES` in `index.html` keys badges on the sub's `kind` field (`requirements` / `calc` / `outlook`) — never on title strings, which silently break on typographic changes.

### Theming
- CSS custom properties on `:root` (dark) and `[data-theme="light"]` (light)
- Color palette: amber (`#f59e0b`) as accent on dark (`#0a0a0e`) background
- Font sizing uses CSS custom properties (`--text-xs` through `--text-xl`) in relative `em` units
- Icon and structural sizes remain fixed in `px`

### Unicode in JSX
`\uXXXX` escape sequences in JSX text content and string attributes render literally as the escape string. Always use actual Unicode characters instead (e.g., the real `—` character, not the six characters `\u2014`, in JSX text — though a `{"\u2014"}` JSX expression is fine).

---

## Data File Schemas

### regulations.js — `META` + `R` array
```js
const META = {version: "8.0.0", asOf: "July 2026"};  // single source for footer version + as-of date

// R entries:
{
  id: "cap-adequacy",       // URL-safe slug, used in hash routes and cross-refs
  cat: "Capital",            // "Capital" | "Liquidity" | "Structural & Prudential" | "Legislation & Community"
  title: "Capital Adequacy Requirements",  // Full display title
  st: "Capital Adequacy",   // Short title for nav/sidebar
  icon: "🏛",               // Emoji icon
  sum: "...",                // One-sentence abstract (must NOT restate Overview's first paragraph)
  subs: [                    // Canonical order: Overview → Scope & Applicability → Requirements
    {                        //   → How It's Calculated (optional) → Key Concepts → Outlook
      kind: "requirements",  // Optional: "requirements" | "calc" | "outlook" — drives badges + Outlook timeline block
      t: "Overview",         // Subsection title
      c: ["...", "..."],     // Content paragraphs (may contain {{ref:id}} tags and glossary terms)
      kp: ["...", "..."],    // Key points (skim layer — intentionally restates paragraphs)
      cite: [{type, auth, pin}],  // Optional regulatory citations
      tables: [{...}]        // Optional structured tables
    }
  ],
  timeline: [                // Per-reg chronology; feeds both TimelineView and the Outlook section's Key Dates block
    {y: 2026, m: 3, day: 19, label: "..."},                       // historical fact (m/day optional)
    {y: 2026, m: 11, label: "...", kind: "outlook", display: "Q4 2026"}  // forward-looking as of META.asOf
  ],
  src: [{t, d, u}]           // Source documents, rendered as a block at the bottom of the reg (not a subsection)
}
```
Timeline sort key is computed as `y*10000 + (m||6)*100 + (day||0)`; `display` overrides date formatting for ranges/quarters.

### glossary.js — `G` object
```js
{ "CET1": "Common Equity Tier 1 capital. The highest-quality...", ... }
```
Plain key-value: term → definition string.

---

## Version Bump Checklist

When updating the version number or as-of date, use the `version-bump` skill. `META` in `data/regulations.js` is the single source for the UI; the service worker cache version and file headers move with it. **Changing `META.asOf` is a content event** — it requires re-verifying every Outlook section and outlook timeline entry, not just editing the label.

---

## Content Update Guidelines

- **Follow `docs/content-style-guide.md`** — the timeless-writing rules (past-anchored dates, no live deadlines, anchored expectations only, single-ownership dedup) govern all content edits
- Always verify regulatory content accuracy via web search before making edits; log verified facts in `docs/factcheck-*.md`
- Forward-looking material lives ONLY in Outlook subsections and `kind:"outlook"` timeline entries, anchored to `META.asOf`
- Glossary terms referenced in regulation content should have matching entries in `glossary.js`
- Cross-references (`{{ref:regId}}`) must use valid `id` values from the `R` array

---

## Deliverables

- Deliverables are zip archives structured for direct Netlify deployment (matching the file structure above)
- Jack reviews proposed action plans before approving implementation
- Prefer concise, complete documentation that a developer could execute independently

---

## Don'ts

- **Don't suggest a database or backend** — the static Netlify architecture is intentional and working
- **Don't duplicate data files at root** — they belong only in `data/`
- **Don't use `\uXXXX` escapes in JSX text** — use real Unicode characters
- **Don't use CSS `::after` for tooltip arrows** — the tooltip system uses inline `<span>` elements via `createPortal`
- **Don't skip defensive guards** on subsection index navigation — always clamp and null-check
- **Don't reintroduce freshness signals** — no "NEW"/"UPDATED"/"pending" badges, counters, or unanchored future tense; `META.asOf` is the only clock
- **Don't key UI on subsection title strings** — use the `kind` field
