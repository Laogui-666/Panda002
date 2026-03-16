/**
 * 签证类型定义
 */

import { BaseEntity, ApiResponse } from './common';

export type { ApiResponse };

/**
 * 护照类型
 */
export type PassportType = 'ordinary' | 'diplomatic' | 'service' | 'other';

/**
 * 签证类型
 */
export type VisaType = 'tourist' | 'business' | 'student' | 'work' | 'transit' | 'family' | 'other';

/**
 * 签证状态
 */
export type VisaStatus = 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'expired';

/**
 * 签证评估因素
 */
export interface AssessmentFactor {
  name: string;
  score: number; // 0-100
  weight: number; // 权重
  description?: string;
}

/**
 * 签证评估结果
 */
export interface VisaAssessment extends BaseEntity {
  userId: string;
  country: string;
  passportType: PassportType;
  visaType: VisaType;
  plannedTravelDate?: string;
  plannedDuration?: number; // 天数
  
  // 申请人信息
  applicantInfo: {
    nationality: string;
    currentResidence?: string;
    age?: number;
    education?: string;
    occupation?: string;
    annualIncome?: number;
    hasValidVisa?: boolean;
    previousVisaDenials?: boolean;
    travelHistory?: string[];
  };
  
  // 评估结果
  assessmentResult: {
    overallScore: number; // 0-100
    passRate: number; // 百分比
    factors: AssessmentFactor[];
    recommendation: 'apply' | 'caution' | 'not_recommended';
    riskFactors?: string[];
    tips?: string[];
  };
  
  status: VisaStatus;
  expiresAt?: string;
}

/**
 * 签证评估请求
 */
export interface VisaAssessmentRequest {
  country: string;
  passportType: PassportType;
  visaType: VisaType;
  plannedTravelDate?: string;
  plannedDuration?: number;
  applicantInfo: VisaAssessment['applicantInfo'];
}

/**
 * 签证评估响应
 */
export interface VisaAssessmentResponse {
  assessment: VisaAssessment;
  similarCases?: {
    country: string;
    passRate: number;
    sampleSize: number;
  }[];
  requiredDocuments?: string[];
  processingTime?: string;
  estimatedCost?: {
    amount: number;
    currency: string;
  };
}
