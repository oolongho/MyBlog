# 乌龙茶的博客

基于 Vite + React + TypeScript 的静态博客，托管在 GitHub Pages。

## 技术栈

- **框架**: Vite + React 19 + TypeScript
- **SSG**: Vike（静态站点生成 + 客户端水合）
- **样式**: Tailwind CSS v4 + shadcn/ui
- **主题**: 抹茶绿/荧光绿，暗黑/明亮模式切换
- **内容**: Markdown 文件 + gray-matter frontmatter
- **部署**: GitHub Pages + GitHub Actions

## 项目结构

```
content/posts/          # Markdown 文章
public/                 # 静态资源
src/
  components/           # 组件
    ui/                 # shadcn 组件
  lib/
    content.ts          # 内容加载与解析
    utils.ts            # 工具函数
  pages/                # Vike 文件路由
    index/              # 首页
    posts/              # 文章列表 + 详情
    friends/            # 友链
    moments/            # 说说
    about/              # 关于
    admin/              # 管理面板
  types/                # 类型定义
  index.css             # 全局样式与主题变量
```

## 页面路由

| 路由 | 页面 | 渲染方式 |
|------|------|---------|
| `/` | 首页（文章列表） | SSG |
| `/posts` | 文章（标签/系列筛选） | SSG |
| `/posts/:slug` | 文章详情 | SSG |
| `/friends` | 友链 | SSG |
| `/moments` | 说说 | SSG |
| `/about` | 关于 | SSG |
| `/admin` | 管理面板 | CSR |

## 开发

```bash
# 安装依赖
pnpm install

# 开发服务器
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 文章 Frontmatter

```yaml
---
title: 文章标题
date: 2026-05-14
tags: [标签1, 标签2]
series: 系列名
seriesOrder: 1
excerpt: 文章摘要
cover: /covers/example.jpg
---
```

## License

MIT
