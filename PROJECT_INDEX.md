# Panda001 签证服务平台 - 项目索引

> 最后更新：2026-03-09 04:35

## 一、项目概述

面向年轻出境自由行群体的高端签证服务平台

---

## 二、技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + Morandi配色 |
| 动效 | Framer Motion |
| 状态 | Zustand |
| AI | GLM-4.6V (SiliconFlow) |
| 图片处理 | Sharp (自动压缩) |
| PDF导出 | html2pdf.js v0.14.0 |

---

## 三、核心功能模块

| 序号 | 模块 | 路径 | 状态 |
|------|------|------|------|
| 1 | 行程规划 (Itinerary) | `src/app/itinerary/` | ✅ 已完成 |
| 2 | 签证评估 (Visa) | `src/app/visa/` | ✅ 已完成 |
| 3 | 解释信 (Explanation Letter) | `src/app/explanation-letter/` | ✅ 已完成 |
| 4 | 用户认证 (Auth) | `src/app/auth/` | ✅ 已完成 |
| 5 | 用户资料 (Profile) | `src/app/profile/` | ✅ 已完成 |
| 6 | 智能文档翻译 (Translation) | `src/app/translation/` | ✅ 已完成 |

---

## 四、翻译模块架构

### 四层分离设计

```
┌─────────────────────────────────────────────────────────────┐
│  UI 交互层 (components/translation/)                        │
│  - 拖拽上传、多任务队列、进度条                              │
│  - 预览导出、PDF下载                                        │
│  - 图片自动压缩(2048x2048, 300dpi)                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  AI 驱动层 (app/api/translate/document/route.ts)           │
│  - GLM-4.6V 模型 (SiliconFlow)                             │
│  - 自动模板识别与匹配                                       │
│  - max_tokens: 50000                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  模板引擎层 (lib/templates/)                                │
│  - 9种高保真HTML模板（自动匹配）                            │
│  - 身份证、营业执照、房产证、户口本等                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  数据模型层 (lib/oss.ts)                                    │
│  - 阿里云OSS上传                                           │
│  - Sharp图片压缩                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 五、环境变量配置规范

### 5.1 核心原则

**⚠️ 强制要求**：所有环境变量必须通过 `src/lib/config.ts` 读取，禁止直接使用 `process.env.*`

### 5.2 环境变量架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     环境变量读取架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   启动方式（二选一）：                                          │
│                                                                 │
│   方式A：shell脚本（推荐）                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ecosystem.start.sh:                                      │   │
│   │   source .env.production  ← 加载环境变量到进程          │   │
│   │   exec next start                                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   方式B：PM2环境变量                                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ ecosystem.config.js:                                      │   │
│   │   env: { SILICONFLOW_API_KEY: 'xxx' }                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   运行时读取：                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ src/lib/config.ts (唯一读取入口)                         │   │
│   │   → src/lib/runtime-env.ts (底层读取器)                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│   业务代码使用：                                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ import { config } from '@/lib/config';                   │   │
│   │ const apiKey = config.ai.siliconflowApiKey;             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 配置文件位置

| 文件 | 用途 |
|------|------|
| `.env.local` | 开发环境配置（本地） |
| `.env.production` | 生产环境配置（服务器） |
| `ecosystem.config.js` | PM2 启动配置 |
| `ecosystem.start.sh` | Shell 启动脚本（推荐） |

### 5.4 环境变量清单

| 变量名 | 用途 | 必需 | 在config中的访问方式 |
|--------|------|------|---------------------|
| `DB_HOST` | 数据库主机 | 是 | `config.db.host` |
| `DB_PORT` | 数据库端口 | 是 | `config.db.port` |
| `DB_USER` | 数据库用户名 | 是 | `config.db.user` |
| `DB_PASSWORD` | 数据库密码 | 是 | `config.db.password` |
| `DB_NAME` | 数据库名称 | 是 | `config.db.name` |
| `PORT` | 服务器端口 | 是 | `config.server.port` |
| `NODE_ENV` | 运行环境 | 是 | `config.server.nodeEnv` |
| `SILICONFLOW_API_KEY` | SiliconFlow API | 是 | `config.ai.siliconflowApiKey` |
| `SILICONFLOW_API_URL` | SiliconFlow API地址 | 否 | `config.ai.siliconflowApiUrl` |
| `SILICONFLOW_MODEL` | SiliconFlow 模型 | 否 | `config.ai.siliconflowModel` |
| `DOUBAO_API_KEY` | 豆包AI API | 否 | `config.ai.doubaoApiKey` |
| `DOUBAO_MODEL` | 豆包AI 模型 | 否 | `config.ai.doubaoModel` |
| `DOUBAO_API_URL` | 豆包AI API地址 | 否 | `config.ai.doubaoApiUrl` |
| `DEEPSEEK_API_KEY` | DeepSeek API | 否 | `config.ai.deepseekApiKey` |
| `OSS_REGION` | OSS区域 | 否 | `config.oss.region` |
| `OSS_ACCESS_KEY_ID` | OSS AccessKey | 否 | `config.oss.accessKeyId` |
| `OSS_ACCESS_KEY_SECRET` | OSS Secret | 否 | `config.oss.accessKeySecret` |
| `OSS_BUCKET` | OSS Bucket | 否 | `config.oss.bucket` |
| `NEXT_PUBLIC_API_URL` | 公共API地址 | 否 | `config.server.apiUrl` |

### 5.5 强制开发规范

**⚠️ 违规代码示例（禁止）：**
```typescript
// ❌ 禁止：直接使用 process.env
const apiKey = process.env.SILICONFLOW_API_KEY;

// ❌ 禁止：直接读取 .env 文件
import dotenv from 'dotenv';
dotenv.config();
```

**✅ 正确代码示例（强制）：**
```typescript
// ✅ 正确：通过 config 读取
import { config } from '@/lib/config';
const apiKey = config.ai.siliconflowApiKey;
```

**✅ 正确代码示例（需要默认值）：**
```typescript
// ✅ 正确：使用带默认值的读取
import { getRuntimeEnv } from '@/lib/runtime-env';
const apiUrl = getRuntimeEnv('SILICONFLOW_API_URL', 'https://api.siliconflow.cn/v1/chat/completions');
```

---

## 六、代码结构

### 6.1 目录结构

```
src/
├── app/                          # 页面路由 (Next.js App Router)
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   ├── translation/             # 翻译模块
│   │   ├── page.tsx
│   │   └── api/
│   │       └── document/        # 文档翻译API
│   ├── itinerary/               # 行程规划
│   ├── visa/                    # 签证评估
│   ├── explanation-letter/      # 解释信
│   ├── profile/                 # 用户资料
│   ├── auth/                   # 认证模块
│   └── api/                    # API路由
│       ├── translate/           # 翻译API
│       ├── skills/              # 技能系统
│       └── upload/              # 文件上传
│
├── components/                  # UI组件
│   ├── ui/                     # 基础组件
│   ├── layout/                 # 布局组件
│   └── translation/            # 翻译组件
│
├── lib/                        # 工具库
│   ├── config.ts              # ⭐ 运行时配置中心（强制使用）
│   ├── runtime-env.ts         # ⭐ 运行时环境变量读取器
│   ├── translation/           # 翻译模块
│   │   ├── templates.ts
│   │   ├── qwenService.ts
│   │   └── index.ts
│   ├── skills/                # 技能系统
│   ├── doubao.ts             # 豆包AI
│   └── ai.ts                 # AI统一出口
│
├── types/                      # 类型定义
│   ├── translation.ts
│   └── ...
│
├── hooks/                      # 自定义Hooks
└── api/                        # API客户端
```

### 6.2 核心文件说明

| 文件 | 作用 |
|------|------|
| `src/lib/config.ts` | ⭐ **运行时配置中心** - 所有环境变量的唯一读取入口 |
| `src/lib/runtime-env.ts` | 运行时环境变量底层读取器 |
| `src/lib/doubao.ts` | 豆包AI调用（已改造为使用config） |
| `src/app/api/translate/document/route.ts` | 文档翻译API（已改造为使用config） |
| `ecosystem.config.js` | PM2启动配置 |
| `ecosystem.start.sh` | Shell启动脚本（推荐使用） |

---

## 七、部署指南

### 7.1 服务器部署命令

```bash
# 1. 进入项目目录
cd /www/wwwroot/Panda001

# 2. 拉取最新代码
git pull origin master

# 3. 确保启动脚本有执行权限
chmod +x ecosystem.start.sh

# 4. 重启服务
pm2 restart ecosystem.config.js

# 5. 查看日志确认启动成功
pm2 logs Panda001 --lines 20 --nostream
```

### 7.2 环境变量配置（生产环境）

在服务器上创建或更新 `.env.production` 文件：

```bash
# 编辑环境变量文件
vim /www/wwwroot/Panda001/.env.production
```

添加以下内容：
```env
# 数据库配置
DB_HOST=rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com
DB_PORT=3306
DB_USER=visa
DB_PASSWORD=Laogui@900327
DB_NAME=visa

# 服务器配置
PORT=3000
NODE_ENV=production

# AI 服务配置
SILICONFLOW_API_KEY=sk-xxxxx  # 替换为实际API Key

# OSS 配置
OSS_REGION=oss-cn-beijing
OSS_ACCESS_KEY_ID=xxxxx  # 替换为实际Key
OSS_ACCESS_KEY_SECRET=xxxxx  # 替换为实际Secret
OSS_BUCKET=hxvisa001
```

---

## 八、API 路由

| 路由 | 功能 |
|------|------|
| `/api/translate` | 文本翻译 |
| `/api/translate/document` | 文档翻译（图片/PDF，支持模板自动匹配） |
| `/api/upload` | 文件上传到OSS（支持图片压缩） |
| `/api/skills/parse` | 技能解析 |
| `/api/skills/execute` | 技能执行 |
| `/api/skills/paddle-ocr` | OCR识别 |
| `/api/upload/image` | 图片上传（旧版） |

---

## 九、翻译模板系统

### 支持的模板类型（9种）

| 模板ID | 名称 | 用途 | 变量占位符 |
|--------|------|------|------------|
| ID_CARD | 身份证 | 居民身份证正反面 | `{{Name}}`, `{{Gender}}` 等 |
| BUSINESS_LICENSE | 营业执照 | 个体户/公司营业执照 | `{{BUSINESS_NAME}}` 等 |
| HOUSE_PROPERTY_CERT | 房产证 | 不动产登记证 | `{{OBLIGEE_NAME}}` 等 |
| HOUSEHOLD_REGISTER | 户口本 | 居民户口簿 | `{{HOUSEHOLD_TYPE}}` 等 |
| MARRIAGE_CERT | 结婚证 | 结婚证/离婚证 | `{{GROOM_NAME}}` 等 |
| RETIREMENT_CERT | 退休证 | 退休证/养老证 | `{{FIELD_1_LABEL}}` 等 |
| VEHICLE_REGISTRATION | 机动车登记证 | 行驶证/车辆登记 | 车辆相关字段 |
| RESIDENCE_PROOF | 居住证明 | 居住证明 | 证明类字段 |
| GENERAL_DOCUMENT | 通用文档 | 其他文档 | 无固定结构 |

### 模板文件位置

```
src/lib/templates/
├── registry.ts          # 模板注册表（自动匹配逻辑）
└── html/                # HTML模板文件（9个）
    ├── 身份证翻译框架（改）.html
    ├── 个体工商户-营业执照翻译框架.html
    ├── 公司-营业执照翻译框架.html
    ├── 新版-房产证翻译框架.html
    ├── 旧版-房产证翻译框架（改）.html
    ├── （新）户口本翻译框架.html
    ├── 结婚证翻译框架.html
    ├── 退休证翻译框架.html
    ├── 机动车登记证翻译框架.html
    ├── 居住证明翻译框架.html
    └── 通用文档翻译框架.html
```

### 自动匹配规则

大模型会根据文档内容自动识别并匹配最佳模板：
- 若为"身份证" → ID_CARD
- 若为"营业执照" → BUSINESS_LICENSE
- 若为"房产证" → HOUSE_PROPERTY_CERT
- 若为"户口本" → HOUSEHOLD_REGISTER
- 若为"结婚证" → MARRIAGE_CERT
- 若为"退休证" → RETIREMENT_CERT
- 若为"机动车登记证/行驶证" → VEHICLE_REGISTRATION
- 若为"居住证明" → RESIDENCE_PROOF
- 其他情况 → GENERAL_DOCUMENT

### 添加新模板

1. 将HTML模板放入 `src/lib/templates/html/` 目录
2. 在 `src/lib/templates/registry.ts` 中添加模板配置

---

## 十、开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start
```

---

## 十、部署信息

| 环境 | 地址 | 状态 |
|------|------|------|
| 本地开发 | http://localhost:3000 | ✅ 运行中 |
| 阿里云服务器 | http://223.6.248.154:3000 | 部署中 |

---

## 十一、重大更新日志

### 2026-03-09 - 翻译模块全面升级

**新增功能：**
1. **模型切换**：从 Qwen2.5-VL 切换到 GLM-4.6V (SiliconFlow)
2. **图片压缩**：使用 Sharp 库自动压缩超大图片（最大 2048x2048, 300DPI）
3. **模板自动匹配**：支持9种文档模板自动识别与匹配
4. **PDF导出优化**：升级 html2pdf.js 到 v0.14.0 修复颜色兼容问题
5. **Prompt优化**：精简 prompt，设置 max_tokens=50000

**翻译工作流：**
```
上传文件 → OSS存储+自动压缩 → GLM-4.6V翻译 → 自动模板匹配 → HTML输出
```

**模板系统：**
- 新增 `src/lib/templates/` 目录
- 包含9种专业模板（身份证、营业执照、房产证等）
- 大模型自动识别文档类型并选择最佳模板

---

### 2026-03-07 - 运行时配置中心重构

**问题背景：**
- Next.js 构建时将环境变量嵌入代码，运行时无法读取 `.env` 文件
- 导致生产环境 API Key 读取失败

**解决方案：**
1. 创建 `src/lib/runtime-env.ts` - 运行时环境变量读取器
2. 创建 `src/lib/config.ts` - 统一配置中心
3. 改造所有 API 路由使用 `config` 读取环境变量
4. 创建 `ecosystem.start.sh` 启动脚本

**强制规范：**
- ✅ 所有环境变量必须通过 `config` 读取
- ✅ 禁止直接使用 `process.env.*`
- ✅ 修改 `.env.production` 后只需重启 PM2，无需重新构建

---

## 十二、注意事项

1. **强制使用 config**：所有代码必须通过 `import { config } from '@/lib/config'` 读取环境变量
2. **启动方式**：推荐使用 `ecosystem.start.sh` 脚本启动
3. **配置生效**：修改环境变量后执行 `pm2 restart` 即可生效，无需重新构建
4. **模板添加**：后续添加新模板只需放入 `src/lib/templates/html/` 并在 registry.ts 注册
4. **验证配置**：可以使用 `pm2 logs` 查看是否有配置错误
