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

Extracted from Figma. All values go in `globals.css` as CSS custom properties.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0e0e10` | Page background |
| `--color-surface` | `#121212` | Card / panel background |
| `--color-border` | `#242328` | All borders |
| `--color-text-primary` | `#d8d8d8` | Primary body text |
| `--color-text-secondary` | `#676767` | Muted / secondary text |
| `--color-accent` | `#9d894e` | Accent — gold, used sparingly |
| `--color-white` | `#ffffff` | Pure white — button labels, high-contrast text |

## Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family-base` | `'Inter', sans-serif` | All text — one font throughout |
| `--font-weight-regular` | `400` | Body text |
| `--font-weight-bold` | `700` | Bold emphasis — used sparingly for inline highlights |
| `--font-size-sm` | `14px` | Base text size (aligns with Figma) |
| `--line-height-sm` | `17.52px` | Tight line height for small text |
| `--line-height-md` | `20px` | Standard line height |
| `--line-height-lg` | `23px` | Loose line height |

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
| `--space-8` | `32px` |
| `--space-12` | `48px` |
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
