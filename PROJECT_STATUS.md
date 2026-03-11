# 沐海签证 - 项目状态索引

> 本文档记录项目的当前状态和重要调整，作为开发参考
> **最后更新**: 2026-03-05

---

## 📊 项目概览

| 项目 | 内容 |
|------|------|
| **项目名称** | 沐海签证 (Muhai Visa) |
| **项目路径** | `C:\Users\Administrator\Desktop\muhai001\muhai001` |
| **技术栈** | Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Zustand |
| **当前状态** | 活跃开发中 |

---

## 🗂️ 目录结构

```
muhai001/
├── src/
│   ├── api/                    # API 服务层 (7个模块)
│   ├── hooks/                  # 自定义Hooks (6个)
│   ├── components/             # UI组件
│   ├── types/                  # TypeScript类型定义 (7个)
│   ├── lib/                    # 工具库
│   ├── styles/                 # 样式
│   └── app/                    # Next.js页面路由
├── skills/                     # Skills脚本目录
├── tailwind.config.js          # Tailwind配置
├── next.config.js              # Next.js配置
├── package.json                # 项目依赖
└── PROJECT_STATUS.md           # 本文档
```

---

## 📍 文件导航 (按功能模块)

### 🔐 认证模块

| 功能 | 文件路径 |
|------|----------|
| 登录页面 | `src/app/auth/login/page.tsx` |
| 注册页面 | `src/app/auth/register/page.tsx` |
| 忘记密码 | `src/app/auth/forgot-password/page.tsx` |
| 认证API | `src/api/authApi.ts` |
| 认证Hook | `src/hooks/useAuth.ts` |
| 用户类型 | `src/types/user.ts` |

---

### 🏠 首页

| 功能 | 文件路径 |
|------|----------|
| 首页页面 | `src/app/page.tsx` |
| 导航栏 | `src/components/layout/Navbar.tsx` |
| 页脚 | `src/components/layout/Footer.tsx` |
| 鼠标跟随 | `src/components/MouseFollower.tsx` *(动态导入)* |
| 动画配置 | `src/hooks/useAnimation.ts` |

---

### 📋 行程规划

| 功能 | 文件路径 |
|------|----------|
| 行程页面 | `src/app/itinerary/page.tsx` |
| 行程API | `src/api/itineraryApi.ts` |
| 行程Hook | `src/hooks/useItinerary.ts` |
| 行程类型 | `src/types/itinerary.ts` |

---

### 👤 个人中心

| 功能 | 文件路径 |
|------|----------|
| 个人中心页面 | `src/app/profile/page.tsx` |

---

### 💰 钱包/积分

| 功能 | 文件路径 |
|------|----------|
| 钱包API | `src/api/walletApi.ts` |
| 钱包Hook | `src/hooks/useWallet.ts` |
| 钱包类型 | `src/types/wallet.ts` |

---

### 🛂 签证评估

| 功能 | 文件路径 |
|------|----------|
| 签证API | `src/api/visaAssessmentApi.ts` |
| 签证Hook | `src/hooks/useVisaAssessment.ts` |
| 签证类型 | `src/types/visa.ts` |

---

### ✉️ 解释信

| 功能 | 文件路径 |
|------|----------|
| 解释信API | `src/api/explanationLetterApi.ts` |
| 解释信Hook | `src/hooks/useExplanationLetter.ts` |
| 解释信类型 | `src/types/explanationLetter.ts` |

---

### 🌐 智能翻译 (PaddleOCR-VL)

| 功能 | 文件路径 |
|------|----------|
| 翻译页面 | `src/app/translation/page.tsx` |
| 翻译Hook | `src/hooks/useTranslation.ts` |
| 翻译类型 | `src/types/translation.ts` |
| 预览编辑弹窗 | `src/components/translation/PreviewEditorModal.tsx` |
| PaddleOCR技能 | `src/lib/skills/paddle-ocr.ts` |
| 翻译API | `src/app/api/skills/paddle-ocr/route.ts` |
| PDF处理脚本 | `skills/paddle_ocr/process_pdf.py` |

**支持功能**:
- 文本翻译 (10种语言)
- 文档翻译 (图片/PDF)
- 批量/单独翻译
- 在线预览编辑
- 导出PDF
- 历史记录

---

### 📜 历史记录

| 功能 | 文件路径 |
|------|----------|
| 历史API | `src/api/historyApi.ts` |
| 历史类型 | `src/types/history.ts` |

---

### 🧩 通用UI组件

| 组件 | 文件路径 |
|------|----------|
| 按钮 | `src/components/ui/Button.tsx` *(移动端适配:全宽+增大触摸区)* |
| 卡片 | `src/components/ui/Card.tsx` |
| 输入框 | `src/components/ui/Input.tsx` *(移动端适配:增大输入区)* |

### 📱 移动端专用组件

#### 布局组件
| 组件 | 文件路径 | 功能 |
|------|----------|------|
| 底部导航 | `src/components/mobile/BottomNav.tsx` | 移动端Tab导航 |
| 顶部栏 | `src/components/mobile/MobileHeader.tsx` | 移动端页面头部 |
| 抽屉菜单 | `src/components/mobile/MobileDrawer.tsx` | 侧滑菜单 |
| 表单容器 | `src/components/mobile/MobileFormWrapper.tsx` | 响应式表单布局 |

#### 基础UI组件（2026-03-03新增）
| 组件 | 文件路径 | 功能 |
|------|----------|------|
| 卡片 | `src/components/mobile/MobileCard.tsx` | 移动端紧凑型卡片 |
| 列表项 | `src/components/mobile/MobileListItem.tsx` | 列表展示标准项 |
| 区块 | `src/components/mobile/MobileSection.tsx` | 带标题和折叠功能的区域 |
| 模态框 | `src/components/mobile/MobileModal.tsx` | 全屏模态框 |

---

### 🤖 AI/智能服务

| 功能 | 文件路径 |
|------|----------|
| AI集成 | `src/lib/ai.ts` |
| 豆包API | `src/lib/doubao.ts` |
| Skills执行器 | `src/lib/skills/executor.ts` |
| Skills索引 | `src/lib/skills/index.ts` |

---

### ⚙️ API路由

| 路由 | 文件路径 |
|------|----------|
| Skills执行 | `src/app/api/skills/execute/route.ts` |
| 文档解析 | `src/app/api/skills/parse/route.ts` |
| 基础API | `src/api/baseApi.ts` |

---

### 🎨 样式配置

| 配置 | 文件路径 |
|------|----------|
| 全局样式 | `src/styles/globals.css` |
| Tailwind配置 | `tailwind.config.js` |
| Next配置 | `next.config.js` |
| 公共类型 | `src/types/common.ts` |

---

## 🛤️ 页面路由

| 路由 | 描述 | 状态 | 备注 |
|------|------|------|------|
| `/` | 首页 | ✅ 完成 | 已实施动态导入优化 |
| `/auth/login` | 登录页 | ✅ 完成 | |
| `/auth/register` | 注册页 | ✅ 完成 | |
| `/auth/forgot-password` | 忘记密码 | ✅ 完成 | |
| `/itinerary` | 行程规划 | 🔄 开发中 | |
| `/profile` | 个人中心 | ✅ 完成 | |

---

## ⚙️ 重要配置

### Tailwind 断点配置
```javascript
// 保留默认断点 (因首页使用 xl/2xl)
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

### 莫兰迪色系
```javascript
colors: {
  morandi: {
    ocean: '#7A9D96',   // 海洋绿 - 主色调
    sand: '#D6C6B0',   // 沙色
    mist: '#8A9A94',    // 雾色
    clay: '#8B7B70',    // 陶土色
    blush: '#E8D5D0',   // 腮红
    deep: '#1A2832',    // 深色文字
    light: '#F5F7FA',   // 浅色背景
    cream: '#F0EDE8',   // 奶油色
  }
}
```

### 玻璃拟态
```css
.glass {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
}
```

---

## 📝 开发规范

### ⚠️ 核心铁律 (必须遵守)

#### 1. 新组件必须集成到布局
> **规则**: 创建任何新组件后，必须立即将其集成到实际页面布局中，不可只创建文件而不使用
> - 新建组件文件 → 立即在 `layout.tsx` 或对应页面中导入使用
> - 禁止只创建组件但不集成到页面
> - 这是之前的教训：移动端组件创建后未集成导致用户看不到效果

#### 2. 移动端优化同步进行
> **规则**: 任何功能开发或调整，必须同时考虑并实现移动端适配，无需用户提醒
> - 新增页面 → 同时编写移动端和桌面端样式
> - 新增组件 → 同步创建移动端版本或添加响应式样式
> - 修改样式 → 优先修改移动端样式，桌面端用 `md:` 覆盖
> - 不允许只开发桌面端功能后再由用户提醒才适配移动端

#### 3. 移动优先原则（2026-03-03新增）
> **规则**: 所有新页面和组件默认采用「移动优先」设计方式
> - 默认样式（不带前缀）= 移动端样式
> - 桌面端样式必须使用 `md:`、`lg:` 等前缀显式声明
> - 禁止将桌面端样式作为默认样式，移动端用 `md:` 覆盖
> - 这样可以确保：在不支持JavaScript的环境下，移动端界面仍然可用

#### 4. 移动端独立布局方案
> **规则**: 页面重构和新页面开发采用响应式布局优化策略
> - 仅调整样式类名和HTML结构，不改变任何代码逻辑
> - 移动端布局参考成熟APP设计模式
> - 必要的移动端组件放置在 `src/components/mobile/` 目录

---

### 新增页面
1. 在 `src/app/` 下创建对应的路由目录
2. 创建 `page.tsx` 作为页面入口
3. 使用 `use client` 标记客户端组件

### 新增组件
1. 放在 `src/components/` 对应目录
2. 优先使用 TypeScript
3. 如组件较重且非首屏必需，考虑使用 lazy 动态导入

### API 开发
1. 在 `src/api/` 创建对应的 API 模块
2. 在 `src/hooks/` 创建对应的业务逻辑 Hook
3. 在 `src/types/` 定义对应的 TypeScript 类型

---

## 📱 移动端开发规范 (重要)

### 断点规则
- **移动端分界线**: `md` (768px)
- 移动端样式: 不带前缀 (默认)
- 桌面端样式: 使用 `md:` 前缀

### 显示/隐藏规则

| 场景 | 移动端 | 桌面端 |
|------|--------|--------|
| 底部导航 | `block md:hidden` | `hidden md:block` |
| 侧边栏 | `hidden md:block` | `block md:hidden` |

### 响应式组件开发

#### ✅ 正确写法
```tsx
// 按钮：移动端全宽+大点击区域，桌面端自适应
<Button className="w-full py-3 md:w-auto md:py-2">提交</Button>

// 布局：移动端单列，桌面端双列
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">内容1</div>
  <div className="flex-1">内容2</div>
</div>
```

#### ❌ 错误写法
```tsx
// 禁止使用JS检测屏幕尺寸，会导致水合错误
const isMobile = window.innerWidth < 768;
if (isMobile) return <MobileComponent />;
```

### 移动端专用组件目录
```
src/components/
├── ui/                  # 通用UI组件
├── layout/              # 布局组件
├── mobile/              # 移动端专用组件 (新增)
│   ├── BottomNav.tsx    # 底部导航栏
│   ├── MobileHeader.tsx # 移动端顶部栏
│   ├── MobileDrawer.tsx # 移动端抽屉菜单
│   └── MobileFormWrapper.tsx # 移动端表单容器
└── MouseFollower.tsx    # 鼠标跟随效果
```

### 移动端专用组件目录
```
src/components/
├── ui/                  # 通用UI组件
├── layout/              # 布局组件
├── mobile/              # 移动端专用组件 (新增)
│   ├── BottomNav.tsx    # 底部导航栏
│   ├── MobileHeader.tsx # 移动端顶部栏
│   ├── MobileDrawer.tsx # 移动端抽屉菜单
│   └── MobileFormWrapper.tsx # 移动端表单容器
└── MouseFollower.tsx    # 鼠标跟随效果
```

> **注意**: 以上规范已整合到「核心铁律」，无需额外提醒

---

## 🔧 待开发功能

- [ ] `/api/skills/execute` 统一入口
- [ ] 文档解析 API (`/api/skills/parse`)
- [ ] 文件上传处理 (`/api/files/upload`)
- [ ] AI 信息提取 (`/api/ai/extract`)
- [ ] DOCX 生成 (`/api/skills/docx/generate`)
- [ ] XLSX 导出 (`/api/skills/xlsx/export`)
- [ ] OCR 识别支持

---

## 📜 更新日志

### 2026-03-03 - UI优化
- ✅ 首页 MouseFollower 组件使用 `React.lazy()` 动态导入
- ✅ 创建独立组件文件: `src/components/MouseFollower.tsx`
- ✅ 使用 `Suspense` 包裹动态组件
- ⚠️ 断点配置保留默认 (因首页使用 `xl:text-7xl`)
- ✅ 添加文件导航索引

---

## 💡 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

---

*本文档随项目开发持续更新*
