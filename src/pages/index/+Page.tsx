import { useData } from 'vike-react/useData'
import { useState } from 'react'
import { ArticleCard } from '@/components/article-card'
import { Pagination } from '@/components/pagination'
import type { Data } from './+data'

const PAGE_SIZE = 10

export default function Page() {
  const { posts } = useData<Data>()
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  const paged = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">乌龙茶的博客</h1>
        <p className="mt-2 text-muted-foreground">hi 我是oolongho乌龙茶</p>
      </div>

      <div className="flex flex-col gap-3">
        {paged.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      <Pagination current={page} total={totalPages} onPageChange={setPage} />
    </div>
  )
}
