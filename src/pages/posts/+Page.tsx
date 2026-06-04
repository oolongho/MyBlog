import { useData } from 'vike-react/useData'
import { useState } from 'react'
import { ArticleCard } from '@/components/article-card'
import { Pagination } from '@/components/pagination'
import { Badge } from '@/components/ui/badge'
import { usePagination } from '@/hooks/usePagination'
import type { Data } from './+data'

export default function Page() {
  const { posts, tags, series } = useData<Data>()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeSeries, setActiveSeries] = useState<string | null>(null)

  const filtered = posts.filter((post) => {
    if (activeTag && !(post.tags ?? []).includes(activeTag)) return false
    if (activeSeries && post.series !== activeSeries) return false
    return true
  })

  const { page, setPage, totalPages, pagedItems } = usePagination(filtered)

  return (
    <div>
      <h1 className="text-2xl font-bold">文章</h1>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {Object.entries(tags).map(([tag, count]) => (
          <Badge
            key={tag}
            variant={activeTag === tag ? 'default' : 'secondary'}
            className="cursor-pointer text-xs"
            onClick={() => {
              setActiveTag(activeTag === tag ? null : tag)
              setActiveSeries(null)
              setPage(1)
            }}
          >
            {tag} ({count})
          </Badge>
        ))}
      </div>

      {Object.keys(series).length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(series).map(([s, count]) => (
            <Badge
              key={s}
              variant={activeSeries === s ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => {
                setActiveSeries(activeSeries === s ? null : s)
                setActiveTag(null)
                setPage(1)
              }}
            >
              {s} ({count})
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {pagedItems.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">没有匹配的文章</p>
        )}
      </div>

      <Pagination current={page} total={totalPages} onPageChange={setPage} />
    </div>
  )
}
