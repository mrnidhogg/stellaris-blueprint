# Stellaris Blueprint

星际裂变蓝图编辑器 - 为游戏《星际裂变》(Stellaris) 提供建筑流水线规划工具

## 项目简介

Stellaris Blueprint 是一个全栈 Web 应用，帮助玩家规划和设计游戏中的建筑流水线。支持网格放置建筑、轨道连接、云端保存和蓝图分享功能。

### 核心功能

- **网格画布** - 100×100 固定网格，支持建筑放置和移除
- **建筑系统** - 预置多种建筑类型（发电厂、矿物精炼厂、研究实验室等）
- **轨道绘制** - 连接建筑之间的运输轨道
- **云端保存** - 蓝图数据存储到云端（开发中）
- **蓝图分享** - 生成分享链接供其他用户查看（开发中）

## 技术栈

### 前端 (client)

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Tailwind CSS | 样式框架 |
| Konva / react-konva | Canvas 画布渲染 |
| Zustand | 状态管理 |
| Axios | HTTP 客户端 |

### 后端 (server)

| 技术 | 用途 |
|------|------|
| NestJS | 后端框架 |
| TypeScript | 类型安全 |
| Prisma | ORM |
| PostgreSQL | 数据库 |
| JWT + Passport | 身份认证 |
| bcryptjs | 密码加密 |

## 项目结构

```
stellaris-blueprint/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   │   └── BlueprintEditor.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── server/                 # 后端 API
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma   # 数据库模型
│   ├── test/
│   └── package.json
├── SPEC.md                 # 项目规格说明书
├── LICENSE
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL 数据库（或使用 Supabase）
- npm 或 pnpm

### 安装依赖

```bash
# 安装前端依赖
cd client
npm install

# 安装后端依赖
cd ../server
npm install
```

### 配置环境变量

```bash
cd server
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接和 JWT 密钥：

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/stellaris"
JWT_SECRET="your-super-secret-jwt-key"
```

### 初始化数据库

```bash
cd server
npx prisma generate
npx prisma db push
```

### 启动开发服务器

```bash
# 启动后端 (端口 3000)
cd server
npm run start:dev

# 启动前端 (端口 5173)
cd client
npm run dev
```

访问 http://localhost:5173 查看应用

## 可用脚本

### 前端

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
npm run lint     # 代码检查
```

### 后端

```bash
npm run start        # 启动服务
npm run start:dev    # 开发模式（热重载）
npm run start:prod   # 生产模式
npm run build        # 构建
npm run test         # 运行单元测试
npm run test:e2e     # 运行端到端测试
npm run lint         # 代码检查
npm run format       # 代码格式化
```

## 数据模型

### User (用户)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | String | 邮箱（唯一） |
| password | String | 密码（加密） |
| blueprints | Blueprint[] | 用户蓝图 |
| createdAt | DateTime | 创建时间 |

### Blueprint (蓝图)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | String | 蓝图名称 |
| gridData | Json | 网格建筑数据 |
| 轨道数据 | Json | 轨道连接数据 |
| isPublic | Boolean | 是否公开 |
| isOfficial | Boolean | 是否官方收录 |
| userId | String | 所属用户 |

### Building (建筑)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | String | 建筑名称 |
| icon | String | 图标 |
| width | Int | 占格宽度 |
| height | Int | 占格高度 |
| 连接点 | Json | 连接点位置 |

## API 接口

### 认证

- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录

### 蓝图

- `GET /blueprints` - 获取当前用户蓝图
- `GET /blueprints/official` - 获取官方库蓝图
- `GET /blueprints/:id` - 获取单个蓝图
- `POST /blueprints` - 创建蓝图
- `PATCH /blueprints/:id` - 更新蓝图
- `DELETE /blueprints/:id` - 删除蓝图
- `POST /blueprints/:id/publish` - 提交到官方库

### 建筑库

- `GET /buildings` - 获取建筑列表

## 开发路线

### Phase 1: 基础框架 ✅

- [x] 项目初始化（前端 + 后端）
- [x] 基础网格渲染
- [ ] 用户注册/登录

### Phase 2: 核心编辑功能 🚧

- [x] 建筑放置/移除
- [x] 轨道绘制
- [ ] 轨道验证
- [ ] 撤销/重做

### Phase 3: 云端功能 📋

- [ ] 蓝图保存到数据库
- [ ] 蓝图列表和加载
- [ ] 蓝图分享

### Phase 4: 完善 📋

- [ ] 导出图片
- [ ] 官方库展示
- [ ] 管理员建筑库管理

## 许可证

[Apache License 2.0](LICENSE)

## 贡献

欢迎提交 Issue 和 Pull Request！
