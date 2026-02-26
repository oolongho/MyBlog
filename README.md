# MyBlog

一个基于 React + Fastify + SQLite 的个人博客系统。

## 功能特性

- 📝 文章管理 - 支持分类、标签、Markdown 编辑
- 💬 说说动态 - 图文分享、点赞、评论
- 🖼️ 图库展示 - 分类管理、图片预览
- 🔗 友链管理 - 申请、审核、展示
- 👥 用户系统 - 访客注册登录、管理员后台
- 🌙 主题切换 - 明暗模式自由切换

## 技术栈

### 前端
- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Ant Design

### 后端
- Fastify
- Prisma ORM
- SQLite
- JWT 认证

## 快速开始

### 环境要求
- Node.js 18+
- pnpm / npm

### 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd frontend
npm install
```

### 配置环境变量

在 `backend` 目录创建 `.env` 文件：

```env
JWT_SECRET=your-jwt-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 初始化数据库

```bash
cd backend
npx prisma db push
```

### 启动开发服务器

```bash
# 后端 (端口 3000)
cd backend
npm run dev

# 前端 (端口 5173)
cd frontend
npm run dev
```

### 构建生产版本

```bash
# 后端
cd backend
npm run build

# 前端
cd frontend
npm run build
```

## 目录结构

```
MyBlog/
├── backend/           # 后端代码
│   ├── prisma/        # 数据库模型
│   ├── src/
│   │   ├── routes/    # API 路由
│   │   ├── plugins/   # Fastify 插件
│   │   └── lib/       # 工具库
│   └── ...
├── frontend/          # 前端代码
│   ├── src/
│   │   ├── pages/     # 页面组件
│   │   ├── components/# 公共组件
│   │   ├── hooks/     # 自定义 Hooks
│   │   └── config/    # 配置文件
│   └── ...
└── README.md
```

## 访问地址

- 前台首页: http://localhost:5173
- 管理后台: http://localhost:5173/admin/login
- API 接口: http://localhost:3000/api

## License

MIT
