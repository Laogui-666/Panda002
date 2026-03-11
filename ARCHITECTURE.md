# 沐海签证 - Skills 架构说明文档

## 📋 文档概述

本文档记录沐海签证项目的 Skills 集成架构，用于指导后期功能开发。

**创建日期：** 2026-03-01  
**项目路径：** `C:\Users\Administrator\Desktop\muhai001\muhai001`

---

## 🏗️ 整体架构

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  用户浏览器  │ ──▶ │   后端 API 服务   │ ──▶ │ Skills 执行引擎  │
│  (前端 Next.js)│ ◀── │   (/api/*)      │ ◀── │ (Python 脚本)   │
└─────────────┘     └──────────────────┘     └─────────────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │  AI API 服务      │
                    │  (环境变量保护)   │
                    └──────────────────┘
```

---

## 🔧 Skills 模块说明

项目包含以下 Skills，位于 `skills/` 目录：

| Skill 名称 | 功能说明 | 适用场景 |
|-----------|----------|----------|
| **xlsx** | Excel 表格处理：创建、编辑、分析 .xlsx/.xlsm/.csv 文件，支持公式计算、数据透视、格式美化 | 行程单数据导出、财务报表生成 |
| **docx** | Word 文档处理：创建、编辑 .docx 文件，支持表格、目录、页眉页脚、批注、修订追踪 | 生成行程单、解释信、报告文档 |
| **pdf** | PDF 处理：读取、提取文本/表格、合并/拆分、旋转、添加水印、填写表单、OCR 识别 | 签证材料处理、PDF 表格提取 |
| **webapp-testing** | Web 应用测试：使用 Playwright 进行自动化测试、截图、调试 UI | 自动化测试、UI 验证 |
| **web-artifacts-builder** | 前端工件构建：React + TypeScript + Tailwind + shadcn/ui 打包为单文件 HTML | 生成独立可分享的交互组件 |
| **frontend-design** | 前端界面设计：创建独特、高品质的前端界面，避免"AI slop"美学 | UI 设计、组件开发 |
| **doc-coauthoring** | 文档协作：引导用户完成结构化文档编写工作流 | 文档编写、PRD、设计文档 |
| **brand-guidelines** | 品牌样式：应用 Anthropic 官方品牌色彩和字体规范 | 品牌文档、演示文稿 |
| **algorithmic-art** | 算法艺术：使用 p5.js 创建生成式艺术 | 创意设计、视觉效果 |

---

## 📡 API 路由结构

后端 API 路由位于 `src/app/api/` 目录：

```
src/app/api/
├── skills/
│   ├── execute/           # 统一 Skills 执行入口
│   │   └── route.ts       # POST /api/skills/execute
│   ├── xlsx/              # XLSX 相关 API
│   │   └── route.ts
│   ├── docx/              # DOCX 相关 API
│   │   └── route.ts
│   ├── pdf/               # PDF 相关 API
│   │   └── route.ts
│   └── parse/             # 文档解析 API
│       └── route.ts       # POST /api/skills/parse
├── files/                 # 文件上传处理
│   └── upload/
│       └── route.ts
└── ai/                    # AI 智能处理
    ├── extract/
    │   └── route.ts       # 信息提取
    └── generate/
        └── route.ts       # 内容生成
```

---

## 🎯 统一 Skills 执行接口

### POST /api/skills/execute

**请求格式：**
```json
{
  "skill": "docx",
  "action": "create",
  "params": {
    "template": "itinerary",
    "data": {
      "name": "张三",
      "date": "2026-03-01"
    }
  },
  "options": {
    "format": "docx",
    "download": true
  }
}
```

**响应格式：**
```json
{
  "status": "success",
  "skill": "docx",
  "action": "create",
  "result": {
    "fileUrl": "/api/files/output.docx",
    "fileName": "行程单_张三.docx"
  },
  "metadata": {
    "processedAt": "2026-03-01T19:00:00Z",
    "processingTime": "2.3s"
  }
}
```

**错误响应：**
```json
{
  "status": "error",
  "error": {
    "code": "SKILL_NOT_FOUND",
    "message": "Skill 'xxx' not found",
    "details": {}
  }
}
```

---

## 📝 典型使用场景

### 场景 1：上传行程单文件 → AI 解析 → 自动填充表单

```
用户上传文件 (.docx/.pdf)
        │
        ▼
POST /api/skills/parse
        │
        ▼
后端调用 python-docx/pypdf 提取文本
        │
        ▼
调用 AI API (GPT-4/通义千问) 进行信息抽取
        │
        ▼
返回结构化 JSON 数据
        │
        ▼
前端填充表单输入框
```

### 场景 2：生成行程单文档

```
用户填写表单数据
        │
        ▼
POST /api/skills/execute
{
  "skill": "docx",
  "action": "generate",
  "data": { ...表单数据... }
}
        │
        ▼
后端使用 docx 技能生成 Word 文档
        │
        ▼
返回文件下载链接
```

### 场景 3：导出 Excel 行程数据

```
用户查看行程数据
        │
        ▼
POST /api/skills/execute
{
  "skill": "xlsx",
  "action": "export",
  "data": { ...行程数据... }
}
        │
        ▼
后端使用 xlsx 技能生成 Excel 文件
        │
        ▼
返回文件下载链接
```

---

## 🔐 安全配置

### 环境变量

在 `.env.local` 中配置：

```env
# AI API Keys (保护在服务器端)
OPENAI_API_KEY=sk-xxxxx
AZURE_VISION_KEY=xxxxx

# 文件处理配置
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=.pdf,.docx,.doc,.jpg,.jpeg,.png

# Skills 路径
SKILLS_PATH=./skills
```

---

## 🛠️ 依赖要求

后端需要安装的 Python 依赖（通过 Python 脚本执行）：

```txt
# xlsx skills
openpyxl>=3.1.0
pandas>=2.0.0

# docx skills  
python-docx>=0.8.0

# pdf skills
pypdf>=3.0.0
pdfplumber>=0.10.0
pytesseract>=0.3.0

# 通用
Pillow>=10.0.0
numpy>=1.24.0
```

---

## 📖 开发指南

### 添加新的 Skill

1. 在 `skills/` 目录添加对应的 Skill 模块
2. 在 `src/lib/skills/` 创建对应的执行器类
3. 在 API 路由中注册新的端点
4. 更新本文档

### 调用 Skill 的标准流程

1. 前端通过 `FormData` 或 JSON 发送请求
2. API 路由接收并验证参数
3. 调用对应的 Skills 执行器
4. 处理结果并返回
5. 前端接收并展示

---

## 📞 后续开发任务

- [ ] 创建 `/api/skills/execute` 统一入口
- [ ] 实现文档解析 API (`/api/skills/parse`)
- [ ] 实现文件上传处理 (`/api/files/upload`)
- [ ] 实现 AI 信息提取 (`/api/ai/extract`)
- [ ] 实现 DOCX 生成 (`/api/skills/docx/generate`)
- [ ] 实现 XLSX 导出 (`/api/skills/xlsx/export`)
- [ ] 添加 OCR 识别支持

---

## 📚 相关文档

- **功能索引**：[SKILLS_INDEX.md](./SKILLS_INDEX.md) - Skills 功能详细索引，包含业务场景映射和使用示例

---

*本文档将随项目开发持续更新*
