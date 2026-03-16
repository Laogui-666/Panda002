/**
 * 解释信类型定义
 */

import { BaseEntity, ApiResponse } from './common';

export type { ApiResponse };

/**
 * 解释信类型
 */
export type LetterType = 'visa_explanation' | 'employment' | 'financial' | 'travel_purpose' | 'custom';

/**
 * 解释信状态
 */
export type LetterStatus = 'draft' | 'generating' | 'completed' | 'reviewed' | 'exported';

/**
 * 解释信内容段落
 */
export interface LetterParagraph {
  title?: string;
  content: string;
  keyPoints?: string[];
}

/**
 * 解释信
 */
export interface ExplanationLetter extends BaseEntity {
  userId: string;
  title: string;
  type: LetterType;
  country: string;
  visaType?: string;
  
  // 内容
  content: string;
  paragraphs: LetterParagraph[];
  
  // 上下文信息
  context: {
    applicantName?: string;
    purpose: string;
    duration?: number;
    destinations?: string[];
    financialSituation?: string;
    travelHistory?: string[];
    additionalInfo?: string;
  };
  
  // AI 生成信息
  aiInfo?: {
    model: string;
    generatedAt: string;
    tokensUsed?: number;
    prompt?: string;
  };
  
  // 状态
  status: LetterStatus;
  isFavorite: boolean;
  tags?: string[];
  wordCount: number;
  
  // 导出信息
  exportedAt?: string;
  pdfUrl?: string;
}

/**
 * 解释信生成请求
 */
export interface ExplanationLetterRequest {
  type: LetterType;
  title?: string;
  country: string;
  visaType?: string;
  context: ExplanationLetter['context'];
  
  // 生成选项
  options?: {
    tone?: 'formal' | 'professional' | 'friendly';
    length?: 'short' | 'medium' | 'long';
    language?: 'zh' | 'en' | 'bilingual';
    includeKeyPoints?: boolean;
  };
}

/**
 * 解释信响应
 */
export interface ExplanationLetterResponse {
  letter: ExplanationLetter;
  suggestions?: string[];
  keywords?: string[];
  similarExamples?: string[];
}
