# Tasks

## Phase 1: 项目初始化
- [x] Task 1: 初始化 Vite + React + TypeScript 项目
  - [x] 使用 pnpm create vite 初始化项目（React + TypeScript 模板）
  - [x] 配置 tsconfig.json（路径别名 @/ 等）
  - [x] 配置 vite.config.ts 基础设置

## Phase 2: SSG 框架集成
- [x] Task 2: 集成 Vike 作为 SSG 框架
  - [x] 安装 vike 及 vike-react 依赖
  - [x] 配置 Vike SSG（+config.ts 继承 vike-react + prerender）
  - [x] 创建基础页面文件结构（pages/）
  - [x] 验证 SSG 构建和客户端水合正常工作

## Phase 3: 样式与主题系统
- [x] Task 3: 集成 Tailwind CSS
  - [x] 安装 Tailwind CSS v4 及 @tailwindcss/vite
  - [x] 配置 tailwind 和全局样式文件
- [x] Task 4: 集成 shadcn 并自定义主题
  - [x] 初始化 shadcn（components.json + utils.ts + 依赖）
  - [x] 配置抹茶绿/荧光绿主题色（CSS 变量，oklch 色彩空间）
  - [x] 配置暗黑/白天模式切换（ThemeProvider + ThemeToggle + +Wrapper）
  - [x] 添加基础 shadcn 组件（Button、Card、Badge、Separator、Skeleton）

## Phase 4: 布局与导航
- [x] Task 5: 创建全局布局组件
  - [x] 创建 Header 组件（导航栏、主题切换、头像、移动端菜单）
  - [x] 创建 Footer 组件
  - [x] 创建 Layout 组件（Header + Content + Footer）+Layout.tsx
  - [x] 实现暗黑/白天模式切换逻辑（ThemeProvider + ThemeToggle + +Wrapper）

## Phase 5: 路由与页面骨架
- [x] Task 6: 创建所有页面路由
  - [x] 首页 `/`（index/+Page.tsx）
  - [x] 文章详情 `/posts/@slug`（+config.ts prerender: false）
  - [x] 归档 `/archive`
  - [x] 友链 `/friends`
  - [x] 说说 `/moments`
  - [x] 关于 `/about`
  - [x] 管理面板 `/admin`（+config.ts prerender: false）

## Phase 6: 内容系统
- [ ] Task 7: 实现 Markdown 内容加载
  - [ ] 定义 frontmatter 类型（title, date, tags, series, excerpt, cover）
  - [ ] 创建构建时内容收集脚本（读取 content/posts/ 下所有 .md 文件）
  - [ ] 解析 frontmatter 和 Markdown 内容
  - [ ] 生成内容清单（manifest）供页面使用
- [ ] Task 8: 创建示例内容
  - [ ] 创建 content/posts/ 目录
  - [ ] 添加 2-3 篇示例 Markdown 文章（含各种 frontmatter 组合）

## Phase 7: 首页
- [ ] Task 9: 实现首页文章列表
  - [ ] 创建 ArticleCard 组件（标题、日期、标签、摘要）
  - [ ] 实现文章列表布局（按日期倒序）
  - [ ] 实现分页功能

## Phase 8: 文章详情页
- [ ] Task 10: 实现 Markdown 渲染
  - [ ] 集成 react-markdown 及插件（remark-gfm, remark-math, rehype-katex, rehype-highlight 等）
  - [ ] 实现代码语法高亮
  - [ ] 实现目录导航（TOC）
  - [ ] 实现 Markdown sanitize（防 XSS）
  - [ ] 实现图片懒加载
- [ ] Task 11: 完善文章页面
  - [ ] 显示文章元信息（日期、标签、系列）
  - [ ] 实现文章底部导航（上/下篇）
  - [ ] 实现文章封面图展示

## Phase 9: 归档页
- [ ] Task 12: 实现标签和系列浏览
  - [ ] 创建标签列表组件（标签名 + 文章数）
  - [ ] 创建系列列表组件（系列名 + 文章数）
  - [ ] 实现点击标签/系列筛选文章
- [ ] Task 13: 实现搜索功能
  - [ ] 构建时生成搜索索引
  - [ ] 实现客户端搜索组件（实时搜索、结果高亮）
  - [ ] 集成 Fuse.js 或类似库

## Phase 10: 管理员认证
- [ ] Task 14: 实现 PAT 认证系统
  - [ ] 创建 AuthContext/AuthProvider
  - [ ] 实现设置页（输入 PAT、S3 凭证）
  - [ ] 实现 PAT 验证逻辑（调用 GitHub API 验证用户名是否为 oolongho）
  - [ ] 实现登出/清除密钥功能
  - [ ] 创建路由守卫（保护 /admin 路由）

## Phase 11: 评论系统
- [ ] Task 15: 集成 Giscus
  - [ ] 安装 @giscus/react
  - [ ] 在文章页面底部集成 Giscus 组件
  - [ ] 配置 Giscus（repo、category、mapping 等）
- [ ] Task 16: 实现评论管理
  - [ ] 通过 GitHub Discussions API 获取评论列表
  - [ ] 实现评论置顶功能（管理员操作）
  - [ ] 实现评论删除功能（管理员操作）

## Phase 12: 友链系统
- [ ] Task 17: 实现友链展示页
  - [ ] 创建 content/friends.json 数据文件
  - [ ] 创建友链卡片组件（头像、名称、描述、链接）
  - [ ] 实现友链页面布局
- [ ] Task 18: 实现友链管理
  - [ ] 在管理面板创建友链管理界面（添加/编辑/删除）
  - [ ] 通过 GitHub API 更新 content/friends.json
  - [ ] 实现友链表单验证

## Phase 13: 说说系统
- [ ] Task 19: 实现说说展示页
  - [ ] 创建 content/moments/ 目录和示例数据
  - [ ] 定义说说数据结构（id, date, content, images, tags）
  - [ ] 创建说说卡片组件（内容、图片、时间）
  - [ ] 实现说说页面布局（时间线样式）
- [ ] Task 20: 实现说说管理
  - [ ] 在管理面板创建说说发布界面
  - [ ] 通过 GitHub API 在 content/moments/ 创建新 JSON 文件
  - [ ] 支持说说配图上传（复用图片上传功能）

## Phase 14: 关于页
- [ ] Task 21: 实现关于页
  - [ ] 显示头像（logo1.png）
  - [ ] 显示博客名称"乌龙茶的博客"
  - [ ] 显示简介"hi 我是oolongho乌龙茶"

## Phase 15: 图片上传
- [ ] Task 22: 实现缤纷云 S3 图片上传
  - [ ] 创建 S3 客户端工具（基于 AWS S3 SDK，endpoint: oolongho.s3.bitiful.net）
  - [ ] 实现图片上传组件（选择文件、预览、上传）
  - [ ] 集成 sharp 进行图片压缩优化
  - [ ] 上传成功后返回可访问 URL 并支持复制

## Phase 16: 文章点赞
- [ ] Task 23: 实现文章点赞功能
  - [ ] 通过 GitHub Discussions API 读取文章对应 Discussion 的 👍 反应数
  - [ ] 创建点赞按钮组件（显示点赞数）
  - [ ] 已登录用户点击点赞按钮通过 API 添加 👍 反应
  - [ ] 未登录用户点击提示需要登录

## Phase 17: 管理面板
- [ ] Task 24: 实现管理面板
  - [ ] 创建管理面板布局（侧边栏导航）
  - [ ] 实现仪表盘（文章数、评论数等概览）
  - [ ] 集成友链管理、说说管理、评论管理、图片上传到管理面板
  - [ ] 实现设置页（PAT、S3 凭证配置、清除密钥）

## Phase 18: SEO 优化
- [ ] Task 25: 实现 SEO
  - [ ] 集成 vite-plugin-seo-files 生成 sitemap.xml 和 robots.txt
  - [ ] 为每个页面配置 meta 标签（title、description）
  - [ ] 配置 Open Graph 和 Twitter Card 标签
  - [ ] 配置 canonical URL

## Phase 19: CI/CD
- [ ] Task 26: 配置 GitHub Actions 自动部署
  - [ ] 创建 .github/workflows/deploy.yml
  - [ ] 配置 push 到 main 分支时自动构建
  - [ ] 配置部署到 GitHub Pages（oolongho.github.io）
  - [ ] 配置 pnpm 缓存加速构建

## Phase 20: 收尾优化
- [ ] Task 27: 性能与体验优化
  - [ ] 添加页面加载状态（Skeleton）
  - [ ] 添加错误边界和 404 页面
  - [ ] 优化图片加载（懒加载、占位符）
  - [ ] 确保移动端响应式布局完善
  - [ ] 代码分割和按需加载

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 2]
- [Task 7] depends on [Task 6]
- [Task 8] depends on [Task 7]
- [Task 9] depends on [Task 8]
- [Task 10] depends on [Task 9]
- [Task 11] depends on [Task 10]
- [Task 12] depends on [Task 8]
- [Task 13] depends on [Task 8]
- [Task 14] depends on [Task 6]
- [Task 15] depends on [Task 11]
- [Task 16] depends on [Task 14, Task 15]
- [Task 17] depends on [Task 8]
- [Task 18] depends on [Task 14, Task 17]
- [Task 19] depends on [Task 8]
- [Task 20] depends on [Task 14, Task 19, Task 22]
- [Task 21] depends on [Task 6]
- [Task 22] depends on [Task 14]
- [Task 23] depends on [Task 14, Task 15]
- [Task 24] depends on [Task 14, Task 16, Task 18, Task 20, Task 22]
- [Task 25] depends on [Task 6]
- [Task 26] depends on [Task 1]
- [Task 27] depends on [all previous tasks]
