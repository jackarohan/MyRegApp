# MyRegApp Site Test -- Findings Report (2026-04-11)

**Target:** https://myreg.app/
**Viewports tested:** Desktop (1440x900), Mobile (375x812)
**Tools used:** Chrome DevTools MCP, Playwright MCP, Lighthouse

---

## Executive Summary

- **Total issues found: 3** (Critical: 0 | Medium: 2 | Low: 1)
- **Console errors: 0** across all views on both viewports
- **Lighthouse scores: excellent** -- see table below
- **Overall quality:** The app is polished and professional on both desktop and mobile. The mobile experience uses native-feeling patterns (bottom tabs, drawer, More sheet) and is well-implemented.

---

## Lighthouse Scores

| Page | Viewport | Accessibility | Best Practices | SEO | Performance |
|------|----------|:------------:|:--------------:|:---:|:-----------:|
| Start Here (`#/regulations`) | Desktop | **100** | **100** | **100** | N/A |
| Regulation Detail (`cap-adequacy/0`) | Desktop | **96** | **100** | **100** | N/A |
| Start Here (`#/regulations`) | Mobile | **96** | **100** | **100** | N/A |
| Regulation Detail (`cap-adequacy/0`) | Mobile | **96** | **100** | **100** | N/A |

*Performance scores excluded by Lighthouse tool (not available in DevTools MCP mode).*

---

## Issues Found

### [M-1] Timeline filter chip contrast ratio (Medium) — RESOLVED v8.0 (light theme active chips now white-on-amber, ≈5.9:1)

- **Views:** Timeline
- **Viewports:** Both (more impactful on mobile)
- **Description:** Active filter chips (`button.tl-chip.active`) have black text (#000000) on a #92530a background, yielding a 3.46:1 contrast ratio. WCAG AA requires 4.5:1 for text at this size (11.2px).
- **Impact:** Flagged by Lighthouse on both mobile and desktop regulation detail audits, accounting for the -4 point a11y deduction.
- **Fix:** Lighten the background or switch text to white.

### [M-2] Basel Explorer not accessible from desktop nav bar (Medium) — RESOLVED v8.0 (Basel Explorer desktop tab took the retired What's Changing slot)

- **Views:** Basel Explorer
- **Viewports:** Desktop only
- **Description:** The desktop nav bar has 4 tabs (Regulations, What's Changing, Timeline, Glossary) but no Basel Explorer tab. The Settings dropdown only contains Font Size and Theme controls. Basel Explorer is only reachable via: (a) direct URL `#/explorer`, (b) CTA button on the Basel III Endgame regulation detail page, or (c) "B3E Explorer" links in What's Changing entries. On mobile, the More sheet correctly includes a "Basel III Explorer" link.
- **Impact:** Desktop users may not discover the Basel Explorer exists.
- **Fix:** Add a 5th nav tab, or add a link in the Settings dropdown.

### [L-1] Timeline filter chip density on mobile (Low) — RESOLVED v8.0 (mobile Timeline uses a native select instead of 20 chips)

- **Views:** Timeline
- **Viewports:** Mobile
- **Description:** All 20 regulation filter chips are displayed at once on mobile, pushing the actual timeline content far down the page. Users must scroll past a dense block of filter chips to reach timeline entries.
- **Fix:** Consider collapsing regulation filters behind an expandable button or limiting visible chips with a "Show more" toggle.

---

## Edge Case Noted

### Dynamic viewport resize causes blank page

- **Viewports:** Mobile-to-desktop transition
- **Description:** When the viewport dynamically changes from mobile to desktop width (e.g., device rotation, external display), the app can render a completely blank `<main>` element with zero children. A full page reload recovers. This was observed during testing when the emulation viewport changed between tool calls.
- **Impact:** Low in practice -- most users don't dynamically resize, and PWA standalone mode locks orientation. But it could affect users connecting to external displays or using split-screen multitasking on tablets.

---

## Console Errors

**None.** Zero JavaScript errors or warnings across all 5 views on both viewports. The only console output was a benign deprecation warning about `apple-mobile-web-app-capable` meta tag.

---

## UX Observations (No Action Required)

- **Regulations View:** Sidebar + detail panel uses space well on desktop. Mobile drawer + MobileRegDetail is a clean pattern. Subsection badges (FINAL RULE, CALC, PENDING) aid scanning.
- **Overview landing:** Capital Stack, Leverage Stack, and Liquidity Requirements visualizations are informative and well-designed.
- **Cross-references:** Render correctly as clickable links. Navigation verified working (eSLR -> Capital Adequacy).
- **"Referenced By" section:** Nice touch showing which regulations cite the current one.
- **What's Changing:** Clean chronological layout with colored status badges.
- **Glossary:** 2-column desktop / single-column mobile works well. 101 terms with "Used in" cross-references.
- **Basel Explorer:** Rich interactive view with 6 tab categories, impact metrics, expandable accordion cards.
- **Dark/Light mode:** Both well-implemented with good contrast. Amber accent consistent.
- **Mobile navigation:** Bottom tab bar (44px touch targets), drawer (80vw/max 360px), and More sheet are native-feeling.
- **Safe areas:** Properly handled with `viewport-fit=cover` and `env(safe-area-inset-*)` CSS.
- **Typography:** Readable at all font sizes. Text wraps properly without truncation.

---

## Checklist Summary

### Desktop (1440x900)

| Check | Result |
|-------|--------|
| Start Here landing renders | PASS |
| Sidebar shows 20 regulations (4 categories) | PASS |
| Regulation detail renders correctly | PASS |
| Subsection tab navigation works | PASS |
| Cross-reference links navigate correctly | PASS |
| Search input visible in nav bar | PASS |
| What's Changing renders with status badges | PASS |
| Timeline renders with filter chips | PASS |
| Glossary renders 2-column grid (~101 terms) | PASS |
| Basel Explorer renders with 6 tabs | PASS |
| Theme toggle works (dark/light) | PASS |
| Font size controls visible | PASS |
| No horizontal overflow (all views) | PASS |
| No console errors | PASS |
| Lighthouse A11y >= 96 | PASS |
| Lighthouse Best Practices = 100 | PASS |
| Lighthouse SEO = 100 | PASS |
| Basel Explorer in nav bar | **FAIL** |

### Mobile (375x812)

| Check | Result |
|-------|--------|
| Mobile layout activates | PASS |
| Bottom tab bar (4 tabs, 44px targets) | PASS |
| Active tab highlighted amber | PASS |
| Regulation cards stack vertically | PASS |
| MobileRegDetail renders on tap | PASS |
| Hamburger opens drawer from left | PASS |
| Drawer shows grouped regulations | PASS |
| Drawer close works | PASS |
| Subsection dropdown works | PASS |
| Glossary tooltip not clipped | PASS |
| More sheet opens with controls | PASS |
| Glossary single-column layout | PASS |
| What's Changing renders | PASS |
| Timeline renders | PASS |
| Touch targets >= 44px | PASS |
| Safe area CSS present | PASS |
| No horizontal overflow (all views) | PASS |
| No console errors | PASS |
| Lighthouse A11y >= 96 | PASS |
| Lighthouse Best Practices = 100 | PASS |
| Lighthouse SEO = 100 | PASS |
| Timeline chip contrast | **FAIL** |

---

## Screenshots

All saved to `docs/superpowers/specs/screenshots/`:

**Desktop:** `desktop-01` through `desktop-16` covering all views, theme toggle, settings dropdown, cross-reference navigation, and full-page captures.

**Mobile:** `mobile-01` through `mobile-08` covering regulation list, detail, drawer, subsection dropdown, tooltip, What's Changing, Timeline, and Glossary.

**Lighthouse:** `report.html` and `report.json` for mobile audit.
