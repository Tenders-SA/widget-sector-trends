import { WidgetConfig, SectorData } from './types'
import { fetchSectorTrends } from './api'
import { injectStyles } from './styles'
import { renderChart } from './renderer'

export { fetchSectorTrends, buildSectorTrendsUrl } from './api'
export { formatCompactNumber, formatCurrency } from './format'
export type { SectorData, WidgetConfig } from './types'

export class SectorTrendsWidget {
  private container: HTMLElement
  private config: Required<WidgetConfig>
  private cleanupRender: (() => void) | null = null
  private cleanupStyles: (() => void) | null = null
  private destroyed = false
  private resizeObserver: ResizeObserver | null = null
  private intersectionObserver: IntersectionObserver | null = null
  private lastData: SectorData[] | null = null

  constructor(container: HTMLElement, config?: WidgetConfig) {
    this.container = container
    this.config = {
      province: config?.province ?? 'all',
      category: config?.category ?? 'all',
      theme: config?.theme ?? 'light',
      limit: config?.limit ?? 8,
      apiBase: config?.apiBase ?? 'https://tenders-sa.org',
    }
  }

  async render(): Promise<void> {
    if (this.destroyed) return

    this.cleanupStyles = injectStyles()
    this.buildShell()
    this.showLoading()

    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        this.loadAndRender()
        this.intersectionObserver?.disconnect()
        this.intersectionObserver = null
      }
    })
    this.intersectionObserver.observe(this.container)
  }

  private buildShell(): void {
    const isDark = this.config.theme === 'dark'

    this.container.innerHTML = `
      <div class="tss-widget tss-${this.config.theme}">
        <div class="tss-header">
          <div class="tss-header-left">
            <span class="tss-header-indicator"></span>
            <span class="tss-header-title">National Sector Trends</span>
          </div>
          <a class="tss-header-link"
             href="https://www.tenders-sa.org/sa-tenders/categories?utm_source=embed&utm_campaign=sector-trends"
             target="_blank"
             rel="noopener noreferrer">
            Powered by TenderSA
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
        <div class="tss-chart">
          <svg xmlns="http://www.w3.org/2000/svg"></svg>
          <div class="tss-tooltip"></div>
        </div>
        <div class="tss-footer">
          <a class="tss-footer-link"
             href="https://www.tenders-sa.org/sa-tenders/categories?utm_source=embed_cta&utm_campaign=sector-trends"
             target="_blank"
             rel="noopener noreferrer">
            View Market Intelligence on TenderSA \u2192
          </a>
        </div>
      </div>
    `
  }

  private getChartEls(): { svg: SVGSVGElement; tooltip: HTMLElement } | null {
    const widget = this.container.firstElementChild
    if (!widget) return null
    const chart = widget.querySelector('.tss-chart')
    if (!chart) return null
    const svg = chart.querySelector('svg')
    const tooltip = chart.querySelector('.tss-tooltip') as HTMLElement
    if (!svg || !tooltip) return null
    return { svg: svg as unknown as SVGSVGElement, tooltip }
  }

  private showLoading(): void {
    const chart = this.container.querySelector('.tss-chart')
    if (!chart) return
    const svg = chart.querySelector('svg')
    if (svg) (svg as unknown as HTMLElement).style.display = 'none'
    chart.innerHTML += `
      <div class="tss-loading">
        <div class="tss-loading-track">
          <div class="tss-loading-bar"></div>
        </div>
      </div>
    `
  }

  private clearLoading(): void {
    const loading = this.container.querySelector('.tss-loading')
    if (loading) loading.remove()
    const svg = this.container.querySelector('.tss-chart svg')
    if (svg) (svg as HTMLElement).style.display = ''
  }

  private async loadAndRender(): Promise<void> {
    if (this.destroyed) return

    try {
      const data = await fetchSectorTrends(this.config.apiBase, {
        province: this.config.province,
        category: this.config.category,
        limit: this.config.limit,
      })
      if (this.destroyed) return
      this.lastData = data
      this.clearLoading()
      this.renderChart(data)
      this.setupResizeObserver()
    } catch (err) {
      if (this.destroyed) return
      this.clearLoading()
      this.showError(err instanceof Error ? err.message : 'Failed to load sector trends')
    }
  }

  private renderChart(data: SectorData[]): void {
    const els = this.getChartEls()
    if (!els) return
    if (data.length === 0) {
      const chart = this.container.querySelector('.tss-chart')
      if (chart) {
        chart.innerHTML += '<div class="tss-empty">No sector data available.</div>'
      }
      return
    }
    const handle = renderChart(els.svg, data, els.tooltip, this.config.theme)
    this.cleanupRender = () => {
      handle.cleanup()
      this.cleanupRender = null
    }
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.lastData || this.destroyed) return
      const els = this.getChartEls()
      if (!els) return
      if (this.cleanupRender) this.cleanupRender()
      const handle = renderChart(els.svg, this.lastData, els.tooltip, this.config.theme)
      this.cleanupRender = () => {
        handle.cleanup()
        this.cleanupRender = null
      }
    })
    this.resizeObserver.observe(this.container)
  }

  private showError(message: string): void {
    const chart = this.container.querySelector('.tss-chart')
    if (!chart) return
    chart.innerHTML += `
      <div class="tss-error">
        <div class="tss-error-message">${escapeHtml(message)}</div>
        <button class="tss-error-retry">Try Again</button>
      </div>
    `
    const btn = chart.querySelector('.tss-error-retry')
    btn?.addEventListener('click', () => {
      const errorEl = chart.querySelector('.tss-error')
      if (errorEl) errorEl.remove()
      this.showLoading()
      this.loadAndRender()
    })
  }

  destroy(): void {
    this.destroyed = true
    this.intersectionObserver?.disconnect()
    this.intersectionObserver = null
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    if (this.cleanupRender) this.cleanupRender()
    if (this.cleanupStyles) this.cleanupStyles()
    this.container.innerHTML = ''
  }
}

export function init(options?: WidgetConfig): SectorTrendsWidget[] {
  const containers = document.querySelectorAll<HTMLElement>('[data-tendersa-sector-trends]')
  return Array.from(containers).map((el) => {
    const config: WidgetConfig = {
      province: el.dataset.province || options?.province,
      category: el.dataset.category || options?.category,
      theme: (el.dataset.theme as 'light' | 'dark') || options?.theme || 'light',
      limit: Number(el.dataset.limit) || options?.limit || 8,
      apiBase: options?.apiBase,
    }
    const widget = new SectorTrendsWidget(el, config)
    widget.render()
    return widget
  })
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init())
  } else {
    init()
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(str))
  return div.innerHTML
}
