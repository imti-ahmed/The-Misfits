# DESIGN.md — The Misfits

## Source of Truth
Design tokens are defined below, extracted from the Figma file. All tokens live in `globals.css`. Do not hardcode any color, font, spacing, or shadow values in component files — always reference a token.

## How to Use
- Colors → `var(--color-*)`
- Typography → `var(--font-*)`
- Spacing → `var(--space-*)`
- Shadows → `var(--shadow-*)`
- Border radius → `var(--radius-*)`
- Always check `globals.css` before writing any new styles.
- If a token doesn't exist for something, flag it and ask before inventing a new value.

## Design Philosophy

The Misfits is built around structure, clarity, and a hint of the past.

- **Grid-first:** Everything lives on a grid. Layouts are boxy, defined, and deliberate. No fluid organic shapes.
- **Minimal palette:** Near-black backgrounds, grey text, and a restrained gold accent. Color signals meaning — it doesn't decorate.
- **Retro-computerized:** The aesthetic recalls early web, terminal UIs, and 90s software interfaces — structured, utilitarian, and slightly cold. Not nostalgic kitsch, just honest function.
- **Typography as structure:** Inter is used throughout. Type is part of the grid — size and weight create hierarchy, not decoration.
- **Restrained animation:** GSAP is used purposefully. Transitions should feel mechanical and precise — not bouncy or playful. Grid reveals, slide-ins, and deliberate state changes.

## Color Tokens

Extracted from Figma (Success Screen redesign, node 162:1832). All values go in `globals.css` as CSS custom properties.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#111111` | Page background |
| `--color-surface` | `#1c1c1c` | Card / panel background |
| `--color-surface-alt` | `#363636` | Secondary/neutral label background (e.g. "copy the url" pill) |
| `--color-border` | `#474747` | All borders |
| `--color-text-primary` | `#d8d8d8` | Primary body text |
| `--color-text-secondary` | `#8d8d8d` | Muted / secondary text, inline links |
| `--color-text-tertiary` | `#c7c7c7` | Text on `--color-surface-alt` labels |
| `--color-text-placeholder` | `#676767` | Form field placeholder text (darker/dimmer than --color-text-secondary) |
| `--color-text-inverted` | `#161616` | Near-black text on light accent badges |
| `--color-white` | `#ffffff` | Pure white — high-contrast text on dark/blue badges |
| `--color-black` | `#000000` | Pure black — text on bright yellow/green badges |
| `--color-accent-yellow` | `#ffc62b` | Accent badge — join / github / contact / click-to-join labels |
| `--color-accent-purple` | `#944bc4` | Accent badge — how it works / site stats labels |
| `--color-accent-green` | `#65d35f` | Accent badge — ticker bar / return home / author's note labels |
| `--color-accent-blue` | `#356aff` | Accent badge — widget / update widget labels |
| `--color-accent-pink` | `#c44b86` | Accent badge — select a widget / active members labels |

## Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family-base` | `'Inter', sans-serif` | All text — one font throughout |
| `--font-weight-regular` | `400` | Body text |
| `--font-weight-bold` | `700` | Bold emphasis — used sparingly for inline highlights |
| `--font-size-sm` | `14px` | Base text size (aligns with Figma) |
| `--font-size-md` | `clamp(16px, ~fluid, 22px)` | Header tag/button label size — fluid, scales with viewport width (16px at <=768px, 22px at >=1920px) |
| `--font-size-body` | `clamp(14px, ~fluid, 18px)` | Content box / paragraph body text (Chivo, not Chivo Mono) — fluid, scales with viewport width (14px at <=768px, 18px at >=1920px) |
| `--line-height-sm` | `17.52px` | Tight line height for small text |
| `--line-height-md` | `20px` | Standard line height |
| `--line-height-lg` | `23px` | Loose line height |
| `--line-height-body` | `1.3125` (unitless) | Content box / paragraph body text line height — unitless so it scales proportionally with the fluid --font-size-body |

**Fluid typography:** `--font-size-md` and `--font-size-body` are only consumed by the new-design atoms (HeaderTag, NavTag, MarqueeTag, StackedTag, TaggedSection) — never by widgets or the old design — so they were safe to make fluid via `clamp()` without affecting embedded widgets on other people's sites. `--font-size-sm` and other legacy tokens stay fixed-px.

**1400–1700px dip:** both tokens intentionally dip down to 12px across the 1700px→1400px viewport range (interpolated, not a hard jump), staying pinned at 12px below 1400px, before resuming the normal 768–1920px fluid curve above 1700px. Implemented as two `@media (max-width: ...)` overrides of the `:root` custom properties in globals.css, since a single `clamp()` can't express a non-monotonic/piecewise curve.

**Secondary fonts (Chivo, Chivo Mono, Familjen Grotesk, Doto):** loaded via `next/font` in `layout.tsx` and exposed as CSS variables (`--font-chivo`, `--font-chivo-mono`, `--font-familjen-grotesk`, `--font-doto`) on `<body>`. These are NOT `:root` tokens — `:root` is the `<html>` element, an ancestor of `<body>`, so it cannot see variables scoped to `<body>`. Reference them directly at the point of use with a fallback, e.g. `font-family: var(--font-chivo-mono, 'Chivo Mono', monospace);` — this matches every widget component already in the codebase.

**Chivo vs Chivo Mono:** Chivo Mono (monospace) is used for header tags/buttons/labels — short, uppercase, structural UI text. Plain Chivo (sans-serif, not mono) is used for longer-form body/paragraph copy inside content boxes.

## Spacing Tokens

4px base scale. To be confirmed as components are built.

| Token | Value |
|-------|-------|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-2-5` | `10px` |
| `--space-3` | `12px` |
| `--space-3-5` | `14px` |
| `--space-4` | `16px` |
| `--space-4-5` | `18px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-7` | `28px` |
| `--space-8` | `32px` |
| `--space-10-5` | `42px` |
| `--space-12` | `48px` |
| `--space-12-5` | `50px` |
| `--space-14` | `56px` |
| `--space-16` | `64px` |

## Anticipated Token Categories (to be expanded)

| Token Group | Status |
|-------------|--------|
| `--radius-*` | Not yet defined |
| `--shadow-*` | Not yet defined |
| `--border-*` | Not yet defined — currently using `--color-border` directly |

## Rules
- No inline styles.
- No hardcoded hex, rgb, or rem values outside of `globals.css`.
- No external UI libraries unless explicitly approved.
- Every new component must use existing tokens only.
- If a token doesn't exist for what you need, **flag it and ask** — do not invent values.
