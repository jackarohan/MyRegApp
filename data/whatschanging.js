/* MyRegApp v6.2 — What's Changing & Status Badges
   Pending and upcoming regulatory changes.
   G (glossary) is defined in glossary.js; ST (status badges) defined here.
   Loaded by index.html via <script> tag. */

const WC=[
{date:"Apr 1, 2026",status:"final",title:"eSLR Recalibration Takes Effect",reg:"eslr",desc:"New buffer-based eSLR (3% + 50% of Method 1 surcharge) replaces fixed 5%/6% thresholds. TLAC leverage buffers conformed."},
{date:"Apr 1, 2026",status:"final",title:"TLAC Leverage Buffers Conformed",reg:"tlac",desc:"TLAC and LTD leverage-based requirements aligned with recalibrated eSLR buffer structure."},
{date:"Q1\u2013Q2 2026",status:"expected",title:"Basel III Endgame Re-Proposal",reg:"endgame",desc:"FDIC and OCC submitted draft rules to OMB on Feb 13, 2026. Bowman confirmed Mar 12, 2026 that proposals come \u2018in the coming weeks.\u2019 Expected to be \u2018capital-neutral,\u2019 with revised scope, AOCI, output floor, FRTB, and new MSR/mortgage risk weight treatment."},
{date:"2026",status:"expected",title:"SCB Averaging Finalization",reg:"scb",desc:"Two-year averaging proposed April 2025. Comment period closed June 2025. Finalization pending; original industry-supported Jan 1, 2026 effective date has passed."},
{date:"2026",status:"expected",title:"Stress Test Transparency Reforms",reg:"stress-testing",desc:"Fed proposed publishing supervisory models (Oct 2025). Comment period extended to Feb 21, 2026. Final rule pending."},
{date:"2026",status:"expected",title:"G-SIB Surcharge Methodology Review",reg:"gsib",desc:"Bowman confirmed (Mar 12, 2026) NPR coming 'in the coming weeks.' Proposed: daily averaging of systemic indicators, 10bps surcharge buckets, updated coefficients. Industry estimates ~1pp reduction."},
{date:"2026",status:"expected",title:"FDIC LTD Proposal for Large Non-G-SIBs",reg:"resolution",desc:"FDIC proposed long-term debt requirement for Category II/III banks. Not yet finalized."},
{date:"Jul 2026",status:"deadline",title:"G-SIB Resolution Plan Submissions",reg:"resolution",desc:"Major G-SIBs (Cohort 3) full-plan submissions due Jul 1, 2026 under updated 2024 guidance. FDIC modified content requirements in Apr 2025, waiving speculative analysis."},
{date:"Jul 18, 2026",status:"deadline",title:"GENIUS Act Implementing Regulations Due",reg:"genius-act",desc:"Federal banking agencies must adopt capital, liquidity, and governance rules for stablecoin issuers under the GENIUS Act."},
{date:"Jan 18, 2027",status:"deadline",title:"GENIUS Act Effective Date (Latest)",reg:"genius-act",desc:"Statute takes effect 18 months after enactment, or 120 days after final rules \u2014 whichever is earlier."},
{date:"2026",status:"expected",title:"CRA Rescission Finalization",reg:"cra",desc:"Agencies proposed rescinding the 2023 CRA modernization rule (Jul 2025). Comment period closed Aug 18, 2025. Finalization pending; expected to reinstate 1995 regulations."},
{date:"Dec 2026",status:"deadline",title:"SEC Treasury Clearing Mandate (Phase 1)",reg:"eslr",desc:"First compliance date for mandatory central clearing of Treasury securities."},
{date:"Jun 2027",status:"deadline",title:"SEC Treasury Clearing Mandate (Phase 2)",reg:"eslr",desc:"Second compliance date extending mandatory clearing to additional transactions."},
{date:"2028\u20132029",status:"expected",title:"Basel III Endgame Implementation",reg:"endgame",desc:"Earliest potential effective date for the re-proposed Endgame rule, with multi-year phase-in expected."},
{date:"2026",status:"expected",title:"Volcker Rule Simplification Proposals",reg:"volcker",desc:"Potential further easing of compliance requirements for less-active trading banks. No formal NPR yet, but the administration has signaled continued interest in streamlining."},
{date:"2026",status:"expected",title:"SCCL Recalibration Discussion",reg:"sccl",desc:"Potential exposure measurement changes if Endgame re-proposal modifies SA-CCR methodology. Digital asset exposure treatment also under review."},
{date:"2026",status:"expected",title:"IRRBB Supervisory Tightening",reg:"irrbb",desc:"Post-SVB heightened examination focus on unrealized losses, deposit modeling, and AOCI treatment. Basel Committee revised IRRBB shocks effective Jan 2026. U.S. formal rulemaking tied to Endgame AOCI opt-out decision."},
{date:"2026",status:"expected",title:"Tailoring Category Recalibration",reg:"tailoring",desc:"Endgame re-proposal may adjust requirements for Category III/IV banks. Post-2023 bank failures fueled debate over whether mid-sized banks warrant stricter standards."},
{date:"2026",status:"expected",title:"Capital Planning Supervisory Tightening",reg:"sr1519",desc:"Post-2023 heightened examination focus on capital planning governance, model risk, and effective challenge. Fed issued new supervisory operating principles (Nov 2025) focusing examiners on material financial risks."}
];

/* ST (status badges) defined here; G (glossary) defined in glossary.js */
const ST={final:{bg:"rgba(34,197,94,.12)",bd:"rgba(34,197,94,.25)",tx:"#4ade80",lb:"FINAL RULE"},expected:{bg:"rgba(250,204,21,.08)",bd:"rgba(250,204,21,.2)",tx:"#facc15",lb:"EXPECTED"},deadline:{bg:"rgba(248,113,113,.08)",bd:"rgba(248,113,113,.2)",tx:"#f87171",lb:"DEADLINE"}};
