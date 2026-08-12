# AGENTS.md

This file records the durable project context and working rules for agents contributing to this repository.

## Project purpose

- This is Zhuo's Chinese personal blog and project archive.
- The site presents articles, projects, and a verifiable learning process for recruiters and people working in similar technical areas.
- Public-facing personal name: `Zhuo`.
- Never invent dates, employment history, results, metrics, personal experiences, or project outcomes. Published facts must be supported by this repository, a linked public repository, or another explicit source supplied by the user.
- Validation metrics must not be described as test metrics. Preserve the distinction between observations, evidence, and conclusions.

## Product and visual direction

- Visual direction: a blue-toned computational editorial style with expressive composition and restrained interaction.
- Article reading surfaces should stay quieter and simpler than the homepage.
- Prefer distinctive, useful interaction over decorative motion. Every interaction must work without hover.
- Respect `prefers-reduced-motion`; motion is progressive enhancement, never required for navigation or comprehension.
- Keep mobile layouts free of horizontal overflow and preserve comfortable touch targets, visible focus states, semantic headings, and readable contrast.
- The current profile photo must not be used to generate a new avatar.
- Do not use AI-generated portraits, generated robot mascots, or DiceBear for the site avatar. The desired replacement is a finished pixel-art asset from an online library with a verified reuse license. Store the chosen asset locally and record its source and license in the repository.

## Technical baseline

- Framework: Next.js 16 App Router, React 19, JavaScript/JSX, and MDX.
- Rendering and hosting: static export via `output: "export"`; build output is `out/` and is deployed to GitHub Pages.
- Images use `next/image` with `images.unoptimized: true`, which is required for static export.
- Fonts come from the local `geist` package plus the Chinese system font stack. Do not add remote CSS font imports.
- There is no backend, database, CMS, authentication, analytics, runtime API, or server-side search. Do not introduce one unless the user explicitly expands the project scope.
- The canonical site URL is defined once in `app/_data/site.js` as `siteConfig.siteUrl`.

## Public routes

- `/`
- `/articles`
- `/articles/[slug]`
- `/projects`
- `/projects/[slug]`
- `/about`

Old Museum, Garden, Lab, Map, and Now routes are intentionally unsupported and may return 404. New public routes must be included in the sitemap when appropriate.

## Important files

- `app/layout.jsx`: global metadata, fonts, structured data, header, footer, and skip link.
- `app/globals.css`: site tokens and shared responsive styles.
- `app/_data/site.js`: site identity, canonical URL, contact links, and primary navigation.
- `app/_data/articles.js`: article metadata plus the MDX module registry.
- `app/_data/site-data.js`: project metadata and verified project evidence.
- `app/_data/search.js`: shared browser-side search index derived from articles and projects.
- `app/_components/SiteHeader.jsx`: navigation and accessible global search dialog.
- `app/_components/FilterableGrid.jsx`: article/project search, tags, and URL state.
- `app/_components/PersonalPath.jsx`: homepage interest signals and shareable personalized route.
- `app/articles/_content/*.mdx`: article bodies.
- `app/sitemap.js` and `app/robots.js`: static discovery metadata.
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment.

## Content models

Articles in `app/_data/articles.js` use:

- `slug`
- `title`
- `description`
- `tags`
- `category`
- `readingTime`
- `keywords`

Every new article also needs an MDX file in `app/articles/_content/` and a matching entry in `articleModules`. The slug, registry key, filename, links, metadata, search index, and static params must stay consistent.

Projects in `app/_data/site-data.js` use:

- `slug`, `number`, `eyebrow`, `title`
- `summary`, `copy`, `category`
- `tags`, `href`, optional `demo`
- `accent`, `signal`, `question`, `role`, `highlights`

Only add claims that can be checked through the linked repository or an explicit source. If evidence is thin, use a concise project card instead of manufacturing a detailed case study.

## Search and URL-state rules

- Search and filtering run entirely in the browser.
- Article/project filters use `q` and `tag` query parameters so refresh, browser history, and shared links restore the state.
- The homepage personalized route uses `path` with up to three signal IDs.
- Chinese IME input must be composition-safe. Never write intermediate Latin keystrokes to the URL while `compositionstart` is active; synchronize the final value on `compositionend`.
- Search dialogs must trap keyboard focus while open, close with Escape, return focus to the trigger, and expose clear empty/reset states.

## Development workflow

```bash
npm install
npm run dev
npm run build
npm run start
```

- `npm run build` is the required baseline verification and must complete with all static routes generated.
- GitHub Pages uses Node.js 20, `npm ci`, `npm run build`, and uploads `out/`.
- Preserve unrelated working-tree changes. Do not delete, reset, or rewrite user work to obtain a clean tree.
- Do not commit generated `.next/`, `out/`, local caches, or temporary screenshots.
- Do not push, open a pull request, merge, or deploy unless the user has asked for that publishing action.

## Verification checklist

Before handing off a change, test what is relevant to its risk:

1. Run `npm run build` and confirm article pages, project pages, icons, sitemap, and robots output are generated.
2. Check desktop and common mobile widths for overflow, layout breakage, focus visibility, and touch usability.
3. Test global search, empty results, Escape close, focus restoration, and keyboard navigation.
4. Test article/project search with a Chinese IME, including composition text, clearing, query-parameter restoration, refresh, and back/forward navigation.
5. Test homepage personalized routes with zero to three signals, the maximum-selection state, copied URLs, refresh restoration, and reset behavior.
6. Test `prefers-reduced-motion: reduce` and confirm content remains understandable without animation.
7. Verify internal links and external evidence links. Do not silently replace broken evidence with unsupported copy.

## Asset provenance

- Prefer self-owned assets or reputable libraries with a clear license.
- Download external assets into the repository; do not depend on fragile hotlinks.
- Record the asset name, creator, source URL, license, modifications, and download date in an asset-credits file.
- Do not bypass a source site's access controls or download flow.
