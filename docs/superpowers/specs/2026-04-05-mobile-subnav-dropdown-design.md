# Mobile SubNav Dropdown Selector

## Context

On mobile, the subsection tab row (`SubNav` component) renders as horizontally-scrolling pill buttons. With 8-10 subsections per regulation and titles like "Scope & Applicability" or "Calculation Deep Dive", these buttons extend well beyond the viewport width, making the entire page feel wider and unprofessional. This redesign replaces the horizontal tab row with a compact dropdown selector on mobile only.

## Design

### Trigger Button (mobile only)

Replaces the horizontal tab row. Single full-width button:

```
[ 3/8    Current Subsection Title    ▼ ]
```

- **Layout:** Flex row — progress indicator (left), title (center/flex-1), chevron (right)
- **Progress:** `3/8` in `var(--text-xs)`, monospace, muted color (`var(--text4)`)
- **Title:** `var(--text-md)`, weight 600, `var(--amber)`
- **Chevron:** Rotates 180deg when dropdown is open (CSS transition)
- **Container:** `border-radius: 10px`, `background: var(--bg3)`, `border: 1px solid var(--border2)`, `padding: 12px 16px`, `min-height: 44px`
- **Copy link button** remains in the same row beside the trigger (existing layout preserved)

### Dropdown Panel

Absolute positioned below trigger, full content width:

- **Container:** `border-radius: 10px`, `background: var(--bg2)`, `border: 1px solid var(--border2)`, `box-shadow: 0 8px 24px rgba(0,0,0,0.25)`, z-index above content but below navbar
- **Max height:** `60vh` with `overflow-y: auto` (for 8+ subsections)
- **Animation:** 150ms ease-out slide-down + opacity fade

**Each item row:**
- Left: index number in monospace, muted (`var(--text5)`)
- Center: subsection title, `var(--text-md)`, weight 500
- Right: badge if applicable (reuses existing `SUB_BADGES` config)
- Active item: amber left border accent, amber text, `var(--amber-bg)` background
- Min height: 44px (touch accessible)
- Separated by `1px solid var(--border)` between items

### Interaction

- **Select:** Tap item to select and close
- **Dismiss:** Tap outside closes (transparent overlay catches taps, no visible dimming)
- **Escape key:** Closes dropdown
- **Focus management:** Opening focuses active item; arrow keys navigate; Enter selects
- **After selection:** Dropdown closes, trigger text updates, content swaps with existing `fade-in` animation

### Scope

- **Mobile only** (`useIsMobile()` — viewport < 768px). Desktop keeps existing flex-wrap tab layout unchanged.
- **Components modified:** `SubNav` — add conditional mobile branch
- **New sub-component:** Dropdown rendering logic (inline within SubNav or small helper)
- **No data file changes** — purely presentational
- **Breadcrumb unchanged** — already shows subsection context
- **Existing features preserved:** `SUB_BADGES`, copy-link button, `scrollTo` on selection

## Files to Modify

- `/Users/jackrohan/dev/MyRegApp/index.html` — `SubNav` component (lines ~497-524), CSS section for any new styles

## Verification

1. Open the app on a mobile viewport (< 768px) or use Chrome DevTools responsive mode
2. Navigate to any regulation with multiple subsections (e.g., Capital Adequacy — 10 subsections)
3. Confirm: trigger button shows current subsection title with progress indicator
4. Tap trigger: dropdown opens with all subsections listed, active one highlighted in amber
5. Select a different subsection: dropdown closes, content updates, trigger text updates
6. Tap outside dropdown: it dismisses
7. Resize to desktop (>= 768px): confirm original horizontal tab layout still works
8. Test with keyboard: Escape closes, arrow keys navigate, Enter selects
9. Verify no horizontal overflow — page should not be wider than viewport
