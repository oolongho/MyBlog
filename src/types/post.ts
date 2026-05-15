export interface PostFrontmatter {
  title: string
  date: string
  tags?: string[]
  series?: string
  seriesOrder?: number
  excerpt?: string
  cover?: string
}

export interface PostMeta extends PostFrontmatter {
  slug: string
}

export interface PostData extends PostMeta {
  content: string
}
