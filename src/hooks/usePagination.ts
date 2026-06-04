import { useEffect, useState } from 'react'

interface UsePaginationOptions {
  pageSize?: number
}

export function usePagination<T>(items: T[], options: UsePaginationOptions = {}) {
  const { pageSize = 10 } = options
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [items.length])

  const totalPages = Math.ceil(items.length / pageSize)
  const pagedItems = items.slice((page - 1) * pageSize, page * pageSize)

  return { page, setPage, totalPages, pagedItems }
}
