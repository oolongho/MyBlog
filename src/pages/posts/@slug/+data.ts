import { getPostBySlug, getAllPostsMeta } from '@/lib/content'
import type { PostData } from '@/types/post'

export type Data = { post: PostData | null }

function getData(slug: string): Data {
  const post = getPostBySlug(slug)
  return { post: post ?? null }
}

export default getData
