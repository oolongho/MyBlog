import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  current: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ current, total, onPageChange }: PaginationProps) {
  if (total <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        variant="outline"
        size="icon-sm"
        disabled={current <= 1}
        onClick={() => onPageChange(current - 1)}
        aria-label="上一页"
      >
        <ChevronLeftIcon />
      </Button>
      <span className="text-sm text-muted-foreground">
        {current} / {total}
      </span>
      <Button
        variant="outline"
        size="icon-sm"
        disabled={current >= total}
        onClick={() => onPageChange(current + 1)}
        aria-label="下一页"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  )
}
