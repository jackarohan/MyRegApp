# B3E Overview Section Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Basel III Explorer overview section to separate RWA and CET1 metrics in the impact graphic, add Cat I/II representation, and reduce card text density using a "so what + bullets" pattern.

**Architecture:** Three changes: (1) replace `B3eImpactSummary` in `index.html` with a two-stage waterfall + dual-cohort stat cards, (2) add structured data support to `B3eChangeCard` for bullet lists, (3) rewrite overview section data in `basel3explorer.js`. No build step — static site with CDN React and in-browser Babel.

**Tech Stack:** React 18 (CDN), in-browser Babel, no build tools. Data in global JS variables.

**Spec:** `docs/superpowers/specs/2026-04-11-b3e-overview-redesign.md`

---

### Task 1: Add structured data support to B3eChangeCard

**Files:**
- Modify: `index.html:1094-1114` (B3eChangeCard expanded content rendering)

This is a backward-compatible change. If `today`/`newRule`/`why` is a string, render as before. If it's an object `{text, bullets}`, render the text paragraph followed by a `<ul>` of bullets. Bullets can contain `<strong>` for labels, so we use a simple inline render helper.

- [ ] **Step 1: Add the SmartField helper inside B3eChangeCard**

In `index.html`, find the `B3eChangeCard` function (line 1071). Add a local helper just inside the function body, after the existing variable declarations (after line 1081):

```jsx
const SmartField=f=>{
  if(!f)return null;
  if(typeof f==="string")return f;
  return React.createElement(React.Fragment,null,
    f.text&&React.createElement("div",{style:{marginBottom:f.bullets?8:0}},f.text),
    f.bullets&&React.createElement("ul",{style:{margin:0,paddingLeft:18,fontSize:12,lineHeight:1.6}},
      f.bullets.map((b,i)=>React.createElement("li",{key:i,style:{marginBottom:3},dangerouslySetInnerHTML:{__html:b}}))
    )
  );
};
```

Note: We use `dangerouslySetInnerHTML` for bullets because they contain `<strong>` tags for label bolding. This is safe — all content is author-controlled from `basel3explorer.js`, not user input.

- [ ] **Step 2: Replace the three plain-text renders with SmartField**

In the same function, replace the three lines that render `change.today`, `change.newRule`, and `change.why`:

Find (line 1099):
```jsx
<div style={{fontSize:13,color:"var(--text2)",lineHeight:1.55}}>{change.today}</div>
```
Replace with:
```jsx
<div style={{fontSize:13,color:"var(--text2)",lineHeight:1.55}}>{SmartField(change.today)}</div>
```

Find (line 1103):
```jsx
<div style={{fontSize:13,color:"var(--text2)",lineHeight:1.55}}>{change.newRule}</div>
```
Replace with:
```jsx
<div style={{fontSize:13,color:"var(--text2)",lineHeight:1.55}}>{SmartField(change.newRule)}</div>
```

Find (line 1108):
```jsx
<div style={{fontSize:13,color:"var(--text3)",lineHeight:1.55}}>{change.why}</div>
```
Replace with:
```jsx
<div style={{fontSize:13,color:"var(--text3)",lineHeight:1.55}}>{SmartField(change.why)}</div>
```

- [ ] **Step 3: Verify backward compatibility**

Open the app in a browser. Navigate to the B3E Explorer. Expand any card in a non-overview section (e.g., Lending → "Residential Mortgages: Owner-Occupied"). Verify it renders identically to before — all existing string-based cards should be unaffected.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(explorer): add structured data support to B3eChangeCard for bullet lists"
```

---

### Task 2: Rewrite B3eImpactSummary as two-stage waterfall

**Files:**
- Modify: `index.html:1028-1069` (B3eImpactSummary function)

Replace the entire `B3eImpactSummary` function with a new version that has:
1. Four dual-cohort CET1 stat cards at top
2. Stage 1: RWA bars by asset class (Cat III/IV)
3. Labeled divider
4. Stage 2: CET1 translation waterfall

- [ ] **Step 1: Replace the B3eImpactSummary function**

In `index.html`, replace the entire function from line 1028 (`function B3eImpactSummary(){`) through line 1069 (`}`) with:

```jsx
function B3eImpactSummary(){
  const decColor=cssVar("--dir-decrease");
  const incColor=cssVar("--dir-increase");
  const mixColor=cssVar("--dir-mixed");
  const simpColor=cssVar("--dir-simplification");

  /* ── Stat cards: both cohorts, CET1 only ── */
  const stats=[
    {label:"Cat I/II Standalone",value:"+1.4%",color:incColor,sub:"credit relief offset by market risk & CVA"},
    {label:"Cat I/II Cumulative",value:"\u22124.8%",color:decColor,sub:"with companion proposals"},
    {label:"Cat III/IV Standalone",value:"\u22123.0%",color:decColor,sub:"CET1 after AOCI offset"},
    {label:"Cat III/IV + Stress Tests",value:"\u22125.3%",color:simpColor,sub:"incl. SCB changes"},
  ];

  /* ── Stage 1: RWA by asset class ── */
  const rwaItems=[
    {label:"Residential Mortgages",val:-30.0},
    {label:"Securitizations",val:-18.0},
    {label:"Retail Exposures",val:-10.0},
    {label:"Other Assets",val:-10.0},
    {label:"Commitments (unused)",val:-8.0},
    {label:"Other Corporate",val:-7.0},
    {label:"CRE",val:-5.0},
    {label:"MSAs",val:0,note:"~0%"},
  ];
  const rwaMax=Math.max(...rwaItems.map(d=>Math.abs(d.val)),1);

  /* ── Stage 2: CET1 translation waterfall ── */
  const cet1Steps=[
    {label:"Gross RWA Relief",value:-6.1},
    {label:"AOCI Opt-Out Elimination",value:+3.1},
    {label:"Equity & Other Increases",value:+0.5},
    {label:"Net CET1 Impact",value:-2.5,isNet:true},
  ];
  const cet1Max=Math.max(...cet1Steps.map(s=>Math.abs(s.value)));

  return(
  <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:20,marginBottom:24}}>

    {/* ── Stat cards ── */}
    <div style={{fontSize:12,fontWeight:700,letterSpacing:.8,color:"var(--text4)",marginBottom:12}}>CET1 IMPACT SUMMARY</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:24}}>
      {stats.map((s,i)=>
        <div key={i} style={{textAlign:"center",padding:"12px 8px",background:"var(--bg)",borderRadius:8,border:"1px solid var(--border)"}}>
          <div style={{fontSize:22,fontWeight:700,color:s.color,fontFamily:"'DM Mono',monospace"}}>{s.value}</div>
          <div style={{fontSize:11,color:"var(--text3)",marginTop:3,fontWeight:600}}>{s.label}</div>
          <div style={{fontSize:10,color:"var(--text4)",marginTop:1}}>{s.sub}</div>
        </div>
      )}
    </div>

    {/* ── Stage 1: RWA bars ── */}
    <div style={{fontSize:11,fontWeight:700,letterSpacing:.8,color:"var(--text4)",marginBottom:12}}>RWA IMPACT — CAT III/IV (STANDARDIZED)</div>
    {rwaItems.map((d,i)=>{
      const isZero=d.val===0;
      const pct=isZero?0:(Math.abs(d.val)/rwaMax)*100;
      const color=isZero?"#777":d.val>0?incColor:decColor;
      return(
      <div key={i} style={{marginBottom:7}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--text3)",marginBottom:3}}>
          <span>{d.label}</span>
          <span style={{fontWeight:700,color,fontFamily:"'DM Mono',monospace"}}>{isZero?(d.note||"0%"):(d.val>0?"+":"")+d.val+"%"}</span>
        </div>
        <div style={{height:5,background:"var(--bg3)",borderRadius:3}} role="img" aria-label={d.label+": "+(isZero?(d.note||"0%"):(d.val>0?"+":"")+d.val+"% RWA change")}>
          <div style={{height:5,borderRadius:3,background:color,width:pct+"%",opacity:.75}}/>
        </div>
      </div>);
    })}
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:4,paddingTop:6,borderTop:"1px dashed var(--border)"}}>
      <span style={{fontSize:11,fontWeight:700,color:decColor,fontFamily:"'DM Mono',monospace"}}>Gross RWA: −6.1%</span>
    </div>

    {/* ── Divider ── */}
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"20px 0 16px"}}>
      <div style={{flex:1,height:1,background:"var(--border)"}}/>
      <span style={{fontSize:10,fontWeight:700,letterSpacing:.8,color:"var(--text4)",whiteSpace:"nowrap"}}>HOW THIS TRANSLATES TO CAPITAL</span>
      <div style={{flex:1,height:1,background:"var(--border)"}}/>
    </div>

    {/* ── Stage 2: CET1 waterfall ── */}
    {cet1Steps.map((s,i)=>{
      const barW=(Math.abs(s.value)/cet1Max)*100;
      const color=s.isNet?simpColor:s.value<0?decColor:incColor;
      return(
      <div key={i} style={{marginBottom:7}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--text3)",marginBottom:3}}>
          <span style={{fontWeight:s.isNet?700:400}}>{s.label}</span>
          <span style={{fontWeight:700,color,fontFamily:"'DM Mono',monospace"}}>{s.value>0?"+":""}{s.value}%</span>
        </div>
        <div style={{height:s.isNet?7:5,background:"var(--bg3)",borderRadius:3}} role="img" aria-label={s.label+": "+(s.value>0?"+":"")+s.value+"% CET1 impact"}>
          <div style={{height:"100%",borderRadius:3,background:color,width:barW+"%",opacity:s.isNet?1:.75}}/>
        </div>
      </div>);
    })}

    {/* ── Source ── */}
    <div style={{marginTop:14,paddingTop:10,borderTop:"1px solid var(--border)",fontSize:10,color:"var(--text4)",lineHeight:1.5}}>
      Source: Federal Reserve Board / OCC / FDIC aggregate estimates based on Q2 2025 balance sheet data. All figures reflect agency-published re-proposal impact analysis; not institution-specific.
    </div>
  </div>);
}
```

- [ ] **Step 2: Verify the new component renders**

Open the app in a browser. Navigate to the B3E Explorer. The overview section should show:
- Four stat cards in a responsive grid (Cat I/II Standalone +1.4%, Cat I/II Cumulative −4.8%, Cat III/IV Standalone −3.0%, Cat III/IV + Stress Tests −5.3%)
- RWA bar chart with 8 asset classes, all negative except MSAs ~0%, with "Gross RWA: −6.1%" subtotal
- "HOW THIS TRANSLATES TO CAPITAL" divider
- CET1 waterfall with 4 bars ending at "Net CET1 Impact: −2.5%"
- Source footnote at bottom

Check that colors are correct: decreases in teal, increases in red, net in blue. Verify mobile responsiveness — stat cards should stack into 2 columns on narrow screens.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(explorer): replace impact summary with two-stage waterfall and dual-cohort stat cards"
```

---

### Task 3: Rewrite overview intro and card text in basel3explorer.js

**Files:**
- Modify: `data/basel3explorer.js:5` (overview section intro)
- Modify: `data/basel3explorer.js:15-19` (5 overview card objects)

- [ ] **Step 1: Replace the overview intro text**

In `data/basel3explorer.js`, line 5, find the overview section object and replace its `intro` value.

Find:
```
intro:"The 2026 re-proposal replaces the 2023 NPR with two concurrent frameworks. The Expanded Risk-Based Approach (ERBA) applies mandatorily to 9 Category I/II BHCs (\u2265$700B assets or \u2265$75B cross-jurisdictional activity), eliminating advanced approaches, introducing an explicit operational risk charge (SMA), and bringing CVA into the binding capital calculation. The revised Standardized Approach governs Category III/IV banks (\u2265$100B assets), recalibrating credit risk weights with operational risk embedded in the calibrations\u2014no standalone SMA or CVA for most firms. Cat III/IV firms may voluntarily opt into ERBA. The result is broadly capital-neutral on a standalone basis, a sharp reversal from the 2023 NPR\u2019s estimated +19% aggregate CET1 increase."
```

Replace with:
```
intro:"The 2026 re-proposal replaces the 2023 NPR with a broadly capital-neutral framework — a sharp reversal from the original +19% capital increase. Two approaches: ERBA (mandatory for Cat I/II) and revised Standardized (Cat III/IV), with voluntary opt-in available."
```

- [ ] **Step 2: Replace the "Aggregate Capital Impact" card (line 15)**

Find the card object starting with `{section:"overview",title:"Aggregate Capital Impact"` and replace the `today`, `newRule`, and `why` fields:

```js
today:"The 2023 NPR would have raised aggregate CET1 requirements ~19% across all banks \u2265$100B.",
newRule:{text:"Broadly capital-neutral to capital-relieving — a sharp reversal from the 2023 NPR. Impact varies significantly by bank category and whether companion proposals are included.",bullets:["<strong>Cat I/II standalone:</strong> CET1 +1.4% (credit relief offset by market risk & CVA)","<strong>Cat I/II cumulative:</strong> CET1 \u22124.8% with companion proposals (~$42B freed)","<strong>Cat III/IV:</strong> gross RWA \u22129.5% \u2192 net CET1 \u22123.0% after AOCI offset","<strong>Cat III/IV + stress tests:</strong> CET1 \u22125.3%","<strong>Smaller covered firms:</strong> 7.7\u20138.3% RWA relief (retain AOCI opt-out)"]},
why:"Converts a +19% capital increase into a neutral-to-relieving outcome. The headline number depends entirely on which cohort and which proposals you count.",
```

- [ ] **Step 3: Replace the "Two Frameworks Replace One" card (line 16)**

Find the card object starting with `{section:"overview",title:"Two Frameworks Replace One"` and replace the `today`, `newRule`, and `why` fields:

```js
today:"All banks \u2265$100B use the standardized approach. Cat I/II also maintain parallel advanced approaches (IRB, AMA) — the binding ratio is the lower of the two.",
newRule:{text:"Single-stack design eliminates the dual parallel calculation entirely.",bullets:["<strong>Cat I/II:</strong> ERBA only (single stack)","<strong>Cat III/IV:</strong> revised Standardized only (single stack)","<strong>Removed:</strong> IRB, AMA, and dual-stack binding constraint","<strong>Retained:</strong> internal models for market risk at desk level (ERBA only)"]},
why:"Eliminates the costly requirement to maintain parallel RWA calculations. The binding constraint toggle between approaches disappears.",
```

- [ ] **Step 4: Replace the "AOCI Opt-Out Eliminated" card (line 17)**

Find the card object starting with `{section:"overview",title:"AOCI Opt-Out Eliminated"` and replace the `today`, `newRule`, and `why` fields:

```js
today:"Cat III/IV firms may exclude AOCI from regulatory capital. Most do, insulating CET1 from unrealized securities gains and losses.",
newRule:{text:"The opt-out is eliminated with a five-year phase-in beginning on the rule\u2019s effective date.",bullets:["<strong>Phase-in:</strong> 25% Yr 1 \u2192 50% Yr 2 \u2192 75% Yr 3 \u2192 100% Yrs 4\u20135","<strong>CET1 headwind:</strong> +3.1% for Cat III/IV HCs — absorbs roughly half of gross RWA relief","<strong>Historical AOCI swing:</strong> +$16B to \u2212$112B since 2015","<strong>Banks <$100B:</strong> retain the opt-out"]},
why:"SVB\u2019s 2023 failure demonstrated the danger of capital that ignores unrealized losses. AOCI recognition is the single largest headwind in the re-proposal — it\u2019s why gross RWA relief doesn\u2019t translate dollar-for-dollar into lower requirements.",
```

- [ ] **Step 5: Replace the "Voluntary Opt-In for Cat III/IV" card (line 18)**

Find the card object starting with `{section:"overview",title:"Voluntary Opt-In for Cat III/IV"` and replace the `today`, `newRule`, and `why` fields:

```js
today:"No opt-in mechanism exists. Banks use their assigned approach.",
newRule:{text:"Any banking organization may voluntarily elect ERBA — a strategic choice, not a compliance obligation.",bullets:["<strong>Notice:</strong> 4 full calendar quarters\u2019 written notice to supervisor","<strong>Permanent AOCI:</strong> recognition required even if later reverting","<strong>SA-CCR:</strong> mandatory for counterparty credit risk","<strong>Irrevocable:</strong> election cannot be reversed","<strong>Estimated impact:</strong> 3\u20137% CET1 reduction for opt-in firms"]},
why:"Trades lower risk weights (e.g., 65% IG corporate vs. 95% standardized) for new requirements including SMA operational risk, 10% UCC CCF, and permanent AOCI. See Capital & Structure for detailed economics.",
```

- [ ] **Step 6: Replace the "Implementation Timeline & Inflation Indexing" card (line 19)**

Find the card object starting with `{section:"overview",title:"Implementation Timeline & Inflation Indexing"` and replace the `today`, `newRule`, and `why` fields:

```js
today:"All dollar thresholds are fixed in nominal terms. No scheduled phase-in periods under current rules.",
newRule:{text:"Phased implementation with built-in inflation adjustment.",bullets:["<strong>Effective date:</strong> all revised Standardized risk weights, SEC-SA, broadened commitments, MSA changes, expanded CRM take effect immediately","<strong>Effective + 3 years:</strong> PLA test transition ends — capital consequences begin for red/amber-zone desks","<strong>Effective + 5 years:</strong> AOCI transition complete, full recognition required","<strong>CPI-W indexing:</strong> biennial adjustments to 9 ERBA and 4 Standardized thresholds","<strong>Floor:</strong> thresholds never decrease during deflation"]},
why:"Standardized takes effect all at once except AOCI. ERBA firms get a three-year PLA runway. CPI-W indexing prevents silent scope creep as nominal values grow.",
```

- [ ] **Step 7: Verify all 5 cards render correctly**

Open the app in a browser. Navigate to the B3E Explorer overview section. Expand each of the 5 overview cards and verify:
- "Today" panels show 1–2 concise sentences
- "2026 Reproposal" panels show a short lede paragraph followed by bulleted key points with bold labels
- "Why It Matters" panels show 1–2 editorial sentences
- No rendering errors or broken formatting
- Non-overview section cards (e.g., Lending) still render normally as plain strings

- [ ] **Step 8: Commit**

```bash
git add data/basel3explorer.js
git commit -m "content(explorer): rewrite overview cards with so-what-plus-bullets pattern and trim intro"
```

---

### Task 4: Update service worker cache version

**Files:**
- Modify: `sw.js` (CACHE_VERSION string)

The data file `basel3explorer.js` has changed content. Bump the service worker cache to ensure returning users get the updated version.

- [ ] **Step 1: Find and update CACHE_VERSION**

In `sw.js`, find the `CACHE_VERSION` constant and increment its version number. For example, if it currently reads:

```js
const CACHE_VERSION = "mra-v6.2";
```

Change to:

```js
const CACHE_VERSION = "mra-v6.2.1";
```

Use whatever the current version string is and append a patch increment.

- [ ] **Step 2: Commit**

```bash
git add sw.js
git commit -m "chore: bump service worker cache version for explorer content update"
```

---

### Task 5: Final verification

- [ ] **Step 1: Full visual check**

Open the app in a browser (hard refresh to bypass service worker cache: Cmd+Shift+R). Navigate through the full B3E Explorer:

1. **Overview tab:** Verify stat cards show 4 CET1 metrics (both cohorts), RWA bars are clean with subtotal, divider is visible, CET1 waterfall renders below
2. **Overview cards:** Expand all 5, verify bullet formatting, no broken HTML
3. **Other tabs:** Click Lending, Off-Balance Sheet, Trading, Operational Risk, Capital — verify cards render identically to before (plain string format, no regressions)
4. **Search:** Type "major" in search — verify overview cards appear in results with correct formatting
5. **Mobile:** Resize to mobile width — verify stat cards stack to 2 columns, waterfall remains legible

- [ ] **Step 2: Verify print stylesheet**

Press Cmd+P (or Ctrl+P) to open print preview. Verify the overview section renders cleanly with the new layout.
