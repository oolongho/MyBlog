import { getAllPostsMeta } from '@/lib/content'
import type { OnBeforePrerenderStartAsync } from 'vike'

export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async () => {
  const posts = getAllPostsMeta()
  return posts.map((post) => ({
    url: `/posts/${post.slug}`,
    pageContext: {
      routeParams: { slug: post.slug },
    },
  }))
}
