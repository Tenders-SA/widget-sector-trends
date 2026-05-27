import { SectorData } from './types'

export const DEFAULT_API_BASE = 'https://tenders-sa.org'

export function buildSectorTrendsUrl(
  apiBase: string,
  params: { province?: string; category?: string; limit?: number }
): string {
  const url = new URL(`${apiBase}/api/widgets/sector-trends`)
  if (params.province && params.province !== 'all')
    url.searchParams.set('province', params.province)
  if (params.category && params.category !== 'all')
    url.searchParams.set('category', params.category)
  if (params.limit) url.searchParams.set('limit', String(params.limit))
  return url.toString()
}

export async function fetchSectorTrends(
  apiBase: string,
  params: { province?: string; category?: string; limit?: number }
): Promise<SectorData[]> {
  const url = buildSectorTrendsUrl(apiBase, params)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sector trends API error: ${res.status}`)
  const json = await res.json()
  if (!json.data) throw new Error('Invalid API response: missing data field')
  return json.data as SectorData[]
}
