# Skills 功能索引 (Skills Feature Index)

> 本文档将 Skills 功能与沐海签证业务场景进行映射，方便快速检索

---

## 📌 快速查找表

| 业务需求 | 对应 Skill | 具体功能 | API 端点 |
|---------|-----------|----------|----------|
| 上传行程单文件自动填充表单 | `docx` / `pdf` | 解析 Word/PDF 提取文本 | `/api/skills/parse` |
| 生成行程单 Word 文档 | `docx` | 创建 Word 文档、填充模板 | `/api/skills/execute` (action: create) |
| 导出行程数据为 Excel | `xlsx` | 创建 Excel、公式计算 | `/api/skills/execute` (action: export) |
| 处理 PDF 签证材料 | `pdf` | 提取文本、合并、分割 | `/api/skills/execute` |
| 识别图片中的文字 (OCR) | `paddle-ocr` | 图片转文字、表格识别、版面分析 | `/api/skills/paddle-ocr` |
| 文本/文档翻译 | `paddle-ocr` | 多语言翻译、保留排版 | `/api/skills/paddle-ocr` |
| 生成解释信 | `docx` | Word 文档生成 | `/api/skills/execute` |
| 生成签证评估报告 | `docx` | Word 报告生成 | `/api/skills/execute` |
| 批量处理文档 | `docx` / `pdf` | 批量转换、合并 | `/api/skills/execute` |

---

## 🔧 Skills 详细功能索引

### 1. docx (Word 文档处理)

**用途**：创建、编辑、解析 Word 文档

**可用动作 (actions)**：

| 动作 | 功能说明 | 适用场景 |
|------|----------|----------|
| `create` | 创建新 Word 文档 | 生成行程单、解释信 |
| `edit` | 编辑现有文档 | 修改模板、添加内容 |
| `generate` | 模板化生成 | 批量生成个性化文档 |
| `parse` | 解析文档内容 | 提取用户上传的行程单信息 |
| `convert` | 格式转换 | Word 转 PDF 等 |

**支持的文件格式**：`.docx`, `.doc`

**脚本位置**：`skills/docx/scripts/`

**典型业务场景**：
- 生成英文/中文行程单
- 生成解释信
- 生成签证材料清单
- 解析用户上传的行程单文件

---

### 2. xlsx (Excel 表格处理)

**用途**：创建、编辑、分析 Excel 表格

**可用动作 (actions)**：

| 动作 | 功能说明 | 适用场景 |
|------|----------|----------|
| `create` | 创建新 Excel 文件 | 新建数据表 |
| `edit` | 编辑现有表格 | 修改数据、添加行 |
| `analyze` | 数据分析 | 统计、汇总 |
| `export` | 导出数据 | 行程数据导出为 Excel |
| `import` | 导入数据 | 读取外部 Excel |

**支持的文件格式**：`.xlsx`, `.xlsm`, `.csv`, `.tsv`

**脚本位置**：`skills/xlsx/scripts/`

**典型业务场景**：
- 导出用户行程数据
- 导出财务报表
- 生成费用明细表
- 数据统计分析

---

### 3. pdf (PDF 处理)

**用途**：读取、创建、转换 PDF 文件

**可用动作 (actions)**：

| 动作 | 功能说明 | 适用场景 |
|------|----------|----------|
| `read` | 读取 PDF 内容 | 提取文本 |
| `extract` | 提取特定内容 | 提取表格、图片 |
| `merge` | 合并多个 PDF | 合并签证材料 |
| `split` | 分割 PDF | 拆分多页文档 |
| `convert` | 格式转换 | Word 转 PDF, PDF 转图片 |
| `ocr` | 文字识别 | 图片/扫描件 OCR |

**支持的文件格式**：`.pdf`

**脚本位置**：`skills/pdf/scripts/`

**典型业务场景**：
- 识别上传的图片行程单
- 提取 PDF 中的表格数据
- 合并多个签证材料为单个 PDF
- PDF 转图片用于预览

---

### 4. webapp-testing (Web 应用测试)

**用途**：自动化测试、Web 交互

**可用动作 (actions)**：

| 动作 | 功能说明 | 适用场景 |
|------|----------|----------|
| `test` | 自动化测试 | 功能测试、回归测试 |
| `screenshot` | 页面截图 | 生成预览图 |
| `automate` | 自动化操作 | 批量数据录入 |

**典型业务场景**：
- 自动测试表单功能
- 批量生成页面截图
- 自动化 UI 验证

---

### 5. paddle-ocr (PaddleOCR-VL 智能翻译 OCR)

**用途**：图像文字识别（OCR）、多语言翻译、版面分析

**可用动作 (actions)**：

| 动作 | 功能说明 | 适用场景 |
|------|----------|----------|
| `analyze` | OCR版面分析 | 识别图片/PDF中的文字布局 |
| `analyze_json` | 结构化JSON输出 | 提取坐标、类型、内容 |
| `analyze_markdown` | Markdown格式输出 | 保留排版的文本输出 |
| `translate_zh2en` | 中译英 | 中文文档翻译为英文 |
| `translate_en2zh` | 英译中 | 英文文档翻译为中文 |
| `translate_zh2ja` | 中译日 | 中文文档翻译为日文 |
| `translate_zh2ko` | 中译韩 | 中文文档翻译为韩文 |
| `translate_custom` | 自定义翻译 | 自定义Prompt翻译 |
| `process_pdf` | PDF处理 | PDF转图片再OCR翻译 |

**支持的文件格式**：`.jpg`, `.jpeg`, `.png`, `.pdf`

**脚本位置**：`skills/paddle_ocr/`

**模型**：`PaddlePaddle/PaddleOCR-VL-1.5` (via SiliconFlow API)

**API端点**：`/api/skills/paddle-ocr`

**典型业务场景**：
- 识别上传的图片行程单
- 翻译签证材料文档
- 保留排版的文档翻译
- 多语言材料处理

**使用示例**：

```javascript
// OCR分析
const response = await fetch('/api/skills/paddle-ocr', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'analyze',
    imageUrl: 'data:image/png;base64,...'
  })
});

// 翻译
const translateResponse = await fetch('/api/skills/paddle-ocr', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'translate_zh2en',
    imageUrl: 'https://example.com/document.jpg'
  })
});
```

---

### 5. web-artifacts-builder (前端工件构建)

**用途**：创建可交互的 HTML 组件

**可用动作 (actions)**：

| 动作 |功能说明 | 适用场景 |
|------|----------|----------|
| `build` | 构建项目 | 创建 React 项目 |
| `bundle` | 打包为单文件 | 生成独立 HTML 组件 |

**典型业务场景**：
- 生成可分享的交互式组件
- 创建独立的数据可视化页面

---

### 6. frontend-design (前端界面设计)

**用途**：创建高品质前端界面

**典型业务场景**：
- 设计新的 UI 组件
- 优化现有页面
- 创建响应式布局

---

### 7. doc-coauthoring (文档协作)

**用途**：结构化文档编写指导

**典型业务场景**：
- 编写项目文档
- 编写技术规范
- 编写需求文档 (PRD)

---

### 8. brand-guidelines (品牌样式)

**用途**：应用品牌规范

**典型业务场景**：
- 生成品牌演示文稿
- 应用品牌色彩

---

### 9. algorithmic-art (算法艺术)

**用途**：生成艺术图案

**典型业务场景**：
- 生成创意背景
- 生成艺术元素

---

## 🎯 业务场景 → Skills 映射

### 场景 1：用户上传行程单 → 自动填充表单

```
用户操作: 上传 .docx / .pdf 文件
         │
         ▼
API: POST /api/skills/parse
         │
         ├─ 文件是 .docx ──▶ docx skill → 解析文本
         │
         └─ 文件是 .pdf ──▶ pdf skill → 提取文本/OCR
         │
         ▼
AI 处理: 提取关键信息 (姓名、航班、酒店等)
         │
         ▼
返回: JSON 结构化数据
         │
         ▼
前端: 自动填充表单输入框
```

**对应 Skills**：`docx` (parse), `pdf` (extract/ocr)

---

### 场景 2：生成并下载行程单

```
用户操作: 填写行程信息 → 点击"生成行程单"
         │
         ▼
API: POST /api/skills/execute
{
  skill: "docx",
  action: "generate",
  params: { template: "itinerary", data: {...} }
}
         │
         ▼
docx skill: 填充模板 → 生成 .docx 文件
         │
         ▼
返回: 文件下载链接
```

**对应 Skills**：`docx` (create/generate)

---

### 场景 3：导出行程数据为 Excel

```
用户操作: 查看行程 → 点击"导出 Excel"
         │
         ▼
API: POST /api/skills/execute
{
  skill: "xlsx",
  action: "export",
  params: { data: [...] }
}
         │
         ▼
xlsx skill: 创建 Excel → 添加公式/格式
         │
         ▼
返回: 文件下载链接
```

**对应 Skills**：`xlsx` (create/export)

---

### 场景 4：识别图片中的行程信息

```
用户操作: 上传图片行程单
         │
         ▼
API: POST /api/skills/parse (fileType: image)
         │
         ▼
pdf skill (ocr): 图片 → 文字识别
         │
         ▼
AI 处理: 提取关键信息
         │
         ▼
返回: JSON 结构化数据
```

**对应 Skills**：`pdf` (ocr)

---

### 场景 5：识别图片中的行程信息

```
用户操作: 上传图片行程单
         │
         ▼
API: POST /api/skills/parse (fileType: image)
         │
         ▼
pdf skill (ocr): 图片 → 文字识别
         │
         ▼
AI 处理: 提取关键信息
         │
         ▼
返回: JSON 结构化数据
```

**对应 Skills**：`pdf` (ocr)

---

### 场景 6：翻译文档材料

```
用户操作: 上传图片/PDF文档 → 选择目标语言
         │
         ▼
API: POST /api/skills/paddle-ocr
{
  action: "translate_zh2en",
  imageUrl: "data:image/png;base64,..."
}
         │
         ▼
PaddleOCR-VL: OCR识别 → 版面分析 → 翻译
         │
         ▼
返回: 翻译后的JSON/Markdown
         │
         ▼
前端: 预览编辑 → 导出PDF
```

**对应 Skills**：`paddle-ocr` (translate_*)

---

### 场景 7：合并签证材料 PDF

```
用户操作: 选择多个 PDF → 点击"合并"
         │
         ▼
API: POST /ecute
{
  skill: "pdf",
  action:api/skills/ex "merge",
  params: { files: [...] }
}
         │
         ▼
pdf skill: 合并多个 PDF
         │
         ▼
返回: 合并后的 PDF 下载链接
```

**对应 Skills**：`pdf` (merge)

---

## 📖 使用示例

### 示例 1：调用文档解析

```javascript
// 前端调用
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('extractType', 'itinerary');

const response = await fetch('/api/skills/parse', {
  method: 'POST',
  body: formData
});

const result = await response.json();
// result.result.extractedData 包含解析出的结构化数据
```

### 示例 2：调用统一执行接口

```javascript
// 前端调用
const response = await fetch('/api/skills/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    skill: 'docx',
    action: 'generate',
    params: {
      template: 'itinerary',
      data: {
        name: '张三',
        flights: [...],
        hotels: [...]
      }
    },
    options: { format: 'docx' }
  })
});

const result = await response.json();
// result.result 包含生成的文件信息
```

---

## 🔍 关键词检索

快速查找时，可以使用以下关键词：

| 关键词 | 对应功能 |
|--------|----------|
| 上传、解析、提取、填充 | `docx`/`pdf` parse |
| 生成、创建、导出 | `docx`/`xlsx` create/generate/export |
| 表格、Excel、统计 | `xlsx` |
| PDF、合并、分割、OCR | `pdf` |
| 文档、报告、信 | `docx` |
| 图片、文字识别、翻译、排版 | `paddle-ocr` |
| 测试、自动化 | `webapp-testing` |

---

*本文档随项目开发持续更新*
