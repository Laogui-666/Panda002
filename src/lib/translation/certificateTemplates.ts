/**
 * 证件翻译模板注册中心
 * 使用用户提供的专业翻译框架HTML模板
 */

import { TemplateDefinition } from '@/types/translation';

// 1. 身份证模板 - 完整框架
export const ID_CARD_TEMPLATE: TemplateDefinition = {
  id: 'CERT_ID_CARD',
  name: '身份证翻译',
  nameEn: 'ID Card',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['身份证', 'Identity Card', '居民身份证', '身份证号'],
    anchorText: ['姓名', '性别', '民族', '出生', '住址', '公民身份号码'],
    layoutFeatures: ['Table-based layout', 'Two sections: Front and Back'],
    layoutDescription: '居民身份证翻译模板',
    requiredFields: ['NAME', 'GENDER', 'ETHNICITY', 'DOB', 'ADDRESS', 'ID_NUMBER', 'AUTHORITY', 'VALIDITY']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resident Identity Card Translation Template (Full Version)</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.3;
        }
        .card-section {
            margin-bottom: 30px;
        }
        .card-title {
            font-weight: bold;
            text-align: center;
            font-size: 1.2em;
            margin-bottom: 10px;
            background-color: #f0f0f0;
            padding: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            border: 1px solid #000;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px 10px;
            vertical-align: top;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: left;
            width: 18%;
        }
        td {
            width: 32%;
        }
        .full-width {
            width: auto;
        }
        .back-side th {
            width: 25%;
        }
        .back-side td {
            width: 75%;
        }
    </style>
</head>
<body>

    <!-- Front Side: Personal Information -->
    <div class="card-section front-side">
        <div class="card-title">People's Republic of China Resident Identity Card (Front Side)</div>
        <table>
            <tr>
                <th>Name</th>
                <td>{{NAME}}</td>
                <th>Gender</th>
                <td>{{GENDER}}</td>
            </tr>
            <tr>
                <th>Ethnicity</th>
                <td>{{ETHNICITY}}</td>
                <th>Date of Birth</th>
                <td>{{DOB}}</td>
            </tr>
            <tr>
                <th>Residential Address</th>
                <td colspan="3">{{ADDRESS}}</td>
            </tr>
            <tr>
                <th>National ID Number</th>
                <td colspan="3">{{ID_NUMBER}}</td>
            </tr>
        </table>
    </div>

    <!-- Back Side: Issuing Authority & Validity -->
    <div class="card-section back-side">
        <div class="card-title">People's Republic of China Resident Identity Card (Back Side)</div>
        <table>
            <tr>
                <th>Issuing Authority</th>
                <td>{{AUTHORITY}}</td>
            </tr>
            <tr>
                <th>Valid Period</th>
                <td>{{VALIDITY}}</td>
            </tr>
        </table>
    </div>

</body>
</html>`
};

// 2. 户口本模板 - 完整框架
export const HOUSEHOLD_REGISTER_TEMPLATE: TemplateDefinition = {
  id: 'CERT_HOUSEHOLD_REGISTER',
  name: '户口本翻译',
  nameEn: 'Household Register',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['户口本', 'Household Register', '户口簿', '常住人口登记卡'],
    anchorText: ['户主', '与户主关系', '姓名', '性别', '出生地'],
    layoutFeatures: ['Table-based layout', 'Multiple persons', 'Household info'],
    layoutDescription: '户口簿翻译模板',
    requiredFields: ['HOUSEHOLD_NUMBER', 'HOUSEHOLD_ADDRESS', 'PERSONS']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Household Register Translation Template - 3/4 Page Layout</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 13px;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 20px 40px;
            line-height: 1.25;
        }
        .page { width: 100%; max-width: 800px; margin: 0 auto; position: relative; max-height: 210mm; }
        .page-break { page-break-after: always; margin-bottom: 20px; border-bottom: 2px dashed #ccc; padding-bottom: 20px; }
        h2 { text-align: center; letter-spacing: 0.5em; font-size: 20px; margin-bottom: 15px; margin-top: 0; }
        h3 { text-align: center; font-size: 17px; margin-top: 15px; margin-bottom: 8px; letter-spacing: 2px; }
        table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 15px; }
        th, td { border: 1px solid #000; padding: 4px 3px; text-align: center; vertical-align: middle; word-wrap: break-word; }
        .text-left { text-align: left; }
        .seal-red { color: #d32f2f; text-align: center; font-weight: bold; }
        .seal-circle { display: inline-block; border: 3px solid #d32f2f; border-radius: 50%; padding: 12px 5px; width: 130px; height: 130px; box-sizing: border-box; font-size: 11px; line-height: 1.2; }
        .seal-right { width: 150px !important; height: 150px !important; padding: 15px 5px !important; }
        .signature { font-family: 'Brush Script MT', 'Comic Sans MS', cursive; font-size: 16px; }
    </style>
</head>
<body>
    <div class="page page-break">
        <h2>IMPORTANT NOTICES</h2>
        <ol>
            <li>The Resident Household Register has the legal effect of proving the status of citizens and the mutual relationships among family members.</li>
            <li>The head of the household should keep the Resident Household Register properly. Unauthorized alteration, transfer, and lending are strictly prohibited.</li>
            <li>The registration right of the Resident Household Register belongs to the household registration organ.</li>
            <li>If there is an increase or decrease of personnel in the household or changes in registered items, the Resident Household Register should be taken to the household registration organ.</li>
            <li>If the entire household moves out of the jurisdiction of the household registration, the Resident Household Register should be surrendered to the household registration organ.</li>
        </ol>
        <table>
            <tr>
                <th>Household Type</th><td>{{HOUSEHOLD_TYPE}}</td>
                <th>Name of Head of Household</th><td>{{HEAD_OF_HOUSEHOLD_NAME}}</td>
            </tr>
            <tr>
                <th>Household No.</th><td>{{HOUSEHOLD_NUMBER}}</td>
                <th>Address</th><td class="text-left">{{HOUSEHOLD_ADDRESS}}</td>
            </tr>
        </table>
    </div>
    <div class="page">
        <h3>Resident Population Registration Card</h3>
        <table class="card-table">
            <tr>
                <th colspan="3">Name</th><td colspan="5">{{CARD_NAME}}</td>
                <th colspan="7">Relationship to Head</th><td colspan="5">{{CARD_RELATIONSHIP}}</td>
            </tr>
            <tr>
                <th colspan="3">Sex</th><td colspan="5">{{CARD_SEX}}</td>
                <th colspan="7">Date of Birth</th><td colspan="5">{{CARD_DOB}}</td>
            </tr>
            <tr>
                <th colspan="3">Ethnicity</th><td colspan="5">{{CARD_ETHNICITY}}</td>
                <th colspan="7">Place of Birth</th><td colspan="5">{{CARD_BIRTHPLACE}}</td>
            </tr>
            <tr>
                <th colspan="3">Citizen ID Card No.</th><td colspan="8">{{CARD_ID_NUMBER}}</td>
                <th colspan="4">Education Level</th><td colspan="5">{{CARD_EDUCATION}}</td>
            </tr>
        </table>
    </div>
</body>
</html>`
};

// 3. 结婚证模板 - 完整框架
export const MARRIAGE_CERTIFICATE_TEMPLATE: TemplateDefinition = {
  id: 'CERT_MARRIAGE',
  name: '结婚证翻译',
  nameEn: 'Marriage Certificate',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['结婚证', 'Marriage Certificate', '婚姻登记'],
    anchorText: ['结婚双方', '登记日期', '婚姻登记员'],
    layoutFeatures: ['Certificate format', 'Dual person info', 'Marriage date'],
    layoutDescription: '结婚证翻译模板',
    requiredFields: ['CERTIFICATE_NUMBER', 'HUSBAND_NAME', 'WIFE_NAME', 'HUSBAND_ID', 'WIFE_ID', 'MARRIAGE_DATE', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marriage Certificate Translation Template</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 40px; background-color: #fff; display: flex; justify-content: center; line-height: 1.5; }
        .page { width: 100%; max-width: 800px; margin: 0 auto; }
        .certificate-title { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 30px; text-decoration: underline; letter-spacing: 1px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; table-layout: fixed; }
        .info-table td { padding: 10px 15px; vertical-align: middle; border: 1px solid #000; word-wrap: break-word; }
        .info-table td:first-child { font-weight: bold; width: 35%; background-color: #f9f9f9; }
        .section-title { font-size: 18px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="page">
        <div class="certificate-title">MARRIAGE CERTIFICATE</div>
        <table class="info-table">
            <tr><td>Certificate Holder</td><td>{{CERTIFICATE_HOLDER}}</td></tr>
            <tr><td>Registration Date</td><td>{{REGISTRATION_DATE}}</td></tr>
            <tr><td>Marriage Certificate Number</td><td>{{CERTIFICATE_NUMBER}}</td></tr>
            <tr><td>Remarks</td><td>{{REMARKS}}</td></tr>
        </table>
        <div class="section-title">Groom's Information</div>
        <table class="info-table">
            <tr><td>Full Name</td><td>{{GROOM_NAME}}</td></tr>
            <tr><td>Gender</td><td>{{GROOM_GENDER}}</td></tr>
            <tr><td>Nationality</td><td>{{GROOM_NATIONALITY}}</td></tr>
            <tr><td>Date of Birth</td><td>{{GROOM_DOB}}</td></tr>
            <tr><td>ID Card Number</td><td>{{GROOM_ID_NUMBER}}</td></tr>
        </table>
        <div class="section-title">Bride's Information</div>
        <table class="info-table">
            <tr><td>Full Name</td><td>{{BRIDE_NAME}}</td></tr>
            <tr><td>Gender</td><td>{{BRIDE_GENDER}}</td></tr>
            <tr><td>Nationality</td><td>{{BRIDE_NATIONALITY}}</td></tr>
            <tr><td>Date of Birth</td><td>{{BRIDE_DOB}}</td></tr>
            <tr><td>ID Card Number</td><td>{{BRIDE_ID_NUMBER}}</td></tr>
        </table>
    </div>
</body>
</html>`
};

// 4. 房产证模板-新版
export const PROPERTY_CERTIFICATE_NEW_TEMPLATE: TemplateDefinition = {
  id: 'CERT_PROPERTY_NEW',
  name: '房产证翻译-新版',
  nameEn: 'Property Certificate (New)',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['不动产权证', 'Property Certificate', '房产证', '新版'],
    anchorText: ['权利人', '坐落', '不动产单元号', '用途', '面积'],
    layoutFeatures: ['Certificate format', 'Property details', 'Land details'],
    layoutDescription: '新版不动产权证翻译模板',
    requiredFields: ['CERTIFICATE_NUMBER', 'OWNER_NAME', 'PROPERTY_ADDRESS', 'BUILDING_AREA', 'LAND_AREA', 'USE_TYPE', 'OWNERSHIP_TYPE', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{DOCUMENT_TITLE}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #fff; }
        .certificate-title { font-size: 1.2em; margin-bottom: 20px; color: #000; }
        .main-table { border-collapse: collapse; width: 100%; margin-bottom: 25px; }
        .main-table th, .main-table td { border: 1px solid #000; padding: 10px 12px; text-align: left; vertical-align: middle; font-size: 14px; }
        .main-table th { background-color: #f2f2f2; font-weight: bold; width: 30%; color: #000; }
        .remarks-section { margin-bottom: 8px; }
        .remarks-section strong { display: block; font-size: 16px; color: #000; }
        .remarks-table { border-collapse: collapse; width: 100%; }
        .remarks-table td { border: 1px solid #000; padding: 10px 12px; text-align: left; vertical-align: middle; font-size: 14px; }
    </style>
</head>
<body>
    <div class="certificate-title">{{CERTIFICATE_TITLE_AND_NO}}</div>
    <table class="main-table">
        <tr><th>Obligee</th><td>{{OBLIGEE_NAME}}</td></tr>
        <tr><th>Co-ownership Status</th><td>{{CO_OWNERSHIP_STATUS}}</td></tr>
        <tr><th>Location</th><td>{{PROPERTY_LOCATION}}</td></tr>
        <tr><th>Real Estate Registration No.</th><td>{{REAL_ESTATE_REGISTRATION_NO}}</td></tr>
        <tr><th>Right Type</th><td>{{RIGHT_TYPE}}</td></tr>
        <tr><th>Right Nature</th><td>{{RIGHT_NATURE}}</td></tr>
        <tr><th>Purpose</th><td>{{PURPOSE}}</td></tr>
        <tr><th>Area</th><td>{{AREA_INFORMATION}}</td></tr>
        <tr><th>Term of Use</th><td>{{TERM_OF_USE}}</td></tr>
        <tr><th rowspan="7">Right Status Details</th><td>{{APPORTIONED_LAND_USE_RIGHT_AREA}}</td></tr>
        <tr><td>{{HOUSE_STRUCTURE}}</td></tr>
        <tr><td>{{EXCLUSIVE_BUILDING_AREA}}</td></tr>
        <tr><td>{{APPORTIONED_BUILDING_AREA}}</td></tr>
        <tr><td>{{TOTAL_FLOORS_OF_HOUSE}}</td></tr>
        <tr><td>{{FLOOR_LOCATED}}</td></tr>
        <tr><td>{{HOUSE_COMPLETION_TIME}}</td></tr>
    </table>
    <div class="remarks-section"><strong>Remarks</strong></div>
    <table class="remarks-table"><tr><td>Service No.: {{SERVICE_NO}}</td></tr></table>
</body>
</html>`
};

// 5. 房产证模板-旧版
export const PROPERTY_CERTIFICATE_OLD_TEMPLATE: TemplateDefinition = {
  id: 'CERT_PROPERTY_OLD',
  name: '房产证翻译-旧版',
  nameEn: 'Property Certificate (Old)',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['房产证', 'Property Certificate', '房屋所有权证', '旧版'],
    anchorText: ['房屋所有权人', '房屋坐落', '丘地号', '产别', '建筑面积'],
    layoutFeatures: ['Certificate format', 'Property details', 'Building info'],
    layoutDescription: '旧版房产证翻译模板',
    requiredFields: ['CERTIFICATE_NUMBER', 'OWNER_NAME', 'PROPERTY_ADDRESS', 'BUILDING_AREA', 'LAND_AREA', 'PROPERTY_TYPE', 'OWNERSHIP_TYPE', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>House Ownership Certificate Translation Template</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Times New Roman', Arial, sans-serif; font-size: 12pt; color: #000; margin: 0; padding: 40px; background-color: #fff; display: flex; justify-content: center; }
        .page { width: 100%; max-width: 800px; margin: 0 auto; }
        .certificate-title { font-size: 14pt; font-weight: bold; margin-bottom: 20px; line-height: 1.5; text-align: left; }
        .main-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; }
        .main-table > tbody > tr > td { border: 1pt solid #000; padding: 8px 10px; vertical-align: middle; line-height: 1.5; word-wrap: break-word; }
        .label-bg { background-color: #f2f2f2; font-weight: bold; width: 30%; }
        .sub-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0; }
        .sub-table td { border: 1pt solid #000; padding: 6px 4px; text-align: center; vertical-align: middle; font-size: 11pt; word-wrap: break-word; }
        .sub-header-bg { background-color: #f0f0f0; font-weight: bold; }
        .remarks-title { font-weight: bold; margin-top: 10px; margin-bottom: 5px; font-size: 12pt; }
        .remarks-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .remarks-table td { border: 1pt solid #000; padding: 10px; line-height: 1.5; min-height: 60px; word-wrap: break-word; }
    </style>
</head>
<body>
<div class="page">
    <div class="certificate-title">{{CERTIFICATE_TITLE}}</div>
    <table class="main-table">
        <tr><td class="label-bg">House Owner</td><td>{{HOUSE_OWNER}}</td></tr>
        <tr><td class="label-bg">Co-ownership Status</td><td>{{CO_OWNERSHIP_STATUS}}</td></tr>
        <tr><td class="label-bg">House Location</td><td>{{HOUSE_LOCATION}}</td></tr>
        <tr><td class="label-bg">Registration Date</td><td>{{REGISTRATION_DATE}}</td></tr>
        <tr><td class="label-bg">House Nature</td><td>{{HOUSE_NATURE}}</td></tr>
        <tr><td class="label-bg">House Status</td><td style="padding: 8px;">
            <table class="sub-table">
                <tr><td class="sub-header-bg">Total number of floors</td><td class="sub-header-bg">Total Floor Area (㎡)</td><td class="sub-header-bg">Internal Floor Area (㎡)</td><td class="sub-header-bg">Others</td></tr>
                <tr><td>{{TOTAL_FLOORS}}</td><td>{{TOTAL_FLOOR_AREA}}</td><td>{{INTERNAL_FLOOR_AREA}}</td><td>{{HOUSE_OTHERS}}</td></tr>
            </table>
        </td></tr>
        <tr><td class="label-bg">Land Status</td><td style="padding: 8px;">
            <table class="sub-table">
                <tr><td class="sub-header-bg">Land Number</td><td class="sub-header-bg">Land Use Right Acquisition Method</td><td class="sub-header-bg">Land Use Term</td></tr>
                <tr><td>{{LAND_NUMBER}}</td><td>{{ACQUISITION_METHOD}}</td><td>{{LAND_USE_TERM}}</td></tr>
            </table>
        </td></tr>
    </table>
    <div class="remarks-title">Remarks</div>
    <table class="remarks-table"><tr><td>{{REMARKS_CONTENT}}</td></tr></table>
</div>
</body>
</html>`
};

// 6. 营业执照模板-公司
export const BUSINESS_LICENSE_COMPANY_TEMPLATE: TemplateDefinition = {
  id: 'CERT_BUSINESS_LICENSE_COMPANY',
  name: '营业执照翻译-公司',
  nameEn: 'Business License (Company)',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['营业执照', 'Business License', '统一社会信用代码', '有限公司'],
    anchorText: ['公司名称', '法定代表人', '注册资本', '经营范围'],
    layoutFeatures: ['Landscape A4', 'Company info', 'Business scope'],
    layoutDescription: '公司营业执照翻译模板',
    requiredFields: ['UNIFIED_SOCIAL_CREDIT_CODE', 'COMPANY_NAME', 'COMPANY_TYPE', 'PERSON_IN_CHARGE', 'REGISTERED_CAPITAL', 'ESTABLISHMENT_DATE', 'BUSINESS_ADDRESS', 'BUSINESS_SCOPE', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business License Translation Template</title>
    <style>
        @page { size: A4 landscape; margin: 0; }
        body { font-family: 'Times New Roman', 'SimSun', serif; margin: 0; padding: 0; background-color: #f9f9f9; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .a4-landscape { width: 29.7cm; height: 21cm; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative; padding: 1.2cm 2.5cm 1.5cm; box-sizing: border-box; display: flex; flex-direction: column; }
        .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .unified-code-section { flex: 0 0 auto; text-align: left; }
        .unified-code-label { font-size: 14px; margin-bottom: 5px; }
        .unified-code { font-weight: bold; font-size: 16px; letter-spacing: 1px; }
        .license-title { flex: 0 0 auto; text-align: center; font-size: 28px; font-weight: bold; text-decoration: underline; line-height: 1.2; }
        .main-content { flex: 1; display: flex; flex-direction: column; }
        .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .info-column { display: flex; flex-direction: column; }
        .info-row { margin-bottom: 12px; display: flex; min-height: 20px; line-height: 1.3; }
        .label { font-weight: bold; min-width: 150px; white-space: nowrap; }
        .content { flex: 1; border-bottom: 1px dotted #666; padding-left: 5px; line-height: 1.3; }
        .scope-row { display: block; margin-bottom: 10px; line-height: 1.3; }
        .scope-label { font-weight: bold; margin-bottom: 4px; line-height: 1.3; }
        .scope-content { border-bottom: none; padding-left: 0; font-size: 13px; line-height: 1.3; }
        .authority-section { text-align: right; margin-top: 10px; padding-top: 10px; border-top: 1px solid #000; line-height: 1.3; }
        .authority-name { font-weight: bold; margin-bottom: 5px; }
        .authority-date { font-size: 14px; }
        .footer-section { font-size: 13px; margin-top: 15px; padding-top: 0.3cm; }
        .footer-url { text-align: center; margin-bottom: 6px; line-height: 1.3; white-space: nowrap; }
        .footer-reminder { font-size: 12px; text-align: center; margin-bottom: 6px; line-height: 1.3; }
        .footer-monitor { text-align: center; font-size: 13px; margin-top: 8px; padding-top: 6px; border-top: 1px solid #ccc; line-height: 1.3; }
        .bottom-space { height: 2cm; }
    </style>
</head>
<body>
    <div class="a4-landscape">
        <div class="main-content">
            <div class="header-row">
                <div class="unified-code-section">
                    <div class="unified-code-label">Unified Social Credit Code</div>
                    <div class="unified-code">{{UNIFIED_SOCIAL_CREDIT_CODE}}</div>
                </div>
                <div class="license-title">Business License<br>(Duplicate)</div>
                <div style="flex: 0 0 auto; width: 180px;"></div>
            </div>
            <div class="info-section">
                <div class="info-column">
                    <div class="info-row"><div class="label">Name:</div><div class="content">{{COMPANY_NAME}}</div></div>
                    <div class="info-row"><div class="label">Type:</div><div class="content">{{COMPANY_TYPE}}</div></div>
                </div>
                <div class="info-column">
                    <div class="info-row"><div class="label">{{PERSON_IN_CHARGE_LABEL}}:</div><div class="content">{{PERSON_IN_CHARGE_NAME}}</div></div>
                    <div class="info-row"><div class="label">Date of Establishment:</div><div class="content">{{ESTABLISHMENT_DATE}}</div></div>
                    <div class="info-row"><div class="label">Business Address:</div><div class="content">{{BUSINESS_ADDRESS}}</div></div>
                </div>
            </div>
            <div class="scope-row">
                <div class="scope-label">Business Scope:</div>
                <div class="scope-content">
                    <div><strong>General Items:</strong> {{GENERAL_ITEMS}}</div>
                    <div><strong>Permitted Items:</strong> {{PERMITTED_ITEMS}}</div>
                </div>
            </div>
            <div class="authority-section">
                <div class="authority-name">Registration Authority</div>
                <div class="authority-date">{{REGISTRATION_AUTHORITY_DATE}}</div>
            </div>
            <div class="footer-section">
                <div class="footer-url">National Enterprise Credit Information Publicity System Website: http://www.gsxt.gov.cn</div>
                <div class="footer-reminder">Market entities shall submit and publicize their annual report through the National Enterprise Credit Information Publicity System between January 1 and June 30 each year.</div>
                <div class="footer-monitor">Produced under the supervision of the State Administration for Market Regulation.</div>
            </div>
            <div class="bottom-space"></div>
        </div>
    </div>
</body>
</html>`
};

// 7. 营业执照模板-个体工商户
export const BUSINESS_LICENSE_INDIVIDUAL_TEMPLATE: TemplateDefinition = {
  id: 'CERT_BUSINESS_LICENSE_INDIVIDUAL',
  name: '营业执照翻译-个体工商户',
  nameEn: 'Business License (Individual)',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['营业执照', 'Business License', '个体工商户', '经营者'],
    anchorText: ['名称', '经营者', '组成形式', '经营场所'],
    layoutFeatures: ['Portrait A4', 'Individual info', 'Business scope'],
    layoutDescription: '个体工商户营业执照翻译模板',
    requiredFields: ['UNIFIED_SOCIAL_CREDIT_CODE', 'BUSINESS_NAME', 'OWNER_NAME', 'OWNER_ID', 'BUSINESS_ADDRESS', 'BUSINESS_SCOPE', 'OPERATING_FORM', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business License Translation Template</title>
    <style>
        @page { size: A4 landscape; margin: 0; }
        body { font-family: 'Times New Roman', 'SimSun', serif; margin: 0; padding: 0; background-color: #f9f9f9; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .a4-landscape { width: 29.7cm; height: 21cm; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative; padding: 1.2cm 2.5cm 2cm; box-sizing: border-box; display: flex; flex-direction: column; }
        .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .unified-code-section { flex: 0 0 auto; text-align: left; }
        .unified-code-label { font-size: 14px; margin-bottom: 5px; }
        .unified-code { font-weight: bold; font-size: 16px; letter-spacing: 1px; }
        .license-title { flex: 0 0 auto; text-align: center; font-size: 28px; font-weight: bold; text-decoration: underline; line-height: 1.2; }
        .main-content { flex: 1; display: flex; flex-direction: column; }
        .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .info-column { display: flex; flex-direction: column; }
        .info-row { margin-bottom: 12px; display: flex; min-height: 20px; line-height: 1.3; }
        .label { font-weight: bold; min-width: 150px; white-space: nowrap; }
        .content { flex: 1; border-bottom: 1px dotted #666; padding-left: 5px; line-height: 1.3; }
        .scope-row { display: block; margin-bottom: 10px; line-height: 1.3; }
        .scope-label { font-weight: bold; margin-bottom: 4px; line-height: 1.3; }
        .scope-content { border-bottom: none; padding-left: 0; font-size: 13px; line-height: 1.3; }
        .authority-section { text-align: right; margin-top: 10px; padding-top: 10px; border-top: 1px solid #000; line-height: 1.3; }
        .authority-name { font-weight: bold; margin-bottom: 5px; }
        .authority-date { font-size: 14px; }
        .footer-section { font-size: 13px; margin-top: 15px; padding-top: 0.6cm; }
        .footer-url { text-align: center; margin-bottom: 6px; line-height: 1.3; white-space: nowrap; }
        .footer-reminder { font-size: 12px; text-align: center; margin-bottom: 8px; line-height: 1.3; }
        .footer-monitor { text-align: center; font-size: 13px; margin-top: 10px; padding-top: 8px; border-top: 1px solid #ccc; line-height: 1.3; }
        .bottom-space { height: 5.5cm; }
    </style>
</head>
<body>
    <div class="a4-landscape">
        <div class="main-content">
            <div class="header-row">
                <div class="unified-code-section">
                    <div class="unified-code-label">Unified Social Credit Code</div>
                    <div class="unified-code">{{UNIFIED_SOCIAL_CREDIT_CODE}}</div>
                </div>
                <div class="license-title">Business License<br>(Duplicate)</div>
                <div style="flex: 0 0 auto; width: 180px;"></div>
            </div>
            <div class="info-section">
                <div class="info-column">
                    <div class="info-row"><div class="label">Name:</div><div class="content">{{BUSINESS_NAME}}</div></div>
                    <div class="info-row"><div class="label">Type:</div><div class="content">{{BUSINESS_TYPE}}</div></div>
                    <div class="info-row"><div class="label">Operator:</div><div class="content">{{OPERATOR_NAME}}</div></div>
                </div>
                <div class="info-column">
                    <div class="info-row"><div class="label">Form of Organization:</div><div class="content">{{ORGANIZATION_FORM}}</div></div>
                    <div class="info-row"><div class="label">Registration Date:</div><div class="content">{{REGISTRATION_DATE}}</div></div>
                    <div class="info-row"><div class="label">Business Address:</div><div class="content">{{BUSINESS_ADDRESS}}</div></div>
                </div>
            </div>
            <div class="scope-row">
                <div class="scope-label">Business Scope:</div>
                <div class="scope-content">
                    <div><strong>Permitted Items:</strong> {{PERMITTED_ITEMS}}</div>
                    <div><strong>General Items:</strong> {{GENERAL_ITEMS}}</div>
                </div>
            </div>
            <div class="authority-section">
                <div class="authority-name">Registration Authority</div>
                <div class="authority-date">{{AUTHORITY_DATE}}</div>
            </div>
            <div class="footer-section">
                <div class="footer-url">National Enterprise Credit Information Publicity System Website: http://www.gsxt.gov.cn</div>
                <div class="footer-reminder">Market entities shall submit and publicize their annual report through the National Enterprise Credit Information Publicity System between January 1 and June 30 each year.</div>
                <div class="footer-monitor">Produced under the supervision of the State Administration for Market Regulation.</div>
            </div>
            <div class="bottom-space"></div>
        </div>
    </div>
</body>
</html>`
};

// 8. 退休证模板
export const RETIREMENT_CERTIFICATE_TEMPLATE: TemplateDefinition = {
  id: 'CERT_RETIREMENT',
  name: '退休证翻译',
  nameEn: 'Retirement Certificate',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['退休证', 'Retirement Certificate', '退休', '离休'],
    anchorText: ['姓名', '退休前单位', '退休时间', '退休金'],
    layoutFeatures: ['Certificate format', 'Personal info', 'Retirement info'],
    layoutDescription: '退休证翻译模板',
    requiredFields: ['NAME', 'GENDER', 'ID_NUMBER', 'RETIREMENT_UNIT', 'RETIREMENT_DATE', 'RETIREMENT_TYPE', 'PENSION', 'ISSUE_DATE', 'AUTHORITY']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{DOCUMENT_TITLE}}</title>
    <style>
        @page { size: A4 portrait; margin: 2cm; }
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .page-container { width: 210mm; min-height: 297mm; background-color: white; margin: 0 auto; box-shadow: 0 0 15px rgba(0,0,0,0.1); position: relative; padding: 0; }
        .page-content { padding: 20px 30px; min-height: 178mm; }
        .page-break { page-break-before: always; }
        .page-two-content { padding: 20px 30px; min-height: 178mm; }
        .header { text-align: center; margin-bottom: 30px; }
        .main-title { font-size: 36px; font-weight: bold; margin-bottom: 5px; letter-spacing: 3px; }
        .sub-title { font-size: 20px; margin-bottom: 15px; color: #333; }
        .photo-container { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }
        .photo-box { width: 3.5cm; height: 4.5cm; border: 3px solid #000; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 15px; }
        .photo-note { text-align: center; font-size: 14px; line-height: 1.5; color: #555; max-width: 80%; }
        .document-info { margin-bottom: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .document-line { font-size: 16px; margin-bottom: 8px; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .info-table td { border: 2px solid #000; padding: 12px 15px; vertical-align: top; font-size: 16px; }
        .info-table tr td:first-child { font-weight: bold; width: 35%; background-color: #f9f9f9; }
        .notes { margin-top: 40px; font-size: 14px; line-height: 1.6; }
        .bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="page-container">
        <div class="page-content">
            <div class="header">
                <div class="main-title">{{MAIN_TITLE_ENGLISH}}</div>
                <div class="sub-title">Page 1</div>
            </div>
            <div class="photo-container">
                <div class="photo-box">Photo</div>
                <div class="photo-note">{{PHOTO_NOTE_TEXT}}</div>
            </div>
            <div class="document-info">
                <div class="document-line"><span class="bold">{{ID_NUMBER_LABEL}}:</span> {{ID_NUMBER_VALUE}}</div>
                <div class="document-line"><span class="bold">{{SSN_LABEL}}:</span> {{SSN_VALUE}}</div>
                <div class="document-line"><span class="bold">{{ISSUE_DATE_LABEL}}:</span> {{ISSUE_DATE_VALUE}}</div>
            </div>
            <table class="info-table">
                <tr><td>{{FIELD_1_LABEL}}</td><td>{{FIELD_1_VALUE}}</td></tr>
                <tr><td>{{FIELD_2_LABEL}}</td><td>{{FIELD_2_VALUE}}</td></tr>
                <tr><td>{{FIELD_3_LABEL}}</td><td>{{FIELD_3_VALUE}}</td></tr>
            </table>
        </div>
    </div>
    <div class="page-container page-break">
        <div class="page-two-content">
            <div class="header"><div class="sub-title">Page 2</div></div>
            <table class="info-table page-two-table">
                <tr><td>{{FIELD_N1_LABEL}}</td><td>{{FIELD_N1_VALUE}}</td></tr>
                <tr><td>{{FIELD_N2_LABEL}}</td><td>{{FIELD_N2_VALUE}}</td></tr>
                <tr><td>{{FIELD_N3_LABEL}}</td><td>{{FIELD_N3_VALUE}}</td></tr>
            </table>
            <div class="notes">
                <p><strong>Notes:</strong></p>
                <p>1. {{NOTE_1_TEXT}}</p>
                <p>2. {{NOTE_2_TEXT}}</p>
                <p>3. {{NOTE_3_TEXT}}</p>
            </div>
        </div>
    </div>
</body>
</html>`
};

// 9. 机动车登记证模板
export const VEHICLE_REGISTRATION_TEMPLATE: TemplateDefinition = {
  id: 'CERT_VEHICLE_REGISTRATION',
  name: '机动车登记证翻译',
  nameEn: 'Vehicle Registration Certificate',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['机动车登记证', 'Vehicle Registration', '行驶证', '车牌号'],
    anchorText: ['机动车所有人', '车辆品牌', '车辆识别代号', '发动机号'],
    layoutFeatures: ['Certificate format', 'Vehicle info', 'Owner info'],
    layoutDescription: '机动车登记证书翻译模板',
    requiredFields: ['CERTIFICATE_NUMBER', 'OWNER_NAME', 'OWNER_ID', 'VEHICLE_BRAND', 'VEHICLE_MODEL', 'VIN', 'ENGINE_NUMBER', 'PLATE_NUMBER', 'REGISTER_DATE', 'ISSUE_DATE']
  },
  html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Motor Vehicle Register Translation Template</title>
    <style>
        body { tab-interval: 21pt; text-justify-trim: punctuation; font-family: 'Times New Roman', SimSun, serif; margin: 0; padding: 20px; background-color: #fff; display: flex; justify-content: center; }
        .section { layout-grid: 15.6pt; width: 100%; max-width: 800px; }
        .mso-normal { margin: 0; text-align: left; line-height: 1.5; }
        .mso-normal.right { text-align: right; }
        .mso-normal.center { text-align: center; }
        .registration-table { border-collapse: collapse; width: 100%; margin-top: 10px; }
        .registration-table td { padding: 4px 6px; vertical-align: middle; }
        .bold { font-weight: bold; }
        .header-title { font-size: 14pt; letter-spacing: 1px; }
        .field-label { font-size: 9pt; font-weight: bold; }
        .field-value { font-size: 10.5pt; }
        .border-all { border: 1pt solid windowtext; }
    </style>
</head>
<body>
<div class="section">
    <p class="mso-normal"><span class="field-value">{{TOP_BARCODE_OR_SERIAL}}</span></p>
    <p class="mso-normal right"><span class="bold">Motor Vehicle Register No.: </span><span class="bold">{{REGISTER_NO}}</span></p>
    <table class="registration-table">
        <tr><td colspan="12" class="border-all"><p class="mso-normal center"><b class="header-title">Registration Summary</b></p></td></tr>
        <tr>
            <td width="3%" rowspan="2" class="border-all"><p class="mso-normal center"><span>I</span></p></td>
            <td width="30%" colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">1. Motor Vehicle Owner / Type and Number of Identification Certificate</b></p></td>
            <td width="67%" colspan="8" class="border-all"><p class="mso-normal"><span class="field-value">{{OWNER_NAME}}</span> <b> / </b> <span class="field-value">{{ID_CERTIFICATE_TYPE}}</span> <b> / </b> <span class="field-value">{{ID_CERTIFICATE_NO}}</span></p></td>
        </tr>
        <tr>
            <td width="15%" class="border-all"><p class="mso-normal"><b class="field-label">2. Registration Authority</b></p></td>
            <td width="25%" colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{REGISTRATION_AUTHORITY}}</span></p></td>
            <td width="12%" colspan="2" class="border-all"><p class="mso-normal"><b class="field-label">3. Registration Date</b></p></td>
            <td width="15%" class="border-all"><p class="mso-normal"><span class="field-value">{{REGISTRATION_DATE}}</span></p></td>
            <td width="15%" colspan="2" class="border-all"><p class="mso-normal"><b class="field-label">4. Registration No. of Motor Vehicle</b></p></td>
            <td width="15%" class="border-all"><p class="mso-normal"><span class="field-value">{{MOTOR_VEHICLE_REG_NO}}</span></p></td>
        </tr>
        <tr><td colspan="12"><p class="mso-normal center"><b class="header-title">Registered Motor Vehicle Information</b></p></td></tr>
        <tr>
            <td width="25%" colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">5. Vehicle Type</b></p></td>
            <td width="35%" colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{VEHICLE_TYPE}}</span></p></td>
            <td width="20%" colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">6. Vehicle Brand</b></p></td>
            <td width="20%" colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{VEHICLE_BRAND}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">7. Vehicle Models</b></p></td>
            <td colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{VEHICLE_MODELS}}</span></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">8. Color</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{VEHICLE_COLOR}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">9. VIN</b></p></td>
            <td colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{VIN}}</span></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">10. Made-in-China / Imported</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{MADE_IN_CHINA_OR_IMPORTED}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">11. Engine No.</b></p></td>
            <td colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{ENGINE_NO}}</span></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">12. Engine Model</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{ENGINE_MODEL}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">13. Fuel Type</b></p></td>
            <td colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{FUEL_TYPE}}</span></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">14. Displacement / Power Output</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{DISPLACEMENT_POWER}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">15. Manufacturer</b></p></td>
            <td colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{MANUFACTURER}}</span></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">16. Steering Mode</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{STEERING_MODE}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">17. Wheel Track</b></p></td>
            <td colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{WHEEL_TRACK}}</span></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">18. Number of Tyres</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{NUMBER_OF_TYRES}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">19. Tyre Specification</b></p></td>
            <td colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{TYRE_SPECIFICATION}}</span></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">20. Number of Leaf Spring</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{NUMBER_OF_LEAF_SPRING}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">21. Wheelbase</b></p></td>
            <td colspan="4" class="border-all"><p class="mso-normal"><span class="field-value">{{WHEELBASE}}</span></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">22. Number of Axles</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{NUMBER_OF_AXLES}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">23. Outline Dimension</b></p></td>
            <td colspan="7" class="border-all"><p class="mso-normal"><span class="field-value">{{OUTLINE_DIMENSION}}</span></p></td>
            <td colspan="2" rowspan="6" class="border-all" style="vertical-align: top;">
                <p class="mso-normal"><b class="field-label">33. Seal of Issuing Authority:</b><br><span class="field-value">{{ISSUING_AUTHORITY_SEAL}}</span><br><br><b class="field-label">34. Date of Issue: </b><br><span class="field-value">{{ISSUE_DATE}}</span></p>
            </td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">24. Interior Dimension of Container</b></p></td>
            <td colspan="7" class="border-all"><p class="mso-normal"><span class="field-value">{{INTERIOR_DIMENSION}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">25. Total Mass</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{TOTAL_MASS}}</span></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><b class="field-label">26. Ratified Load Capacity</b></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><span class="field-value">{{RATIFIED_LOAD_CAPACITY}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">27. Ratified Seating Capacity</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{RATIFIED_SEATING_CAPACITY}}</span></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><b class="field-label">28. Traction Mass</b></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><span class="field-value">{{TRACTION_MASS}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">29. Seating Capacity of Cab</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{SEATING_CAPACITY_OF_CAB}}</span></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><b class="field-label">30. Usage</b></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><span class="field-value">{{USAGE}}</span></p></td>
        </tr>
        <tr>
            <td colspan="3" class="border-all"><p class="mso-normal"><b class="field-label">31. Source of Vehicle</b></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><span class="field-value">{{SOURCE_OF_VEHICLE}}</span></p></td>
            <td colspan="2" class="border-all"><p class="mso-normal"><b class="field-label">32. Manufacture Date</b></p></td>
            <td colspan="3" class="border-all"><p class="mso-normal"><span class="field-value">{{MANUFACTURE_DATE}}</span></p></td>
        </tr>
    </table>
</div>
</body>
</html>`
};

// 10. 居住证明模板
export const RESIDENCE_PROOF_TEMPLATE: TemplateDefinition = {
  id: 'CERT_RESIDENCE_PROOF',
  name: '居住证明翻译',
  nameEn: 'Residence Proof',
  category: 'CERTIFICATE',
  matchCriteria: {
    keywords: ['居住证明', 'Residence Proof', '居住证', '居住登记'],
    anchorText: ['姓名', '居住地址', '居住类型', '有效期'],
    layoutFeatures: ['Proof format', 'Personal info', 'Residence info'],
    layoutDescription: '居住证明翻译模板',
    requiredFields: ['NAME', 'GENDER', 'ID_NUMBER', 'RESIDENCE_ADDRESS', 'RESIDENCE_TYPE', 'REGISTER_DATE', 'VALIDITY_PERIOD', 'PURPOSE', 'AUTHORITY']
  },
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Residence Certificate Translation Template</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Times New Roman', Arial, sans-serif; margin: 0; padding: 40px; color: #000; background-color: #fff; display: flex; justify-content: center; line-height: 1.6; }
        .page { width: 100%; max-width: 850px; margin: 0 auto; }
        .header { text-align: center; font-size: 26px; font-weight: bold; margin-bottom: 40px; padding-bottom: 10px; border-bottom: 2px solid #000; letter-spacing: 1px; }
        .two-column-container { display: flex; justify-content: space-between; gap: 50px; }
        .column { flex: 1; min-width: 0; }
        .section { margin-bottom: 25px; }
        .info-line { display: flex; align-items: flex-end; margin-bottom: 12px; min-height: 28px; }
        .label { font-weight: bold; white-space: nowrap; margin-right: 8px; }
        .content { flex: 1; border-bottom: 1px solid #000; padding-bottom: 2px; word-wrap: break-word; overflow-wrap: break-word; min-width: 50px; }
        .info-block { margin-bottom: 15px; }
        .info-block .label { display: block; margin-bottom: 5px; }
        .info-block .content-block { display: block; border-bottom: 1px solid #000; min-height: 28px; padding-bottom: 2px; word-wrap: break-word; overflow-wrap: break-word; }
        .inline-group { display: flex; align-items: flex-end; }
        .inline-group .content { flex: 0 1 auto; min-width: 60px; text-align: center; margin: 0 8px; }
        @media print { body { padding: 0; } .two-column-container { page-break-inside: avoid; } }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">Residence Certificate</div>
        <div class="two-column-container">
            <div class="column">
                <div class="section">
                    <div class="info-line"><span class="label">Name:</span> <span class="content">{{NAME}}</span></div>
                    <div class="info-line"><span class="label">Gender:</span> <span class="content">{{GENDER}}</span></div>
                    <div class="info-line"><span class="label">Ethnicity:</span> <span class="content">{{ETHNICITY}}</span></div>
                    <div class="info-line"><span class="label">Date of Birth:</span> <span class="content">{{DATE_OF_BIRTH}}</span></div>
                    <div class="info-line"><span class="label">Citizen ID Number:</span> <span class="content">{{CITIZEN_ID_NUMBER}}</span></div>
                </div>
                <div class="section">
                    <div class="info-block"><span class="label">Domicile Location:</span><span class="content-block">{{DOMICILE_LOCATION}}</span></div>
                </div>
            </div>
            <div class="column">
                <div class="section">
                    <div class="info-line"><span class="label">Business Number:</span> <span class="content">{{BUSINESS_NUMBER}}</span></div>
                </div>
                <div class="section">
                    <div class="info-block"><span class="label">Residential Address:</span><span class="content-block">{{RESIDENTIAL_ADDRESS}}</span></div>
                </div>
                <div class="section">
                    <div class="info-block"><span class="label">Assigned Police Station:</span><span class="content-block">{{POLICE_STATION}}</span></div>
                </div>
                <div class="section">
                    <div class="info-block"><span class="label">Issuing Unit:</span><span class="content-block">{{ISSUING_UNIT}}</span></div>
                </div>
                <div class="section">
                    <div class="info-line"><span class="label">Period of Validity:</span> <span class="content">{{VALIDITY_PERIOD}}</span></div>
                    <div class="info-line inline-group"><span class="label">Continuous Residence:</span> <span class="content">{{RESIDENCE_DAYS}}</span> <span>days</span></div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
};

// 证件翻译模板注册表
export const CERTIFICATE_TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  ID_CARD: ID_CARD_TEMPLATE,
  HOUSEHOLD_REGISTER: HOUSEHOLD_REGISTER_TEMPLATE,
  MARRIAGE_CERTIFICATE: MARRIAGE_CERTIFICATE_TEMPLATE,
  PROPERTY_CERTIFICATE_NEW: PROPERTY_CERTIFICATE_NEW_TEMPLATE,
  PROPERTY_CERTIFICATE_OLD: PROPERTY_CERTIFICATE_OLD_TEMPLATE,
  BUSINESS_LICENSE_COMPANY: BUSINESS_LICENSE_COMPANY_TEMPLATE,
  BUSINESS_LICENSE_INDIVIDUAL: BUSINESS_LICENSE_INDIVIDUAL_TEMPLATE,
  RETIREMENT_CERTIFICATE: RETIREMENT_CERTIFICATE_TEMPLATE,
  VEHICLE_REGISTRATION: VEHICLE_REGISTRATION_TEMPLATE,
  RESIDENCE_PROOF: RESIDENCE_PROOF_TEMPLATE
};

// 证件类型列表
export const CERTIFICATE_TYPES = [
  { id: 'ID_CARD', name: '身份证翻译', nameEn: 'ID Card', icon: 'credit-card' },
  { id: 'HOUSEHOLD_REGISTER', name: '户口本翻译', nameEn: 'Household Register', icon: 'book-open' },
  { id: 'MARRIAGE_CERTIFICATE', name: '结婚证翻译', nameEn: 'Marriage Certificate', icon: 'heart' },
  { id: 'PROPERTY_CERTIFICATE_NEW', name: '房产证翻译-新版', nameEn: 'Property Certificate (New)', icon: 'home' },
  { id: 'PROPERTY_CERTIFICATE_OLD', name: '房产证翻译-旧版', nameEn: 'Property Certificate (Old)', icon: 'home' },
  { id: 'BUSINESS_LICENSE_COMPANY', name: '营业执照翻译-公司', nameEn: 'Business License (Company)', icon: 'briefcase' },
  { id: 'BUSINESS_LICENSE_INDIVIDUAL', name: '营业执照翻译-个体工商户', nameEn: 'Business License (Individual)', icon: 'store' },
  { id: 'RETIREMENT_CERTIFICATE', name: '退休证翻译', nameEn: 'Retirement Certificate', icon: 'calendar' },
  { id: 'VEHICLE_REGISTRATION', name: '机动车登记证翻译', nameEn: 'Vehicle Registration', icon: 'car' },
  { id: 'RESIDENCE_PROOF', name: '居住证明翻译', nameEn: 'Residence Proof', icon: 'map-pin' }
];

// 根据ID获取证件模板
export const getCertificateTemplateById = (id: string): TemplateDefinition | undefined => {
  return CERTIFICATE_TEMPLATE_REGISTRY[id];
};

// 获取证件类型列表
export const getCertificateTypes = () => {
  return CERTIFICATE_TYPES;
};
