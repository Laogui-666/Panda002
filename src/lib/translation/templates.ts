/**
 * 翻译模板注册中心
 * 模板引擎层 - 内置多种证件的高保真 HTML 模板
 */

import { TemplateDefinition } from '@/types/translation';

// 通用文档模板
export const GENERAL_DOCUMENT_TEMPLATE: TemplateDefinition = {
  id: 'ZH_GENERAL_DOCUMENT_V2',
  name: '通用文档',
  nameEn: 'General Document',
  category: 'GENERAL',
  matchCriteria: {
    keywords: ['Document', 'Notice', 'Letter', 'Certificate', 'General', 'Statement', 'Proof', 'Contract', 'Agreement'],
    anchorText: ['Document Title', 'Date', 'Dear', 'Sincerely', 'To Whom It May Concern'],
    layoutFeatures: ['Portrait A4', 'Centered title', 'Formal typography', 'Signature area', 'Structured content'],
    layoutDescription: '高级正式版通用文档翻译件。适用于函件、证明、声明、合同、协议等正式文书。',
    requiredFields: ['DOCUMENT_MAIN_TITLE', 'DOCUMENT_SUBTITLE', 'CONTENT_BODY']
  },
  html: `
    <div class="general-document" style="font-family: 'Times New Roman', Times, serif; color: #000; line-height: 1.5; padding: 40px; background-color: white; max-width: 210mm; margin: 0 auto; box-sizing: border-box;">
      <style>
        .doc-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
        .doc-title { font-size: 24px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
        .doc-subtitle { font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; color: #333; }
        .doc-body { font-size: 12pt; text-align: justify; color: #000; }
        .doc-paragraph { margin-bottom: 15px; text-indent: 2em; }
        .doc-section-title { font-size: 12pt; font-weight: bold; margin-top: 25px; margin-bottom: 10px; background-color: #dae8fc; padding: 3px 8px; display: inline-block; width: 100%; box-sizing: border-box; border-bottom: 1px solid #b1cce7; }
        .doc-list { list-style-type: disc; padding-left: 20px; margin-bottom: 15px; }
        .doc-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11pt; table-layout: auto; }
        .doc-table th { border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold; background-color: #f2f2f2; }
        .doc-table td { border: 1px solid #000; padding: 8px; vertical-align: top; word-wrap: break-word; }
      </style>
      <div class="doc-header">
        <div class="doc-title">{{DOCUMENT_MAIN_TITLE}}</div>
        <div class="doc-subtitle">{{DOCUMENT_SUBTITLE}}</div>
      </div>
      <div class="doc-body">
        {{CONTENT_BODY}}
      </div>
    </div>
  `
};

// 身份证模板
export const ID_CARD_TEMPLATE: TemplateDefinition = {
  id: 'ZH_ID_CARD_V3',
  name: '居民身份证',
  nameEn: 'Identity Card',
  category: 'IDENTITY',
  matchCriteria: {
    keywords: ['身份证', 'Identity Card', '居民身份证'],
    anchorText: ['Name', 'Gender', 'Ethnicity', 'Date of Birth', 'National ID Number'],
    layoutFeatures: ['Two sections: Front Side and Back Side', 'Table-based layout'],
    layoutDescription: '高保真表格版身份证翻译件。包含正反两面信息。',
    requiredFields: ['NAME', 'GENDER', 'ETHNICITY', 'DOB', 'ADDRESS', 'ID_NUMBER', 'AUTHORITY', 'VALIDITY']
  },
  html: `
    <div class="id-card-translation" style="font-family: Arial, sans-serif; color: #000; line-height: 1.3; padding: 20px;">
      <style>
        .card-section { margin-bottom: 30px; }
        .card-title { font-weight: bold; text-align: center; font-size: 1.2em; margin-bottom: 10px; background-color: #f0f0f0; padding: 5px; border: 1px solid #000; }
        .id-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 1px solid #000; table-layout: fixed; }
        .id-table th, .id-table td { border: 1px solid #000; padding: 8px 10px; vertical-align: top; word-wrap: break-word; }
        .id-table th { background-color: #f2f2f2; font-weight: bold; text-align: left; width: 20%; }
      </style>
      <div class="card-section">
        <div class="card-title">People's Republic of China Resident Identity Card (Front Side)</div>
        <table class="id-table">
          <tr><th>Name</th><td>{{NAME}}</td><th>Gender</th><td>{{GENDER}}</td></tr>
          <tr><th>Ethnicity</th><td>{{ETHNICITY}}</td><th>Date of Birth</th><td>{{DOB}}</td></tr>
          <tr><th>Residential Address</th><td colspan="3">{{ADDRESS}}</td></tr>
          <tr><th>National ID Number</th><td colspan="3">{{ID_NUMBER}}</td></tr>
        </table>
      </div>
      <div class="card-section">
        <div class="card-title">People's Republic of China Resident Identity Card (Back Side)</div>
        <table class="id-table">
          <tr><th style="width: 25%;">Issuing Authority</th><td>{{AUTHORITY}}</td></tr>
          <tr><th style="width: 25%;">Valid Period</th><td>{{VALIDITY}}</td></tr>
        </table>
      </div>
    </div>
  `
};

// 营业执照模板
export const BUSINESS_LICENSE_TEMPLATE: TemplateDefinition = {
  id: 'ZH_BUSINESS_LICENSE_V2',
  name: '营业执照',
  nameEn: 'Business License',
  category: 'FINANCE',
  matchCriteria: {
    keywords: ['Business License', '营业执照', 'Unified Social Credit Code', '统一社会信用代码'],
    anchorText: ['Unified Social Credit Code', 'Business License', 'Duplicate'],
    layoutFeatures: ['Landscape A4', 'Two-column info section'],
    layoutDescription: '高保真横版营业执照。',
    requiredFields: ['UNIFIED_SOCIAL_CREDIT_CODE', 'COMPANY_NAME', 'COMPANY_TYPE', 'PERSON_IN_CHARGE_NAME', 'ESTABLISHMENT_DATE', 'BUSINESS_ADDRESS', 'GENERAL_ITEMS', 'PERMITTED_ITEMS', 'REGISTRATION_AUTHORITY_DATE']
  },
  html: `
    <div class="business-license" style="font-family: 'Times New Roman', serif; width: 29.7cm; height: 21cm; background: white; padding: 1.2cm 2.5cm; box-sizing: border-box; color: #000;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
        <div><div style="font-size: 14px;">Unified Social Credit Code</div><div style="font-weight: bold; font-size: 16px;">{{UNIFIED_SOCIAL_CREDIT_CODE}}</div></div>
        <div style="text-align: center; font-size: 28px; font-weight: bold; text-decoration: underline;">Business License<br/>(Duplicate)</div>
        <div style="width: 180px;"></div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <div style="margin-bottom: 12px; display: flex;"><div style="font-weight: bold; min-width: 150px;">Name:</div><div style="border-bottom: 1px dotted #666; flex: 1;">{{COMPANY_NAME}}</div></div>
          <div style="margin-bottom: 12px; display: flex;"><div style="font-weight: bold; min-width: 150px;">Type:</div><div style="border-bottom: 1px dotted #666; flex: 1;">{{COMPANY_TYPE}}</div></div>
        </div>
        <div>
          <div style="margin-bottom: 12px; display: flex;"><div style="font-weight: bold; min-width: 150px;">Person in Charge:</div><div style="border-bottom: 1px dotted #666; flex: 1;">{{PERSON_IN_CHARGE_NAME}}</div></div>
          <div style="margin-bottom: 12px; display: flex;"><div style="font-weight: bold; min-width: 150px;">Date of Establishment:</div><div style="border-bottom: 1px dotted #666; flex: 1;">{{ESTABLISHMENT_DATE}}</div></div>
          <div style="margin-bottom: 12px; display: flex;"><div style="font-weight: bold; min-width: 150px;">Business Address:</div><div style="border-bottom: 1px dotted #666; flex: 1;">{{BUSINESS_ADDRESS}}</div></div>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <div style="font-weight: bold;">Business Scope:</div>
        <div style="font-size: 13px;">
          <div><strong>General Items:</strong> {{GENERAL_ITEMS}}</div>
          <div><strong>Permitted Items:</strong> {{PERMITTED_ITEMS}}</div>
        </div>
      </div>
      <div style="text-align: right; margin-top: 10px; border-top: 1px solid #000; padding-top: 10px;">
        <div style="font-weight: bold;">Registration Authority</div>
        <div>{{REGISTRATION_AUTHORITY_DATE}}</div>
      </div>
    </div>
  `
};

// 护照模板
export const PASSPORT_TEMPLATE: TemplateDefinition = {
  id: 'ZH_PASSPORT_V1',
  name: '护照',
  nameEn: 'Passport',
  category: 'TRAVEL',
  matchCriteria: {
    keywords: ['Passport', '护照', 'PASSPORT'],
    anchorText: ['Surname', 'Given Names', 'Nationality', 'Date of Birth', 'Date of Issue', 'Date of Expiry'],
    layoutFeatures: ['Bio-data page', 'Photo and personal info', 'Machine readable zone'],
    layoutDescription: '护照个人信息页翻译。',
    requiredFields: ['SURNAME', 'GIVEN_NAMES', 'NATIONALITY', 'DATE_OF_BIRTH', 'SEX', 'PLACE_OF_BIRTH', 'DATE_OF_ISSUE', 'DATE_OF_EXPIRY', 'AUTHORITY', 'PASSPORT_NUMBER']
  },
  html: `
    <div class="passport-translation" style="font-family: Arial, sans-serif; color: #000; line-height: 1.4; padding: 30px; max-width: 210mm; margin: 0 auto;">
      <style>
        .passport-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .passport-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .passport-table th { border: 1px solid #000; padding: 10px; text-align: left; background-color: #f2f2f2; font-weight: bold; }
        .passport-table td { border: 1px solid #000; padding: 10px; }
        .passport-photo { width: 100px; height: 120px; border: 1px solid #000; }
      </style>
      <div class="passport-title">PASSPORT</div>
      <table class="passport-table">
        <tr>
          <th style="width: 30%;">Surname</th>
          <td style="width: 70%;">{{SURNAME}}</td>
        </tr>
        <tr>
          <th>Given Names</th>
          <td>{{GIVEN_NAMES}}</td>
        </tr>
        <tr>
          <th>Nationality</th>
          <td>{{NATIONALITY}}</td>
        </tr>
        <tr>
          <th>Date of Birth</th>
          <td>{{DATE_OF_BIRTH}}</td>
        </tr>
        <tr>
          <th>Sex</th>
          <td>{{SEX}}</td>
        </tr>
        <tr>
          <th>Place of Birth</th>
          <td>{{PLACE_OF_BIRTH}}</td>
        </tr>
        <tr>
          <th>Date of Issue</th>
          <td>{{DATE_OF_ISSUE}}</td>
        </tr>
        <tr>
          <th>Date of Expiry</th>
          <td>{{DATE_OF_EXPIRY}}</td>
        </tr>
        <tr>
          <th>Issuing Authority</th>
          <td>{{AUTHORITY}}</td>
        </tr>
        <tr>
          <th>Passport Number</th>
          <td>{{PASSPORT_NUMBER}}</td>
        </tr>
      </table>
    </div>
  `
};

// 驾照模板
export const DRIVER_LICENSE_TEMPLATE: TemplateDefinition = {
  id: 'ZH_DRIVER_LICENSE_V1',
  name: '机动车驾驶证',
  nameEn: 'Driver License',
  category: 'TRAVEL',
  matchCriteria: {
    keywords: ['Driver License', '驾驶证', '机动车驾驶证'],
    anchorText: ['Class', 'Valid From', 'Valid Until', 'Country'],
    layoutFeatures: ['Photo', 'Personal info', 'License class', 'Issue date'],
    layoutDescription: '机动车驾驶证翻译。',
    requiredFields: ['NAME', 'GENDER', 'DOB', 'ADDRESS', 'NATIONALITY', 'LICENSE_CLASS', 'ISSUE_DATE', 'VALID_DATE', 'LICENSE_NUMBER']
  },
  html: `
    <div class="driver-license" style="font-family: Arial, sans-serif; color: #000; line-height: 1.4; padding: 30px; max-width: 210mm; margin: 0 auto;">
      <style>
        .dl-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .dl-table { width: 100%; border-collapse: collapse; }
        .dl-table th { border: 1px solid #000; padding: 10px; text-align: left; background-color: #f2f2f2; font-weight: bold; }
        .dl-table td { border: 1px solid #000; padding: 10px; }
      </style>
      <div class="dl-title">DRIVER LICENSE / PERMIT</div>
      <table class="dl-table">
        <tr><th>Name</th><td>{{NAME}}</td></tr>
        <tr><th>Gender</th><td>{{GENDER}}</td></tr>
        <tr><th>Date of Birth</th><td>{{DOB}}</td></tr>
        <tr><th>Address</th><td>{{ADDRESS}}</td></tr>
        <tr><th>Nationality</th><td>{{NATIONALITY}}</td></tr>
        <tr><th>License Class</th><td>{{LICENSE_CLASS}}</td></tr>
        <tr><th>Issue Date</th><td>{{ISSUE_DATE}}</td></tr>
        <tr><th>Valid Until</th><td>{{VALID_DATE}}</td></tr>
        <tr><th>License Number</th><td>{{LICENSE_NUMBER}}</td></tr>
      </table>
    </div>
  `
};

// 房产证模板
export const PROPERTY_CERTIFICATE_TEMPLATE: TemplateDefinition = {
  id: 'ZH_PROPERTY_CERTIFICATE_V1',
  name: '不动产权证',
  nameEn: 'Property Certificate',
  category: 'PROPERTY',
  matchCriteria: {
    keywords: ['Property Certificate', '房产证', '不动产权证'],
    anchorText: ['Property Owner', 'Property Address', 'Building Area', 'Land Area'],
    layoutFeatures: ['Certificate format', 'Property details', 'Land details'],
    layoutDescription: '不动产权证翻译。',
    requiredFields: ['CERTIFICATE_NUMBER', 'OWNER_NAME', 'PROPERTY_ADDRESS', 'BUILDING_AREA', 'LAND_AREA', 'USE_TYPE', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `
    <div class="property-certificate" style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.4; padding: 30px; max-width: 210mm; margin: 0 auto;">
      <style>
        .pc-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .pc-table { width: 100%; border-collapse: collapse; }
        .pc-table th { border: 1px solid #000; padding: 10px; text-align: left; background-color: #f2f2f2; font-weight: bold; }
        .pc-table td { border: 1px solid #000; padding: 10px; }
      </style>
      <div class="pc-title">CERTIFICATE OF REAL PROPERTY OWNERSHIP</div>
      <table class="pc-table">
        <tr><th style="width: 30%;">Certificate Number</th><td>{{CERTIFICATE_NUMBER}}</td></tr>
        <tr><th>Property Owner</th><td>{{OWNER_NAME}}</td></tr>
        <tr><th>Property Address</th><td>{{PROPERTY_ADDRESS}}</td></tr>
        <tr><th>Building Area</th><td>{{BUILDING_AREA}}</td></tr>
        <tr><th>Land Area</th><td>{{LAND_AREA}}</td></tr>
        <tr><th>Use Type</th><td>{{USE_TYPE}}</td></tr>
        <tr><th>Issue Date</th><td>{{ISSUE_DATE}}</td></tr>
        <tr><th>Issuing Authority</th><td>{{AUTHORITY}}</td></tr>
      </table>
    </div>
  `
};

// 结婚证模板
export const MARRIAGE_CERTIFICATE_TEMPLATE: TemplateDefinition = {
  id: 'ZH_MARRIAGE_CERTIFICATE_V1',
  name: '结婚证',
  nameEn: 'Marriage Certificate',
  category: 'RELATIONSHIP',
  matchCriteria: {
    keywords: ['Marriage Certificate', '结婚证', 'Marriage Registration'],
    anchorText: ['Husband', 'Wife', 'Date of Marriage', 'Marriage License Number'],
    layoutFeatures: ['Certificate format', 'Husband and wife info', 'Marriage date'],
    layoutDescription: '结婚证翻译。',
    requiredFields: ['CERTIFICATE_NUMBER', 'HUSBAND_NAME', 'WIFE_NAME', 'HUSBAND_ID', 'WIFE_ID', 'MARRIAGE_DATE', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `
    <div class="marriage-certificate" style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.4; padding: 30px; max-width: 210mm; margin: 0 auto;">
      <style>
        .mc-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .mc-table { width: 100%; border-collapse: collapse; }
        .mc-table th { border: 1px solid #000; padding: 10px; text-align: left; background-color: #f2f2f2; font-weight: bold; }
        .mc-table td { border: 1px solid #000; padding: 10px; }
      </style>
      <div class="mc-title">MARRIAGE CERTIFICATE</div>
      <table class="mc-table">
        <tr><th style="width: 30%;">Certificate Number</th><td>{{CERTIFICATE_NUMBER}}</td></tr>
        <tr><th>Husband's Name</th><td>{{HUSBAND_NAME}}</td></tr>
        <tr><th>Husband's ID Number</th><td>{{HUSBAND_ID}}</td></tr>
        <tr><th>Wife's Name</th><td>{{WIFE_NAME}}</td></tr>
        <tr><th>Wife's ID Number</th><td>{{WIFE_ID}}</td></tr>
        <tr><th>Date of Marriage</th><td>{{MARRIAGE_DATE}}</td></tr>
        <tr><th>Issue Date</th><td>{{ISSUE_DATE}}</td></tr>
        <tr><th>Issuing Authority</th><td>{{AUTHORITY}}</td></tr>
      </table>
    </div>
  `
};

// 出生证明模板
export const BIRTH_CERTIFICATE_TEMPLATE: TemplateDefinition = {
  id: 'ZH_BIRTH_CERTIFICATE_V1',
  name: '出生医学证明',
  nameEn: 'Birth Certificate',
  category: 'RELATIONSHIP',
  matchCriteria: {
    keywords: ['Birth Certificate', '出生证明', '出生医学证明'],
    anchorText: ['Child Name', 'Date of Birth', 'Gender', 'Parents'],
    layoutFeatures: ['Certificate format', 'Child info', 'Parent info'],
    layoutDescription: '出生医学证明翻译。',
    requiredFields: ['CERTIFICATE_NUMBER', 'CHILD_NAME', 'GENDER', 'DOB', 'BIRTH_PLACE', 'MOTHER_NAME', 'FATHER_NAME', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `
    <div class="birth-certificate" style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.4; padding: 30px; max-width: 210mm; margin: 0 auto;">
      <style>
        .bc-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .bc-table { width: 100%; border-collapse: collapse; }
        .bc-table th { border: 1px solid #000; padding: 10px; text-align: left; background-color: #f2f2f2; font-weight: bold; }
        .bc-table td { border: 1px solid #000; padding: 10px; }
      </style>
      <div class="bc-title">BIRTH CERTIFICATE</div>
      <table class="bc-table">
        <tr><th style="width: 30%;">Certificate Number</th><td>{{CERTIFICATE_NUMBER}}</td></tr>
        <tr><th>Child's Name</th><td>{{CHILD_NAME}}</td></tr>
        <tr><th>Gender</th><td>{{GENDER}}</td></tr>
        <tr><th>Date of Birth</th><td>{{DOB}}</td></tr>
        <tr><th>Place of Birth</th><td>{{BIRTH_PLACE}}</td></tr>
        <tr><th>Mother's Name</th><td>{{MOTHER_NAME}}</td></tr>
        <tr><th>Father's Name</th><td>{{FATHER_NAME}}</td></tr>
        <tr><th>Issue Date</th><td>{{ISSUE_DATE}}</td></tr>
        <tr><th>Issuing Authority</th><td>{{AUTHORITY}}</td></tr>
      </table>
    </div>
  `
};

// 模板注册表
export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  GENERAL_DOCUMENT: GENERAL_DOCUMENT_TEMPLATE,
  ID_CARD: ID_CARD_TEMPLATE,
  BUSINESS_LICENSE: BUSINESS_LICENSE_TEMPLATE,
  PASSPORT: PASSPORT_TEMPLATE,
  DRIVER_LICENSE: DRIVER_LICENSE_TEMPLATE,
  PROPERTY_CERTIFICATE: PROPERTY_CERTIFICATE_TEMPLATE,
  MARRIAGE_CERTIFICATE: MARRIAGE_CERTIFICATE_TEMPLATE,
  BIRTH_CERTIFICATE: BIRTH_CERTIFICATE_TEMPLATE
};

// 获取模板目录
export const getTemplateCatalog = () => {
  return Object.values(TEMPLATE_REGISTRY).map(t => ({
    id: t.id,
    name: t.name,
    nameEn: t.nameEn,
    category: t.category,
    matchCriteria: t.matchCriteria
  }));
};

// 根据ID获取模板
export const getTemplateById = (id: string): TemplateDefinition | undefined => {
  return Object.values(TEMPLATE_REGISTRY).find(t => t.id === id);
};

// 模板变量替换
export const fillTemplate = (templateId: string, variables: Record<string, string>): string => {
  const template = getTemplateById(templateId);
  if (!template) return '';
  
  let html = template.html;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value || '');
  });
  
  return html;
};
