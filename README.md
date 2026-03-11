# 沐海签证 (Muhai Visa)

面向年轻出境自由行群体的高端签证服务平台

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + CSS Modules
- **动效**: Framer Motion
- **状态**: Zustand

## 项目结构

```
src/
├── api/                    # API 服务层
│   ├── itineraryApi.ts     # 行程规划API
│   ├── visaAssessmentApi.ts # 签证评估API
│   ├── explanationLetterApi.ts # 解释信编写API
│   ├── walletApi.ts        # 旅行币API
│   ├── authApi.ts          # 账号认证API
│   └── historyApi.ts       # 历史记录API
│
├── hooks/                  # 自定义Hooks层
│   ├── useItinerary.ts     # 行程规划逻辑
│   ├── useVisaAssessment.ts # 签证评估逻辑
│   ├── useExplanationLetter.ts # 解释信编写逻辑
│   ├── useWallet.ts        # 旅行币逻辑
│   ├── useAuth.ts          # 认证逻辑
│   └── useAnimation.ts     # 动画相关逻辑
│
├── components/             # UI组件层
│   ├── ui/                 # 基础UI组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/             # 布局组件
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   └── business/           # 业务组件
│       ├── ItineraryZone.tsx
│       ├── VisaAssessmentZone.tsx
│       └── ...
│
├── types/                  # 类型定义
│   ├── visa.ts
│   ├── user.ts
│   └── ...
│
├── lib/                   # 工具函数
│   ├── utils.ts
│   └── constants.ts
│
├── styles/                # 全局样式
│   └── globals.css
│
└── app/                   # 页面路由
    ├── layout.tsx
    ├── page.tsx
    └── api/               # API路由
        └── ...
```

## 功能模块（预留）

- 📋 **行程规划** - 智能行程规划服务
- 🛂 **签证评估** - 签证通过率评估
- ✉️ **解释信** - AI辅助解释信编写
- 💰 **旅行币** - 积分钱包系统
- 👤 **账号** - 用户认证系统
- 📜 **历史** - 办理记录查询

## 开发指南

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 环境变量

请在 `.env.local` 中配置：

```
DB_HOST=rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com
DB_PORT=3306
DB_USER=visa
DB_PASSWORD=Laogui@900327
DB_NAME=visa
PORT=3000
NODE_ENV=development
DEEPSEEK_API_KEY=sk-490e4bc3829d42738c0944ea9e7abcf2
```
