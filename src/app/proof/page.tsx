'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Briefcase, Download, Loader2, Building, User, 
  Calendar, FileText, Clock, File
} from 'lucide-react';

// 中文在职证明模板
const CN_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>就业证明模板</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: "SimSun", "Noto Serif SC", "Songti SC", "Times New Roman", serif;
            line-height: 1.8;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 0;
        }
        .page-container {
            background-color: #fff;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 60px;
        }
        .header {
            text-align: center;
            font-size: 28px;
            color: #C00000;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 25px;
            font-weight: bold;
        }
        .title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 0px;
            margin-bottom: 25px;
            margin-top: 0;
        }
        .content {
            line-height: 1.3;
        }
        .content p {
            margin: 10px 0;
            font-size: 16px;
            line-height: 1.3;
        }
        .content .indent {
            text-indent: 2em;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            line-height: 1.3;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            font-size: 16px;
            height: 0.9cm;
            vertical-align: middle;
            line-height: 1.3;
        }
        th {
            font-weight: bold;
        }
        .bold {
            font-weight: bold;
        }
        .footer-info {
            margin-top: 50px;
            line-height: 1.3;
        }
        .footer-info p {
            margin: 10px 0;
            line-height: 1.3;
        }
    </style>
</head>
<body>
<div class="page-container">
    <div class="header">
        {{COMPANY_NAME}}
    </div>
    <div class="title">就业证明</div>
    <div class="content">
        <p>日期：{{ISSUING_YEAR}} 年 {{ISSUING_MONTH}} 月 {{ISSUING_DAY}} 日</p>
        <p>收件人：{{RECIPIENT}}</p>
        <br>
        <p class="indent">兹证明 <span class="bold">{{EMPLOYEE_NAME}}</span>{{GENDER}}自 <span class="bold">{{HIRE_YEAR}} 年 {{HIRE_MONTH}} 月 {{HIRE_DAY}} 日</span>起至今在我{{COMPANY_NATURE}}任职，现任<span class="bold">{{POSITION}}</span>职位。</p>
        <p class="indent">我{{COMPANY_NATURE}}批准{{EMPLOYEE_NAME}}{{GENDER}}于 <span class="bold">{{LEAVE_START_YEAR}} 年 {{LEAVE_START_MONTH}} 月 {{LEAVE_START_DAY}} 日</span> 至 <span class="bold">{{LEAVE_END_YEAR}} 年 {{LEAVE_END_MONTH}} 月 {{LEAVE_END_DAY}} 日</span> 期间请假，前往<span class="bold">{{DESTINATION}}</span>。</p>
        <p class="indent">我{{COMPANY_NATURE}}保证{{EMPLOYEE_NAME}}{{GENDER}}将遵守贵国法律法规并按时回国，旅行期间费用由<span class="bold">{{EXPENSE_BEARER}}</span>承担。我{{COMPANY_NATURE}}同意并承诺{{EMPLOYEE_NAME}}{{GENDER}}回国后继续留任原职。</p>
        <table>
            <thead>
                <tr>
                    <th>名称</th>
                    <th>D.O.B</th>
                    <th>护照号码</th>
                    <th>位置</th>
                    <th>月薪</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="bold">{{EMPLOYEE_NAME}}</td>
                    <td>{{DATE_OF_BIRTH}}</td>
                    <td>{{PASSPORT_NUMBER}}</td>
                    <td class="bold">{{POSITION}}</td>
                    <td>RMB {{MONTHLY_SALARY}}</td>
                </tr>
            </tbody>
        </table>
        <p>以上信息属实。</p>
        <p>特此证明！</p>
        <div class="footer-info">
            <p>负责人姓名：{{LEADER_NAME}}</p>
            <p>负责人职位：{{LEADER_POSITION}}</p>
            <p>签名：</p>
            <br><br>
            <p>公司名称：{{COMPANY_NAME}}</p>
            <p>电话：{{COMPANY_PHONE}}</p>
            <p>地址：{{COMPANY_ADDRESS}}</p>
        </div>
    </div>
</div>
</body>
</html>`;

// 英文在职证明模板
const EN_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employment Certificate</title>
    <style>
        body {
            font-family: "Times New Roman", serif;
            line-height: 1.8;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 0;
        }
        .page-container {
            background-color: #fff;
            max-width: 800px;
            margin: 0 auto;
            padding: 30px 60px 40px;
        }
        .header {
            text-align: center;
            font-size: 28px;
            color: #C00000;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 0px;
            margin-bottom: 20px;
        }
        .content {
            line-height: 1.3;
        }
        .content p {
            margin: 10px 0;
            font-size: 16px;
            line-height: 1.3;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            line-height: 1.3;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            font-size: 16px;
            height: 0.9cm;
            vertical-align: middle;
            line-height: 1.3;
        }
        th {
            font-weight: bold;
        }
        .bold {
            font-weight: bold;
        }
        .footer-info {
            margin-top: 40px;
            line-height: 1.3;
        }
        .footer-info p {
            margin: 10px 0;
            line-height: 1.3;
        }
    </style>
</head>
<body>
<div class="page-container">
    <div class="header">
        {{COMPANY_NAME_EN}}
    </div>
    <div class="title">EMPLOYMENT CERTIFICATE</div>
    <div class="content">
        <p>Date: {{ISSUING_YEAR}}-{{ISSUING_MONTH}}-{{ISSUING_DAY}}</p>
        <p>To: {{RECIPIENT_EN}}</p>
        <br>
        <p>This is to certify that <span class="bold">{{EMPLOYEE_NAME_EN}}</span> has been employed by our <span class="bold">{{COMPANY_NATURE_EN}}</span> since <span class="bold">{{HIRE_YEAR}}-{{HIRE_MONTH}}-{{HIRE_DAY}}</span>, currently serving as <span class="bold">{{POSITION}}</span>.</p>
        <p>Our <span class="bold">{{COMPANY_NATURE_EN}}</span> hereby grants {{GENDER}} leave from <span class="bold">{{LEAVE_START_YEAR}}-{{LEAVE_START_MONTH}}-{{LEAVE_START_DAY}}</span> to <span class="bold">{{LEAVE_END_YEAR}}-{{LEAVE_END_MONTH}}-{{LEAVE_END_DAY}}</span> for travel to <span class="bold">{{DESTINATION_EN}}</span>.</p>
        <p>We hereby guarantee that <span class="bold">{{EMPLOYEE_NAME_EN}}</span> <span class="bold">{{GENDER_TERM}}</span> will comply with all laws and regulations of your country and return to <span class="bold">{{POSSESSIVE}}</span> home country on time. All travel expenses will be borne by <span class="bold">{{EXPENSE_BEARER_EN}}</span>.<br>
We hereby agrees and commits that <span class="bold">{{EMPLOYEE_NAME_EN}}</span> will continue to hold <span class="bold">{{POSSESSIVE}}</span> current position upon returning to <span class="bold">{{POSSESSIVE}}</span> home country.</p>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>D.O.B</th>
                    <th>Passport No.</th>
                    <th>Position</th>
                    <th>Monthly Salary</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="bold">{{EMPLOYEE_NAME_EN}}</td>
                    <td>{{DATE_OF_BIRTH}}</td>
                    <td>{{PASSPORT_NUMBER}}</td>
                    <td class="bold">{{POSITION}}</td>
                    <td>RMB {{MONTHLY_SALARY}}</td>
                </tr>
            </tbody>
        </table>
        <p>Your kind approval of this application would be highly appreciated.</p>
        <p>Yours faithfully,</p>
        <div class="footer-info">
            <p>Name of Supervisor: {{LEADER_NAME}}</p>
            <p>Position: {{LEADER_POSITION}}</p>
            <p>Signature:</p>
            <br><br>
            <p>{{COMPANY_NAME_EN}}</p>
            <p>Tel: {{COMPANY_PHONE}}</p>
            <p>Address: {{COMPANY_ADDRESS_EN}}</p>
        </div>
    </div>
</div>
</body>
</html>`;

// 目的地选项

// 目的地英文映射
const DESTINATION_EN_MAP: Record<string, string> = {
  '欧洲': 'Europe',
  '英国': 'United Kingdom',
  '澳大利亚': 'Australia',
  '加拿大': 'Canada',
  '新西兰': 'New Zealand',
  '美国': 'United States',
  '日本': 'Japan',
  '韩国': 'South Korea',
  '新加坡': 'Singapore',
  '其他': 'Other',
};

// 收件人英文映射
const RECIPIENT_EN_MAP: Record<string, string> = {
  '欧洲': 'Schengen Area Embassies and Consulates',
  '英国': 'British Embassy and Consulate',
  '澳大利亚': 'Australian Embassy and Consulate',
  '加拿大': 'Canadian Embassy and Consulate',
  '新西兰': 'New Zealand Embassy and Consulate',
  '美国': 'U.S. Embassy and Consulate',
  '日本': 'Japanese Embassy and Consulate',
  '韩国': 'Korean Embassy and Consulate',
  '新加坡': 'Singapore Embassy and Consulate',
};

// 申根国家英文映射
const SCHENGEN_EN_MAP: Record<string, string> = {
  '法国': 'French Embassy and Consulate Offices',
  '意大利': 'Italian Embassy and Consulate Offices',
  '西班牙': 'Spanish Embassy and Consulate Offices',
  '德国': 'German Embassy and Consulate Offices',
  '荷兰': 'Dutch Embassy and Consulate Offices',
  '比利时': 'Belgian Embassy and Consulate Offices',
  '奥地利': 'Austrian Embassy and Consulate Offices',
  '瑞士': 'Swiss Embassy and Consulate Offices',
  '葡萄牙': 'Portuguese Embassy and Consulate Offices',
  '希腊': 'Greek Embassy and Consulate Offices',
  '捷克': 'Czech Embassy and Consulate Offices',
  '波兰': 'Polish Embassy and Consulate Offices',
  '匈牙利': 'Hungarian Embassy and Consulate Offices',
  '瑞典': 'Swedish Embassy and Consulate Offices',
  '挪威': 'Norwegian Embassy and Consulate Offices',
  '丹麦': 'Danish Embassy and Consulate Offices',
  '芬兰': 'Finnish Embassy and Consulate Offices',
  '斯洛伐克': 'Slovak Embassy and Consulate Offices',
  '斯洛文尼亚': 'Slovenian Embassy and Consulate Offices',
  '立陶宛': 'Lithuanian Embassy and Consulate Offices',
  '拉脱维亚': 'Latvian Embassy and Consulate Offices',
  '爱沙尼亚': 'Estonian Embassy and Consulate Offices',
  '卢森堡': 'Luxembourg Embassy and Consulate Offices',
  '马耳他': 'Maltese Embassy and Consulate Offices',
  '冰岛': 'Icelandic Embassy and Consulate Offices',
  '列支敦士登': 'Liechtenstein Embassy and Consulate Offices',
};

// 公司性质英文映射
const COMPANY_NATURE_EN_MAP: Record<string, string> = {
  '公司': 'company',
  '单位': 'organization',
};

// 性别英文映射
const GENDER_EN_MAP: Record<string, { term: string; possessive: string; reflexive: string }> = {
  '男': { term: 'he', possessive: 'his', reflexive: 'himself' },
  '女': { term: 'she', possessive: 'her', reflexive: 'herself' },
};

// 获取北京时间今天的日期字符串
const getBeijingToday = (): string => {
  const now = new Date();
  const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000) - now.getTimezoneOffset() * 60 * 1000);
  return beijingTime.toISOString().split('T')[0];
};

const DESTINATIONS = [
  { value: '欧洲', label: '欧洲', labelEn: 'Europe' },
  { value: '英国', label: '英国', labelEn: 'United Kingdom' },
  { value: '澳大利亚', label: '澳大利亚', labelEn: 'Australia' },
  { value: '加拿大', label: '加拿大', labelEn: 'Canada' },
  { value: '新西兰', label: '新西兰', labelEn: 'New Zealand' },
  { value: '美国', label: '美国', labelEn: 'United States' },
  { value: '日本', label: '日本', labelEn: 'Japan' },
  { value: '韩国', label: '韩国', labelEn: 'South Korea' },
  { value: '新加坡', label: '新加坡', labelEn: 'Singapore' },
  { value: '其他', label: '其他', labelEn: 'Other' },
];

// 申根国家列表
const SCHENGEN_COUNTRIES = [
  { value: '', label: '请选择具体国家' },
  { value: '法国', label: '法国使领馆' },
  { value: '意大利', label: '意大利使领馆' },
  { value: '西班牙', label: '西班牙使领馆' },
  { value: '德国', label: '德国使领馆' },
  { value: '荷兰', label: '荷兰使领馆' },
  { value: '比利时', label: '比利时使领馆' },
  { value: '奥地利', label: '奥地利使领馆' },
  { value: '瑞士', label: '瑞士使领馆' },
  { value: '葡萄牙', label: '葡萄牙使领馆' },
  { value: '希腊', label: '希腊使领馆' },
  { value: '捷克', label: '捷克使领馆' },
  { value: '波兰', label: '波兰使领馆' },
  { value: '匈牙利', label: '匈牙利使领馆' },
  { value: '瑞典', label: '瑞典使领馆' },
  { value: '挪威', label: '挪威使领馆' },
  { value: '丹麦', label: '丹麦使领馆' },
  { value: '芬兰', label: '芬兰使领馆' },
  { value: '斯洛伐克', label: '斯洛伐克使领馆' },
  { value: '斯洛文尼亚', label: '斯洛文尼亚使领馆' },
  { value: '立陶宛', label: '立陶宛使领馆' },
  { value: '拉脱维亚', label: '拉脱维亚使领馆' },
  { value: '爱沙尼亚', label: '爱沙尼亚使领馆' },
  { value: '卢森堡', label: '卢森堡使领馆' },
  { value: '马耳他', label: '马耳他使领馆' },
  { value: '冰岛', label: '冰岛使领馆' },
  { value: '列支敦士登', label: '列支敦士登使领馆' },
];

// 收件人选项
const RECIPIENT_OPTIONS = [
  { value: '', label: '请选择收件人' },
  { value: '欧洲', label: '欧洲各申根国使领馆' },
  { value: '英国', label: '英国使领馆' },
  { value: '澳大利亚', label: '澳大利亚使领馆' },
  { value: '加拿大', label: '加拿大使领馆' },
  { value: '新西兰', label: '新西兰使领馆' },
  { value: '美国', label: '美国使领馆' },
  { value: '日本', label: '日本使领馆' },
  { value: '韩国', label: '韩国使领馆' },
  { value: '新加坡', label: '新加坡使领馆' },
];

// 公司性质选项
const COMPANY_NATURES = [
  { value: '公司', label: '公司' },
  { value: '单位', label: '单位' },
];

// 性别选项
const GENDER_OPTIONS = [
  { value: '男', label: '男', text: '先生' },
  { value: '女', label: '女', text: '女士' },
];

// 获取费用承担人选项（根据公司性质动态生成
const getExpenseBearerOptions = (companyNature: string) => [
  { value: '本人', label: '本人' },
  { value: companyNature, label: companyNature },
  { value: '其他', label: '其他' },
];

interface FormData {
  COMPANY_NAME: string;
  COMPANY_NAME_EN: string;
  COMPANY_ADDRESS: string;
  COMPANY_ADDRESS_EN: string;
  COMPANY_PHONE: string;
  COMPANY_NATURE: string;
  EMPLOYEE_NAME: string;
  EMPLOYEE_NAME_EN: string;
  PASSPORT_NUMBER: string;
  DATE_OF_BIRTH: string;
  POSITION: string;
  MONTHLY_SALARY: string;
  GENDER: string;
  HIRE_DATE: string;
  LEAVE_START_DATE: string;
  LEAVE_END_DATE: string;
  ISSUING_DATE: string;
  DESTINATION: string;
  DESTINATION_OTHER: string;
  EXPENSE_BEARER: string;
  EXPENSE_BEARER_OTHER: string;
  LEADER_NAME: string;
  LEADER_POSITION: string;
  RECIPIENT: string;
  SCHENGEN_COUNTRY: string;
}

const getDefaultFields = (): FormData => ({
  COMPANY_NAME: '',
  COMPANY_NAME_EN: '',
  COMPANY_ADDRESS: '',
  COMPANY_ADDRESS_EN: '',
  COMPANY_PHONE: '',
  COMPANY_NATURE: '公司',
  EMPLOYEE_NAME: '',
  EMPLOYEE_NAME_EN: '',
  PASSPORT_NUMBER: '',
  DATE_OF_BIRTH: '',
  POSITION: '',
  MONTHLY_SALARY: '',
  GENDER: '男',
  HIRE_DATE: '',
  LEAVE_START_DATE: '',
  LEAVE_END_DATE: '',
  ISSUING_DATE: new Date().toISOString().split('T')[0],
  DESTINATION: '欧洲',
  DESTINATION_OTHER: '',
  EXPENSE_BEARER: '本人',
  EXPENSE_BEARER_OTHER: '',
  LEADER_NAME: '',
  LEADER_POSITION: '',
  RECIPIENT: '',
  SCHENGEN_COUNTRY: '',
});

// 填充模板
const fillTemplate = (template: string, data: FormData): string => {
  let result = template;
  
  // 获取性别称呼
  const genderOption = GENDER_OPTIONS.find(g => g.value === data.GENDER);
  const genderText = genderOption ? genderOption.text : '';
  
  // 获取英文性别信息
  const genderEnMap = GENDER_EN_MAP[data.GENDER] || { term: '', possessive: '', reflexive: '' };
  const genderTerm = genderEnMap.term;
  const genderPossessive = genderEnMap.possessive;
  const genderReflexive = genderEnMap.reflexive;
  
  // 获取收件人显示（中文）
  let recipient = data.RECIPIENT;
  if (data.RECIPIENT === '欧洲' && data.SCHENGEN_COUNTRY) {
    const country = SCHENGEN_COUNTRIES.find(c => c.value === data.SCHENGEN_COUNTRY);
    recipient = country ? country.label : '欧洲各申根国使领馆';
  } else {
    const option = RECIPIENT_OPTIONS.find(r => r.value === data.RECIPIENT);
    recipient = option ? option.label : `${data.RECIPIENT}使领馆`;
  }
  
  // 获取收件人英文
  let recipientEn = RECIPIENT_EN_MAP[data.RECIPIENT] || '';
  if (data.RECIPIENT === '欧洲' && data.SCHENGEN_COUNTRY) {
    recipientEn = SCHENGEN_EN_MAP[data.SCHENGEN_COUNTRY] || '';
  }
  
  // 获取目的地显示（中文）
  let destination = data.DESTINATION;
  if (data.DESTINATION === '其他' && data.DESTINATION_OTHER) {
    destination = data.DESTINATION_OTHER;
  }
  
  // 获取目的地英文
  let destinationEn = DESTINATION_EN_MAP[data.DESTINATION] || '';
  if (data.DESTINATION === '其他' && data.DESTINATION_OTHER) {
    destinationEn = data.DESTINATION_OTHER; // 其他目的地使用原文
  }
  
  // 获取公司性质英文
  const companyNatureEn = COMPANY_NATURE_EN_MAP[data.COMPANY_NATURE] || data.COMPANY_NATURE;
  
  // 获取费用承担人
  let expenseBearer = data.EXPENSE_BEARER;
  if (data.EXPENSE_BEARER === '本人') {
    expenseBearer = data.EMPLOYEE_NAME + '本人';
  } else if (data.EXPENSE_BEARER === data.COMPANY_NATURE) {
    expenseBearer = data.COMPANY_NAME;
  } else if (data.EXPENSE_BEARER === '其他' && data.EXPENSE_BEARER_OTHER) {
    expenseBearer = data.EXPENSE_BEARER_OTHER;
  }
  
  // 获取费用承担人英文（用于英文模板）
  // 若左边费用承担人选择的是"本人"，则根据姓别分别映射为"himself"或"herself"
  // 若左边费用承担人选择的是"公司"或"单位"，则填充翻译后的公司名称
  // 若左边费用承担人选择的是"其他"，则填充翻译后的其他费用承担人
  let expenseBearerEn = '';
  if (data.EXPENSE_BEARER === '本人') {
    expenseBearerEn = genderReflexive; // himself/herself
  } else if (data.EXPENSE_BEARER === data.COMPANY_NATURE) {
    // 公司或单位 - 使用翻译后的公司名称
    expenseBearerEn = data.COMPANY_NAME_EN || data.COMPANY_NAME || '';
  } else if (data.EXPENSE_BEARER === '其他' && data.EXPENSE_BEARER_OTHER) {
    // 其他 - 使用翻译后的其他费用承担人（需要额外翻译）
    expenseBearerEn = data.EXPENSE_BEARER_OTHER;
  } else {
    expenseBearerEn = data.EXPENSE_BEARER;
  }
  
  // 解析日期
  const parseDate = (dateStr: string) => {
    if (!dateStr) return { year: '', month: '', day: '' };
    const parts = dateStr.split('-');
    return {
      year: parts[0] || '',
      month: parts[1] || '',
      day: parts[2] || ''
    };
  };
  
  const issuingDate = parseDate(data.ISSUING_DATE);
  const hireDate = parseDate(data.HIRE_DATE);
  const leaveStartDate = parseDate(data.LEAVE_START_DATE);
  const leaveEndDate = parseDate(data.LEAVE_END_DATE);
  
  // 替换所有占位符
  const replacements: Record<string, string> = {
    '{{COMPANY_NAME}}': data.COMPANY_NAME || '',
    '{{COMPANY_NAME_EN}}': data.COMPANY_NAME_EN || data.COMPANY_NAME || '',
    '{{COMPANY_ADDRESS}}': data.COMPANY_ADDRESS || '',
    '{{COMPANY_ADDRESS_EN}}': data.COMPANY_ADDRESS_EN || data.COMPANY_ADDRESS || '',
    '{{COMPANY_PHONE}}': data.COMPANY_PHONE || '',
    '{{COMPANY_NATURE}}': data.COMPANY_NATURE || '',
    '{{COMPANY_NATURE_EN}}': companyNatureEn || '',
    '{{EMPLOYEE_NAME}}': data.EMPLOYEE_NAME || '',
    '{{EMPLOYEE_NAME_EN}}': data.EMPLOYEE_NAME_EN || data.EMPLOYEE_NAME || '',
    '{{PASSPORT_NUMBER}}': data.PASSPORT_NUMBER || '',
    '{{DATE_OF_BIRTH}}': data.DATE_OF_BIRTH || '',
    '{{POSITION}}': data.POSITION || '',
    '{{MONTHLY_SALARY}}': data.MONTHLY_SALARY || '',
    '{{GENDER}}': genderText || '',
    '{{GENDER_TERM}}': genderTerm || '',
    '{{POSSESSIVE}}': genderPossessive || '',
    '{{RECIPIENT}}': recipient || '',
    '{{RECIPIENT_EN}}': recipientEn || '',
    '{{DESTINATION}}': destination || '',
    '{{DESTINATION_EN}}': destinationEn || '',
    '{{EXPENSE_BEARER}}': expenseBearer || '',
    '{{EXPENSE_BEARER_EN}}': expenseBearerEn || '',
    '{{LEADER_NAME}}': data.LEADER_NAME || '',
    '{{LEADER_POSITION}}': data.LEADER_POSITION || '',
    '{{ISSUING_YEAR}}': issuingDate.year,
    '{{ISSUING_MONTH}}': issuingDate.month,
    '{{ISSUING_DAY}}': issuingDate.day,
    '{{HIRE_YEAR}}': hireDate.year,
    '{{HIRE_MONTH}}': hireDate.month,
    '{{HIRE_DAY}}': hireDate.day,
    '{{LEAVE_START_YEAR}}': leaveStartDate.year,
    '{{LEAVE_START_MONTH}}': leaveStartDate.month,
    '{{LEAVE_START_DAY}}': leaveStartDate.day,
    '{{LEAVE_END_YEAR}}': leaveEndDate.year,
    '{{LEAVE_END_MONTH}}': leaveEndDate.month,
    '{{LEAVE_END_DAY}}': leaveEndDate.day,
  };
  
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.split(key).join(value);
  });
  
  return result;
};

// 简单卡片组件
interface SimpleCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  index?: number;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ title, icon, children, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6F8386] to-[#8A9A9D] flex items-center justify-center shadow-sm">
            {icon}
          </div>
          <span className="text-sm font-semibold text-[#45494D]">{title}</span>
        </div>
      </div>
      <div className="px-5 pb-5 pt-4">
        {children}
      </div>
    </motion.div>
  );
};

// 输入框组件
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'date' | 'select';
  options?: { value: string; label: string }[];
  max?: string;  // 最大日期（不能晚于）
  min?: string;  // 最小日期（不能早于）
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder, required, type = 'text', options, max, min }) => {
  return (
    <div className="transition-all duration-300">
      <label className="block text-[11px] font-medium text-[#8C9296] uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 text-sm bg-[#FAFAFA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6F8386]/20 focus:border-[#6F8386] focus:bg-white transition-all duration-200 outline-none hover:border-[#6F8386]/50 hover:shadow-md"
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'date' ? (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          max={max}
          min={min}
          className="w-full px-3 py-2.5 text-sm bg-[#FAFAFA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6F8386]/20 focus:border-[#6F8386] focus:bg-white transition-all duration-200 outline-none hover:border-[#6F8386]/50 hover:shadow-md"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-sm bg-[#FAFAFA] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6F8386]/20 focus:border-[#6F8386] focus:bg-white transition-all duration-200 outline-none placeholder:text-slate-300 hover:border-[#6F8386]/50 hover:shadow-md"
        />
      )}
    </div>
  );
};

export default function ProofPage() {
  const [fields, setFields] = useState<FormData>(getDefaultFields());
  const [isGenerating, setIsGenerating] = useState(false);
  const [cnProgress, setCnProgress] = useState(0);
  const [enProgress, setEnProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const handleChange = (key: keyof FormData, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  // 生成中文预览HTML
  const previewHtml = useMemo(() => {
    return fillTemplate(CN_TEMPLATE, fields);
  }, [fields]);

  // 翻译文本函数
  const translateText = async (text: string): Promise<string> => {
    if (!text || !text.trim()) return '';
    try {
      const response = await fetch('/api/translate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, sourceLang: 'zh', targetLang: 'en' })
      });
      const result = await response.json();
      if (result.success) {
        return result.translatedText;
      }
      return text;
    } catch (error) {
      console.error('翻译失败:', error);
      return text;
    }
  };

  // 翻译需要英文化的数据字段
  const translateFieldsToEnglish = async (data: FormData): Promise<FormData> => {
    const translatedData = { ...data };
    
    // 获取英文性别称呼
    const genderEn = data.GENDER === '男' ? 'Mr.' : data.GENDER === '女' ? 'Ms.' : '';
    
    // 翻译目的地
    const destinationEn = await translateText(data.DESTINATION === '其他' ? data.DESTINATION_OTHER : data.DESTINATION);
    
    // 翻译费用承担人
    const expenseBearerEn = await translateText(data.EXPENSE_BEARER === '其他' ? data.EXPENSE_BEARER_OTHER : data.EXPENSE_BEARER);
    
    // 并行翻译其他字段
    const [
      companyNameEn,
      companyAddressEn,
      employeeNameEn,
      positionEn,
      leaderNameEn,
      leaderPositionEn
    ] = await Promise.all([
      translateText(data.COMPANY_NAME),
      translateText(data.COMPANY_ADDRESS),
      translateText(data.EMPLOYEE_NAME),
      translateText(data.POSITION),
      translateText(data.LEADER_NAME),
      translateText(data.LEADER_POSITION)
    ]);
    
    translatedData.COMPANY_NAME_EN = companyNameEn || data.COMPANY_NAME_EN;
    translatedData.COMPANY_ADDRESS_EN = companyAddressEn || data.COMPANY_ADDRESS_EN;
    translatedData.EMPLOYEE_NAME_EN = employeeNameEn || data.EMPLOYEE_NAME_EN;
    translatedData.POSITION = positionEn || data.POSITION;
    translatedData.LEADER_NAME = leaderNameEn || data.LEADER_NAME;
    translatedData.LEADER_POSITION = leaderPositionEn || data.LEADER_POSITION;
    translatedData.GENDER = genderEn;
    translatedData.DESTINATION = destinationEn || data.DESTINATION;
    translatedData.EXPENSE_BEARER = expenseBearerEn || data.EXPENSE_BEARER;
    
    return translatedData;
  };

  // 生成PDF函数 - 使用blob方式避免页面跳转
  const generatePDF = async (isEnglish: boolean) => {
    if (!fields.COMPANY_NAME || !fields.EMPLOYEE_NAME) {
      alert('请填写公司名称和员工姓名');
      return;
    }

    // 设置进度条
    const setProgress = isEnglish ? setEnProgress : setCnProgress;
    setIsGenerating(true);
    setProgress(0);
    
    // 模拟进度条
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    try {
      let templateData = fields;
      
      // 如果是英文PDF，先翻译内容
      if (isEnglish) {
        templateData = await translateFieldsToEnglish(fields);
      }
      
      const template = isEnglish ? EN_TEMPLATE : CN_TEMPLATE;
      const html = fillTemplate(template, templateData);
      
      // 使用jsPDF的html方法进行更好的渲染
      const { default: jsPDF } = await import('jspdf');
      
      // 创建PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 0;
      
      // 使用html2canvas进行高质量渲染
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = `${pageWidth}mm`;
      container.style.padding = '0';
      container.style.margin = '0';
      document.body.appendChild(container);
      
      // 等待内容渲染
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 导入html2canvas，使用更高比例
      const html2canvas = (await import('html2canvas')).default;
      
      // 转换为canvas，使用3倍缩放提高清晰度
      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: Math.round(794 * 1.5),
      });
      
      // 移除临时容器
      document.body.removeChild(container);
      
      // 计算图片尺寸
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // 分页处理
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // 下载
      const fileName = isEnglish 
        ? `Employment_Certificate_${templateData.EMPLOYEE_NAME_EN || templateData.EMPLOYEE_NAME || fields.EMPLOYEE_NAME}.pdf`
        : `在职证明_${fields.EMPLOYEE_NAME}.pdf`;
      
      pdf.save(fileName);
      
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };

  // 生成Word函数
  const generateWord = async (isEnglish: boolean) => {
    if (!fields.COMPANY_NAME || !fields.EMPLOYEE_NAME) {
      alert('请填写公司名称和员工姓名');
      return;
    }

    const setProgress = isEnglish ? setEnProgress : setCnProgress;
    setIsGenerating(true);
    setProgress(0);
    
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          if (progressRef.current) clearInterval(progressRef.current);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    try {
      let templateData = fields;
      
      if (isEnglish) {
        templateData = await translateFieldsToEnglish(fields);
      }
      
      const template = isEnglish ? EN_TEMPLATE : CN_TEMPLATE;
      let html = fillTemplate(template, templateData);
      
      // 移除html和body标签，保留内部内容以便Word更好地解析
      html = html.replace(/<html[^>]*>|<\/html>|<head[^>]*>.*?<\/head>|<body[^>]*>|<\/body>/gi, '');
      
      // 添加Word兼容性元标签
      const wordHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <title>${isEnglish ? 'Employment Certificate' : '在职证明'}</title>
            <!--[if gte mso 9]>
            <xml>
                <w:WordDocument>
                    <w:View>Print</w:View>
                </w:WordDocument>
            <![endif]-->
            <style>
                body { font-family: "Times New Roman", "SimSun", serif; }
                table { border-collapse: collapse; }
                td, th { border: 1px solid #000; padding: 8px; }
            </style>
        </head>
        <body>
            ${html}
        </body>
        </html>
      `;
      
      // 创建Blob并下载为.doc文件
      const blob = new Blob([wordHtml], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = isEnglish 
        ? `Employment_Certificate_${templateData.EMPLOYEE_NAME_EN || templateData.EMPLOYEE_NAME || fields.EMPLOYEE_NAME}.doc`
        : `在职证明_${fields.EMPLOYEE_NAME}.doc`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* 页面标题 - 居中 */}
        <div className="bg-white rounded-3xl shadow-lg py-6 px-8 mb-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-morandi-deep">在职证明</h1>
            <p className="text-morandi-mist text-sm mt-1">填写信息生成中英文在职证明</p>
          </div>
        </div>

        {/* 左右两栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧表单区域 */}
          <div className="space-y-4">
            {/* 其他信息 */}
            <SimpleCard title="其他信息" icon={<FileText className="w-4 h-4 text-white" />} index={0}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputField
                    label="收件人"
                    value={fields.RECIPIENT}
                    onChange={(v) => handleChange('RECIPIENT', v)}
                    type="select"
                    options={RECIPIENT_OPTIONS}
                  />
                  {fields.RECIPIENT === '欧洲' && (
                    <div className="mt-4">
                      <InputField
                        label="请选择具体国家"
                        value={fields.SCHENGEN_COUNTRY}
                        onChange={(v) => handleChange('SCHENGEN_COUNTRY', v)}
                        type="select"
                        options={SCHENGEN_COUNTRIES}
                      />
                    </div>
                  )}
                </div>
                <InputField
                  label="开具日期"
                  value={fields.ISSUING_DATE}
                  onChange={(v) => handleChange('ISSUING_DATE', v)}
                  type="date"
                  max={getBeijingToday()}
                />
              </div>
            </SimpleCard>

            {/* 公司信息 */}
            <SimpleCard title="公司信息" icon={<Building className="w-4 h-4 text-white" />} index={1}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="公司性质"
                  value={fields.COMPANY_NATURE}
                  onChange={(v) => handleChange('COMPANY_NATURE', v)}
                  type="select"
                  options={COMPANY_NATURES}
                />
                <InputField
                  label="公司名称"
                  value={fields.COMPANY_NAME}
                  onChange={(v) => handleChange('COMPANY_NAME', v)}
                  placeholder="例：成都市某某公司"
                  required
                />
                <InputField
                  label="公司地址"
                  value={fields.COMPANY_ADDRESS}
                  onChange={(v) => handleChange('COMPANY_ADDRESS', v)}
                  placeholder="例：成都市高新区某某路"
                />
                <InputField
                  label="公司电话"
                  value={fields.COMPANY_PHONE}
                  onChange={(v) => handleChange('COMPANY_PHONE', v)}
                  placeholder="例：028-12345678"
                />
                <InputField
                  label="负责人姓名"
                  value={fields.LEADER_NAME}
                  onChange={(v) => handleChange('LEADER_NAME', v)}
                  placeholder="例：李四"
                />
                <InputField
                  label="负责人职位"
                  value={fields.LEADER_POSITION}
                  onChange={(v) => handleChange('LEADER_POSITION', v)}
                  placeholder="例：总经理"
                />
              </div>
            </SimpleCard>

            {/* 员工信息 */}
            <SimpleCard title="员工信息" icon={<User className="w-4 h-4 text-white" />} index={2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="员工姓名"
                  value={fields.EMPLOYEE_NAME}
                  onChange={(v) => handleChange('EMPLOYEE_NAME', v)}
                  placeholder="例：张三"
                  required
                />
                <InputField
                  label="性别"
                  value={fields.GENDER}
                  onChange={(v) => handleChange('GENDER', v)}
                  type="select"
                  options={GENDER_OPTIONS}
                />
                <InputField
                  label="出生日期"
                  value={fields.DATE_OF_BIRTH}
                  onChange={(v) => handleChange('DATE_OF_BIRTH', v)}
                  type="date"
                  max={getBeijingToday()}
                />
                <InputField
                  label="护照号码"
                  value={fields.PASSPORT_NUMBER}
                  onChange={(v) => handleChange('PASSPORT_NUMBER', v)}
                  placeholder="例：E12345678"
                />
                <InputField
                  label="入职日期"
                  value={fields.HIRE_DATE}
                  onChange={(v) => handleChange('HIRE_DATE', v)}
                  type="date"
                  max={getBeijingToday()}
                />
                <InputField
                  label="职位"
                  value={fields.POSITION}
                  onChange={(v) => handleChange('POSITION', v)}
                  placeholder="例：经理"
                  required
                />
                <InputField
                  label="月薪(人民币)"
                  value={fields.MONTHLY_SALARY}
                  onChange={(v) => handleChange('MONTHLY_SALARY', v)}
                  placeholder="例：10000"
                  required
                />
              </div>
            </SimpleCard>

            {/* 请假信息 */}
            <SimpleCard title="请假信息" icon={<Calendar className="w-4 h-4 text-white" />} index={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="请假开始日期"
                  value={fields.LEAVE_START_DATE}
                  onChange={(v) => handleChange('LEAVE_START_DATE', v)}
                  type="date"
                  min={getBeijingToday()}
                />
                <InputField
                  label="请假结束日期"
                  value={fields.LEAVE_END_DATE}
                  onChange={(v) => handleChange('LEAVE_END_DATE', v)}
                  type="date"
                  min={fields.LEAVE_START_DATE || getBeijingToday()}
                />
                <InputField
                  label="目的地"
                  value={fields.DESTINATION}
                  onChange={(v) => handleChange('DESTINATION', v)}
                  type="select"
                  options={DESTINATIONS}
                />
                {fields.DESTINATION === '其他' && (
                  <InputField
                    label="请输入目的地"
                    value={fields.DESTINATION_OTHER}
                    onChange={(v) => handleChange('DESTINATION_OTHER', v)}
                    placeholder="请输入目的地名称"
                  />
                )}
                <InputField
                  label="费用承担人"
                  value={fields.EXPENSE_BEARER}
                  onChange={(v) => handleChange('EXPENSE_BEARER', v)}
                  type="select"
                  options={getExpenseBearerOptions(fields.COMPANY_NATURE)}
                />
                {fields.EXPENSE_BEARER === '其他' && (
                  <InputField
                    label="其他费用承担人"
                    value={fields.EXPENSE_BEARER_OTHER}
                    onChange={(v) => handleChange('EXPENSE_BEARER_OTHER', v)}
                    placeholder="请说明"
                  />
                )}
              </div>
            </SimpleCard>

            {/* 生成按钮 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-3 gap-3">
                {/* 生成中文PDF */}
                <div className="relative">
                  <button
                    onClick={() => generatePDF(false)}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-[#5D8A8E] via-[#4A7A7E] to-[#3D6A6E] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 group"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-sm opacity-80">生成中文</div>
                      <div className="text-lg">PDF 文档</div>
                    </div>
                  </button>
                  {/* 进度条 */}
                  {cnProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent rounded-b-xl overflow-hidden">
                      <div 
                        className="h-full bg-white/80 transition-all duration-200" 
                        style={{ width: `${cnProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                {/* 生成英文PDF */}
                <div className="relative">
                  <button
                    onClick={() => generatePDF(true)}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-[#7A9B8C] via-[#6A8B7C] to-[#5A7B6C] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 group"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-sm opacity-80">生成英文</div>
                      <div className="text-lg">PDF 文档</div>
                    </div>
                  </button>
                  {/* 进度条 */}
                  {enProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent rounded-b-xl overflow-hidden">
                      <div 
                        className="h-full bg-white/80 transition-all duration-200" 
                        style={{ width: `${enProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                {/* 历史记录按钮 */}
                <button
                  className="flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-[#9B8A7A] via-[#8B7A6A] to-[#7B6A5A] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all group"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">历史</div>
                    <div className="text-lg">记录</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 生成Word按钮 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
              <div className="grid grid-cols-3 gap-3">
                {/* 生成中文Word */}
                <div className="relative">
                  <button
                    onClick={() => generateWord(false)}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-[#5D8A8E] via-[#4A7A7E] to-[#3D6A6E] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 group"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                        <File className="w-4 h-4" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-sm opacity-80">生成中文</div>
                      <div className="text-lg">Word 文档</div>
                    </div>
                  </button>
                  {cnProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent rounded-b-xl overflow-hidden">
                      <div 
                        className="h-full bg-white/80 transition-all duration-200" 
                        style={{ width: `${cnProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                {/* 生成英文Word */}
                <div className="relative">
                  <button
                    onClick={() => generateWord(true)}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-[#7A9B8C] via-[#6A8B7C] to-[#5A7B6C] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 group"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
                        <File className="w-4 h-4" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className="text-sm opacity-80">生成英文</div>
                      <div className="text-lg">Word 文档</div>
                    </div>
                  </button>
                  {enProgress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent rounded-b-xl overflow-hidden">
                      <div 
                        className="h-full bg-white/80 transition-all duration-200" 
                        style={{ width: `${enProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                {/* 空白占位 */}
                <div></div>
              </div>
            </div>
          </div>

          {/* 右侧预览区域 */}
          <div className="lg:sticky lg:top-4 h-fit lg:h-[calc(100vh-5rem)]">
            <div className="bg-white rounded-3xl shadow-lg p-3 lg:p-4 h-full flex flex-col">
              <h2 className="text-lg font-bold text-morandi-deep flex items-center gap-2 mb-2 lg:mb-3 flex-shrink-0">
                <FileText className="w-5 h-5" />
                预览
              </h2>
              
              {/* 预览纸张 */}
              <div className="bg-white border border-slate-200 rounded-lg shadow-inner overflow-hidden flex-1 min-h-0">
                <iframe
                  ref={previewRef}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="在职证明预览"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
