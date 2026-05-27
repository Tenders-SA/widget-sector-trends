import { SectorData } from './types'
import { formatCurrency } from './format'

const CHART_PADDING = 24
const ROW_HEIGHT = 38
const CHART_TOP = 8
const CHART_BOTTOM = 8

const LIGHT_COLORS = [
  '#6366f1',
  '#818cf8',
  '#4f46e5',
  '#a5b4fc',
  '#7c3aed',
  '#8b5cf6',
  '#6d28d9',
  '#c4b5fd',
]

const DARK_COLORS = [
  '#818cf8',
  '#a5b4fc',
  '#6366f1',
  '#c7d2fe',
  '#8b5cf6',
  '#a78bfa',
  '#7c3aed',
  '#c4b5fd',
]

function truncateLabel(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars - 1) + '\u2026'
}

function ns(tag: string): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}

export interface RendererHandle {
  cleanup: () => void
}

export function renderChart(
  svgEl: SVGSVGElement,
  data: SectorData[],
  tooltipEl: HTMLElement,
  theme: 'light' | 'dark'
): RendererHandle {
  const isDark = theme === 'dark'
  const parent = svgEl.parentElement
  if (!parent) return { cleanup: () => {} }

  const width = parent.clientWidth || 400
  const availableWidth = width - CHART_PADDING
  const labelWidth = Math.min(120, availableWidth * 0.38)
  const valueWidth = Math.min(80, availableWidth * 0.22)
  const barMaxWidth = availableWidth - labelWidth - valueWidth - 16
  const barEffectiveWidth = Math.max(barMaxWidth, 20)

  const maxValue = Math.max(...data.map(d => d.totalValue), 1)
  const barHeight = Math.max(ROW_HEIGHT - 14, 14)
  const svgHeight = CHART_TOP + data.length * ROW_HEIGHT + CHART_BOTTOM

  svgEl.innerHTML = ''
  svgEl.setAttribute('width', String(width))
  svgEl.setAttribute('height', String(svgHeight))

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS
  const textColor = isDark ? '#94a3b8' : '#64748b'
  const valueColor = isDark ? '#e2e8f0' : '#334155'
  const lineColor = isDark ? '#1e293b' : '#f1f5f9'

  const barX = CHART_PADDING / 2 + labelWidth + 6
  const labelX = barX - 10
  const valueGap = 6

  const barElements: SVGRectElement[] = []

  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    const y = CHART_TOP + i * ROW_HEIGHT
    const barY = y + (ROW_HEIGHT - barHeight) / 2
    const barWidth = Math.max((d.totalValue / maxValue) * barEffectiveWidth, 4)
    const color = colors[i % colors.length]

    const label = ns('text') as SVGTextElement
    label.setAttribute('x', String(labelX))
    label.setAttribute('y', String(y + ROW_HEIGHT / 2 + 4))
    label.setAttribute('text-anchor', 'end')
    label.setAttribute('fill', textColor)
    label.setAttribute('font-size', '11')
    label.setAttribute('font-weight', '600')
    label.textContent = truncateLabel(d.sector, 16)
    svgEl.appendChild(label)

    const bar = ns('rect') as SVGRectElement
    bar.setAttribute('x', String(barX))
    bar.setAttribute('y', String(barY))
    bar.setAttribute('width', String(barWidth))
    bar.setAttribute('height', String(barHeight))
    bar.setAttribute('rx', '4')
    bar.setAttribute('ry', '4')
    bar.setAttribute('fill', color)
    bar.setAttribute('data-index', String(i))
    svgEl.appendChild(bar)
    barElements.push(bar)

    const valLabel = ns('text') as SVGTextElement
    valLabel.setAttribute('x', String(barX + barWidth + valueGap))
    valLabel.setAttribute('y', String(y + ROW_HEIGHT / 2 + 4))
    valLabel.setAttribute('fill', valueColor)
    valLabel.setAttribute('font-size', '11')
    valLabel.setAttribute('font-weight', '700')
    valLabel.textContent = formatCurrency(d.totalValue)
    svgEl.appendChild(valLabel)

    if (i < data.length - 1) {
      const sep = ns('line')
      sep.setAttribute('x1', String(CHART_PADDING / 2))
      sep.setAttribute('y1', String(y + ROW_HEIGHT))
      sep.setAttribute('x2', String(width - CHART_PADDING / 2))
      sep.setAttribute('y2', String(y + ROW_HEIGHT))
      sep.setAttribute('stroke', lineColor)
      sep.setAttribute('stroke-width', '1')
      svgEl.appendChild(sep)
    }
  }

  const onMouseEnter = (e: Event) => {
    const bar = e.currentTarget as SVGRectElement
    const index = Number(bar.getAttribute('data-index'))
    const datum = data[index]
    if (!datum) return
    const rect = bar.getBoundingClientRect()
    const chartRect = parent.getBoundingClientRect()
    const tx = rect.left - chartRect.left + rect.width / 2
    const ty = rect.top - chartRect.top - 6
    tooltipEl.innerHTML = `
      <div class="tss-tooltip-sector">${escapeHtml(datum.sector)}</div>
      <div class="tss-tooltip-value">${formatCurrency(datum.totalValue)}</div>
      <div class="tss-tooltip-count">${datum.tenderCount.toLocaleString()} active tenders</div>
    `
    tooltipEl.style.left = `${tx}px`
    tooltipEl.style.top = `${ty}px`
    tooltipEl.style.display = 'block'
  }

  const onMouseLeave = () => {
    tooltipEl.style.display = 'none'
  }

  for (const bar of barElements) {
    bar.addEventListener('mouseenter', onMouseEnter)
    bar.addEventListener('mouseleave', onMouseLeave)
  }

  return {
    cleanup: () => {
      for (const bar of barElements) {
        bar.removeEventListener('mouseenter', onMouseEnter)
        bar.removeEventListener('mouseleave', onMouseLeave)
      }
    },
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(str))
  return div.innerHTML
}
