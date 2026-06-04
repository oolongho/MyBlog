import { useData } from 'vike-react/useData'
import { ArticleCard } from '@/components/article-card'
import { Pagination } from '@/components/pagination'
import { usePagination } from '@/hooks/usePagination'
import type { Data } from './+data'

export default function Page() {
  const { posts } = useData<Data>()
  const { page, setPage, totalPages, pagedItems } = usePagination(posts)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">乌龙茶的博客</h1>
        <p className="mt-2 text-muted-foreground">hi 我是oolongho乌龙茶</p>
      </div>

      <div className="flex flex-col gap-3">
        {pagedItems.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      <Pagination current={page} total={totalPages} onPageChange={setPage} />
    </div>
  )
}
