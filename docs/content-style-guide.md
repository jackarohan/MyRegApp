# MyRegApp Content Style Guide — Writing for a Static Reference

MyRegApp is a point-in-time reference, not a news site. Every sentence must remain **true indefinitely** without maintenance. These rules govern all content in `data/regulations.js`, `data/glossary.js`, `data/basel3explorer.js`, and any prose in `index.html`.

## The rules

1. **One clock.** The site has exactly one as-of anchor: `META.asOf` in `data/regulations.js`. No other freshness signals — no "currently", no per-section "updated" notes, no live-countdown language, no NEW/UPDATED tags.

2. **Past-anchored events.** Every event is stated with its date, in past tense: "In March 2026, the agencies proposed…", "Effective April 1, 2026, the eSLR buffer equals…". Never "recently", "just", "newly", "the new rule".

3. **No live deadlines.** Never "comments are due June 18" or "agencies must adopt rules by July 18, 2026". Instead: "The comment period closed June 18, 2026" or "The statute set a July 18, 2026 rulemaking deadline; the OCC and Treasury issued proposals in mid-2026."

4. **Anchored expectations only.** "Expected", "pending", "anticipated", "under review" may appear *only* (a) inside an Outlook subsection or a `kind:"outlook"` timeline entry, and (b) anchored to a date: "As of July 2026, finalization was expected in Q4 2026." Bare future tense about regulators' actions is banned.

5. **Snapshot tables carry their date.** Any table of firm-specific or indexed figures (G-SIB surcharges, CRA asset thresholds, SCB ranges) gets its as-of date in the title or footnote: "G-SIB Method 2 surcharges (as of the October 2025 determination)".

6. **Requirements = rule in force as of `META.asOf`.** The Requirements subsection states the rule in force, naming its effective date once ("in effect since April 1, 2026") — never framed as new vs. old. Prior-rule comparisons live in Key Concepts or Outlook history only where genuinely instructive.

7. **Cross-reg single ownership.** Each shared concept has one owning regulation:
   - Tailoring / Category I–IV → `tailoring`
   - G-SIB scoring and surcharges → `gsib`
   - SCB mechanics → `scb`
   - Endgame reproposal detail → `endgame`
   - DFAST/CCAR mechanics → `stress-testing`

   Other regulations get at most one sentence plus `{{ref:owner}}`. The $100B/$250B thresholds may be *stated* wherever they define scope, but *explained* only in tailoring.

8. **Key Points are a skim layer.** `kp` bullets intentionally restate the adjacent paragraphs — never trim them for that redundancy. Dedup rules apply across sections and across regulations only.

9. **`sum` is an abstract, not a copy.** `reg.sum` must not near-duplicate Overview `c[0]`. Write it as a one-sentence "what this is and why it matters".

10. **Timeline entries are labels, not narratives.** ≤ ~90 characters, facts only; the Outlook paragraphs carry the analysis.

11. **Link, don't embed, volatile figures.** No bank-specific dollar estimates that drift; formula-level detail links to the Federal Register source in `reg.src` rather than being embedded.

12. **Banned-word lint.** Mechanically check for `currently|recently|now |soon|upcoming|not yet|awaiting|is expected|will be finalized|remains pending|to date|as of this writing`. Each hit must either sit in an Outlook context with a date anchor in the same sentence/paragraph, or be rewritten. Human-adjudicated — the grep finds candidates, judgment decides.

## When updating `META.asOf`

Changing the as-of date is a content event, not a label edit: it requires re-verifying every Outlook subsection and every `kind:"outlook"` timeline entry against primary sources, then updating them to the new anchor. See `.claude/skills/version-bump/SKILL.md`.
