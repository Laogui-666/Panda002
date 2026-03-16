# 盼达旅行签证平台 - 项目跟踪脚本

> **最后更新**: 2026-03-17 02:24
> **当前状态**: 🟢 ERP系统重构完成，准备部署
> **下一步动作**: 推送代码到GitHub，部署到云服务器

---

## 1. 🏗️ 开发方案总览（生产环境）

### 项目目标
打造一站式签证办理服务平台，包含用户端（申请表填写、证明文件生成、翻译服务）和后台ERP管理系统。

### 技术栈
- **前端框架**: Next.js 14 + React + TypeScript + Tailwind CSS
- **UI组件库**: Framer Motion (动画)
- **状态管理**: Zustand
- **后端/数据库**: 阿里云MySQL + 自建API + Prisma ORM
- **部署平台**: 阿里云服务器 + PM2

### ERP系统架构
```
ERP模块 (/erp/*)
├── /erp/login          - 登录页面
├── /erp/dashboard      - 仪表盘
├── /erp/orders        - 订单管理
├── /erp/customers     - 客户管理
├── /erp/users         - 用户管理
└── /api/erp/*        - 后端API接口
```

### 环境变量配置方案
```bash
# 数据库配置 (Prisma)
DATABASE_URL="mysql://your_user:your_password@your_host.mysql.rds.aliyuncs.com:3306/your_db"

# JWT配置
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# 服务器配置
PORT=3000
NODE_ENV=production

# AI服务API密钥 (请联系管理员获取)
SILICONFLOW_API_KEY=your_api_key
DEEPSEEK_API_KEY=your_api_key

# 阿里云OSS配置 (请联系管理员获取)
OSS_REGION=your_oss_region
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=your_bucket
```

### 关键约束
- ✅ 环境变量通过 .env.local 文件配置，不提交到Git
- ✅ 使用 runtime-env.ts 在运行时读取环境变量
- ✅ ecosystem.start.sh 启动时加载 .env.local
- ✅ .gitignore 已配置保护敏感文件
- ✅ Prisma ORM 管理数据库Schema

---

## 2. ⚠️ 环境变量配置说明（每次部署必读）

### 服务器部署步骤
1. 从GitHub拉取最新代码：`git pull origin main`
2. 在项目目录创建 `.env.local` 文件
3. 安装依赖：`npm install`
4. 生成Prisma客户端：`npx prisma generate`
5. 同步数据库结构：`npx prisma db push`
6. 构建项目：`npm run build`
7. 启动服务：`pm2 start ecosystem.config.js --env production`

### 环境变量文件位置
- **本地模板**: 项目根目录 `.env.local` (受.gitignore保护)
- **服务器位置**: `/www/wwwroot/Panda001/.env.local`

### 禁止事项
- ❌ 禁止将 .env.local 推送到Git
- ❌ 禁止在代码中硬编码API密钥
- ❌ 禁止在 ecosystem.config.js 中配置密钥

---

## 3. 📊 当前进度

### 本次会话 (2026-03-17)
- [x] 彻底重构ERP系统
- [x] 实现6级角色权限体系 (SUPER_ADMIN, COMPANY_OWNER, DEPT_ADMIN, OPERATOR, OUTSOURCE, CUSTOMER)
- [x] 实现订单状态机 (9个状态)
- [x] 创建Prisma数据库Schema
- [x] 实现JWT认证系统
- [x] 创建API接口
- [x] 创建前端页面
- [x] 配置环境变量 (DATABASE_URL)
- [x] 同步数据库结构到阿里云RDS
- [x] 初始化测试数据 (6个账号)
- [x] 测试数据库连接和登录
- [x] 项目构建成功 (55页)

### 测试账号
| 角色 | 用户名 | 密码 |
|------|--------|------|
| 超级管理员 | superadmin@muhai001.com | 123456 |
| 公司负责人 | owner1@muhai001.com | owner123456 |
| 业务部管理员 | deptadmin1@muhai001.com | deptadmin123456 |
| 操作员 | operator1@muhai001.com | operator123456 |
| 外包业务员 | outsource1@muhai001.com | outsource123456 |
| 普通用户 | customer1@example.com | customer123456 |

### 待完成
- [ ] 推送代码到GitHub
- [ ] 部署到云服务器 (223.6.248.154)
- [ ] 测试ERP系统登录

---

## 4. 📋 关键文件索引

| 功能模块 | 关键文件 |
|----------|----------|
| 数据库Schema | `prisma/schema.prisma` |
| 认证系统 | `src/lib/erp/auth.ts` |
| 状态机 | `src/lib/erp/order-state-machine.ts` |
| API接口 | `src/app/api/erp/*` |
| 前端页面 | `src/app/erp/*` |
| 环境变量读取 | `src/lib/runtime-env.ts` |
| 配置中心 | `src/lib/config.ts` |
| 启动脚本 | `ecosystem.start.sh` |
| PM2配置 | `ecosystem.config.js` |
| 环境变量模板 | `.env.local` |

---

## 5. 📝 ERP系统设计文档

详细设计文档请参考：
- `D:\工作\WPS同步\(A材料模板)\AI项目\签证平台\Visa_ERP_System_Design_Blueprint.txt`
- `D:\工作\WPS同步\(A材料模板)\AI项目\签证平台\方案.txt`

### 6级角色权限体系
1. **SUPER_ADMIN (超级管理员)**: 网站最高权限，管理所有入驻公司
2. **COMPANY_OWNER (公司负责人)**: 公司最高权限，可查看公司所有数据
3. **DEPT_ADMIN (业务部管理员)**: 部门最高权限，可查看部门数据
4. **OPERATOR (业务部门操作员)**: 员工权限，仅能操作自己分配的订单
5. **OUTSOURCE (外包业务员)**: 受限权限，敏感信息脱敏
6. **CUSTOMER (普通用户)**: 客户端用户，只能从"我的订单"进入查看

### 订单状态机
```
PENDING_CONNECTION (待对接)
→ CONNECTED (已对接)
→ COLLECTING_DOCS (资料收集中)
→ PENDING_REVIEW (待审核)
→ UNDER_REVIEW (资料审核中)
→ MAKING_MATERIALS (材料制作中)
→ PENDING_DELIVERY (待交付)
→ DELIVERED (已交付)
→ APPROVED/REJECTED (出签/拒签)
```

---

> 📌 **使用说明**: 
> - 每次部署前确保 .env.local 文件存在
> - 本文件已加入Git版本控制
> - 环境变量配置方案已记录在此文档中
