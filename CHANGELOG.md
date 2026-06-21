# CHANGELOG — The Makers Guild

_Internal development log. Updated by Claude after every completed task. One row per change. Sessions are separated by a header. This is not the public release log — see RELEASES.md for versioned public updates._

---

## Session 1 — 2026-06-21

| # | Title | Description | Type | Files Changed |
|---|-------|-------------|------|---------------|
| 1 | Project initialized | CLAUDE.md, DESIGN.md, CHANGELOG.md, RELEASES.md, README.md created. Internal Docs/ folder set up with ARCHITECTURE.md, DATA_FLOW.md, and COMPONENTS.md. | Setup | All |
| 2 | Design tokens extracted from Figma | Color and typography tokens pulled from the main page Figma frame and added to DESIGN.md. 6 color tokens, 6 typography tokens, 8 spacing tokens defined. | Update | DESIGN.md |
| 3 | Next.js project scaffolded | Manually initialized Next.js 15 app with TypeScript, App Router, CSS Modules. Created package.json, next.config.ts, tsconfig.json, eslint config, app/layout.tsx, app/page.tsx, app/globals.css with all design tokens as CSS variables. | Setup | package.json, next.config.ts, tsconfig.json, eslint.config.mjs, app/layout.tsx, app/page.tsx, app/globals.css |
| 4 | AboutSection component built | Built AboutSection from Figma frame. Header with Plus icon (Phosphor), two content rows with webring description text. Installed @phosphor-icons/react. | Feature | components/sections/AboutSection.tsx, components/sections/AboutSection.module.css |
| 5 | RequirementSection component built | Built RequirementSection from Figma frame. Header with Plus icon, content area with 7-item bulleted list of join requirements. | Feature | components/sections/RequirementSection.tsx, components/sections/RequirementSection.module.css |
| 6 | JoinSection component built | Built JoinSection from Figma frame. Header with Plus icon, single paragraph content block explaining how to join. | Feature | components/sections/JoinSection.tsx, components/sections/JoinSection.module.css |
| 7 | AuthorSection component built | Built AuthorSection from Figma frame (482px wide). Header with Plus icon, two-line content with accent-coloured link text for social links. | Feature | components/sections/AuthorSection.tsx, components/sections/AuthorSection.module.css |

---

_Types: Setup · Feature · Bug Fix · Update · Refactor · Config · Copy_
