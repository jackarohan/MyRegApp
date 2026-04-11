# Basel III Explorer — Overview Section Redesign

**Date:** 2026-04-11
**Status:** Draft
**Scope:** Overview section only (impact graphic, card text, intro text)

---

## Problem

The B3E Explorer overview section has two UX issues:

1. **The impact graphic mixes units.** `B3eImpactSummary` shows RWA changes by asset class (e.g., Residential Mortgages −30%) alongside CET1 offsets (AOCI +3.1%) on the same bar chart scale. These are different metrics — RWA is an input, CET1 is the output — and combining them creates confusion about what's being measured.

2. **Card text is too dense.** The 5 overview cards use paragraph-style prose in the Today, 2026 Reproposal, and Why It Matters panels. Key data points are buried in 60–90 word blocks that require careful reading to extract numbers.

Additionally, the impact graphic only covers Cat III/IV, with no Cat I/II representation.

---

## Changes

### 1. Impact Graphic — Two-Stage Waterfall with Dual-Cohort Stat Cards

**Replace the current `B3eImpactSummary` component.**

#### Top: Stat Cards (both cohorts)

Four headline stat cards in a 2×2 or responsive grid:

| Card | Value | Subtitle |
|------|-------|----------|
| Cat I/II Standalone | +1.4% | CET1 (credit relief offset by market risk & CVA) |
| Cat I/II Cumulative | −4.8% | with companion proposals |
| Cat III/IV Standalone | −3.0% | CET1 after AOCI offset |
| Cat III/IV + Stress Tests | −5.3% | incl. SCB changes |

Colors: decreases use `--dir-decrease` (teal), increases use `--dir-increase` (red), mixed use `--dir-mixed` (amber).

#### Stage 1: RWA Changes by Asset Class

- Header label: `RWA IMPACT — CAT III/IV (STANDARDIZED)`
- Horizontal bars, all in % RWA change:
  - Residential Mortgages: −30.0%
  - Securitizations: −18.0%
  - Retail Exposures: −10.0%
  - Other Assets: −10.0%
  - Commitments (unused): −8.0%
  - Other Corporate: −7.0%
  - CRE: −5.0%
  - MSAs: ~0%
- Subtotal line at bottom: **Gross RWA: −6.1%**
- All bars use `--dir-decrease` / `--dir-increase` colors based on direction

#### Divider

A labeled horizontal rule: `HOW THIS TRANSLATES TO CAPITAL`

#### Stage 2: CET1 Translation Waterfall

Running-total waterfall bars showing the pipeline from RWA relief to net CET1:

1. Gross RWA Relief: −6.1% (teal)
2. AOCI Opt-Out Elimination: +3.1% (red)
3. Equity & Other Increases: +0.5% (red)
4. **Net CET1 Impact: −2.5%** (blue, bold bar)

Each bar connects visually — the start position of each bar picks up where the previous one ended.

#### Source footnote

Retain existing source attribution text.

### 2. Card Text Density — "So What" + Bullets Pattern

**Rewrite text for all 5 overview cards in `basel3explorer.js`.** Component code (`B3eChangeCard`) is unchanged.

#### Pattern for each panel:

- **TODAY:** 1–2 sentences. Current state of the rule. No history of how we got here (2023 NPR opposition, comment letters, etc.).
- **2026 REPROPOSAL:** 1–2 sentence "so what" lede summarizing the directional change, followed by bulleted key data points. Each bullet is one fact with a bolded label portion.
- **WHY IT MATTERS:** 2 sentences max. Pure editorial insight — the "so what," not a restatement of numbers.

#### Card-by-card guidance:

**Aggregate Capital Impact:**
- Today: One sentence on the 2023 NPR's +19% headline.
- Reproposal: "Broadly capital-neutral to capital-relieving" lede, then bullets per cohort (Cat I/II standalone, Cat I/II cumulative, Cat III/IV, Cat III/IV + stress tests, smaller firms).
- Why: Converts +19% increase into neutral-to-relieving; headline depends on cohort and proposal scope.

**Two Frameworks Replace One:**
- Today: One sentence on the dual-stack requirement.
- Reproposal: Single-stack lede, then bullets (ERBA for Cat I/II, revised Std for Cat III/IV, IRB/AMA removed, internal models retained only for market risk desks).
- Why: Eliminates costly parallel calculations; binding constraint toggle disappears.

**AOCI Opt-Out Eliminated:**
- Today: One sentence on the current opt-out.
- Reproposal: Opt-out eliminated lede, then bullets (5-year phase-in schedule, +3.1% CET1 headwind, historical AOCI swing range, <$100B retain opt-out).
- Why: SVB demonstrated the danger; AOCI is the largest single headwind in the re-proposal.

**Voluntary Opt-In for Cat III/IV:**
- Today: One sentence (no opt-in mechanism exists).
- Reproposal: Strategic choice lede, then bullets (notice period, permanent AOCI, SA-CCR required, irrevocable, 3–7% CET1 reduction estimate).
- Why: Trades lower risk weights for new requirements; see Capital & Structure for detailed economics.

**Implementation Timeline & Inflation Indexing:**
- Today: One sentence (fixed nominal thresholds, no phase-in).
- Reproposal: Phased implementation lede, then bullets (effective date items, +3yr PLA test, +5yr AOCI complete, biennial CPI-W indexing, thresholds never decrease).
- Why: Standardized is immediate except AOCI; ERBA gets 3-year PLA runway; CPI-W prevents silent scope creep.

### 3. Overview Intro Text

**Trim the `intro` field** for the overview section in `B3E.SECTIONS` from ~70 words to ~2 sentences:

> "The 2026 re-proposal replaces the 2023 NPR with a broadly capital-neutral framework — a sharp reversal from the original +19% capital increase. Two approaches: ERBA (mandatory for Cat I/II) and revised Standardized (Cat III/IV), with voluntary opt-in available."

---

## What Doesn't Change

- `B3eChangeCard` component code (expand/collapse, direction badges, KEY/NEW tags, color scheme)
- Charts within cards (LTV grids, per-card waterfalls)
- All non-overview sections (Lending, Off-Balance Sheet, Trading, Operational Risk, Capital)
- Search, tab navigation, accessibility features
- The existing per-card waterfall in the Capital & Structure section ("Capital Relief Waterfall")

## Files Touched

| File | Change |
|------|--------|
| `index.html` | Rewrite `B3eImpactSummary` component (two-stage waterfall + dual-cohort stat cards) |
| `data/basel3explorer.js` | Rewrite overview section `intro`; rewrite `today`, `newRule`, `why` for 5 overview cards |

## Data Integrity

All numbers in the redesigned graphic and card text must match existing values in `basel3explorer.js` and `regulations.js`. No new data points are introduced — this is a presentation-layer change only.
