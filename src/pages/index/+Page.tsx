import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Page() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">乌龙茶的博客</h1>
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>欢迎</CardTitle>
            <CardDescription>hi 我是oolongho乌龙茶</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge>React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="outline">Vike</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button>默认按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="outline">轮廓按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
        </div>
      </div>
    </div>
  )
}
