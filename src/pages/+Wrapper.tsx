import { ThemeProvider } from '@/components/theme-provider'

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
