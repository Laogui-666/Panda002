/**
 * 翻译模块类型定义
 * 核心架构：数据模型层
 */

// 任务状态
export enum TaskStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  CONVERTING = 'converting',
  PROCESSING = 'processing',
  ANALYZING = 'analyzing',
  TRANSLATING = 'translating',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// 翻译类型
export enum TranslationType {
  NORMAL = 'NORMAL',
  CERTIFIED = 'CERTIFIED' // 认证翻译（带翻译宣誓词和盖章）
}

// 翻译任务
export interface TranslationTask {
  id: string;
  fileName: string;
  fileType: string;
  status: TaskStatus;
  type?: TranslationType;
  progress: number;
  progressLabel: string;
  resultHtml?: string;
  resultUrl?: string;     // 翻译结果HTML（用于PDF下载）
  originalHtml?: string;    // 原文HTML
  translatedHtml?: string;  // 译文HTML
  errorMsg?: string;
  originalFile?: File;
  previewUrl?: string;
  completedAt?: number;
}

// 处理步骤
export interface ProcessingStep {
  label: string;
  percentage: number;
}

// 进度条步骤配置
export const PROCESSING_STEPS: ProcessingStep[] = [
  { label: '正在安全上传...', percentage: 10 },
  { label: '正在转换文档格式...', percentage: 20 },
  { label: '智能 OCR 内容识别中...', percentage: 40 },
  { label: '神经网络高质量翻译中...', percentage: 65 },
  { label: '智能排版还原中...', percentage: 85 },
  { label: '正在生成结果文件...', percentage: 95 },
  { label: '准备就绪', percentage: 100 }
];

// 模板定义
export interface TemplateDefinition {
  id: string;
  name: string;
  nameEn: string;
  category: 'IDENTITY' | 'FINANCE' | 'EMPLOYMENT' | 'RELATIONSHIP' | 'TRAVEL' | 'GENERAL' | 'PROPERTY' | 'CERTIFICATE' | 'PROOF';
  icon?: string;
  matchCriteria?: {
    keywords: string[];
    anchorText: string[];
    layoutFeatures: string[];
    layoutDescription: string;
    requiredFields: string[];
  };
  html: string;
}

// 模板变量
export interface TemplateVariable {
  key: string;
  label: string;
  labelEn: string;
  type: 'text' | 'date' | 'number' | 'table';
}

// 翻译请求
export interface TranslateRequest {
  file?: File;
  text?: string;
  images?: string[];
  targetLang: string;
  sourceLang?: string;
  templateId?: string;
  translationType?: TranslationType;
}

// 翻译响应
export interface TranslateResponse {
  success: boolean;
  html?: string;
  text?: string;
  error?: string;
}

// 语言选项
export const LANGUAGES = [
  { code: 'zh', name: '中文', nameEn: 'Chinese' },
  { code: 'en', name: '英语', nameEn: 'English' },
  { code: 'ja', name: '日语', nameEn: 'Japanese' },
  { code: 'ko', name: '韩语', nameEn: 'Korean' },
  { code: 'fr', name: '法语', nameEn: 'French' },
  { code: 'de', name: '德语', nameEn: 'German' },
  { code: 'es', name: '西班牙语', nameEn: 'Spanish' },
  { code: 'it', name: '意大利语', nameEn: 'Italian' },
  { code: 'ru', name: '俄语', nameEn: 'Russian' },
  { code: 'ar', name: '阿拉伯语', nameEn: 'Arabic' },
];

// 目标语言选项（用于下拉选择）- 包含所有语言
export const TARGET_LANGUAGES = LANGUAGES;
