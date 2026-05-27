import { describe, it, expect } from 'vitest'
import { formatCompactNumber, formatCurrency } from '../src/format'
import { buildSectorTrendsUrl } from '../src/api'

describe('formatCompactNumber', () => {
  it('returns number as-is for values under 1000', () => {
    expect(formatCompactNumber(0)).toBe('0')
    expect(formatCompactNumber(500)).toBe('500')
    expect(formatCompactNumber(999)).toBe('999')
  })

  it('formats thousands with K suffix', () => {
    expect(formatCompactNumber(1000)).toBe('1.0K')
    expect(formatCompactNumber(1500)).toBe('1.5K')
    expect(formatCompactNumber(999_999)).toBe('1000.0K')
  })

  it('formats millions with M suffix', () => {
    expect(formatCompactNumber(1_000_000)).toBe('1.0M')
    expect(formatCompactNumber(2_500_000)).toBe('2.5M')
    expect(formatCompactNumber(999_999_999)).toBe('1000.0M')
  })

  it('formats billions with B suffix', () => {
    expect(formatCompactNumber(1_000_000_000)).toBe('1.0B')
    expect(formatCompactNumber(3_750_000_000)).toBe('3.8B')
  })
})

describe('formatCurrency', () => {
  it('prepends R and formats compact', () => {
    expect(formatCurrency(1_500_000)).toBe('R 1.5M')
    expect(formatCurrency(750_000)).toBe('R 750.0K')
    expect(formatCurrency(500)).toBe('R 500')
  })
})

describe('buildSectorTrendsUrl', () => {
  const base = 'https://tenders-sa.org'

  it('builds default URL with no params', () => {
    const url = buildSectorTrendsUrl(base, {})
    expect(url).toBe('https://tenders-sa.org/api/widgets/sector-trends')
  })

  it('ignores "all" province and category filters', () => {
    const url = buildSectorTrendsUrl(base, { province: 'all', category: 'all' })
    expect(url).not.toContain('province=')
    expect(url).not.toContain('category=')
  })

  it('applies province filter', () => {
    const url = buildSectorTrendsUrl(base, { province: 'Gauteng' })
    expect(url).toContain('province=Gauteng')
  })

  it('applies category filter', () => {
    const url = buildSectorTrendsUrl(base, { category: 'Construction' })
    expect(url).toContain('category=Construction')
  })

  it('applies limit parameter', () => {
    const url = buildSectorTrendsUrl(base, { limit: 10 })
    expect(url).toContain('limit=10')
  })

  it('combines multiple parameters', () => {
    const url = buildSectorTrendsUrl(base, {
      province: 'Western Cape',
      category: 'IT Services',
      limit: 5,
    })
    expect(url).toContain('province=Western+Cape')
    expect(url).toContain('category=IT+Services')
    expect(url).toContain('limit=5')
  })
})
