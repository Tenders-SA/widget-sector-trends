export interface SectorData {
  sector: string
  tenderCount: number
  totalValue: number
}

export interface WidgetConfig {
  province?: string
  category?: string
  theme?: 'light' | 'dark'
  limit?: number
  apiBase?: string
}
