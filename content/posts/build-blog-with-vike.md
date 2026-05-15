---
title: 用 Vike 搭建个人博客
date: 2026-05-10
tags: [React, Vike, SSG]
series: 博客搭建
seriesOrder: 1
excerpt: 使用 Vike + React + TypeScript 搭建一个支持 SSG 的个人博客站点。
---

## 为什么选择 Vike

Vike 是一个基于 Vite 的 SSR/SSG 框架，它的优势在于：

- **文件路由**：基于文件系统的路由，无需手动配置
- **SSG 支持**：构建时预渲染为静态 HTML，SEO 友好
- **Vite 生态**：完全兼容 Vite 插件和配置

## 技术栈

本项目使用了以下技术：

- **Vite** - 构建工具
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Tailwind CSS v4** - 样式
- **shadcn/ui** - 组件库

## 开始使用

```bash
pnpm create vite my-blog --template react-ts
cd my-blog
pnpm add vike vike-react
```

接下来配置 Vike 并创建页面文件即可。
