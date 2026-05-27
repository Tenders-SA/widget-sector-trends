# @tendersa/widget-sector-trends

[![CI](https://github.com/Tenders-SA/widget-sector-trends/actions/workflows/ci.yml/badge.svg)](https://github.com/Tenders-SA/widget-sector-trends/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@tendersa/widget-sector-trends)](https://www.npmjs.com/package/@tendersa/widget-sector-trends)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Embeddable bar chart widget showing tender volume and value by sector across South Africa. Zero runtime dependencies — built as a standalone IIFE bundle.

![Sector Trends Widget preview](https://tenders-sa.org/images/widget-sector-trends-preview.png)

## Quick Start

Add a container element with the `data-tendersa-sector-trends` attribute:

```html
<div data-tendersa-sector-trends data-theme="light" data-limit="8"></div>
```

Include the script:

```html
<script src="https://cdn.jsdelivr.net/npm/@tendersa/widget-sector-trends@0.1/dist/widget-sector-trends.iife.js"></script>
```

The widget auto-initializes on DOMContentLoaded.

## Installation

### npm

```bash
npm install @tendersa/widget-sector-trends
```

```javascript
import { SectorTrendsWidget } from '@tendersa/widget-sector-trends'

const container = document.getElementById('my-chart')
const widget = new SectorTrendsWidget(container, {
  theme: 'dark',
  limit: 8,
})
widget.render()
```

### CDN (jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/@tendersa/widget-sector-trends@0.1/dist/widget-sector-trends.iife.js"></script>
```

### CDN (unpkg)

```html
<script src="https://unpkg.com/@tendersa/widget-sector-trends@0.1/dist/widget-sector-trends.iife.js"></script>
```

## Configuration

### Data Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-tendersa-sector-trends` | — | — | Activates the widget on this element |
| `data-theme` | `'light'` \| `'dark'` | `'light'` | Color theme |
| `data-limit` | `number` | `8` | Maximum number of sectors to display |
| `data-province` | `string` | `'all'` | Filter by province name |
| `data-category` | `string` | `'all'` | Filter by category name |

### JavaScript Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `'light'` \| `'dark'` | `'light'` | Color theme |
| `limit` | `number` | `8` | Maximum sectors to display |
| `province` | `string` | `'all'` | Province filter |
| `category` | `string` | `'all'` | Category filter |
| `apiBase` | `string` | `'https://tenders-sa.org'` | API base URL |

## JavaScript API

### `SectorTrendsWidget`

```javascript
import { SectorTrendsWidget, init } from '@tendersa/widget-sector-trends'

// Single widget
const widget = new SectorTrendsWidget(document.getElementById('chart'), {
  theme: 'dark',
  province: 'Gauteng',
  limit: 10,
})
widget.render()

// Auto-init all data-attribute containers
const widgets = init({ theme: 'dark' })

// Clean up
widget.destroy()
```

### `init(options?)`

Scans the document for `[data-tendersa-sector-trends]` elements and initializes a widget on each. Returns an array of `SectorTrendsWidget` instances.

### Utility Functions

```javascript
import { formatCompactNumber, formatCurrency, buildSectorTrendsUrl, fetchSectorTrends } from '@tendersa/widget-sector-trends'

formatCompactNumber(1500000)    // '1.5M'
formatCurrency(2500000)         // 'R 2.5M'
buildSectorTrendsUrl('https://tenders-sa.org', { limit: 5 })
fetchSectorTrends('https://tenders-sa.org', { province: 'Western Cape' })
```

## Data Source

The widget fetches data from the [Tenders-SA](https://tenders-sa.org) public API:

```
GET https://tenders-sa.org/api/widgets/sector-trends?limit=8&province=all&category=all
```

## Development

```bash
# Install dependencies
npm install

# Development with watch mode
npm run dev

# Type-check
npm run typecheck

# Run tests
npm test

# Production build
npm run build
```

### Build Output

| File | Format |
|------|--------|
| `dist/widget-sector-trends.js` | ES Module |
| `dist/widget-sector-trends.iife.js` | IIFE (browser global `TendersaSectorTrends`) |
| `dist/widget-sector-trends.umd.js` | UMD |
| `dist/index.d.ts` | TypeScript declarations |

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## License

MIT — see [LICENSE](LICENSE) for details.
