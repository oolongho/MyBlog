import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
