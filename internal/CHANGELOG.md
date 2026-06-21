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
| 8 | GuildSection component built | Built GuildSection from Figma frame (481px wide). Three sub-sections: guild info header + description, numbered members list (11 entries, name + URL in accent gold), update log footer bar with GitFork and CaretRight Phosphor icons. | Feature | components/sections/GuildSection.tsx, components/sections/GuildSection.module.css |
| 9 | GallerySection component built | Built GallerySection from Figma frame (1400px wide). Header with Plus icon, CSS marquee animation of 15 site screenshot images (duplicated for seamless loop, pauses on hover). Figma image URLs — placeholder until real member images added. | Feature | components/sections/GallerySection.tsx, components/sections/GallerySection.module.css |
| 10 | AnimationSection component built | Built AnimationSection from Figma frame (482px wide, 625px tall). Stats header with Eye + UserFocus + Plus Phosphor icons, Views and Members counters. Large 583px placeholder area for future GSAP animation. | Feature | components/sections/AnimationSection.tsx, components/sections/AnimationSection.module.css |
| 11 | Home screen assembled | Composed main page from all 7 section components. 1880px fixed layout with 20px page padding: GuildSection (left sidebar), AboutSection + RequirementSection + JoinSection (center column), AnimationSection + AuthorSection (right column), GallerySection (full-width bottom row). | Feature | app/page.tsx, app/page.module.css |
| 12 | Border collapse + viewport scaling | Fixed doubled borders: removed container-level borders from AboutSection and GallerySection (children's borders now form the outer edges). Added margin-top: -1px to non-first children in centerColumn and rightColumn. Created ScaleWrapper client component — scales the fixed 1920×1080 layout to fit any viewport using transform:scale() with resize listener. | Bug Fix | components/sections/AboutSection.module.css, components/sections/GallerySection.module.css, app/page.module.css, app/page.tsx, components/ScaleWrapper.tsx |
| 14 | GSAP particle interaction | Built CoolInteraction.tsx — canvas-based particle system with 120 floating ASCII chars, dots and numbers in accent gold. Hover slows particles via GSAP speed tween. Click-and-release fires a ripple wave that pushes nearby particles outward. Replaced placeholder image in AnimationSection. Installed gsap. | Feature | components/CoolInteraction.tsx, components/sections/AnimationSection.tsx, package.json |
| 13 | Width-fill scaling + member list numbering | Changed ScaleWrapper to scale by viewport width only (was using min of width/height, which left a gap on the right when browser chrome reduced viewport height). Members list numbering fixed: ol/li flex display overrides list-item and kills decimal markers — switched to block layout with margin-top spacing and display:block on name/url spans. | Bug Fix | components/ScaleWrapper.tsx, components/sections/GuildSection.module.css |

## Session 2 — 2026-06-22

| # | Title | Description | Type | Files Changed |
|---|-------|-------------|------|---------------|
| 1 | Data layer + ring mechanics | Installed gray-matter. Created content/sites/ with 5 dummy member markdown files. Built lib/sites.ts (reads + parses all .md files, returns typed Site[]). Built lib/ring.ts (getRingNeighbors returns prev/next by alphabetical slug with wrap-around). Wired getSites() into GuildSection replacing hardcoded MEMBERS array. | Feature | content/sites/*.md, lib/sites.ts, lib/ring.ts, components/sections/GuildSection.tsx, package.json |

---

_Types: Setup · Feature · Bug Fix · Update · Refactor · Config · Copy_
