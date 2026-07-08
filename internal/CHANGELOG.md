# CHANGELOG — The Misfits

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

## Session 3 — 2026-06-23

| # | Title | Description | Type | Files Changed |
|---|-------|-------------|------|---------------|
| 1 | New design tokens added | Added --color-white, --space-2-5 (10px), --space-4-5 (18px). Fixed --font-size-sm from 15px to 14px to match Figma. Updated globals.css and DESIGN.md. | Update | globals.css, DESIGN.md |
| 2 | FormSection built | Built FormSection from Figma frame (node 51:35). Two-part form with required fields (name, nickname, website, email, tags) and optional fields (bg color, text color, comments textarea), plus submit/discard action row. | Feature | components/sections/FormSection.tsx, components/sections/FormSection.module.css |
| 3 | Token --space-3-5 added | Added --space-3-5: 14px to globals.css and DESIGN.md. | Update | globals.css, DESIGN.md |
| 4 | SuccessSection built | Built SuccessSection from Figma frame (node 53:184). Three rows: confirmation message, iframe embed code field with copy icon, and action buttons (Go Back, Check Github Page, Contact Guild Leader). | Feature | components/sections/SuccessSection.tsx, components/sections/SuccessSection.module.css |
| 5 | PreviewSection built | Built PreviewSection from Figma frame (node 54:211). Two-column layout: left panel renders the selected widget preview (289×103px), right panel shows a formatted application number badge (e.g. Member Application [#012]). Accepts widgetPreview (ReactNode) and applicationNumber (number) props. | Feature | components/sections/PreviewSection.tsx, components/sections/PreviewSection.module.css |
| 6 | Token --space-5 added | Added --space-5: 20px to globals.css and DESIGN.md. | Update | globals.css, DESIGN.md |
| 7 | WidgetTicker built | Built WidgetTicker from Figma frame (node 54:222). Client component carousel — shows prev/center/next widgets with caret navigation. Center is selected (white border, 289×103px); sides scale to 73.5% with opacity 0.5 and no border. Accepts widgets array and optional onSelect callback. | Feature | components/sections/WidgetTicker.tsx, components/sections/WidgetTicker.module.css |
| 8 | JoinGuildSection built | Built JoinGuildSection from Figma frame (node 54:232). Header bar (Join The Guild + Plus icon) and static welcome/instructions content row. | Feature | components/sections/JoinGuildSection.tsx, components/sections/JoinGuildSection.module.css |
| 9 | Token --font-weight-bold added | Added --font-weight-bold: 700 to globals.css and DESIGN.md. | Update | globals.css, DESIGN.md |
| 12 | WidgetTicker + divider fixes | JoinGuildSection content height 105→113px to align bottom divider with GuildSection. WidgetTicker rewritten: single widget display (no side widgets), registry-sourced (WIDGET_IDS array), 171→220px height, white carets with BACK/NEXT label on hover. CenterColumn cleaned up (no DEMO_WIDGETS). | Feature | JoinGuildSection.module.css, WidgetTicker.tsx, WidgetTicker.module.css, CenterColumn.tsx |
| 11 | Header + gap fixes | JoinGuildSection header corrected to 48px to match all other section headers. centerColumn set to align-self: stretch with last-child flex: 1 to fill full height. FormSection submitRow set to flex: 1 to absorb remaining space in join view. | Bug Fix | JoinGuildSection.module.css, page.module.css, FormSection.module.css |
| 14 | Success screen assembled | Added "success" view to CenterColumn (3rd state after join). Wired FormSection to POST /api/apply which creates the member MD file in /members. On success, shows JoinGuildSection + PreviewSection (real widget rendered with submitted nickname) + SuccessSection (iframe embed code with real slug). SuccessSection now accepts slug + onGoBack props. FormSection is now fully controlled with all fields tracked and a submit handler. | Feature | CenterColumn.tsx, FormSection.tsx, SuccessSection.tsx, src/app/api/apply/route.ts |
| 13 | Widget011 built | Dark (#141414) pill widget, 300×29px. Doto SemiBold font (added to layout.tsx). Gold identity row (nickname + GuildMark + "THE MAKERS GUILD"). Gold pixel-art << and >> carets (SVG dot arrays) with list icon for random nav. Registered in WidgetRenderer and added to WidgetTicker. Fixed Widget004/007 overflow (added overflow:hidden + identity flex:1) and Widget008 top-clip (removed overflow:hidden, height→min-height). | Feature | Widget011.tsx, Widget011.module.css, layout.tsx, WidgetRenderer.tsx, WidgetTicker.tsx, Widget004.module.css, Widget007.module.css, Widget008.module.css |
| 10 | Form screen assembled (client-side view swap) | Assembled the form screen as a client-side view swap within the homepage. CenterColumn.tsx manages "home"/"join" state. Home view: AboutSection + RequirementSection + JoinSection. Join view: JoinGuildSection + WidgetTicker + FormSection. JoinSection updated to accept onJoin prop and style "this form here" as bold gold clickable trigger. FormSection updated to accept onDiscard prop. page.tsx updated to use CenterColumn. | Feature | components/CenterColumn.tsx, components/sections/JoinSection.tsx, components/sections/JoinSection.module.css, components/sections/FormSection.tsx, app/page.tsx |

## Session 4 — 2026-06-23

| # | Title | Description | Type | Files Changed |
|---|-------|-------------|------|---------------|
| 1 | Member health check script + workflow | Created scripts/check-members.mjs — reads all members/*.md, fetches each site URL (10s timeout), checks homepage HTML for guild widget embed, and raises a removal PR for any member whose site is down or widget is missing. Created .github/workflows/member-health-check.yml — runs every Monday at midnight UTC and supports manual dispatch. Removal PRs land on branches like removal/SLUG-YYYYMMDD with a table of issues found and merge/close instructions. | Feature | scripts/check-members.mjs, .github/workflows/member-health-check.yml |

---

_Types: Setup · Feature · Bug Fix · Update · Refactor · Config · Copy_
