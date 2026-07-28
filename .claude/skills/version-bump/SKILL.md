---
name: version-bump
description: Version bump checklist for MyRegApp. Use whenever updating the app version number or the content as-of date — all locations must move together or deployed clients serve stale cached content.
---

When updating the MyRegApp version number, ALL of these must be updated together:

1. **`META` in `data/regulations.js`** — `const META={version:"X.Y.Z",asOf:"Month YYYY"}`. This is the single source for the footer version, the footer as-of date, and every "as of" label in the UI (Outlook badges, Timeline era chip, Explorer footnote).
2. **Service worker** — `CACHE_VERSION` in `sw.js` (e.g. `mra-vX.Y.Z`) **and** the version in the `sw.js` header comment. This is what actually invalidates deployed clients' caches.
3. **`<meta name="description">`** in `index.html` `<head>` — the "Content as of ..." date is static HTML and must be edited manually.
4. **File header comments** — `data/regulations.js`, `data/glossary.js`, `data/basel3explorer.js` (`/* MyRegApp vX.Y — ... */`). `index.html` has no header comment.
5. **`claude.md`** — the "Current version" line.

## Changing `META.asOf` is a content event

The as-of date asserts that every Outlook subsection and every `kind:"outlook"` timeline entry in `data/regulations.js` was verified against primary sources as of that date. Do NOT bump `asOf` as a label edit — re-verify (web search, primary sources) and update the forward-looking content first, per `docs/content-style-guide.md`, logging results in a `docs/factcheck-*.md` file.
