/**
 * 申根签证申请表类型定义 - 完全复刻原项目
 */

export interface Step1Personal {
  surname: string;
  birthSurname: string;
  givenName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  birthCountry: string;
  gender: 'male' | 'female';
  maritalStatus: string;
  maritalStatusOther: string;
  idCard: string;
  // 监护人信息
  guardian1Name: string;
  guardian1Nationality: string;
  guardian1Phone: string;
  guardian1Email: string;
  guardian1Address: string;
  guardian2Name: string;
  guardian2Nationality: string;
  guardian2Phone: string;
  guardian2Email: string;
  guardian2Address: string;
}

export interface Step2Passport {
  passportType: string;
  passportTypeOther: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiry: string;
  passportIssuer: string;
  address: string;
  phone: string;
  email: string;
  residenceAbroad: boolean;
  residencePermitType: string;
  residencePermitExpiry: string;
  occupation: string;
  occupationOther: string;
  // 工作单位信息
  employerName: string;
  employerAddress: string;
  employerPhone: string;
  currentPosition: string;
  // 学生学校信息
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
}

export interface Companion {
  name: string;
  relationship: string;
  relationshipOther: string;
  passportNumber: string;
}

export interface Step3Travel {
  visaApplicationCountry: string;
  destinations: string[];
  firstEntry: string;
  entryType: string;
  arrivalDate: string;
  departureDate: string;
  stayDuration: string;
  tripPurpose: string[];
  tripPurposeOther: string;
  hasCompanion: boolean;
  companions: Companion[];
  prevSchengenVisa: boolean;
  prevVisaNumber: string;
  prevVisaIssueDate: string;
  prevVisaExpiryDate: string;
  fingerprints: boolean;
  fingerprintsDate: string;
}

export interface Step4Invitation {
  hasInviter: 'no' | 'personal' | 'organization';
  // 酒店信息
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  hotelEmail: string;
  // 个人邀请
  inviterName: string;
  inviterAddress: string;
  inviterPhone: string;
  inviterEmail: string;
  // 机构邀请
  orgName: string;
  orgAddress: string;
  orgPhone: string;
  orgContactName: string;
  orgContactPhone: string;
  orgContactEmail: string;
}

export interface Step5Funding {
  fundingSource: 'applicant' | 'sponsor';
  // 本人支付
  applicantMeans: string[];
  applicantMeansOther: string;
  // 赞助人支付
  sponsorType: 'inviter' | 'other';
  otherSponsorName: string;
  sponsorMeans: string[];
  sponsorMeansOther: string;
}

export interface SchengenVisaData {
  step1: Step1Personal;
  step2: Step2Passport;
  step3: Step3Travel;
  step4: Step4Invitation;
  step5: Step5Funding;
}

// 申根国家列表
export const schengenCountries = [
  '法国', '意大利', '西班牙', '德国', '荷兰', '比利时', '奥地利', '瑞士',
  '葡萄牙', '希腊', '丹麦', '瑞典', '挪威', '芬兰', '冰岛', '卢森堡',
  '捷克', '波兰', '斯洛伐克', '斯洛文尼亚', '匈牙利', '立陶宛', '拉脱维亚',
  '爱沙尼亚', '马耳他', '列支敦士登'
];

// 职业选项
export const occupationOptions = [
  { value: '', label: '请选择职业' },
  { value: 'student', label: '学生 (Student)' },
  { value: 'employed', label: '在职 (Employed)' },
  { value: 'self-employed', label: '自雇 (Self-employed)' },
  { value: 'retired', label: '退休 (Retired)' },
  { value: 'unemployed', label: '无业 (Unemployed)' },
  { value: 'other', label: '其他 (Other)' },
];

// 婚姻状况选项
export const maritalStatusOptions = [
  { value: 'single', label: '未婚 (Single)' },
  { value: 'married', label: '已婚 (Married)' },
  { value: 'separated', label: '分居 (Separated)' },
  { value: 'divorced', label: '离异 (Divorced)' },
  { value: 'widowed', label: '丧偶 (Widowed)' },
  { value: 'other', label: '其他 (Other)' },
];

// 旅行目的选项
export const tripPurposeOptions = [
  { value: 'tourism', label: '旅游 (Tourism)' },
  { value: 'business', label: '商务 (Business)' },
  { value: 'family', label: '探亲访友 (Visiting Family/Friends)' },
  { value: 'culture', label: '文化 (Cultural)' },
  { value: 'sports', label: '体育 (Sports)' },
  { value: 'study', label: '学习 (Study)' },
  { value: 'transit', label: '过境 (Transit)' },
  { value: 'medical', label: '医疗 (Medical Reasons)' },
  { value: 'other', label: '其他 (Other)' },
];

// 支付方式选项
export const paymentMeansOptions = [
  { value: 'cash', label: '现金 (Cash)' },
  { value: 'creditCard', label: '信用卡 (Credit Card)' },
  { value: 'prepaidAccommodation', label: '预付住宿 (Prepaid Accommodation)' },
  { value: 'prepaidTransport', label: '预付交通 (Prepaid Transport)' },
  { value: 'other', label: '其他 (Other)' },
];

// 初始数据
export const initialStep1: Step1Personal = {
  surname: '',
  birthSurname: '',
  givenName: '',
  birthDate: '',
  birthPlace: '',
  nationality: 'China',
  birthCountry: 'China',
  gender: 'male',
  maritalStatus: '',
  maritalStatusOther: '',
  idCard: '',
  guardian1Name: '',
  guardian1Nationality: '',
  guardian1Phone: '',
  guardian1Email: '',
  guardian1Address: '',
  guardian2Name: '',
  guardian2Nationality: '',
  guardian2Phone: '',
  guardian2Email: '',
  guardian2Address: '',
};

export const initialStep2: Step2Passport = {
  passportType: '',
  passportTypeOther: '',
  passportNumber: '',
  passportIssueDate: '',
  passportExpiry: '',
  passportIssuer: 'CHINA',
  address: '',
  phone: '',
  email: '',
  residenceAbroad: false,
  residencePermitType: '',
  residencePermitExpiry: '',
  occupation: '',
  occupationOther: '',
  employerName: '',
  employerAddress: '',
  employerPhone: '',
  currentPosition: '',
  schoolName: '',
  schoolAddress: '',
  schoolPhone: '',
};

export const initialStep3: Step3Travel = {
  visaApplicationCountry: '',
  destinations: [],
  firstEntry: '',
  entryType: '',
  arrivalDate: '',
  departureDate: '',
  stayDuration: '',
  tripPurpose: [],
  tripPurposeOther: '',
  hasCompanion: false,
  companions: [],
  prevSchengenVisa: false,
  prevVisaNumber: '',
  prevVisaIssueDate: '',
  prevVisaExpiryDate: '',
  fingerprints: false,
  fingerprintsDate: '',
};

export const initialStep4: Step4Invitation = {
  hasInviter: 'no',
  hotelName: '',
  hotelAddress: '',
  hotelPhone: '',
  hotelEmail: '',
  inviterName: '',
  inviterAddress: '',
  inviterPhone: '',
  inviterEmail: '',
  orgName: '',
  orgAddress: '',
  orgPhone: '',
  orgContactName: '',
  orgContactPhone: '',
  orgContactEmail: '',
};

export const initialStep5: Step5Funding = {
  fundingSource: 'applicant',
  applicantMeans: ['cash', 'creditCard'],
  applicantMeansOther: '',
  sponsorType: 'inviter',
  otherSponsorName: '',
  sponsorMeans: ['allExpenses'],
  sponsorMeansOther: '',
};

export const initialSchengenData: SchengenVisaData = {
  step1: initialStep1,
  step2: initialStep2,
  step3: initialStep3,
  step4: initialStep4,
  step5: initialStep5,
};
