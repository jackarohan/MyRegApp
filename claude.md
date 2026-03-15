# MyRegApp — Claude Project Context

## What This Is

MyRegApp is a free Progressive Web App (PWA) — a searchable reference guide to U.S. banking capital and liquidity regulations. It covers 20 regulations across capital, liquidity, structural/prudential, and legislative categories. The app is a side project by Jack Rohan (jackarohan@gmail.com), deployed as a static site on Netlify.

**Live features:** cross-references between regulations, calculation deep dives with worked examples, structured data tables, a glossary with tooltip system, a "What's Changing" section with timeline view, dark/light mode, print stylesheet, PWA/offline support.

**Current version:** v6.2 (content current as of March 2026).

---

## Architecture

### Stack
- **Frontend:** React 18 (via CDN) with in-browser Babel compilation — no build step
- **Entry point:** Single `index.html` (~975 lines) containing all CSS, React components, and app logic
- **Data files:** Three JS files loaded via `<script>` tags, each exporting a global variable:
  - `data/regulations.js` → `const R = [...]` (array of regulation objects)
  - `data/glossary.js` → `const G = {...}` (term → definition map, ~87 terms)
  - `data/whatschanging.js` → `const WC = [...]` (array of upcoming regulatory changes) + `const ST = {...}` (status badge config)
- **PWA:** `sw.js` (service worker) + `manifest.json` + icon PNGs at root
- **Fonts:** DM Sans + DM Mono via Google Fonts CDN
- **Hosting:** Netlify static deployment (no server, no database)

### Deployment File Structure
```
/
├── index.html
├── sw.js
├── manifest.json
├── icon192.png
├── icon512.png
└── data/
    ├── regulations.js
    ├── glossary.js
    └── whatschanging.js
```

> **CRITICAL:** Data files must live ONLY in `data/`. Duplicating them at root causes black-screen deployment failures. The service worker's `APP_SHELL` array references `/data/regulations.js`, `/data/glossary.js`, `/data/whatschanging.js`.

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

### Theming
- CSS custom properties on `:root` (dark) and `[data-theme="light"]` (light)
- Color palette: amber (`#f59e0b`) as accent on dark (`#0a0a0e`) background
- Font sizing uses CSS custom properties (`--text-xs` through `--text-xl`) in relative `em` units
- Icon and structural sizes remain fixed in `px`

### Unicode in JSX
`\uXXXX` escape sequences in JSX text content and string attributes render literally as the escape string. Always use actual Unicode characters instead (e.g., `—` not `\u2014` in JSX text, though `{"\u2014"}` in JSX expressions is fine).

---

## Data File Schemas

### regulations.js — `R` array
```js
{
  id: "cap-adequacy",       // URL-safe slug, used in hash routes and cross-refs
  cat: "Capital",            // Category: "Capital" | "Liquidity" | "Structural & Prudential" | "Legislative"
  title: "Capital Adequacy Requirements",  // Full display title
  st: "Capital Adequacy",   // Short title for nav/sidebar
  icon: "🏛",               // Emoji icon
  sum: "...",                // One-paragraph summary
  subs: [                    // Ordered array of subsections
    {
      t: "Overview",         // Subsection title
      c: ["...", "..."],     // Array of content paragraphs (may contain {{ref:id}} tags and glossary terms)
      kp: ["...", "..."],    // Key points (bullet summaries)
      cite: [{type, auth, pin}],  // Optional regulatory citations
      calc: { ... }          // Optional calculation deep-dive object
    }
  ]
}
```

### glossary.js — `G` object
```js
{ "CET1": "Common Equity Tier 1 capital. The highest-quality...", ... }
```
Plain key-value: term → definition string.

### whatschanging.js — `WC` array + `ST` object
```js
// WC entries:
{ date: "Apr 1, 2026", status: "final", title: "...", reg: "eslr", desc: "..." }
// status values: "final" | "expected" | "deadline" | "proposed" | "effective"

// ST: status badge display config
{ final: { label, color, bg }, ... }
```

---

## React Component Map

| Component | Role |
|---|---|
| `App` | Root. Manages view state, theme, search, hash routing |
| `NavBar` | Top nav with view tabs, search input, theme/font controls |
| `RegulationsView` | Main content view. Sidebar list + detail panel with subsections |
| `StartHereView` | Landing page with category cards |
| `WhatsChangingView` | Upcoming regulatory changes list |
| `TimelineView` | Visual timeline of regulation history |
| `GlossaryView` | Searchable glossary grid |
| `ErrorBoundary` | Class component catch-all for render errors |
| `OfflineBanner` | Fixed banner shown when navigator is offline |
| `SmartText` | Parses `{{ref:id}}` cross-references and renders glossary term tooltips |

---

## Version Bump Checklist

When updating the version number, ALL of these must be updated together:
1. **Footer** in `index.html` — `MyRegApp v6.x`
2. **File headers** — comment at top of `index.html`, `regulations.js`, `glossary.js`, `whatschanging.js`
3. **Service worker** — `CACHE_VERSION` in `sw.js`
4. **Content date** — footer text ("Content current as of ...") and `<meta name="description">` in `<head>`

---

## Content Update Guidelines

- Always verify regulatory content accuracy via web search before making edits
- The "What's Changing" section (`whatschanging.js`) tracks upcoming regulatory milestones — update dates, statuses, and descriptions as events unfold
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
