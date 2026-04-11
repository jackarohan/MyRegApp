# Comprehensive Desktop & Mobile Site Test — Design Spec

**Date:** 2026-04-11
**Target:** https://myreg.app/ (live Netlify deployment)
**Goal:** Bug hunting + UX/design quality audit across all views at desktop and mobile viewports

---

## Context

MyRegApp has undergone recent mobile UI/UX improvements (Lighthouse 96→100, drawer navigation, safe area fixes). This test validates the current state of the site across all 5 views at both desktop and mobile viewports, combining manual interactive testing with automated Lighthouse audits.

## Approach: Hybrid MCP Walk-through + Lighthouse

Use Chrome DevTools MCP for interactive browser testing (navigation, screenshots, interaction verification) and Lighthouse audits for quantitative accessibility/performance metrics.

### Skills Used
- `chrome-devtools-mcp:chrome-devtools` — browser navigation, screenshots, interaction testing
- `chrome-devtools-mcp:a11y-debugging` — accessibility auditing via Lighthouse
- `web-design-guidelines` — UI review against web interface best practices

---

## Test Structure

Two sequential passes through all 5 views:

| Pass | Viewport | Dimensions | Simulates |
|------|----------|------------|-----------|
| 1 | Desktop | 1440×900 | Standard laptop/monitor |
| 2 | Mobile | 375×812 | iPhone-class device |

Each pass covers the same 5 views in order:
1. Regulations View (Start Here → Regulation detail)
2. What's Changing View
3. Timeline View
4. Glossary View
5. Basel Explorer

A Lighthouse audit runs once per viewport for overall scores.

---

## Per-View Test Checklist

### 1. Regulations View

**Rendering:**
- [ ] Start Here / landing page renders with category cards
- [ ] Sidebar lists all 20 regulations grouped by category
- [ ] Detail panel renders regulation content with correct formatting
- [ ] Subsection content displays paragraphs, key points, citations

**Navigation:**
- [ ] Clicking a regulation from Start Here navigates to detail view
- [ ] Sidebar selection updates detail panel and URL hash
- [ ] Subsection prev/next buttons navigate correctly
- [ ] Subsection dropdown selector works
- [ ] Cross-references (`{{ref:regId}}`) render as links and navigate to target
- [ ] Back/forward browser buttons work with hash routing

**Interactions:**
- [ ] Search input filters regulation list, highlights matches
- [ ] Search clear button works
- [ ] Glossary tooltips appear on hover (desktop) / tap (mobile) for `gterm` spans
- [ ] Tooltip positioning is correct (no clipping at edges)

**Mobile-specific:**
- [ ] MobileRegDetail replaces list view on regulation tap
- [ ] Hamburger menu (☰) opens MobileDrawer
- [ ] Drawer slides in from left, swipe-to-close works
- [ ] Drawer overlay click closes drawer
- [ ] Subsection dropdown works on mobile
- [ ] Back navigation returns to regulation list

### 2. What's Changing View

**Rendering:**
- [ ] All entries render with correct status badges (final, expected, proposed, etc.)
- [ ] Badge colors match ST config
- [ ] Dates display correctly
- [ ] Descriptions are readable

**Navigation:**
- [ ] Links to related regulations navigate to correct regulation detail
- [ ] Hash updates correctly

**Layout:**
- [ ] Cards/entries have consistent spacing
- [ ] No horizontal overflow on mobile

### 3. Timeline View

**Rendering:**
- [ ] Timeline renders with visual markers/indicators
- [ ] Events display dates, titles, and descriptions
- [ ] Direction indicators (colors) render correctly

**Interactions:**
- [ ] Category filters work
- [ ] Time period filters (past/future/all) work
- [ ] Filtered results update correctly

**Layout:**
- [ ] Timeline is scrollable without layout breaks
- [ ] Mobile layout adapts without clipping

### 4. Glossary View

**Rendering:**
- [ ] Two-column grid on desktop
- [ ] Single column on mobile
- [ ] All terms display with definitions

**Interactions:**
- [ ] Search filters terms correctly
- [ ] Usage references link to correct regulations
- [ ] Clicking a usage reference navigates to the regulation

**Layout:**
- [ ] Consistent card/term spacing
- [ ] No overflow issues

### 5. Basel Explorer

**Rendering:**
- [ ] Tab bar renders with all sections
- [ ] Content loads for each tab
- [ ] Change cards display with impact indicators

**Interactions:**
- [ ] Tabs switch content correctly
- [ ] Expandable cards open/close
- [ ] Search across provisions filters results
- [ ] Before/after comparisons render correctly

**Layout:**
- [ ] Tabs wrap or scroll on mobile
- [ ] Card content doesn't overflow

### Cross-Cutting Checks (Every View)

**Theme & Settings:**
- [ ] Theme toggle (dark → light → dark) applies correctly across all elements
- [ ] Font size controls (A⁻/A/A⁺) adjust text, persist on navigation
- [ ] Settings accessible from NavBar (desktop) / More sheet (mobile)

**Mobile Navigation:**
- [ ] Bottom tab bar renders with 4 tabs (Regs, Changes, Timeline, More)
- [ ] Each bottom tab navigates to correct view
- [ ] More sheet opens with Glossary + Basel Explorer options
- [ ] More sheet closes on overlay tap / Escape key
- [ ] Active tab state (amber highlight) is correct

**General:**
- [ ] No JavaScript console errors on any view
- [ ] No horizontal overflow / scrollbar on any view
- [ ] Safe area insets respected (nav bar top, bottom tab bar)
- [ ] Touch targets ≥ 44px on mobile
- [ ] Print stylesheet renders clean output (spot check)

---

## Lighthouse Audits

Run Lighthouse on 2 pages per viewport (4 total audits):

| Page | Desktop | Mobile |
|------|---------|--------|
| Homepage / Start Here | ✓ | ✓ |
| Regulation detail (sample) | ✓ | ✓ |

Capture scores for: Performance, Accessibility, Best Practices, SEO.

---

## Execution Flow

1. **Open Chrome** and navigate to https://myreg.app/
2. **Desktop pass** (1440×900):
   - Navigate through each view, take screenshots, test interactions per checklist
   - Run Lighthouse on Start Here and a sample regulation detail
3. **Resize to mobile** (375×812):
   - Navigate through each view, test mobile-specific UI per checklist
   - Run Lighthouse on Start Here and a sample regulation detail
4. **Compile findings** — categorize as bugs vs. UX improvements, severity levels
5. **Generate report** — screenshots + findings + Lighthouse scores

## Output

A findings report organized by:
- **Critical bugs** — broken functionality, crashes, navigation failures
- **Visual/layout issues** — overflow, clipping, misalignment, rendering glitches
- **UX improvements** — design quality, consistency, readability suggestions
- **Accessibility findings** — from Lighthouse + manual checks
- **Lighthouse scores** — performance, a11y, best practices, SEO (4 audits)

Each finding includes: view, viewport, description, screenshot reference, severity.

---

## Verification

The test itself IS the verification — the output is the findings report. Success criteria:
- All 5 views tested at both viewports
- All checklist items evaluated
- 4 Lighthouse audits completed
- Findings documented with screenshots
