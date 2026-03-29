# 星际裂变蓝图编辑器 - 项目规格说明书

## 1. 项目概述

**项目名称**：Stellaris Blueprint Builder (暂定)
**类型**：全栈 Web 应用
**核心功能**：为游戏《星际裂变》(Stellaris) 提供建筑流水线规划工具，支持网格放置、轨道连接、云端保存和蓝图分享
**目标用户**：Stellaris 玩家、建筑规划爱好者

---

## 2. 功能需求

### 2.1 用户模块

| 功能 | 描述 |
|------|------|
| 注册/登录 | 邮箱 + 密码，支持 JWT 认证 |
| 蓝图列表 | 查看自己保存的蓝图（最多 3 个） |
| 蓝图 CRUD | 创建、读取、更新、删除自己的蓝图 |
| 蓝图分享 | 生成分享链接，其他用户可查看 |
| 官方库 | 浏览管理员收录的优秀蓝图（不占用户额度） |

### 2.2 编辑器模块

| 功能 | 描述 |
|------|------|
| 网格画布 | 100×100 固定网格，支持缩放和平移 |
| 建筑放置 | 从建筑库选择建筑，放置到网格中 |
| 建筑移除 | 点击选中后删除 |
| 轨道绘制 | 连接两个建筑，支持方向设置 |
| 轨道验证 | 检查轨道是否穿墙、是否连接到有效建筑 |
| 建筑库 | 管理员增删改建筑（名称、图标、尺寸、连接点） |
| 撤销/重做 | 支持操作历史 |
| 自动保存 | 编辑过程中自动保存到云端 |

### 2.3 蓝图管理

| 功能 | 描述 |
|------|------|
| 导出图片 | 导出为 PNG/JPG 图片 |
| 导入/导出 JSON | 数据备份和迁移 |
| 设为公开 | 提交到官方库供其他用户浏览 |

---

## 3. 技术栈

### 前端
- **框架**：React 18 + TypeScript
- **画布**：react-konva 或原生 Canvas API
- **状态管理**：Zustand
- **样式**：Tailwind CSS
- **HTTP**：Axios

### 后端
- **框架**：NestJS + TypeScript
- **ORM**：Prisma
- **数据库**：PostgreSQL (Supabase 免费层)
- **认证**：JWT + bcrypt
- **文件存储**：Supabase Storage 或本地存储

### 部署
- **前端**：Vercel
- **后端**：Railway / Render
- **GitHub**：公开仓库

---

## 4. 数据模型

### 用户 (User)
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  blueprints Blueprint[]
  createdAt DateTime @default(now())
}
```

### 蓝图 (Blueprint)
```prisma
model Blueprint {
  id          String   @id @default(uuid())
  name        String
  gridData    Json     // 网格建筑数据
 轨道数据     Json     // 轨道连接数据
  isPublic    Boolean  @default(false)
  isOfficial  Boolean  @default(false)  // 官方收录
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 建筑 (Building)
```prisma
model Building {
  id          String   @id @default(uuid())
  name        String
  icon        String   // 图标URL或emoji
  width       Int      // 占格宽度
  height      Int      // 占格高度
  连接点      Json     // 连接点位置列表
  description String?
}
```

---

## 5. API 设计

### 认证
- `POST /auth/register` - 注册
- `POST /auth/login` - 登录，返回 JWT

### 蓝图
- `GET /blueprints` - 获取当前用户蓝图
- `GET /blueprints/official` - 获取官方库蓝图
- `GET /blueprints/:id` - 获取单个蓝图
- `POST /blueprints` - 创建蓝图
- `PATCH /blueprints/:id` - 更新蓝图
- `DELETE /blueprints/:id` - 删除蓝图
- `POST /blueprints/:id/publish` - 提交到官方库

### 建筑库
- `GET /buildings` - 获取建筑列表（仅管理员）

---

## 6. 里程碑

### Phase 1：基础框架
- [ ] 项目初始化（前端 + 后端）
- [ ] 用户注册/登录
- [ ] 基础网格渲染

### Phase 2：核心编辑功能
- [ ] 建筑放置/移除
- [ ] 轨道绘制和验证
- [ ] 撤销/重做

### Phase 3：云端功能
- [ ] 蓝图保存到数据库
- [ ] 蓝图列表和加载
- [ ] 蓝图分享

### Phase 4：完善
- [ ] 导出图片
- [ ] 官方库展示
- [ ] 管理员建筑库管理

---

## 7. 命名规范

- 项目名：`stellaris-blueprint`
- 仓库：`https://github.com/<username>/stellaris-blueprint`

---

**创建日期**：2026-03-29
**版本**：v0.1.0 (规划中)
