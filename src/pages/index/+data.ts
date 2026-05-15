import { getAllPostsMeta } from '@/lib/content'
import type { PostMeta } from '@/types/post'

export type Data = { posts: PostMeta[] }

async function data() {
  return { posts: getAllPostsMeta() }
}

export { data }
