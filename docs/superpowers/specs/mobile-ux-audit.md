# MyRegApp Mobile UI/UX Audit

**Date:** April 6, 2026
**Device emulated:** iPhone 14 Pro (393x852, 3x DPR, touch)
**Modes tested:** Dark, Light, Landscape, Offline
**Tools:** Chrome DevTools MCP, Lighthouse (mobile), Vercel Web Interface Guidelines

---

## Lighthouse Scores (Mobile)

| Category | Score |
|----------|-------|
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |

---

## Findings Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High | 5 |
| Medium | 15 |
| Low | 9 |

---

## Critical Issues

### C1. Color Contrast Failures in Light Mode
**Lighthouse audit: `color-contrast` (score 0)**

Multiple elements fail WCAG AA 4.5:1 contrast in light mode:

| Element | Foreground | Background | Ratio | Required |
|---------|-----------|------------|-------|----------|
| "20 REGULATIONS" heading (`--text4`) | `#6b7280` | `#f5f5f0` | 4.42:1 | 4.5:1 |
| Category headers (CAPITAL, etc.) | `#9ca3af` | `#f5f5f0` | 2.32:1 | 4.5:1 |
| "2 pending" badges | `#facc15` | `#efebd8` | 1.27:1 | 4.5:1 |
| Card summary text (`--text3`) | `#64748b` | `#eeeee9` | 4.08:1 | 4.5:1 |

**Fix:** Darken `--text3`, `--text4` in light theme. Change pending badge to darker amber text on light background (e.g., `#92400e` on `#fef3c7`).

### C2. No `prefers-reduced-motion` Support
**Lines:** CSS keyframes (33-36), inline transitions throughout

The app defines `fadeUp`, `fadeIn`, `dropSlide` keyframe animations and uses `transition` on dozens of elements, but has zero `prefers-reduced-motion` media query handling. Users with vestibular disorders or motion sensitivity have no way to reduce animations.

**Fix:** Add a single CSS rule:
```css
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:0.01ms!important;
    transition-duration:0.01ms!important;
  }
}
```

### C3. Cross-Reference Links Are Non-Semantic `<span onClick>`
**Line:** 384

`ref-link` elements render as `<span className="ref-link" onClick={...}>` instead of `<a href>` or `<button>`. They:
- Are not keyboard-focusable
- Cannot be right-clicked to "Open in new tab"
- Are invisible to screen readers as interactive elements
- Don't support Cmd/Ctrl+click

**Fix:** Convert to `<a href={"#/regulations/"+parts[i]}>` with click handler for SPA navigation.

---

## High Issues

### H1. Inline `outline: none` on Search Inputs
**Lines:** 429, 467, 1179

All three search inputs have `outline:"none"` in inline styles, which suppresses the default focus ring. The `.search-input:focus` CSS rule provides a border-color + box-shadow, but:
- Uses `:focus` not `:focus-visible`
- The border change alone may not meet WCAG focus indicator requirements
- Inline styles override any CSS outline

**Fix:** Remove inline `outline:"none"`. Use `:focus-visible` in CSS for the border/shadow treatment.

### H2. `aria-label` Does Not Match Visible Text on Regulation Cards
**Lighthouse audit: `label-content-name-mismatch`**

Regulation cards have `aria-label="Basel III Endgame"` but the visible text includes emoji, description text, and pending badges. The `aria-label` overrides the entire accessible name, hiding the visible content from screen readers.

Similarly, the Overview card has `aria-label="Overview — capital stacks, deep dives, and quick links"` but the visible text differs.

**Fix:** Remove the `aria-label` from reg cards and let the visible text content serve as the accessible name. Or use `aria-labelledby` pointing to the title element.

### H3. `transition: all` Used in 6+ Places
**Lines:** 44, 47, 48, 49, 50, 93, plus inline styles at 669, 768, 1073

Using `transition: all` is an anti-pattern that:
- Transitions layout-triggering properties (width, height, padding)
- Can cause unexpected visual jank
- Wastes GPU resources

**Fix:** Replace with specific properties: `transition: border-color .15s, box-shadow .15s, transform .15s`.

### H4. Missing `touch-action: manipulation` on Interactive Elements
No `touch-action: manipulation` is applied to buttons, links, or inputs. This causes the 300ms tap delay on some mobile browsers and allows double-tap-to-zoom on interactive elements.

**Fix:** Add to CSS: `button, a, input { touch-action: manipulation; }`

### H5. Missing `overscroll-behavior: contain` on Drawer and More Sheet
**Lines:** 82 (`.drawer-panel`), 92 (`.more-sheet-panel`)

When scrolling inside the drawer or More sheet, scroll can chain to the body behind, causing unwanted background scrolling.

**Fix:** Add `overscroll-behavior: contain` to `.drawer-panel` and `.more-sheet-panel`.

---

## Medium Issues

### M1. Missing `aria-live` for Dynamic Search Results Count
**Lines:** 891, 910

When filtering regulations/glossary, the result count updates dynamically ("20 Regulations" -> "3 Regulations") but is not announced to screen readers.

**Fix:** Add `aria-live="polite"` to the results count heading or wrap it in a live region.

### M2. Font Size Buttons Lack Descriptive `aria-label`
**Lines:** 458, 1514

Font size controls show "A⁻", "A", "A⁺" but have no `aria-label` explaining their function (e.g., "Small font size").

**Fix:** Add `aria-label="Small font size"`, `aria-label="Medium font size"`, `aria-label="Large font size"`.

### M3. `tabpanel` Missing `aria-labelledby` / Tabs Missing `aria-controls`
**Lines:** 549, 607

Desktop subsection tabs use `role="tab"` without `aria-controls`, and the content panel uses `role="tabpanel"` without `aria-labelledby`. This breaks the ARIA tab pattern for screen readers.

**Fix:** Add matching `id`/`aria-controls`/`aria-labelledby` attributes.

### M4. Missing `color-scheme: dark` on HTML Element
**Line:** 18

The root element sets dark-mode CSS variables but never declares `color-scheme: dark`. Without this, native UA elements (scrollbars, form controls) render in light mode.

**Fix:** Add `color-scheme: dark` to `:root` and `color-scheme: light` to `[data-theme="light"]`.

### M5. `getComputedStyle` Called During Render
**Line:** 984

The `cssVar()` function calls `getComputedStyle(document.documentElement)` during component render (used by chart components). This forces style recalculation on every render.

**Fix:** Cache CSS variable values in a `useEffect`/`useLayoutEffect` or use a React context.

### M6. Search Inputs Use `type="text"` Instead of `type="search"`
**Lines:** 429, 467, 1179

Using `type="search"` provides better semantics, shows a "Search" keyboard button on mobile, and provides a native clear button.

**Fix:** Change `type="text"` to `type="search"` and add `autocomplete="off"`.

### M7. Search Inputs Missing `autocomplete` Attribute
**Lines:** 429, 467, 1179

Without `autocomplete="off"`, browsers may show autofill suggestions that interfere with the custom search.

### M8. "Back to All Regulations" Buttons Should Be Links
**Lines:** 756, 871

Navigation actions that change the URL should use `<a>` elements for proper semantics (right-click, middle-click, screen reader announcement).

### M9. Overview Bar Chart Labels Truncated on Mobile
**Screenshot 09**

In the Overview page, capital stack bar labels truncate ("SCB (firm-spec...", "CCyB (currentl...") because the bars and labels compete for horizontal space on 393px width.

**Fix:** Consider shorter labels on mobile (e.g., "SCB" instead of "SCB (firm-specific)"), or stack labels above bars, or use a tooltip on tap.

### M10. Pending Change Badge Yellow Text on Yellow-ish Background
**Screenshot 07**

The "2 pending" / "1 pending" badges use yellow text (`#facc15`) on a beige card background (`#efebd8`), resulting in a contrast ratio of only 1.27:1.

**Fix:** Use darker amber text (e.g., `#92400e`) or add a darker background to the badge.

### M11. No Visible Offline Banner on Mobile
**Screenshot 13**

When tested in offline mode, the app loaded from service worker cache but no offline indicator was visible to the user. The `OfflineBanner` component exists but may not be rendering properly in mobile emulation, or its positioning relative to the bottom tab bar may cause it to be obscured.

**Fix:** Verify the offline banner renders and is visible above the bottom tab bar.

### M12. Drawer Category Labels Repeat Across Groups
**Snapshot analysis**

The drawer navigation shows "CAPITAL" appearing 3 times, "LIQUIDITY" appearing 2 times, and "STRUCTURAL & PRUDENTIAL" appearing 2 times because regulations are listed in a non-grouped order that repeats category headers.

**Fix:** Group regulations by category in the drawer so each category header appears only once.

### M13. Glossary Term Count Inconsistency
**Screenshots 05 vs 06**

The More sheet says "87 regulatory terms defined" but the Glossary view heading says "101 terms". The glossary has grown but the More sheet description wasn't updated.

**Fix:** Make the count dynamic: reference the actual glossary length instead of a hardcoded "87".

### M14. Glossary View Has No Search on Mobile
**Screenshot 06**

The Glossary view shows a long scrollable list of 101 terms but no visible search/filter input on mobile (unlike desktop which may have one in the sidebar). Users must scroll through the entire list.

**Fix:** Add a sticky search/filter input at the top of the glossary on mobile.

### M15. Timeline View Renders 155 Events Without Virtualization
**Snapshot analysis**

The Timeline renders all 155 events in the DOM at once. While manageable now, this could grow and impact scroll performance on lower-end devices.

**Fix:** Consider `content-visibility: auto` for off-screen timeline entries.

---

## Low Issues

### L1. Heading Hierarchy Inconsistencies
Multiple `<h2>` elements at the same level across views. Inside `SubContent`, headings jump from `<h2>` (regulation title) to `<h4>` (KEY POINTS) in some cases.

### L2. Tab Bar Labels Are Abbreviations
"Regs" instead of "Regulations" in `aria-label`. While space-constrained visually, the `aria-label` could use the full word.

### L3. Overlay Divs with `onClick` But No ARIA Role
Drawer/sheet overlay dismiss targets are `<div onClick>` without `role="button"`. Low severity since Escape key dismissal exists as an alternative.

### L4. Missing `tabular-nums` on Numeric Displays
B3E impact percentages and other numeric values could benefit from `font-variant-numeric: tabular-nums` for better alignment.

### L5. Missing `text-wrap: balance` on Headings
View titles and regulation headings could use `text-wrap: balance` for more visually appealing line breaks on narrow viewports.

### L6. Regulation Titles Could Overflow Without Truncation
Long regulation titles in the detail view header have no overflow handling. "Capital Planning Guidance (SR 15-18/19)" wraps naturally but very long custom titles could theoretically overflow.

### L7. Timeline Regulation Buttons Have No Consistent Touch Target
Timeline regulation tag buttons (e.g., "Reg W", "CRA") are small pill-shaped elements. While they have padding, their touch targets may be smaller than the 44px minimum in some cases.

### L8. Scroll Position Not Preserved on View Changes
Navigating between views (Regs -> Changes -> back to Regs) may lose scroll position context.

### L9. No `scroll-margin-top` on Heading Anchors
If heading anchors are linked to directly, they may scroll behind the fixed navbar without `scroll-margin-top`.

---

## Positive Observations

The app does many things well on mobile:

- **Touch targets:** Most interactive elements meet the 44px minimum (buttons, tab bar, drawer items)
- **Safe area handling:** Comprehensive `env(safe-area-inset-*)` usage for notched devices
- **No zoom restriction:** Viewport meta correctly allows user scaling
- **Skip link:** "Skip to content" link is present
- **Hash-based routing:** URL reflects state for deep linking and back/forward navigation
- **Keyboard accessibility in modals:** Drawer and More sheet support Escape key and focus trapping
- **Responsive font sizing:** User-controllable A-/A/A+ with localStorage persistence
- **PWA support:** Service worker with network-first strategy for content freshness
- **Print stylesheet:** Comprehensive print styles hiding interactive elements
- **Dark/light mode:** Full theme support with CSS custom properties
- **Content truncation:** Regulation card summaries correctly use `-webkit-line-clamp`

---

## Consistency Map — All Locations Per Fix

Several findings appear in multiple places. This map ensures every instance is fixed consistently.

### `transition: all` (H3) — 22 instances
**CSS rules (5):**
- Line 44: `.src-link`
- Line 47: `.action-btn`
- Lines 48-50: `.wc-card:hover`, `.gl-card:hover`, `.reg-card:hover`
- Line 93: `.overview-card`

**Inline styles (17):**
- Line 449: Nav tab button
- Line 454: Settings button
- Line 458: Font size buttons (desktop)
- Line 525: Dropdown button
- Line 537: Dropdown option button
- Line 549: Subsection tab button
- Line 669: Endgame explorer button
- Line 686: Backlink buttons
- Line 736: Reg select button (mobile)
- Line 768: Endgame explorer button (mobile detail)
- Line 785: Backlink buttons (mobile detail)
- Line 1073: Expandable card
- Line 1082: Arrow icon
- Line 1402: Chart button
- Line 1415: Link button
- Line 1514: Font size buttons (mobile More sheet)

**Fix:** Replace each with explicit properties (e.g., `transition: border-color .15s, box-shadow .15s, transform .15s`).

### `outline: "none"` (H1) — 3 instances
- Line 429: Desktop search input
- Line 467: Mobile search input
- Line 1179: B3E Explorer search input

**Fix:** Remove all three. Ensure `.search-input:focus-visible` CSS provides visible focus.

### `type="text"` on search inputs (M6) — 3 instances
- Line 429: Desktop search
- Line 467: Mobile search
- Line 1179: B3E Explorer search

**Fix:** Change all to `type="search"` and add `autocomplete="off"`.

### Missing `aria-label` on buttons (M2) — 13 buttons
- Line 449: Nav tab buttons (have `title` but no `aria-label`)
- Line 458: Font size buttons in desktop settings
- Line 461: Theme toggle button in desktop settings
- Line 537: Subsection option buttons in dropdown
- Line 549: Subsection tab buttons (desktop)
- Line 686: Backlink/cross-ref buttons
- Line 785: Backlink buttons (mobile detail view)
- Line 1289: Timeline era filter buttons
- Line 1294: Timeline "All regulations" button
- Line 1296: Timeline regulation filter buttons
- Line 1402: Chart/explorer buttons (Overview)
- Line 1415: Quick link buttons (Overview)
- Line 1514: Font size buttons in mobile More sheet
- Line 1517: Theme toggle in mobile More sheet

**Note:** Many of these have visible text so `aria-label` isn't strictly required — but the font size buttons (458, 1514) and theme toggles (461, 1517) are the priority fixes since their visual text is ambiguous.

### Missing `aria-live` on dynamic counts (M1) — 3 locations missing
- Line 891: Regulation count heading (desktop sidebar) — **MISSING**
- Line 910: Regulation count heading (mobile) — **MISSING**
- Line 1302: Timeline event count — **MISSING**
- Line 1197: B3E Explorer search results — already has `aria-live="polite"` (use as reference pattern)

### `overscroll-behavior: contain` (H5) — priority containers
Must-fix (modal/drawer/sheet):
- Line 82: `.drawer-panel` (CSS)
- Line 92: `.more-sheet-panel` (CSS)
- Line 535: Subsection dropdown listbox (inline)

Should-fix (nested scroll areas):
- Line 41: `.tooltip` (CSS)
- Line 908: Sidebar scroll area (inline)
- Line 922: Detail column scroll area (inline)

### Hardcoded glossary count (M13) — 1 location
- Line 1491: `desc:"87 regulatory terms defined"` in More sheet config

**Fix:** Replace with `desc: Object.keys(G).length + " regulatory terms defined"`.

### `onClick` on non-semantic elements (C3, L3) — 9 instances
Critical (navigation — should be `<a>`):
- Line 384: `ref-link` span

Low (overlays — dismiss targets with Escape key alternative):
- Line 533: Dropdown overlay div
- Line 722: Drawer overlay div
- Line 1495: More sheet overlay div

OK (have `role="button"` + `tabIndex`):
- Line 395: Glossary term span (has `role="button"`, `tabIndex={0}`)
- Line 1074: Expandable card div (has `role="button"`, `aria-controls`)
- Line 1310: Timeline reg span (has `role="button"`, `tabIndex={0}`)
- Line 1334: Interactive div (has conditional `role="button"`)

### `role="tab"` / `role="tabpanel"` pairing (M3) — incomplete
- Line 549: `role="tab"` — **missing `aria-controls`**
- Line 607: `role="tabpanel"` — **missing `id` and `aria-labelledby`**
- Line 1207: `role="tabpanel"` — has `aria-labelledby` (use as reference)

---

## Top 5 Recommended Fixes (Priority Order)

1. **Fix color contrast in light mode** (C1) — Accessibility compliance, affects all users in light mode
2. **Add `prefers-reduced-motion` support** (C2) — Accessibility requirement, single CSS rule fix
3. **Convert cross-ref spans to proper links** (C3) — Accessibility + usability, enables right-click/Cmd+click
4. **Fix pending badge contrast** (M10/C1) — Currently unreadable at 1.27:1 ratio
5. **Add `touch-action: manipulation`** (H4) — Eliminates 300ms tap delay on mobile
