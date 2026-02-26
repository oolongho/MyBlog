# MyBlog

一个基于 React + Fastify + SQLite 的个人博客系统，支持文章管理、说说动态、图库展示、友链管理等功能。

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![Fastify](https://img.shields.io/badge/Fastify-5-orange)
![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey)

## 功能特性

### 内容管理
- **文章管理** - 支持分类、标签、Markdown 编辑、草稿/发布状态
- **说说动态** - 图文分享、点赞、评论
- **图库展示** - 分类管理、图片预览

### 社交功能
- **友链管理** - 申请、审核、展示
- **评论系统** - 文章评论、说说评论
- **点赞功能** - 说说点赞、状态持久化

### 用户系统
- **访客功能** - 注册、登录、评论、点赞
- **管理后台** - 内容管理、数据统计

### 界面特性
- **主题切换** - 明暗模式自由切换
- **响应式设计** - 适配桌面端和移动端

## 技术栈

### 前端
- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Ant Design
- React Router

### 后端
- Fastify 5
- Prisma ORM
- SQLite
- JWT 认证

## 项目结构

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma      # 数据库模型
│   ├── src/
│   │   ├── app.ts             # Fastify 入口
│   │   ├── routes/            # API 路由
│   │   │   ├── articles.ts    # 文章路由
│   │   │   ├── moments.ts     # 说说路由
│   │   │   ├── gallery.ts     # 图库路由
│   │   │   ├── friends.ts     # 友链路由
│   │   │   ├── comments.ts    # 评论路由
│   │   │   ├── auth.ts        # 管理员认证
│   │   │   ├── visitor.ts     # 访客认证
│   │   │   └── stats.ts       # 统计接口
│   │   ├── plugins/           # Fastify 插件
│   │   │   └── auth.ts        # JWT 认证插件
│   │   └── lib/               # 工具库
│   │       └── prisma.ts      # Prisma 客户端
│   └── .env                   # 环境变量
├── frontend/
│   └── src/
│       ├── pages/             # 页面组件
│       │   ├── HomePage.tsx
│       │   ├── ArticlesPage.tsx
│       │   ├── ArticleDetailPage.tsx
│       │   ├── MomentsPage.tsx
│       │   ├── GalleryPage.tsx
│       │   ├── LinksPage.tsx
│       │   ├── AboutPage.tsx
│       │   ├── AuthPage.tsx
│       │   └── admin/         # 管理后台页面
│       ├── components/        # 公共组件
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   └── admin/
│       ├── hooks/             # 自定义 Hooks
│       │   └── useAuth.ts
│       ├── config/            # 配置文件
│       │   └── api.ts
│       └── styles/            # 样式文件
└── README.md
```

## 快速开始

### 环境要求
- Node.js 18+
- npm / pnpm

### 后端安装

```bash
# 克隆项目
git clone https://github.com/oolongho/MyBlog.git
cd MyBlog

# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建 .env 文件
echo "JWT_SECRET=your-jwt-secret" > .env
echo "ADMIN_USERNAME=admin" >> .env
echo "ADMIN_PASSWORD=admin123" >> .env

# 初始化数据库
npx prisma db push

# 启动后端服务
npm run dev
```

### 前端安装

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 访问应用

- 前端页面: http://localhost:5173
- 管理后台: http://localhost:5173/admin/login
- API 接口: http://localhost:3000/api

## 环境变量

### 后端 (.env)

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `JWT_SECRET` | JWT 密钥 | 必填 |
| `ADMIN_USERNAME` | 管理员用户名 | 必填 |
| `ADMIN_PASSWORD` | 管理员密码 | 必填 |

### 前端 (.env)

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | 后端 API 地址 | http://localhost:3000 |

## 构建部署

### 构建生产版本

```bash
# 后端
cd backend
npm run build

# 前端
cd frontend
npm run build
```

### 部署说明

1. 将 `frontend/dist` 目录部署到静态服务器
2. 将 `backend/dist` 目录部署到 Node.js 服务器
3. 配置 Nginx 反向代理

## 作者

oolongho
