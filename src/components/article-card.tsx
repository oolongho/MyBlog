import { Badge } from '@/components/ui/badge'
import type { PostMeta } from '@/types/post'

export function ArticleCard({ post }: { post: PostMeta }) {
  return (
    <a
      href={`/posts/${post.slug}`}
      className="group block rounded-lg border border-border p-5 transition-colors hover:border-primary/40 hover:bg-accent/50"
    >
      <article>
        <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <time>{post.date}</time>
          {post.series && (
            <>
              <span>·</span>
              <span className="text-primary/80">{post.series}</span>
            </>
          )}
        </div>
        {post.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </article>
    </a>
  )
}
