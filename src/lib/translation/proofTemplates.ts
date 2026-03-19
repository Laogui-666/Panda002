/**
/**
 * 证明文件模板注册中心
 * 用于证明文件助手功能
 */

import { TemplateDefinition } from '@/types/translation';

// 在职证明字段定义
export interface EmploymentProofFields {
  // 公司信息
  COMPANY_NAME: string;           // 公司中文名称
  COMPANY_NAME_EN: string;        // 公司英文名称
  COMPANY_ADDRESS: string;        // 公司地址
  COMPANY_PHONE: string;          // 公司电话
  COMPANY_NATURE: string;        // 公司性质 (公司/单位)
  
  // 员工信息
  EMPLOYEE_NAME: string;          // 员工中文姓名
  EMPLOYEE_NAME_EN: string;       // 员工英文姓名/拼音
  PASSPORT_NUMBER: string;        // 护照号码
  DATE_OF_BIRTH: string;          // 出生日期
  POSITION: string;               // 职位
  MONTHLY_SALARY: string;         // 月薪
  GENDER: string;                 // 性别 (男/女)
  
  // 日期信息
  HIRE_DATE: string;              // 入职日期
  LEAVE_START_DATE: string;       // 准假开始日期
  LEAVE_END_DATE: string;         // 准假结束日期
  ISSUING_DATE: string;           // 开具日期
  
  // 其他信息
  DESTINATION: string;            // 目的地
  DESTINATION_OTHER: string;      // 其他目的地
  SCHENGEN_COUNTRY: string;       // 申根国家
  EXPENSE_BEARER: string;        // 费用承担人
  EXPENSE_BEARER_OTHER: string;   // 其他费用承担人
  LEADER_NAME: string;            // 领导人姓名
  LEADER_POSITION: string;        // 领导人职位
  RECIPIENT: string;              // 收件人 (XX国使领馆)
}

// 在职证明中文模板 - 规范版
export const EMPLOYMENT_PROOF_CN_TEMPLATE: TemplateDefinition = {
  id: 'PROOF_EMPLOYMENT_CN',
  name: '在职证明',
  nameEn: 'Employment Certificate',
  category: 'PROOF',
  icon: 'briefcase',
  html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>在职证明</title>
    <style>
        @page {
            size: A4;
            margin: 25mm;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: "SimSun", "宋体", serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
            width: 160mm;
            margin: 0 auto;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 1pt solid #000;
            padding-bottom: 8pt;
            margin-bottom: 12pt;
        }
        .company-name {
            font-size: 22pt;
            font-weight: bold;
            color: #C00;
            margin-bottom: 4pt;
        }
        .title {
            font-family: "SimHei", "Microsoft YaHei", sans-serif;
            font-size: 22pt;
            font-weight: bold;
            text-align: center;
            margin: 16pt 0;
            letter-spacing: 8pt;
        }
        .content {
            font-size: 12pt;
            text-align: justify;
            line-height: 1.5;
            margin-bottom: 12pt;
        }
        .content p { margin-bottom: 8pt; text-indent: 24pt; }
        .content .date-line { text-indent: 0; margin-bottom: 6pt; }
        .content .recipient-line { text-indent: 0; margin-bottom: 10pt; font-weight: bold; }
        
        table {
            width: 160mm;
            border-collapse: collapse;
            margin: 12pt auto;
            font-size: 10.5pt;
        }
        th, td {
            border: 0.75pt solid #000;
            padding: 4pt 6pt;
            text-align: center;
        }
        th {
            background: #f5f5f5;
            font-weight: bold;
            height: 9mm;
        }
        td { height: 9mm; }
        
        .closing {
            font-size: 12pt;
            margin: 12pt 0 8pt 0;
            text-indent: 24pt;
        }
        
        .signature {
            margin-top: 16pt;
            display: flex;
            justify-content: space-between;
            font-size: 12pt;
        }
        .signature-left, .signature-right {
            width: 48%;
        }
        .signature-line {
            margin-bottom: 8pt;
        }
        
        .company-info {
            margin-top: 16pt;
            font-size: 10.5pt;
            border-top: 1pt solid #ccc;
            padding-top: 8pt;
        }
        .company-info p { margin-bottom: 2pt; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">{{COMPANY_NAME}}</div>
    </div>
    
    <div class="title">在 职 证 明</div>
    
    <div class="content">
        <p class="date-line">日期：{{ISSUING_DATE}}</p>
        <p class="recipient-line">收件人：{{RECIPIENT}}</p>
        
        <p>兹证明{{EMPLOYEE_NAME}}（护照号：{{PASSPORT_NUMBER}}）自{{HIRE_DATE}}起至今在我{{COMPANY_NATURE}}任职，现任{{POSITION}}职位，月薪为人民币{{MONTHLY_SALARY}}元。</p>
        
        <p>我{{COMPANY_NATURE}}批准{{GENDER}}于{{LEAVE_START_DATE}}至{{LEAVE_END_DATE}}期间请假前往{{DESTINATION}}。</p>
        
        <p>我{{COMPANY_NATURE}}保证{{EMPLOYEE_NAME}}将遵守贵国法律法规并按时回国，所有差旅费用由{{EXPENSE_BEARER}}承担。我{{COMPANY_NATURE}}同意并承诺{{EMPLOYEE_NAME}}回国后继续留任原职。</p>
    </div>
    
    <table>
        <tr>
            <th style="width:25mm">姓名</th>
            <th style="width:32mm">出生日期</th>
            <th style="width:35mm">护照号码</th>
            <th style="width:35mm">职务</th>
            <th style="width:32mm">月收入</th>
        </tr>
        <tr>
            <td>{{EMPLOYEE_NAME}}</td>
            <td>{{DATE_OF_BIRTH}}</td>
            <td>{{PASSPORT_NUMBER}}</td>
            <td>{{POSITION}}</td>
            <td>RMB {{MONTHLY_SALARY}}</td>
        </tr>
    </table>
    
    <p class="closing">恳请贵方批准本申请，我们将不胜感激。</p>
    <p class="closing">特此证明！</p>
    
    <div class="signature">
        <div class="signature-left">
            <div class="signature-line">领导姓名：{{LEADER_NAME}}</div>
            <div class="signature-line">领导职位：{{LEADER_POSITION}}</div>
            <div class="signature-line">签名：_______________</div>
        </div>
        <div class="signature-right" style="text-align: right;">
            <div class="signature-line">{{COMPANY_NAME}}</div>
            <div class="signature-line">电话：{{COMPANY_PHONE}}</div>
            <div class="signature-line">地址：{{COMPANY_ADDRESS}}</div>
        </div>
    </div>
</body>
</html>`
};

// 在职证明英文模板 - 优化版
export const EMPLOYMENT_PROOF_EN_TEMPLATE: TemplateDefinition = {
  id: 'PROOF_EMPLOYMENT_EN',
  name: '在职证明',
  nameEn: 'Employment Certificate',
  category: 'PROOF',
  icon: 'briefcase',
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Certificate of Employment</title>
    <style>
        @page {
            size: A4;
            margin: 25mm;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
            width: 160mm;
            margin: 0 auto;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 1pt solid #000;
            padding-bottom: 8pt;
            margin-bottom: 12pt;
        }
        .company-name {
            font-size: 22pt;
            font-weight: bold;
            color: #C00;
            margin-bottom: 4pt;
        }
        .title {
            font-size: 22pt;
            font-weight: bold;
            text-align: center;
            margin: 16pt 0;
            letter-spacing: 2pt;
        }
        .content {
            font-size: 12pt;
            text-align: justify;
            line-height: 1.5;
            margin-bottom: 12pt;
        }
        .content p { margin-bottom: 8pt; }
        .content .date-line { margin-bottom: 6pt; }
        .content .recipient-line { margin-bottom: 10pt; font-weight: bold; }
        
        table {
            width: 160mm;
            border-collapse: collapse;
            margin: 12pt auto;
            font-size: 10.5pt;
        }
        th, td {
            border: 0.75pt solid #000;
            padding: 4pt 6pt;
            text-align: center;
        }
        th {
            background: #f5f5f5;
            font-weight: bold;
            height: 9mm;
        }
        td { height: 9mm; }
        
        .closing {
            font-size: 12pt;
            margin: 12pt 0 8pt 0;
        }
        
        .signature {
            margin-top: 16pt;
            display: flex;
            justify-content: space-between;
            font-size: 12pt;
        }
        .signature-left, .signature-right {
            width: 48%;
        }
        .signature-line {
            margin-bottom: 8pt;
        }
        
        .company-info {
            margin-top: 16pt;
            font-size: 10.5pt;
            border-top: 1pt solid #ccc;
            padding-top: 8pt;
        }
        .company-info p { margin-bottom: 2pt; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">{{COMPANY_NAME_EN}}</div>
    </div>
    
    <div class="title">CERTIFICATE OF EMPLOYMENT</div>
    
    <div class="content">
        <p class="date-line">Date: {{ISSUING_DATE}}</p>
        <p class="recipient-line">To: {{RECIPIENT}}</p>
        
        <p>This is to certify that {{EMPLOYEE_NAME_EN}} (Passport No.: {{PASSPORT_NUMBER}}) has been employed by our {{COMPANY_NATURE}} since {{HIRE_DATE}}, currently serving as {{POSITION}} with a monthly salary of RMB {{MONTHLY_SALARY}}.</p>
        
        <p>Our {{COMPANY_NATURE}} hereby grants {{GENDER}} leave from {{LEAVE_START_DATE}} to {{LEAVE_END_DATE}} for travel to {{DESTINATION}}.</p>
        
        <p>We hereby guarantee that {{GENDER}} will comply with all laws and regulations of your country and return to China on time. All travel expenses will be borne by {{EXPENSE_BEARER}}. We confirm that {{GENDER}}'s position will be reserved upon {{GENDER}}'s return to China.</p>
    </div>
    
    <table>
        <tr>
            <th style="width:27mm">Name</th>
            <th style="width:27mm">D.O.B</th>
            <th style="width:32mm">Passport No.</th>
            <th style="width:40mm">Position</th>
            <th style="width:33mm">Monthly Salary</th>
        </tr>
        <tr>
            <td>{{EMPLOYEE_NAME_EN}}</td>
            <td>{{DATE_OF_BIRTH}}</td>
            <td>{{PASSPORT_NUMBER}}</td>
            <td>{{POSITION}}</td>
            <td>RMB {{MONTHLY_SALARY}}</td>
        </tr>
    </table>
    
    <p class="closing">Your kind approval of this application would be highly appreciated.</p>
    <p class="closing">Yours faithfully,</p>
    
    <div class="signature">
        <div class="signature-left">
            <div class="signature-line">Name of Supervisor: {{LEADER_NAME}}</div>
            <div class="signature-line">Position: {{LEADER_POSITION}}</div>
            <div class="signature-line">Signature: _________________</div>
        </div>
        <div class="signature-right" style="text-align: right;">
            <div class="signature-line">{{COMPANY_NAME_EN}}</div>
            <div class="signature-line">Tel: {{COMPANY_PHONE}}</div>
            <div class="signature-line">Address: {{COMPANY_ADDRESS}}</div>
        </div>
    </div>
</body>
</html>`
};

// 证明文件模板列表
export const PROOF_DOCUMENT_TYPES = [
  { 
    id: 'PROOF_EMPLOYMENT', 
    name: '在职证明', 
    nameEn: 'Employment Certificate', 
    icon: 'briefcase',
    hasCN: true,
    hasEN: true
  }
];

// 翻译映射表 - 用于英文版在职证明
const TRANSLATION_MAP: Record<string, string> = {
  // 公司性质
  '公司': 'company',
  '单位': 'unit',
  // 性别代词
  '他': 'he',
  '她': 'she',
  // 费用承担人
  '本人': 'himself/herself',
  // 目的地
  '欧洲': 'Europe',
  '英国': 'the United Kingdom',
  '澳大利亚': 'Australia',
  '加拿大': 'Canada',
  '新西兰': 'New Zealand',
  '美国': 'the United States',
  '日本': 'Japan',
  '韩国': 'South Korea',
  '新加坡': 'Singapore',
  '其他': 'other countries',
};

// 翻译字段到英文
export const translateFieldsToEnglish = (fields: EmploymentProofFields): EmploymentProofFields => {
  const translate = (value: string): string => {
    if (!value) return value;
    return TRANSLATION_MAP[value] || value;
  };

  return {
    ...fields,
    COMPANY_NATURE: translate(fields.COMPANY_NATURE),
    GENDER: translate(fields.GENDER),
    EXPENSE_BEARER: translate(fields.EXPENSE_BEARER),
    DESTINATION: translate(fields.DESTINATION),
    EXPENSE_BEARER_OTHER: fields.EXPENSE_BEARER_OTHER ? translate(fields.EXPENSE_BEARER_OTHER) : '',
  };
};

// 模板注册表
export const PROOF_TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  'PROOF_EMPLOYMENT_CN': EMPLOYMENT_PROOF_CN_TEMPLATE,
  'PROOF_EMPLOYMENT_EN': EMPLOYMENT_PROOF_EN_TEMPLATE,
};

// 根据ID获取模板
export const getProofTemplateById = (id: string): TemplateDefinition | undefined => {
  return PROOF_TEMPLATE_REGISTRY[id];
};

// 获取证明文件类型列表
export const getProofDocumentTypes = () => {
  return PROOF_DOCUMENT_TYPES;
};

// 填充模板
export const fillProofTemplate = (html: string, fields: EmploymentProofFields): string => {
  let result = html;
  
  // 处理费用承担人
  let expenseBearer = fields.EXPENSE_BEARER;
  if (fields.EXPENSE_BEARER === '其他' && fields.EXPENSE_BEARER_OTHER) {
    expenseBearer = fields.EXPENSE_BEARER_OTHER;
  }
  
  // 处理公司性质
  let companyNature = fields.COMPANY_NATURE;
  let companyNatureEn = fields.COMPANY_NATURE === '公司' ? 'company' : 'unit';
  
  // 创建字段副本进行处理
  const processedFields = {
    ...fields,
    EXPENSE_BEARER: expenseBearer,
    COMPANY_NATURE: companyNature,
    COMPANY_NAME_EN: fields.COMPANY_NAME_EN || fields.COMPANY_NAME, // 如果没有英文名则用中文名
  };
  
  // 替换所有占位符
  Object.entries(processedFields).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.split(placeholder).join(value || '');
  });
  
  return result;
};
