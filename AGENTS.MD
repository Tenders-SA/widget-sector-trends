# @tenders-sa-org/widget-sector-trends — Agent Instructions

**Path**: `widgets/widget-sector-trends/` | **Published**: [npm](https://npmjs.com/package/@tenders-sa-org/widget-sector-trends)

## What It Is
Pure SVG bar chart widget showing procurement activity by sector. Lazy-loads via IntersectionObserver, responsive via ResizeObserver.

## Quick Start
```bash
npm install
npm run build     # tsup: esm + iife (global: TendersaSectorTrends)
npm test          # vitest
npm version patch && npm publish   # manual publish
```

## Key Files
| File | Purpose |
|------|---------|
| `src/index.ts` | `SectorTrendsWidget` + auto-init via `[data-tendersa-sector-trends]` |
| `src/api.ts` | Fetches sector trends data |
| `src/renderer.ts` | Pure SVG bar chart with tooltips |
| `src/styles.ts` | CSS template string injected via `<style>` element |
| `src/types.ts` | Interfaces |
| `src/format.ts` | Number/currency formatting utilities |

## Architecture Notes
- **No Shadow DOM** — injects `<style>` tag into `<head>` via `injectStyles()`
- **IntersectionObserver**: lazy-loads only when visible in viewport
- **ResizeObserver**: responsive re-rendering on container resize
- **Pure SVG**: no canvas or Chart.js dependency
- **CTA footer** with UTM tracking links
- **Data attributes**: `data-province`, `data-category`, `data-theme`, `data-limit`

## Published
- v0.1.0 (initial)
