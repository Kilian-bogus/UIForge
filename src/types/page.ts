export interface Page {
  id: string
  title: string
  slug: string
  description?: string
  rootComponentId: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'published' | 'scheduled'
  publishedAt?: string
  password?: string
  isHome?: boolean
  meta?: {
    title?: string
    description?: string
    ogImage?: string
  }
  settings?: {
    layout?: 'default' | 'fullwidth' | 'sidebar'
    customCSS?: string
    customJS?: string
  }
}
