/**
 * 翻译模板注册表
 * 用于自动识别文档类型并匹配对应的翻译模板
 * 
 * 使用方法：
 * import { TEMPLATE_REGISTRY, getTemplateCatalog } from '@/lib/templates/registry';
 * 
 * const catalog = getTemplateCatalog(); // 获取模板目录列表
 * const template = TEMPLATE_REGISTRY['ID_CARD']; // 获取指定模板
 */

// 模板类型枚举
export enum TemplateType {
  ID_CARD = 'ID_CARD',
  BUSINESS_LICENSE_COMPANY = 'BUSINESS_LICENSE_COMPANY',
  BUSINESS_LICENSE_INDIVIDUAL = 'BUSINESS_LICENSE_INDIVIDUAL',
  HOUSE_PROPERTY_CERT_NEW = 'HOUSE_PROPERTY_CERT_NEW',
  HOUSE_PROPERTY_CERT_OLD = 'HOUSE_PROPERTY_CERT_OLD',
  HOUSEHOLD_REGISTER = 'HOUSEHOLD_REGISTER',
  MARRIAGE_CERT = 'MARRIAGE_CERT',
  RETIREMENT_CERT = 'RETIREMENT_CERT',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  RESIDENCE_PROOF = 'RESIDENCE_PROOF',
  GENERAL_DOCUMENT = 'GENERAL_DOCUMENT'
}

// 模板注册表
export interface TemplateInfo {
  id: TemplateType;
  name: string;
  nameEn: string;
  file: string;
  keywords: string[]; // 用于识别文档类型的关键词
  description?: string;
}

export const TEMPLATE_REGISTRY: Record<TemplateType, TemplateInfo> = {
  [TemplateType.ID_CARD]: {
    id: TemplateType.ID_CARD,
    name: '身份证',
    nameEn: 'Identity Card',
    file: '身份证翻译框架（改）.html',
    keywords: [
      '居民身份证', '公民身份号码', '身份证', '性别', '民族', '出生日期',
      '常住地址', '签发机关', '有效期限',
      'Identity Card', 'ID Number', 'Resident Identity'
    ],
    description: '中国居民身份证正反面翻译'
  },

  // 公司营业执照
  [TemplateType.BUSINESS_LICENSE_COMPANY]: {
    id: TemplateType.BUSINESS_LICENSE_COMPANY,
    name: '营业执照（公司）',
    nameEn: 'Business License (Company)',
    file: '公司-营业执照翻译框架.html',
    keywords: [
      '营业执照', '统一社会信用代码', '法定代表人', '注册资本', '公司名称',
      '企业名称', '成立日期', '营业期限', '登记机关', '公司类型',
      'Business License', 'Unified Social Credit Code', 'Legal Representative', 
      'Registered Capital', 'Company Name'
    ],
    description: '公司营业执照翻译'
  },

  // 个体工商户营业执照
  [TemplateType.BUSINESS_LICENSE_INDIVIDUAL]: {
    id: TemplateType.BUSINESS_LICENSE_INDIVIDUAL,
    name: '营业执照（个体工商户）',
    nameEn: 'Business License (Individual)',
    file: '个体工商户-营业执照翻译框架.html',
    keywords: [
      '营业执照', '统一社会信用代码', '经营者', '经营范围', '登记机关',
      '经营场所', '组成形式', '注册日期',
      'Business License', 'Unified Social Credit Code', 'Operator', 
      'Business Scope', 'Individual Business'
    ],
    description: '个体工商户营业执照翻译'
  },

  // 新版房产证
  [TemplateType.HOUSE_PROPERTY_CERT_NEW]: {
    id: TemplateType.HOUSE_PROPERTY_CERT_NEW,
    name: '房产证（新版）',
    nameEn: 'House Property Certificate (New)',
    file: '新版-房产证翻译框架.html',
    keywords: [
      '不动产登记', '不动产单元号', '权利人', '共有情况', '坐落位置',
      '权利类型', '权利性质', '用途', '面积', '分摊面积',
      'Property Certificate', 'Real Estate Registration', 'Obligee', 
      'Unit Number', 'Building Area'
    ],
    description: '新版不动产登记证/房产证翻译'
  },

  // 旧版房产证
  [TemplateType.HOUSE_PROPERTY_CERT_OLD]: {
    id: TemplateType.HOUSE_PROPERTY_CERT_OLD,
    name: '房产证（旧版）',
    nameEn: 'House Property Certificate (Old)',
    file: '旧版-房产证翻译框架（改）.html',
    keywords: [
      '房产证', '房屋所有权证', '房屋所有权', '共有人', '房屋坐落',
      '建筑面积', '设计用途', '总层数', '建筑结构', '填发单位',
      'House Ownership Certificate', 'Building Area', 'Owner', 'Address'
    ],
    description: '旧版房屋所有权证翻译'
  },

  [TemplateType.HOUSEHOLD_REGISTER]: {
    id: TemplateType.HOUSEHOLD_REGISTER,
    name: '户口本',
    nameEn: 'Household Register',
    file: '（新）户口本翻译框架.html',
    keywords: [
      '户口本', '常住人口', '户主', '户口地址', '户别',
      'Household Register', 'Resident Population', 'Household Type'
    ],
    description: '居民户口簿翻译'
  },

  [TemplateType.MARRIAGE_CERT]: {
    id: TemplateType.MARRIAGE_CERT,
    name: '结婚证',
    nameEn: 'Marriage Certificate',
    file: '结婚证翻译框架.html',
    keywords: [
      '结婚证', '婚姻登记', '登记日期', '证件编号', '男方', '女方',
      'Marriage Certificate', 'Registration Date', 'Groom', 'Bride'
    ],
    description: '结婚证/离婚证翻译'
  },

  [TemplateType.RETIREMENT_CERT]: {
    id: TemplateType.RETIREMENT_CERT,
    name: '退休证',
    nameEn: 'Retirement Certificate',
    file: '退休证翻译框架.html',
    keywords: [
      '退休证', '退休', '养老', '社会保险',
      'Retirement Certificate', 'Pension', 'Social Security'
    ],
    description: '退休证/养老证翻译'
  },

  [TemplateType.VEHICLE_REGISTRATION]: {
    id: TemplateType.VEHICLE_REGISTRATION,
    name: '机动车登记证',
    nameEn: 'Vehicle Registration Certificate',
    file: '机动车登记证翻译框架.html',
    keywords: [
      '机动车登记证', '行驶证', '车辆型号', '车辆识别代号', '发动机号',
      '车牌号码', '注册日期', '发证日期',
      'Vehicle Registration', 'VIN', 'Engine Number', 'License Plate'
    ],
    description: '机动车登记证/行驶证翻译'
  },

  [TemplateType.RESIDENCE_PROOF]: {
    id: TemplateType.RESIDENCE_PROOF,
    name: '居住证明',
    nameEn: 'Residence Proof',
    file: '居住证明翻译框架.html',
    keywords: [
      '居住证明', '居住证', '暂住证', '居住地址', '居住登记',
      'Residence Proof', 'Residence Permit', 'Temporary Residence'
    ],
    description: '居住证明翻译'
  },

  [TemplateType.GENERAL_DOCUMENT]: {
    id: TemplateType.GENERAL_DOCUMENT,
    name: '通用文档',
    nameEn: 'General Document',
    file: '通用文档翻译框架.html',
    keywords: [],
    description: '通用文档翻译（无固定模板）'
  }
};

/**
 * 获取模板目录列表（用于发送给大模型）
 */
export function getTemplateCatalog(): { id: string; name: string; nameEn: string; keywords: string[] }[] {
  return Object.values(TEMPLATE_REGISTRY).map(template => ({
    id: template.id,
    name: template.name,
    nameEn: template.nameEn,
    keywords: template.keywords
  }));
}

/**
 * 根据关键词匹配最佳模板
 * @param keywords 从文档中识别的关键词数组
 * @returns 匹配的模板类型
 */
export function matchTemplate(keywords: string[]): TemplateType {
  let bestMatch: TemplateType = TemplateType.GENERAL_DOCUMENT;
  let highestScore = 0;

  for (const [type, template] of Object.entries(TEMPLATE_REGISTRY)) {
    if (template.keywords.length === 0) continue; // 跳过通用文档
    
    let score = 0;
    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase();
      for (const templateKeyword of template.keywords) {
        if (lowerKeyword.includes(templateKeyword.toLowerCase())) {
          score++;
        }
      }
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = type as TemplateType;
    }
  }

  return bestMatch;
}

/**
 * 获取指定模板的文件名
 */
export function getTemplateFile(type: TemplateType): string {
  return TEMPLATE_REGISTRY[type]?.file || TEMPLATE_REGISTRY[TemplateType.GENERAL_DOCUMENT].file;
}
