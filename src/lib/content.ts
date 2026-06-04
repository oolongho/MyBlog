import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { PostMeta, PostData } from '@/types/post'

const CONTENT_DIR = path.resolve(process.cwd(), 'content/posts')

function getMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(dir, f))
}

function formatDate(d: unknown): string {
  if (d == null) return ''
  if (d instanceof Date) return d.toISOString().slice(0, 10)
  return String(d)
}

function parseFile(filePath: string): PostData {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const slug = path.basename(filePath, '.md')
  return {
    slug,
    title: data.title ?? slug,
    date: formatDate(data.date),
    tags: data.tags ?? [],
    series: data.series || undefined,
    seriesOrder: data.seriesOrder || undefined,
    excerpt: data.excerpt || undefined,
    cover: data.cover || undefined,
    content,
  }
}

let _postsCache: PostData[] | null = null

export function getAllPosts(): PostData[] {
  if (_postsCache) return _postsCache
  _postsCache = getMdFiles(CONTENT_DIR).map(parseFile).sort((a, b) => b.date.localeCompare(a.date))
  return _postsCache
}

export function clearCache(): void {
  _postsCache = null
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPosts().map(({ content, ...meta }) => {
    const cleaned: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(meta)) {
      if (v !== undefined) cleaned[k] = v
    }
    return cleaned as PostMeta
  })
}

export function getPostBySlug(slug: string): PostData | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined
  return parseFile(filePath)
}

export function getAllTags(): Record<string, number> {
  const posts = getAllPostsMeta()
  const tags: Record<string, number> = {}
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      tags[tag] = (tags[tag] ?? 0) + 1
    }
  }
  return tags
}

export function getAllSeries(): Record<string, number> {
  const posts = getAllPostsMeta()
  const series: Record<string, number> = {}
  for (const post of posts) {
    if (post.series) {
      series[post.series] = (series[post.series] ?? 0) + 1
    }
  }
  return series
}
