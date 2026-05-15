import { getAllPostsMeta, getAllTags, getAllSeries } from '@/lib/content'

export type Data = {
  posts: ReturnType<typeof getAllPostsMeta>
  tags: Record<string, number>
  series: Record<string, number>
}

async function data() {
  return {
    posts: getAllPostsMeta(),
    tags: getAllTags(),
    series: getAllSeries(),
  }
}

export { data }
