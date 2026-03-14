/**
 * 签证申请表单类型定义
 */

// 个人信息
export interface PersonalInfo {
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
  // 未成年人信息
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

// 护照信息
export interface PassportInfo {
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssueAuthority: string;
  hasOldPassport: boolean;
  oldPassportNumber: string;
  oldPassportExpiry: string;
}

// 行程信息
export interface TravelInfo {
  mainDestination: string;
  arrivalDate: string;
  departureDate: string;
  tripPurpose: string[];
  tripPurposeOther: string;
  firstEntryCountry: string;
  intendedStay: string;
}

// 邀请住宿信息
export interface InvitationInfo {
  hasInviter: 'yes' | 'no' | '';
  inviterName: string;
  inviterNationality: string;
  inviterAddress: string;
  inviterPhone: string;
  inviterEmail: string;
  inviterCompany: string;
  inviterRelationship: string;
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
}

// 费用出资信息
export interface FundingInfo {
  fundingSource: 'applicant' | 'sponsor' | '';
  sponsorName: string;
  sponsorNationality: string;
  sponsorPhone: string;
  sponsorEmail: string;
  sponsorAddress: string;
  sponsorCompany: string;
  sponsorRelationship: string;
  sponsorBankStatement: boolean;
  sponsorGuaranteeLetter: boolean;
}

// 完整表单数据
export interface VisaFormData {
  personal: PersonalInfo;
  passport: PassportInfo;
  travel: TravelInfo;
  invitation: InvitationInfo;
  funding: FundingInfo;
}

// 初始数据
export const initialPersonalInfo: PersonalInfo = {
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

export const initialPassportInfo: PassportInfo = {
  passportNumber: '',
  passportIssueDate: '',
  passportExpiryDate: '',
  passportIssueAuthority: '',
  hasOldPassport: false,
  oldPassportNumber: '',
  oldPassportExpiry: '',
};

export const initialTravelInfo: TravelInfo = {
  mainDestination: '',
  arrivalDate: '',
  departureDate: '',
  tripPurpose: [],
  tripPurposeOther: '',
  firstEntryCountry: '',
  intendedStay: '',
};

export const initialInvitationInfo: InvitationInfo = {
  hasInviter: '',
  inviterName: '',
  inviterNationality: '',
  inviterAddress: '',
  inviterPhone: '',
  inviterEmail: '',
  inviterCompany: '',
  inviterRelationship: '',
  hotelName: '',
  hotelAddress: '',
  hotelPhone: '',
};

export const initialFundingInfo: FundingInfo = {
  fundingSource: '',
  sponsorName: '',
  sponsorNationality: '',
  sponsorPhone: '',
  sponsorEmail: '',
  sponsorAddress: '',
  sponsorCompany: '',
  sponsorRelationship: '',
  sponsorBankStatement: false,
  sponsorGuaranteeLetter: false,
};
