import { ThemeToggle } from '@/components/theme-toggle'

const navItems = [
  { label: '首页', href: '/' },
  { label: '归档', href: '/archive' },
  { label: '友链', href: '/friends' },
  { label: '说说', href: '/moments' },
  { label: '关于', href: '/about' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo1.png" alt="头像" className="size-8 rounded-full" />
          <span className="text-lg font-semibold text-primary">乌龙茶的博客</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileNav items={navItems} />
        </div>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

function MobileNav({ items }: { items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(!open)} aria-label="菜单">
        {open ? <XIcon /> : <MenuIcon />}
      </Button>
      {open && (
        <div className="absolute left-0 right-0 top-14 border-b border-border bg-background p-4">
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
