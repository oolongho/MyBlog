# 乌龙茶的博客 - 个人博客系统 Spec

## Why
构建一个托管在 GitHub Pages 上的个人博客，支持文章发布、友链、说说、评论互动、图片上传等功能，无需后端服务器，以 GitHub 作为数据后端。

## What Changes
- 初始化 Vite + React + TypeScript 项目（pnpm）
- 集成 Vike 作为 SSG 框架，实现 SSG + CSR 混合渲染
- 集成 shadcn + Tailwind CSS，自定义抹茶绿/荧光绿主题，支持暗黑/白天模式
- 实现博客文章系统（仓库内 Markdown 文件，SSG 构建）
- 实现友链系统（仓库内 JSON 配置，管理员通过 GitHub API 管理）
- 实现评论系统（Giscus + GitHub Discussions API 置顶/管理）
- 实现说说系统（仓库内 JSON 文件，短动态+图片，类似朋友圈）
- 实现图片上传（缤纷云 S3 兼容 API，客户端直传）
- 实现管理员认证（PAT 存储在 localStorage）
- 实现文章点赞（GitHub Reactions）
- 实现标签、系列、搜索功能
- 实现 SEO（sitemap + robots.txt + meta tags）
- 实现 GitHub Actions 自动构建部署

## Impact
- Affected code: 全新项目，无已有代码影响
- 外部依赖: GitHub API、缤纷云 S3 API、Giscus

---

## ADDED Requirements

### Requirement: 项目基础设施
系统 SHALL 使用 pnpm 作为包管理器，基于 Vite + React + TypeScript 初始化项目，并集成 Vike 作为 SSG 框架。

#### Scenario: 项目初始化
- **WHEN** 执行项目初始化
- **THEN** 生成 Vite + React + TypeScript 项目骨架，配置 Vike SSG，配置 pnpm

#### Scenario: SSG 构建
- **WHEN** 执行构建命令
- **THEN** Vike 将所有页面预渲染为静态 HTML，支持客户端水合（hydration）

### Requirement: 主题与样式系统
系统 SHALL 使用 shadcn + Tailwind CSS 构建UI，支持暗黑/白天模式切换，主题色为抹茶绿/荧光绿。

#### Scenario: 主题切换
- **WHEN** 用户点击主题切换按钮
- **THEN** 页面在暗黑模式和白天模式之间切换，主题色保持一致

#### Scenario: 响应式布局
- **WHEN** 在不同尺寸设备上访问
- **THEN** 页面自适应布局，移动端友好

### Requirement: 博客文章系统
系统 SHALL 从仓库内 `content/posts/` 目录读取 Markdown 文件，在构建时渲染为静态页面。

#### Scenario: 文章列表展示
- **WHEN** 访问首页
- **THEN** 显示最新文章列表，每篇文章显示标题、日期、标签、摘要

#### Scenario: 文章详情展示
- **WHEN** 访问文章页面 `/posts/:slug`
- **THEN** 完整渲染 Markdown 内容，支持 GFM、代码高亮、数学公式、表格、任务列表、脚注、目录导航

#### Scenario: Markdown frontmatter
- **WHEN** Markdown 文件包含 frontmatter
- **THEN** 解析 title、date、tags、series、excerpt、cover 等字段

### Requirement: 标签与系列系统
系统 SHALL 支持按标签和系列组织文章。

#### Scenario: 标签浏览
- **WHEN** 访问归档页标签分类
- **THEN** 显示所有标签及对应文章数量，点击标签显示该标签下所有文章

#### Scenario: 系列浏览
- **WHEN** 访问归档页系列分类
- **THEN** 显示所有系列及对应文章数量，点击系列显示该系列下所有文章（按顺序排列）

### Requirement: 搜索功能
系统 SHALL 提供客户端全文搜索，搜索文章标题和内容。

#### Scenario: 搜索文章
- **WHEN** 用户在搜索框输入关键词
- **THEN** 实时显示匹配的文章列表，高亮匹配关键词

#### Scenario: 搜索索引构建
- **WHEN** 执行构建
- **THEN** 自动生成搜索索引文件供客户端使用

### Requirement: 评论系统
系统 SHALL 集成 Giscus 作为评论系统，基于 GitHub Discussions。

#### Scenario: 文章评论
- **WHEN** 访问文章页面底部
- **THEN** 显示 Giscus 评论组件，支持 GitHub 登录评论和回复

#### Scenario: 评论置顶
- **WHEN** 管理员在管理面板操作置顶
- **THEN** 通过 GitHub Discussions API 将指定评论置顶显示

### Requirement: 管理员认证
系统 SHALL 支持 PAT（Personal Access Token）方式的管理员认证。

#### Scenario: 管理员登录
- **WHEN** 管理员在设置页输入 GitHub PAT
- **THEN** 验证 PAT 有效性，存储到 localStorage，标识为已登录

#### Scenario: 管理员身份验证
- **WHEN** 管理员执行管理操作
- **THEN** 使用存储的 PAT 调用 GitHub API，验证用户名为 oolongho

#### Scenario: 登出
- **WHEN** 管理员点击登出或清除密钥
- **THEN** 清除 localStorage 中的 PAT 和 S3 密钥

### Requirement: 友链系统
系统 SHALL 从仓库内 `content/friends.json` 读取友链数据，管理员可通过 GitHub API 在网页上管理。

#### Scenario: 友链展示
- **WHEN** 访问友链页
- **THEN** 显示所有友链卡片（头像、名称、描述、链接）

#### Scenario: 管理员添加友链
- **WHEN** 管理员在管理面板添加友链
- **THEN** 通过 GitHub API 更新 `content/friends.json` 文件，触发自动重新构建部署

#### Scenario: 管理员编辑/删除友链
- **WHEN** 管理员在管理面板编辑或删除友链
- **THEN** 通过 GitHub API 更新对应文件内容

### Requirement: 说说系统
系统 SHALL 支持短动态发布（类似朋友圈），数据存储在仓库内 `content/moments/` 目录的 JSON 文件中。

#### Scenario: 说说展示
- **WHEN** 访问说说页
- **THEN** 按时间倒序显示所有说说，每条包含内容、图片、时间

#### Scenario: 管理员发布说说
- **WHEN** 管理员在管理面板发布新说说
- **THEN** 通过 GitHub API 在 `content/moments/` 创建新 JSON 文件

### Requirement: 图片上传
系统 SHALL 支持管理员上传图片到缤纷云对象存储（S3 兼容 API）。

#### Scenario: 图片上传
- **WHEN** 管理员在图片上传页面选择图片
- **THEN** 图片上传到缤纷云 S3 存储桶，返回可访问的 URL

#### Scenario: S3 配置
- **WHEN** 管理员在设置页配置 S3 凭证
- **THEN** 将 Access Key、Secret Key、Endpoint、Bucket 存储到 localStorage

#### Scenario: 图片处理
- **WHEN** 上传图片
- **THEN** 使用 sharp 压缩和优化图片后再上传

### Requirement: 文章点赞
系统 SHALL 支持登录用户通过 GitHub Reactions 点赞文章。

#### Scenario: 显示点赞数
- **WHEN** 访问文章页面
- **THEN** 显示该文章对应 GitHub Discussion 的 👍 反应数量

#### Scenario: 点赞文章
- **WHEN** 已登录用户点击点赞按钮
- **THEN** 通过 GitHub API 在对应 Discussion 添加 👍 反应

### Requirement: 页面路由
系统 SHALL 提供以下页面路由：

| 路由 | 页面 | 渲染方式 |
|------|------|---------|
| `/` | 首页（文章列表） | SSG |
| `/posts/:slug` | 文章详情 | SSG |
| `/archive` | 归档（标签/系列/搜索） | SSG + CSR |
| `/friends` | 友链 | SSG |
| `/moments` | 说说 | SSG |
| `/about` | 关于 | SSG |
| `/admin` | 管理面板 | CSR only |

### Requirement: SEO 优化
系统 SHALL 自动生成 SEO 相关文件和标签。

#### Scenario: Sitemap 和 Robots.txt
- **WHEN** 执行构建
- **THEN** 自动生成 sitemap.xml 和 robots.txt

#### Scenario: Meta 标签
- **WHEN** 渲染任何页面
- **THEN** 包含正确的 title、description、Open Graph、Twitter Card 等 meta 标签

### Requirement: CI/CD 自动部署
系统 SHALL 通过 GitHub Actions 实现自动构建和部署到 GitHub Pages。

#### Scenario: Push 触发部署
- **WHEN** 推送代码到 main 分支
- **THEN** GitHub Actions 自动构建项目并部署到 GitHub Pages（oolongho.github.io）

### Requirement: 安全措施
系统 SHALL 实施以下安全措施：

- PAT 和 S3 密钥仅存储在管理员浏览器的 localStorage 中，不会暴露在代码或网络请求中
- Markdown 内容严格 sanitize，防止 XSS 攻击
- PAT 设置最小权限建议（仅 `repo` + `public_repo`）
- S3 Key 设置最小权限建议（仅允许上传到指定 bucket）
- 管理面板提供"清除所有密钥"按钮
- 管理员操作前验证用户名为 oolongho

### Requirement: 关于页
系统 SHALL 提供关于页面，显示博客名称"乌龙茶的博客"和简介"hi 我是oolongho乌龙茶"，以及头像 logo1.png。

#### Scenario: 关于页展示
- **WHEN** 访问关于页
- **THEN** 显示头像、博客名称、简介信息
