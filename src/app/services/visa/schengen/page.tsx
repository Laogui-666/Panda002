'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useVisaFormStore } from '../store';
import { Input, Select, TextArea } from '@/components/ui/Input';

// 步骤组件
function StepIndicator() {
  const { currentStep, totalSteps } = useVisaFormStore();
  
  const steps = [
    { num: 1, label: '个人信息' },
    { num: 2, label: '证件信息' },
    { num: 3, label: '行程信息' },
    { num: 4, label: '邀请住宿' },
    { num: 5, label: '费用出资' },
    { num: 6, label: '预览导出' },
  ];

  return (
    <div className="mb-8">
      <div className="relative mb-4">
        <div className="h-1 bg-morandi-mist/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-morandi-ocean to-morandi-blush"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        {steps.map((step) => (
          <div 
            key={step.num}
            className={`flex flex-col items-center ${
              step.num === currentStep 
                ? 'text-morandi-ocean' 
                : step.num < currentStep 
                  ? 'text-morandi-deep' 
                  : 'text-morandi-mist/50'
            }`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1
              ${step.num === currentStep 
                ? 'bg-morandi-ocean text-white' 
                : step.num < currentStep 
                  ? 'bg-morandi-ocean/20 text-morandi-deep' 
                  : 'bg-morandi-mist/20 text-morandi-mist/50'}
            `}>
              {step.num < currentStep ? '✓' : step.num}
            </div>
            <span className="text-xs hidden sm:block">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 1: 个人信息
function PersonalInfoStep() {
  const { formData, updatePersonal } = useVisaFormStore();
  const p = formData.personal;
  
  const isMinor = p.birthDate ? (() => {
    const birth = new Date(p.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age < 18;
  })() : false;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-morandi-deep mb-4">
        <span className="inline-block w-8 h-8 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-center mr-2">1</span>
        个人信息
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="姓 (Surname)"
          value={p.surname}
          onChange={(e) => updatePersonal({ surname: e.target.value })}
          placeholder="请输入姓"
        />
        <Input
          label="出生时姓氏"
          value={p.birthSurname}
          onChange={(e) => updatePersonal({ birthSurname: e.target.value })}
          placeholder="如有曾用名请填写"
        />
        <Input
          label="名 (Given Name)"
          value={p.givenName}
          onChange={(e) => updatePersonal({ givenName: e.target.value })}
          placeholder="请输入名"
        />
        <Input
          label="出生日期"
          type="date"
          value={p.birthDate}
          onChange={(e) => updatePersonal({ birthDate: e.target.value })}
        />
        <Input
          label="出生地"
          value={p.birthPlace}
          onChange={(e) => updatePersonal({ birthPlace: e.target.value })}
          placeholder="例如：四川成都"
        />
        <Input
          label="现国籍"
          value={p.nationality}
          onChange={(e) => updatePersonal({ nationality: e.target.value })}
          placeholder="例如：China"
        />
        <Input
          label="出生国家"
          value={p.birthCountry}
          onChange={(e) => updatePersonal({ birthCountry: e.target.value })}
          placeholder="例如：China"
        />
        <div>
          <label className="block text-sm font-medium text-morandi-deep mb-2">性别</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={p.gender === 'male'}
                onChange={() => updatePersonal({ gender: 'male' })}
                className="w-4 h-4 text-morandi-ocean"
              />
              <span>男 (Male)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={p.gender === 'female'}
                onChange={() => updatePersonal({ gender: 'female' })}
                className="w-4 h-4 text-morandi-ocean"
              />
              <span>女 (Female)</span>
            </label>
          </div>
        </div>
        <Select
          label="婚姻状况"
          value={p.maritalStatus}
          onChange={(v) => updatePersonal({ maritalStatus: v })}
          options={[
            { value: '', label: '请选择' },
            { value: 'single', label: '未婚 (Single)' },
            { value: 'married', label: '已婚 (Married)' },
            { value: 'separated', label: '分居 (Separated)' },
            { value: 'divorced', label: '离异 (Divorced)' },
            { value: 'widowed', label: '丧偶 (Widowed)' },
            { value: 'other', label: '其他 (Other)' },
          ]}
        />
        {p.maritalStatus === 'other' && (
          <Input
            label="请说明"
            value={p.maritalStatusOther}
            onChange={(e) => updatePersonal({ maritalStatusOther: e.target.value })}
            placeholder="请具体说明"
          />
        )}
        <div className="md:col-span-2">
          <Input
            label="身份证号码"
            value={p.idCard}
            onChange={(e) => updatePersonal({ idCard: e.target.value })}
            placeholder="请输入身份证号码"
          />
        </div>
      </div>

      {/* 未成年人信息 */}
      {isMinor && (
        <div className="mt-6 p-4 bg-morandi-ocean/5 rounded-xl border border-morandi-ocean/20">
          <h3 className="font-medium text-morandi-deep mb-4">监护人信息 (未成年人必填)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="监护人1姓名"
              value={p.guardian1Name}
              onChange={(e) => updatePersonal({ guardian1Name: e.target.value })}
              placeholder="请输入监护人1姓名"
            />
            <Input
              label="监护人1国籍"
              value={p.guardian1Nationality}
              onChange={(e) => updatePersonal({ guardian1Nationality: e.target.value })}
              placeholder="例如：China"
            />
            <Input
              label="监护人1电话"
              value={p.guardian1Phone}
              onChange={(e) => updatePersonal({ guardian1Phone: e.target.value })}
              placeholder="请输入监护人1电话"
            />
            <Input
              label="监护人1邮箱"
              type="email"
              value={p.guardian1Email}
              onChange={(e) => updatePersonal({ guardian1Email: e.target.value })}
              placeholder="请输入监护人1邮箱"
            />
            <div className="md:col-span-2">
              <Input
                label="监护人1地址"
                value={p.guardian1Address}
                onChange={(e) => updatePersonal({ guardian1Address: e.target.value })}
                placeholder="请输入监护人1地址"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 2: 证件信息
function PassportInfoStep() {
  const { formData, updatePassport } = useVisaFormStore();
  const p = formData.passport;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-morandi-deep mb-4">
        <span className="inline-block w-8 h-8 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-center mr-2">2</span>
        证件信息
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="护照号码"
          value={p.passportNumber}
          onChange={(e) => updatePassport({ passportNumber: e.target.value })}
          placeholder="请输入护照号码"
        />
        <Input
          label="护照签发日期"
          type="date"
          value={p.passportIssueDate}
          onChange={(e) => updatePassport({ passportIssueDate: e.target.value })}
        />
        <Input
          label="护照到期日期"
          type="date"
          value={p.passportExpiryDate}
          onChange={(e) => updatePassport({ passportExpiryDate: e.target.value })}
        />
        <Input
          label="护照签发机关"
          value={p.passportIssueAuthority}
          onChange={(e) => updatePassport({ passportIssueAuthority: e.target.value })}
          placeholder="请输入护照签发机关"
        />
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.hasOldPassport}
            onChange={(e) => updatePassport({ hasOldPassport: e.target.checked })}
            className="w-4 h-4 text-morandi-ocean rounded"
          />
          <span className="text-sm text-morandi-deep">我有旧护照</span>
        </label>
        
        {p.hasOldPassport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="旧护照号码"
              value={p.oldPassportNumber}
              onChange={(e) => updatePassport({ oldPassportNumber: e.target.value })}
              placeholder="请输入旧护照号码"
            />
            <Input
              label="旧护照到期日期"
              type="date"
              value={p.oldPassportExpiry}
              onChange={(e) => updatePassport({ oldPassportExpiry: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Step 3: 行程信息
function TravelInfoStep() {
  const { formData, updateTravel } = useVisaFormStore();
  const t = formData.travel;

  const tripPurposes = [
    { value: 'tourism', label: '旅游 (Tourism)' },
    { value: 'business', label: '商务 (Business)' },
    { value: 'visit', label: '探亲访友 (Visit)' },
    { value: 'study', label: '学习 (Study)' },
    { value: 'work', label: '工作 (Work)' },
    { value: 'transit', label: '过境 (Transit)' },
    { value: 'other', label: '其他 (Other)' },
  ];

  const handlePurposeChange = (purpose: string) => {
    const newPurposes = t.tripPurpose.includes(purpose)
      ? t.tripPurpose.filter(p => p !== purpose)
      : [...t.tripPurpose, purpose];
    updateTravel({ tripPurpose: newPurposes });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-morandi-deep mb-4">
        <span className="inline-block w-8 h-8 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-center mr-2">3</span>
        行程信息
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="主要目的地"
          value={t.mainDestination}
          onChange={(e) => updateTravel({ mainDestination: e.target.value })}
          placeholder="例如：法国"
        />
        <Input
          label="首入国家"
          value={t.firstEntryCountry}
          onChange={(e) => updateTravel({ firstEntryCountry: e.target.value })}
          placeholder="例如：法国"
        />
        <Input
          label="入境日期"
          type="date"
          value={t.arrivalDate}
          onChange={(e) => updateTravel({ arrivalDate: e.target.value })}
        />
        <Input
          label="出境日期"
          type="date"
          value={t.departureDate}
          onChange={(e) => updateTravel({ departureDate: e.target.value })}
        />
        <Input
          label="预计停留天数"
          value={t.intendedStay}
          onChange={(e) => updateTravel({ intendedStay: e.target.value })}
          placeholder="例如：15"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-morandi-deep mb-2">旅行目的</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tripPurposes.map((purpose) => (
            <label
              key={purpose.value}
              className={`
                flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all
                ${t.tripPurpose.includes(purpose.value)
                  ? 'border-morandi-ocean bg-morandi-ocean/5'
                  : 'border-morandi-mist/30 hover:border-morandi-ocean/50'}
              `}
            >
              <input
                type="checkbox"
                value={purpose.value}
                checked={t.tripPurpose.includes(purpose.value)}
                onChange={() => handlePurposeChange(purpose.value)}
                className="w-4 h-4 text-morandi-ocean rounded"
              />
              <span className="text-sm">{purpose.label}</span>
            </label>
          ))}
        </div>
        {t.tripPurpose.includes('other') && (
          <div className="mt-2">
            <Input
              value={t.tripPurposeOther}
              onChange={(e) => updateTravel({ tripPurposeOther: e.target.value })}
              placeholder="请说明其他旅行目的"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4: 邀请住宿
function InvitationInfoStep() {
  const { formData, updateInvitation } = useVisaFormStore();
  const inv = formData.invitation;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-morandi-deep mb-4">
        <span className="inline-block w-8 h-8 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-center mr-2">4</span>
        邀请住宿
      </h2>

      <div className="p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-medium text-morandi-deep mb-2">是否有邀请方</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasInviter"
              value="yes"
              checked={inv.hasInviter === 'yes'}
              onChange={() => updateInvitation({ hasInviter: 'yes' })}
              className="w-4 h-4 text-morandi-ocean"
            />
            <span>有邀请方</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasInviter"
              value="no"
              checked={inv.hasInviter === 'no'}
              onChange={() => updateInvitation({ hasInviter: 'no' })}
              className="w-4 h-4 text-morandi-ocean"
            />
            <span>无邀请方 (住酒店)</span>
          </label>
        </div>
      </div>

      {inv.hasInviter === 'yes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="邀请人姓名"
            value={inv.inviterName}
            onChange={(e) => updateInvitation({ inviterName: e.target.value })}
            placeholder="请输入邀请人姓名"
          />
          <Input
            label="邀请人国籍"
            value={inv.inviterNationality}
            onChange={(e) => updateInvitation({ inviterNationality: e.target.value })}
            placeholder="例如：France"
          />
          <Input
            label="邀请人电话"
            value={inv.inviterPhone}
            onChange={(e) => updateInvitation({ inviterPhone: e.target.value })}
            placeholder="请输入邀请人电话"
          />
          <Input
            label="邀请人邮箱"
            type="email"
            value={inv.inviterEmail}
            onChange={(e) => updateInvitation({ inviterEmail: e.target.value })}
            placeholder="请输入邀请人邮箱"
          />
          <Input
            label="邀请公司/机构"
            value={inv.inviterCompany}
            onChange={(e) => updateInvitation({ inviterCompany: e.target.value })}
            placeholder="请输入邀请公司/机构"
          />
          <Input
            label="与邀请人关系"
            value={inv.inviterRelationship}
            onChange={(e) => updateInvitation({ inviterRelationship: e.target.value })}
            placeholder="例如：朋友、亲属、商务"
          />
          <div className="md:col-span-2">
            <Input
              label="邀请人地址"
              value={inv.inviterAddress}
              onChange={(e) => updateInvitation({ inviterAddress: e.target.value })}
              placeholder="请输入邀请人详细地址"
            />
          </div>
        </div>
      )}

      {inv.hasInviter === 'no' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="酒店名称"
            value={inv.hotelName}
            onChange={(e) => updateInvitation({ hotelName: e.target.value })}
            placeholder="请输入酒店名称"
          />
          <Input
            label="酒店电话"
            value={inv.hotelPhone}
            onChange={(e) => updateInvitation({ hotelPhone: e.target.value })}
            placeholder="请输入酒店电话"
          />
          <div className="md:col-span-2">
            <Input
              label="酒店地址"
              value={inv.hotelAddress}
              onChange={(e) => updateInvitation({ hotelAddress: e.target.value })}
              placeholder="请输入酒店地址"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Step 5: 费用出资
function FundingInfoStep() {
  const { formData, updateFunding } = useVisaFormStore();
  const f = formData.funding;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-morandi-deep mb-4">
        <span className="inline-block w-8 h-8 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-center mr-2">5</span>
        费用出资
      </h2>

      <div className="p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-medium text-morandi-deep mb-2">费用承担方式</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="fundingSource"
              value="applicant"
              checked={f.fundingSource === 'applicant'}
              onChange={() => updateFunding({ fundingSource: 'applicant' })}
              className="w-4 h-4 text-morandi-ocean"
            />
            <span>本人支付</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="fundingSource"
              value="sponsor"
              checked={f.fundingSource === 'sponsor'}
              onChange={() => updateFunding({ fundingSource: 'sponsor' })}
              className="w-4 h-4 text-morandi-ocean"
            />
            <span>赞助人支付</span>
          </label>
        </div>
      </div>

      {f.fundingSource === 'sponsor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="赞助人姓名"
            value={f.sponsorName}
            onChange={(e) => updateFunding({ sponsorName: e.target.value })}
            placeholder="请输入赞助人姓名"
          />
          <Input
            label="赞助人国籍"
            value={f.sponsorNationality}
            onChange={(e) => updateFunding({ sponsorNationality: e.target.value })}
            placeholder="例如：China"
          />
          <Input
            label="赞助人电话"
            value={f.sponsorPhone}
            onChange={(e) => updateFunding({ sponsorPhone: e.target.value })}
            placeholder="请输入赞助人电话"
          />
          <Input
            label="赞助人邮箱"
            type="email"
            value={f.sponsorEmail}
            onChange={(e) => updateFunding({ sponsorEmail: e.target.value })}
            placeholder="请输入赞助人邮箱"
          />
          <Input
            label="赞助人公司"
            value={f.sponsorCompany}
            onChange={(e) => updateFunding({ sponsorCompany: e.target.value })}
            placeholder="请输入赞助人公司"
          />
          <Input
            label="与赞助人关系"
            value={f.sponsorRelationship}
            onChange={(e) => updateFunding({ sponsorRelationship: e.target.value })}
            placeholder="例如：父母、配偶"
          />
          <div className="md:col-span-2">
            <Input
              label="赞助人地址"
              value={f.sponsorAddress}
              onChange={(e) => updateFunding({ sponsorAddress: e.target.value })}
              placeholder="请输入赞助人详细地址"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-morandi-deep mb-2">附加材料</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.sponsorBankStatement}
                  onChange={(e) => updateFunding({ sponsorBankStatement: e.target.checked })}
                  className="w-4 h-4 text-morandi-ocean rounded"
                />
                <span>银行流水</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.sponsorGuaranteeLetter}
                  onChange={(e) => updateFunding({ sponsorGuaranteeLetter: e.target.value === true })}
                  className="w-4 h-4 text-morandi-ocean rounded"
                />
                <span>赞助信</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {f.fundingSource === 'applicant' && (
        <div className="p-4 bg-morandi-ocean/5 rounded-xl">
          <p className="text-sm text-morandi-mist">
            您将使用本人的资金支付旅行费用。请确保您有足够的经济能力证明。
          </p>
        </div>
      )}
    </div>
  );
}

// Step 6: 预览导出
function PreviewStep() {
  const { formData } = useVisaFormStore();

  const handleExport = () => {
    // 生成Word文档
    const content = `
      <html>
      <head>
        <meta charset="utf-8">
        <title>申根签证申请表</title>
        <style>
          body { font-family: 'Noto Sans SC', Arial, sans-serif; padding: 40px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #f5f5f5; }
          .section { margin: 30px 0; }
        </style>
      </head>
      <body>
        <h1>申根签证申请表</h1>
        
        <div class="section">
          <h2>一、个人信息</h2>
          <table>
            <tr><th>姓</th><td>${formData.personal.surname}</td><th>名</th><td>${formData.personal.givenName}</td></tr>
            <tr><th>出生日期</th><td>${formData.personal.birthDate}</td><th>出生地</th><td>${formData.personal.birthPlace}</td></tr>
            <tr><th>国籍</th><td>${formData.personal.nationality}</td><th>性别</th><td>${formData.personal.gender === 'male' ? '男' : '女'}</td></tr>
            <tr><th>婚姻状况</th><td>${formData.personal.maritalStatus}</td><th>身份证号</th><td>${formData.personal.idCard}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>二、护照信息</h2>
          <table>
            <tr><th>护照号码</th><td>${formData.passport.passportNumber}</td></tr>
            <tr><th>签发日期</th><td>${formData.passport.passportIssueDate}</td><th>到期日期</th><td>${formData.passport.passportExpiryDate}</td></tr>
            <tr><th>签发机关</th><td colspan="3">${formData.passport.passportIssueAuthority}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>三、行程信息</h2>
          <table>
            <tr><th>主要目的地</th><td>${formData.travel.mainDestination}</td><th>首入国家</th><td>${formData.travel.firstEntryCountry}</td></tr>
            <tr><th>入境日期</th><td>${formData.travel.arrivalDate}</td><th>出境日期</th><td>${formData.travel.departureDate}</td></tr>
            <tr><th>停留天数</th><td>${formData.travel.intendedStay}</td><th>旅行目的</th><td>${formData.travel.tripPurpose.join(', ')}</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>四、邀请/住宿信息</h2>
          ${formData.invitation.hasInviter === 'yes' ? `
          <table>
            <tr><th>邀请人</th><td>${formData.invitation.inviterName}</td><th>关系</th><td>${formData.invitation.inviterRelationship}</td></tr>
            <tr><th>电话</th><td>${formData.invitation.inviterPhone}</td><th>邮箱</th><td>${formData.invitation.inviterEmail}</td></tr>
            <tr><th>地址</th><td colspan="3">${formData.invitation.inviterAddress}</td></tr>
          </table>
          ` : `
          <table>
            <tr><th>酒店名称</th><td>${formData.invitation.hotelName}</td></tr>
            <tr><th>酒店地址</th><td>${formData.invitation.hotelAddress}</td></tr>
            <tr><th>酒店电话</th><td>${formData.invitation.hotelPhone}</td></tr>
          </table>
          `}
        </div>

        <div class="section">
          <h2>五、费用信息</h2>
          <table>
            <tr><th>费用承担</th><td>${formData.funding.fundingSource === 'applicant' ? '本人支付' : '赞助人支付'}</td></tr>
            ${formData.funding.fundingSource === 'sponsor' ? `
            <tr><th>赞助人</th><td>${formData.funding.sponsorName}</td><th>关系</th><td>${formData.funding.sponsorRelationship}</td></tr>
            ` : ''}
          </table>
        </div>
      </body>
      </html>
    `;

    // 使用HTML MIME方式生成Word
    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '申根签证申请表.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-morandi-deep mb-4">
        <span className="inline-block w-8 h-8 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-center mr-2">6</span>
        预览导出
      </h2>

      <div className="bg-white border border-morandi-mist/30 rounded-xl p-6 max-h-96 overflow-y-auto">
        <h3 className="font-bold text-lg text-morandi-deep mb-4">申请表预览</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-morandi-deep mb-2">一、个人信息</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-morandi-mist">姓:</span> {formData.personal.surname}</p>
              <p><span className="text-morandi-mist">名:</span> {formData.personal.givenName}</p>
              <p><span className="text-morandi-mist">出生日期:</span> {formData.personal.birthDate}</p>
              <p><span className="text-morandi-mist">出生地:</span> {formData.personal.birthPlace}</p>
              <p><span className="text-morandi-mist">国籍:</span> {formData.personal.nationality}</p>
              <p><span className="text-morandi-mist">性别:</span> {formData.personal.gender === 'male' ? '男' : '女'}</p>
              <p><span className="text-morandi-mist">婚姻状况:</span> {formData.personal.maritalStatus}</p>
              <p><span className="text-morandi-mist">身份证号:</span> {formData.personal.idCard}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-morandi-deep mb-2">二、护照信息</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-morandi-mist">护照号码:</span> {formData.passport.passportNumber}</p>
              <p><span className="text-morandi-mist">签发日期:</span> {formData.passport.passportIssueDate}</p>
              <p><span className="text-morandi-mist">到期日期:</span> {formData.passport.passportExpiryDate}</p>
              <p><span className="text-morandi-mist">签发机关:</span> {formData.passport.passportIssueAuthority}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-morandi-deep mb-2">三、行程信息</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-morandi-mist">主要目的地:</span> {formData.travel.mainDestination}</p>
              <p><span className="text-morandi-mist">首入国家:</span> {formData.travel.firstEntryCountry}</p>
              <p><span className="text-morandi-mist">入境日期:</span> {formData.travel.arrivalDate}</p>
              <p><span className="text-morandi-mist">出境日期:</span> {formData.travel.departureDate}</p>
              <p><span className="text-morandi-mist">停留天数:</span> {formData.travel.intendedStay}</p>
              <p><span className="text-morandi-mist">旅行目的:</span> {formData.travel.tripPurpose.join(', ')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-morandi-deep mb-2">四、邀请/住宿信息</h4>
            {formData.invitation.hasInviter === 'yes' ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-morandi-mist">邀请人:</span> {formData.invitation.inviterName}</p>
                <p><span className="text-morandi-mist">关系:</span> {formData.invitation.inviterRelationship}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-morandi-mist">酒店:</span> {formData.invitation.hotelName}</p>
                <p><span className="text-morandi-mist">地址:</span> {formData.invitation.hotelAddress}</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium text-morandi-deep mb-2">五、费用信息</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-morandi-mist">费用承担:</span> {formData.funding.fundingSource === 'applicant' ? '本人支付' : '赞助人支付'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleExport}
          className="px-8 py-3 bg-gradient-to-r from-morandi-ocean to-morandi-blush text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          导出Word文档
        </button>
      </div>
    </div>
  );
}

// 主页面组件
export default function SchengenVisaPage() {
  const { currentStep, nextStep, prevStep } = useVisaFormStore();
  
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep />;
      case 2: return <PassportInfoStep />;
      case 3: return <TravelInfoStep />;
      case 4: return <InvitationInfoStep />;
      case 5: return <FundingInfoStep />;
      case 6: return <PreviewStep />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* 页面标题 */}
        <div className="bg-white rounded-3xl shadow-lg py-6 px-8 mb-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-morandi-deep">申根签证申请表</h1>
            <p className="text-morandi-mist text-sm mt-1">智能向导填写，一键生成标准申请表</p>
          </div>
        </div>
        
        {/* 主卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 lg:p-8">
          <StepIndicator />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
          
          {/* 导航按钮 */}
          {currentStep < 6 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-morandi-mist/20">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep === 1
                    ? 'bg-morandi-mist/20 text-morandi-mist cursor-not-allowed'
                    : 'bg-morandi-mist/10 text-morandi-deep hover:bg-morandi-mist/20'
                }`}
              >
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                上一步
              </button>
              
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-morandi-ocean to-morandi-blush text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                下一步
                <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
