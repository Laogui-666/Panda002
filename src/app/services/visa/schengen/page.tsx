"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useSchengenVisaStore } from './store';
import { Input, Select, TextArea } from '@/components/ui/Input';
import { 
  schengenCountries, 
  occupationOptions, 
  maritalStatusOptions, 
  tripPurposeOptions,
  paymentMeansOptions 
} from './types';

// 获取北京时间日期字符串
const getBeijingDate = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
};

const getBeijingDateString = (): string => {
  const bd = getBeijingDate();
  return bd.toISOString().split('T')[0];
};

// 同行人关系选项
const companionRelationshipOptions = [
  { value: '', label: '请选择' },
  { value: 'spouse', label: '配偶' },
  { value: 'parent', label: '父母' },
  { value: 'friend', label: '朋友' },
  { value: 'colleague', label: '同事' },
  { value: 'other_relative', label: '其他亲属' },
  { value: 'other', label: '其他' },
];

// StepIndicator - 优化的导航栏UI
function StepIndicator() {
  const { currentStep, totalSteps, completedSteps, setStep } = useSchengenVisaStore();
  
  const steps = [
    { num: 1, label: '个人信息', icon: '👤' },
    { num: 2, label: '证件与职业', icon: '📄' },
    { num: 3, label: '行程信息', icon: '✈️' },
    { num: 4, label: '邀请住宿', icon: '🏨' },
    { num: 5, label: '费用出资', icon: '💰' },
    { num: 6, label: '预览导出', icon: '📋' },
  ];

  const handleStepClick = (stepNum: number) => {
    if (stepNum === currentStep || completedSteps.includes(stepNum)) {
      setStep(stepNum);
    }
  };

  return (
    <div className="mb-6">
      {/* 优化的导航栏 */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-1.5 rounded-2xl shadow-lg">
        <div className="flex items-center gap-1">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.num);
            const isCurrent = step.num === currentStep;
            const isClickable = isCompleted || isCurrent;
            
            return (
              <React.Fragment key={step.num}>
                <motion.div
                  className="flex-1 relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.button
                    onClick={() => handleStepClick(step.num)}
                    disabled={!isClickable}
                    className={`
                      w-full px-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                      ${isClickable 
                        ? 'cursor-pointer hover:bg-white/10' 
                        : 'cursor-not-allowed opacity-40'
                      }
                      ${isCurrent 
                        ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-lg shadow-sky-500/40' 
                        : isCompleted
                          ? 'bg-white/10 text-sky-300 hover:text-white'
                          : 'text-slate-400'
                      }
                    `}
                    whileHover={isClickable ? { scale: 1.02 } : {}}
                    whileTap={isClickable ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {isCompleted && !isCurrent ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm">{step.icon}</span>
                      )}
                      <span className="hidden lg:inline">{step.label}</span>
                    </div>
                  </motion.button>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-3 h-0.5 rounded ${step.num < currentStep ? 'bg-sky-500' : 'bg-slate-600'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="mt-3">
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-sky-500 to-sky-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

// Step 1: 个人信息
function Step1Personal() {
  const { formData, updateStep1 } = useSchengenVisaStore();
  const p = formData.step1;
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isMinor = p.birthDate ? (() => {
    const birth = new Date(p.birthDate);
    const today = getBeijingDate();
    const age = today.getFullYear() - birth.getFullYear();
    return age < 18;
  })() : false;

  const handleDateChange = (field: string, value: string) => {
    let error = '';
    if (field === 'birthDate') {
      const beijingNow = getBeijingDateString();
      if (value > beijingNow) {
        error = '出生日期不能晚于今天';
      }
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    updateStep1({ [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-morandi-deep mb-4 flex items-center">
        <span className="inline-flex items-center justify-center w-7 h-7 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-sm mr-2">01</span>
        个人信息
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="姓 (Surname) *" value={p.surname} onChange={(e) => updateStep1({ surname: e.target.value })} placeholder="请输入姓" />
        <Input label="出生时姓氏" value={p.birthSurname} onChange={(e) => updateStep1({ birthSurname: e.target.value })} placeholder="如有曾用名请填写" />
        <Input label="名 (Given Name) *" value={p.givenName} onChange={(e) => updateStep1({ givenName: e.target.value })} placeholder="请输入名" />
        <div>
          <Input 
            label="出生日期 *" 
            type="date" 
            value={p.birthDate} 
            max={getBeijingDateString()}
            onChange={(e) => handleDateChange('birthDate', e.target.value)} 
          />
          {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
        </div>
        <Input label="出生地 *" value={p.birthPlace} onChange={(e) => updateStep1({ birthPlace: e.target.value })} placeholder="例如：四川成都" />
        <Input label="现国籍 *" value={p.nationality} onChange={(e) => updateStep1({ nationality: e.target.value })} placeholder="例如：China" />
        <Input label="出生国家 *" value={p.birthCountry} onChange={(e) => updateStep1({ birthCountry: e.target.value })} placeholder="例如：China" />
        <div>
          <label className="block text-sm font-medium text-morandi-deep mb-2">性别 *</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="gender" value="male" checked={p.gender === 'male'} onChange={() => updateStep1({ gender: 'male' })} className="w-4 h-4 text-morandi-ocean" />
              <span className="text-sm">男 (Male)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="gender" value="female" checked={p.gender === 'female'} onChange={() => updateStep1({ gender: 'female' })} className="w-4 h-4 text-morandi-ocean" />
              <span className="text-sm">女 (Female)</span>
            </label>
          </div>
        </div>
        <Select label="婚姻状况 *" value={p.maritalStatus} onChange={(v) => updateStep1({ maritalStatus: v })} options={maritalStatusOptions} />
        {p.maritalStatus === 'other' && (
          <Input label="请说明" value={p.maritalStatusOther} onChange={(e) => updateStep1({ maritalStatusOther: e.target.value })} placeholder="请具体说明" />
        )}
        <div className="md:col-span-2">
          <Input label="身份证号码 *" value={p.idCard} onChange={(e) => updateStep1({ idCard: e.target.value })} placeholder="请输入身份证号码" />
        </div>
      </div>

      {/* 未成年人监护人信息 */}
      {isMinor && (
        <div className="mt-6 p-4 bg-morandi-ocean/5 rounded-xl border border-morandi-ocean/20">
          <h3 className="font-medium text-morandi-deep mb-4 text-sm">监护人信息 (未成年人必填)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="监护人1姓名 *" value={p.guardian1Name} onChange={(e) => updateStep1({ guardian1Name: e.target.value })} placeholder="请输入监护人1姓名" />
            <Input label="监护人1国籍 *" value={p.guardian1Nationality} onChange={(e) => updateStep1({ guardian1Nationality: e.target.value })} placeholder="例如：China" />
            <Input label="监护人1电话 *" value={p.guardian1Phone} onChange={(e) => updateStep1({ guardian1Phone: e.target.value })} placeholder="请输入监护人1电话" />
            <Input label="监护人1邮箱" value={p.guardian1Email} onChange={(e) => updateStep1({ guardian1Email: e.target.value })} placeholder="请输入监护人1邮箱" />
            <div className="md:col-span-2">
              <Input label="监护人1地址 *" value={p.guardian1Address} onChange={(e) => updateStep1({ guardian1Address: e.target.value })} placeholder="请输入监护人1地址" />
            </div>
            <Input label="监护人2姓名" value={p.guardian2Name} onChange={(e) => updateStep1({ guardian2Name: e.target.value })} placeholder="请输入监护人2姓名" />
            <Input label="监护人2国籍" value={p.guardian2Nationality} onChange={(e) => updateStep1({ guardian2Nationality: e.target.value })} placeholder="例如：China" />
            <Input label="监护人2电话" value={p.guardian2Phone} onChange={(e) => updateStep1({ guardian2Phone: e.target.value })} placeholder="请输入监护人2电话" />
            <Input label="监护人2邮箱" value={p.guardian2Email} onChange={(e) => updateStep1({ guardian2Email: e.target.value })} placeholder="请输入监护人2邮箱" />
            <div className="md:col-span-2">
              <Input label="监护人2地址" value={p.guardian2Address} onChange={(e) => updateStep1({ guardian2Address: e.target.value })} placeholder="请输入监护人2地址" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 2: 证件与职业信息
function Step2Passport() {
  const { formData, updateStep2 } = useSchengenVisaStore();
  const p = formData.step2;

  // 获取日期限制
  const todayStr = getBeijingDateString();

  const handleOccupationChange = (value: string) => {
    updateStep2({ occupation: value });
    // 如果从学生改为其他，清空学校信息
    if (p.occupation === 'student' && value !== 'student') {
      updateStep2({ schoolName: '', schoolAddress: '', schoolPhone: '' });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-morandi-deep mb-4 flex items-center">
        <span className="inline-flex items-center justify-center w-7 h-7 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-sm mr-2">02</span>
        证件与职业信息
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select 
          label="护照种类 *" 
          value={p.passportType} 
          onChange={(v) => updateStep2({ passportType: v })} 
          options={[
            { value: '', label: '请选择' },
            { value: 'ordinary', label: '普通护照 (Ordinary Passport)' },
            { value: 'diplomatic', label: '外交护照 (Diplomatic Passport)' },
            { value: 'service', label: '公务护照 (Service Passport)' },
            { value: 'official', label: '因公护照 (Official Passport)' },
            { value: 'special', label: '特殊护照 (Special Passport)' },
            { value: 'other', label: '其他 (Other)' },
          ]} 
        />
        {p.passportType === 'other' && (
          <Input label="请说明" value={p.passportTypeOther} onChange={(e) => updateStep2({ passportTypeOther: e.target.value })} placeholder="请具体说明" />
        )}
        <Input label="护照号码 *" value={p.passportNumber} onChange={(e) => updateStep2({ passportNumber: e.target.value })} placeholder="请输入护照号码" />
        <Input 
          label="护照签发日期 *" 
          type="date" 
          value={p.passportIssueDate} 
          max={todayStr}
          onChange={(e) => updateStep2({ passportIssueDate: e.target.value })} 
        />
        <Input 
          label="有效期至 *" 
          type="date" 
          value={p.passportExpiry} 
          min={p.passportIssueDate || undefined}
          onChange={(e) => updateStep2({ passportExpiry: e.target.value })} 
        />
        <Input label="签发机关 *" value={p.passportIssuer} onChange={(e) => updateStep2({ passportIssuer: e.target.value })} placeholder="例如：China" />
        <div className="md:col-span-2">
          <Input label="申请人住址 *" value={p.address} onChange={(e) => updateStep2({ address: e.target.value })} placeholder="请输入详细住址" />
        </div>
        <div className="md:col-span-2">
          <Input label="申请人电话 *" value={p.phone} onChange={(e) => updateStep2({ phone: e.target.value })} placeholder="请输入电话号码" />
        </div>
        <div className="md:col-span-2">
          <Input label="申请人电子邮箱 *" type="email" value={p.email} onChange={(e) => updateStep2({ email: e.target.value })} placeholder="请输入电子邮箱" />
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl mt-4">
        <label className="block text-sm font-medium text-morandi-deep mb-2">是否居住在现时国籍以外的国家？</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="residenceAbroad" value="no" checked={!p.residenceAbroad} onChange={() => updateStep2({ residenceAbroad: false })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">否 (No)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="residenceAbroad" value="yes" checked={p.residenceAbroad} onChange={() => updateStep2({ residenceAbroad: true })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">是 (Yes)</span>
          </label>
        </div>
        
        {p.residenceAbroad && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Select 
              label="居留许可种类" 
              value={p.residencePermitType} 
              onChange={(v) => updateStep2({ residencePermitType: v })} 
              options={[
                { value: '', label: '请选择' },
                { value: 'student', label: '学生居留' },
                { value: 'work', label: '工作居留' },
                { value: 'long-term', label: '长期居留' },
                { value: 'other', label: '其他' },
              ]} 
            />
            <Input label="有效期至" type="date" value={p.residencePermitExpiry} onChange={(e) => updateStep2({ residencePermitExpiry: e.target.value })} />
          </div>
        )}
      </div>

      {/* 职业信息 */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <Select 
          label="职业 * (Occupation)" 
          value={p.occupation} 
          onChange={handleOccupationChange}
          options={occupationOptions} 
        />
        {p.occupation === 'other' && (
          <div className="mt-3">
            <Input label="请说明" value={p.occupationOther} onChange={(e) => updateStep2({ occupationOther: e.target.value })} placeholder="请具体说明" />
          </div>
        )}

        {/* 在职/自雇 */}
        {(p.occupation === 'employed' || p.occupation === 'self-employed') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Input label="工作单位名称 *" value={p.employerName} onChange={(e) => updateStep2({ employerName: e.target.value })} placeholder="请输入单位名称" />
            <Input label="现任职位" value={p.currentPosition} onChange={(e) => updateStep2({ currentPosition: e.target.value })} placeholder="请输入职位" />
            <div className="md:col-span-2">
              <Input label="单位地址" value={p.employerAddress} onChange={(e) => updateStep2({ employerAddress: e.target.value })} placeholder="请输入单位地址" />
            </div>
            <Input label="单位电话" value={p.employerPhone} onChange={(e) => updateStep2({ employerPhone: e.target.value })} placeholder="请输入单位电话" />
          </div>
        )}

        {/* 学生 - 学校信息 */}
        {p.occupation === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="md:col-span-2">
              <Input label="学校名称 *" value={p.schoolName} onChange={(e) => updateStep2({ schoolName: e.target.value })} placeholder="请输入学校名称" />
            </div>
            <div className="md:col-span-2">
              <Input label="学校地址" value={p.schoolAddress} onChange={(e) => updateStep2({ schoolAddress: e.target.value })} placeholder="请输入学校地址" />
            </div>
            <Input label="学校电话" value={p.schoolPhone} onChange={(e) => updateStep2({ schoolPhone: e.target.value })} placeholder="请输入学校电话" />
          </div>
        )}
      </div>
    </div>
  );
}

// Step 3: 行程信息
function Step3Travel() {
  const { formData, updateStep3 } = useSchengenVisaStore();
  const t = formData.step3;
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 日期限制
  const todayStr = getBeijingDateString();

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDestinationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDestination = (country: string) => {
    const newDestinations = t.destinations.includes(country)
      ? t.destinations.filter(c => c !== country)
      : [...t.destinations, country];
    updateStep3({ destinations: newDestinations });
    if (newDestinations.length > 0 && !newDestinations.includes(t.firstEntry)) {
      updateStep3({ firstEntry: newDestinations[0] });
    }
  };

  const handlePurposeChange = (purpose: string) => {
    const newPurposes = t.tripPurpose.includes(purpose)
      ? t.tripPurpose.filter(p => p !== purpose)
      : [...t.tripPurpose, purpose];
    updateStep3({ tripPurpose: newPurposes });
  };

  // 自动计算逗留天数
  const handleDateChange = (field: string, value: string) => {
    updateStep3({ [field]: value });
    
    if (t.arrivalDate && t.departureDate) {
      const arrival = new Date(t.arrivalDate);
      const departure = new Date(t.departureDate);
      const days = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        updateStep3({ stayDuration: days.toString() });
      }
    }
  };

  const handleAddCompanion = () => {
    const { addCompanion } = useSchengenVisaStore.getState();
    addCompanion({ name: '', relationship: '', relationshipOther: '', passportNumber: '' });
  };

  const removeCompanion = (index: number) => {
    const { removeCompanion } = useSchengenVisaStore.getState();
    removeCompanion(index);
  };

  const updateCompanion = (index: number, field: string, value: string) => {
    const newCompanions = [...t.companions];
    (newCompanions[index] as any)[field] = value;
    updateStep3({ companions: newCompanions });
  };

  // 首入 国选项
  const firstEntryOptions = t.destinations.length > 0 
    ? [{ value: '', label: '请选择' }, ...t.destinations.map(c => ({ value: c, label: c }))]
    : [{ value: '', label: '请先选择目的地' }];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-morandi-deep mb-4 flex items-center">
        <span className="inline-flex items-center justify-center w-7 h-7 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-sm mr-2">03</span>
        行程信息
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select 
          label="签证申请国 *" 
          value={t.visaApplicationCountry} 
          onChange={(v) => updateStep3({ visaApplicationCountry: v, firstEntry: v })} 
          options={[{ value: '', label: '请选择' }, ...schengenCountries.map(c => ({ value: c, label: c }))]} 
        />
        
        {/* 申根目的地多选 */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-morandi-deep mb-2">预计前往申根地区 *</label>
          <div 
            className="w-full px-4 py-3 rounded-2xl border border-morandi-mist/30 bg-white cursor-pointer hover:border-morandi-ocean/50 transition-colors"
            onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
          >
            {t.destinations.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {t.destinations.map(c => (
                  <span key={c} className="inline-block px-2 py-0.5 bg-morandi-ocean/10 text-morandi-ocean text-xs rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-morandi-mist">点击选择申根国家（可多选）</span>
            )}
          </div>
          {showDestinationDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-morandi-mist/30 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {schengenCountries.map(country => (
                <label 
                  key={country} 
                  className={`flex items-center gap-2 px-4 py-2.5 hover:bg-morandi-ocean/5 cursor-pointer transition-colors ${
                    t.destinations.includes(country) ? 'bg-morandi-ocean/5' : ''
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={t.destinations.includes(country)} 
                    onChange={() => toggleDestination(country)}
                    className="w-4 h-4 text-morandi-ocean rounded" 
                  />
                  <span className="text-sm">{country}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Select 
            label="申根首 Jeb国 *" 
            value={t.firstEntry} 
            onChange={(v) => updateStep3({ firstEntry: v })} 
            options={firstEntryOptions}
            disabled={t.destinations.length === 0}
          />
        </div>
        <Select 
          label="申请入境次数 *" 
          value={t.entryType} 
          onChange={(v) => updateStep3({ entryType: v })} 
          options={[
            { value: '', label: '请选择' },
            { value: 'single', label: '一次 (Single Entry)' },
            { value: 'two', label: '两次 (Two Entries)' },
            { value: 'multiple', label: '多次 (Multiple Entries)' },
          ]} 
        />
        <Input 
          label="预计入境日期 *" 
          type="date" 
          value={t.arrivalDate} 
          min={todayStr}
          onChange={(e) => handleDateChange('arrivalDate', e.target.value)} 
        />
        <Input 
          label="预计离境日期 *" 
          type="date" 
          value={t.departureDate} 
          min={t.arrivalDate || todayStr}
          onChange={(e) => handleDateChange('departureDate', e.target.value)} 
        />
        <Input label="预计逗留天数" value={t.stayDuration} onChange={(e) => updateStep3({ stayDuration: e.target.value })} placeholder="自动计算" readOnly />
      </div>

      {/* 旅行目的 */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-morandi-deep mb-2">旅程主要目的 *</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tripPurposeOptions.map(purpose => (
            <label
              key={purpose.value}
              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${
                t.tripPurpose.includes(purpose.value)
                  ? 'border-morandi-ocean bg-morandi-ocean/5'
                  : 'border-morandi-mist/30 hover:border-morandi-ocean/50'
              }`}
            >
              <input
                type="checkbox"
                value={purpose.value}
                checked={t.tripPurpose.includes(purpose.value)}
                onChange={() => handlePurposeChange(purpose.value)}
                className="w-3 h-3 text-morandi-ocean rounded"
              />
              <span className="text-xs">{purpose.label}</span>
            </label>
          ))}
        </div>
        {t.tripPurpose.includes('other') && (
          <div className="mt-2">
            <Input value={t.tripPurposeOther} onChange={(e) => updateStep3({ tripPurposeOther: e.target.value })} placeholder="请说明其他旅行目的" />
          </div>
        )}
      </div>

      {/* 同行人信息 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-medium text-morandi-deep mb-2">是否有同行人？</label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="hasCompanion" value="no" checked={!t.hasCompanion} onChange={() => updateStep3({ hasCompanion: false })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">否 (No)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="hasCompanion" value="yes" checked={t.hasCompanion} onChange={() => updateStep3({ hasCompanion: true })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">是 (Yes)</span>
          </label>
        </div>
        
        {t.hasCompanion && (
          <div>
            {t.companions.map((companion, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 bg-white rounded-lg">
                <Input 
                  placeholder="姓名" 
                  value={companion.name} 
                  onChange={(e) => updateCompanion(index, 'name', e.target.value)} 
                />
                <Select 
                  placeholder="与本人关系" 
                  value={companion.relationship} 
                  onChange={(v) => updateCompanion(index, 'relationship', v)}
                  options={companionRelationshipOptions}
                />
                {companion.relationship === 'other' && (
                  <Input 
                    placeholder="请说明关系" 
                    value={companion.relationshipOther || ''} 
                    onChange={(e) => updateCompanion(index, 'relationshipOther', e.target.value)}
                  />
                )}
                <Input 
                  placeholder="护照号码" 
                  value={companion.passportNumber} 
                  onChange={(e) => updateCompanion(index, 'passportNumber', e.target.value)} 
                />
                <button onClick={() => removeCompanion(index)} className="text-red-500 text-sm hover:text-red-700 transition-colors">删除</button>
              </div>
            ))}
            <button onClick={handleAddCompanion} className="text-morandi-ocean text-sm mt-2 hover:text-morandi-deep transition-colors">+ 添加同行人</button>
          </div>
        )}
      </div>

      {/* 之前申根签证信息 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-medium text-morandi-deep mb-2">过去三年是否获批过申根签证？</label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="prevSchengenVisa" value="no" checked={!t.prevSchengenVisa} onChange={() => updateStep3({ prevSchengenVisa: false })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">否 (No)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="prevSchengenVisa" value="yes" checked={t.prevSchengenVisa} onChange={() => updateStep3({ prevSchengenVisa: true })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">是 (Yes)</span>
          </label>
        </div>
        
        {t.prevSchengenVisa && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input label="最近一次签证编号" value={t.prevVisaNumber} onChange={(e) => updateStep3({ prevVisaNumber: e.target.value })} placeholder="例：FRA000000001" />
            <Input label="签发日期" type="date" value={t.prevVisaIssueDate} max={todayStr} onChange={(e) => updateStep3({ prevVisaIssueDate: e.target.value })} />
            <Input label="有效期至" type="date" value={t.prevVisaExpiryDate} onChange={(e) => updateStep3({ prevVisaExpiryDate: e.target.value })} />
          </div>
        )}
      </div>

      {/* 指纹记录 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-medium text-morandi-deep mb-2">最近一次申根签证指纹记录</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="fingerprints" value="no" checked={!t.fingerprints} onChange={() => updateStep3({ fingerprints: false })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">否 (No)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="fingerprints" value="yes" checked={t.fingerprints} onChange={() => updateStep3({ fingerprints: true })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">是 (Yes)</span>
          </label>
        </div>
        {t.fingerprints && (
          <div className="mt-3">
            <Input label="指纹记录日期" type="date" value={t.fingerprintsDate} max={todayStr} onChange={(e) => updateStep3({ fingerprintsDate: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4: 邀请与住宿
function Step4Invitation() {
  const { formData, updateStep4 } = useSchengenVisaStore();
  const inv = formData.step4;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-morandi-deep mb-4 flex items-center">
        <span className="inline-flex items-center justify-center w-7 h-7 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-sm mr-2">04</span>
        邀请与住宿信息
      </h2>
      
      <div className="p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-medium text-morandi-deep mb-2">是否有邀请人或邀请机构？ *</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="hasInviter" value="no" checked={inv.hasInviter === 'no'} onChange={() => updateStep4({ hasInviter: 'no' })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">无 (酒店/暂住地)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="hasInviter" value="personal" checked={inv.hasInviter === 'personal'} onChange={() => updateStep4({ hasInviter: 'personal' })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">个人邀请</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="hasInviter" value="organization" checked={inv.hasInviter === 'organization'} onChange={() => updateStep4({ hasInviter: 'organization' })} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">公司/机构邀请</span>
          </label>
        </div>
      </div>

      {inv.hasInviter === 'no' && (
        <div className="mt-4 p-4 bg-morandi-ocean/5 rounded-xl border border-morandi-ocean/20">
          <h3 className="font-medium text-morandi-deep mb-3 text-sm">酒店/暂住地信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Input label="酒店/暂住地名称" value={inv.hotelName} onChange={(e) => updateStep4({ hotelName: e.target.value })} placeholder="请输入酒店名称" />
            </div>
            <div className="md:col-span-2">
              <Input label="地址" value={inv.hotelAddress} onChange={(e) => updateStep4({ hotelAddress: e.target.value })} placeholder="请输入地址" />
            </div>
            <Input label="电话" value={inv.hotelPhone} onChange={(e) => updateStep4({ hotelPhone: e.target.value })} placeholder="请输入电话号码" />
            <Input label="电子邮件" type="email" value={inv.hotelEmail} onChange={(e) => updateStep4({ hotelEmail: e.target.value })} placeholder="请输入电子邮件" />
          </div>
        </div>
      )}

      {inv.hasInviter === 'personal' && (
        <div className="mt-4 p-4 bg-morandi-ocean/5 rounded-xl border border-morandi-ocean/20">
          <h3 className="font-medium text-morandi-deep mb-3 text-sm">邀请人信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Input label="邀请人姓名" value={inv.inviterName} onChange={(e) => updateStep4({ inviterName: e.target.value })} placeholder="请输入邀请人姓名" />
            </div>
            <div className="md:col-span-2">
              <Input label="邀请人住址" value={inv.inviterAddress} onChange={(e) => updateStep4({ inviterAddress: e.target.value })} placeholder="请输入邀请人住址" />
            </div>
            <Input label="邀请人电话" value={inv.inviterPhone} onChange={(e) => updateStep4({ inviterPhone: e.target.value })} placeholder="请输入电话号码" />
            <Input label="邀请人电子邮件" type="email" value={inv.inviterEmail} onChange={(e) => updateStep4({ inviterEmail: e.target.value })} placeholder="请输入电子邮件" />
          </div>
        </div>
      )}

      {inv.hasInviter === 'organization' && (
        <div className="mt-4 p-4 bg-morandi-ocean/5 rounded-xl border border-morandi-ocean/20">
          <h3 className="font-medium text-morandi-deep mb-3 text-sm">邀请公司/机构信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Input label="公司/机构名称" value={inv.orgName} onChange={(e) => updateStep4({ orgName: e.target.value })} placeholder="请输入公司/机构名称" />
            </div>
            <div className="md:col-span-2">
              <Input label="公司/机构地址" value={inv.orgAddress} onChange={(e) => updateStep4({ orgAddress: e.target.value })} placeholder="请输入公司/机构地址" />
            </div>
            <Input label="公司/机构电话" value={inv.orgPhone} onChange={(e) => updateStep4({ orgPhone: e.target.value })} placeholder="请输入电话号码" />
            <Input label="联系人姓名" value={inv.orgContactName} onChange={(e) => updateStep4({ orgContactName: e.target.value })} placeholder="请输入联系人姓名" />
            <Input label="联系人电话" value={inv.orgContactPhone} onChange={(e) => updateStep4({ orgContactPhone: e.target.value })} placeholder="请输入联系人电话" />
            <Input label="联系人电子邮件" type="email" value={inv.orgContactEmail} onChange={(e) => updateStep4({ orgContactEmail: e.target.value })} placeholder="请输入电子邮件" />
          </div>
        </div>
      )}
    </div>
  );
}

// Step 5: 费用出资
function Step5Funding() {
  const { formData, updateStep5 } = useSchengenVisaStore();
  const f = formData.step5;

  const handleApplicantMeans = (means: string) => {
    const newMeans = f.applicantMeans.includes(means)
      ? f.applicantMeans.filter(m => m !== means)
      : [...f.applicantMeans, means];
    updateStep5({ applicantMeans: newMeans });
  };

  const handleSponsorMeans = (means: string) => {
    const newMeans = f.sponsorMeans.includes(means)
      ? f.sponsorMeans.filter(m => m !== means)
      : [...f.sponsorMeans, means];
    updateStep5({ sponsorMeans: newMeans });
  };

  const handleFundingSourceChange = (source: 'applicant' | 'sponsor') => {
    if (source === 'applicant') {
      updateStep5({ fundingSource: 'applicant', applicantMeans: ['cash', 'creditCard'], sponsorMeans: [] });
    } else {
      updateStep5({ fundingSource: 'sponsor', applicantMeans: [], sponsorMeans: ['allExpenses'] });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-morandi-deep mb-4 flex items-center">
        <span className="inline-flex items-center justify-center w-7 h-7 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-sm mr-2">05</span>
        费用与出资信息
      </h2>
      
      <div className="p-4 bg-gray-50 rounded-xl">
        <label className="block text-sm font-medium text-morandi-deep mb-2">旅费及停留费用由谁支付？ *</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="fundingSource" value="applicant" checked={f.fundingSource === 'applicant'} onChange={() => handleFundingSourceChange('applicant')} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">申请人本人支付</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="fundingSource" value="sponsor" checked={f.fundingSource === 'sponsor'} onChange={() => handleFundingSourceChange('sponsor')} className="w-4 h-4 text-morandi-ocean" />
            <span className="text-sm">赞助人/邀请方支付</span>
          </label>
        </div>
      </div>

      {f.fundingSource === 'applicant' && (
        <div className="mt-4 p-4 bg-morandi-ocean/5 rounded-xl border border-morandi-ocean/20">
          <h3 className="font-medium text-morandi-deep mb-3 text-sm">本人支付方式 (默认勾选)</h3>
          <label className="block text-sm text-morandi-mist mb-2">支付方式 (可多选)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {paymentMeansOptions.map(means => (
              <label
                key={means.value}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${
                  f.applicantMeans.includes(means.value)
                    ? 'border-morandi-ocean bg-morandi-ocean/5'
                    : 'border-morandi-mist/30 hover:border-morandi-ocean/50'
                }`}
              >
                <input
                  type="checkbox"
                  value={means.value}
                  checked={f.applicantMeans.includes(means.value)}
                  onChange={() => handleApplicantMeans(means.value)}
                  className="w-3 h-3 text-morandi-ocean rounded"
                />
                <span className="text-xs">{means.label}</span>
              </label>
            ))}
          </div>
          {f.applicantMeans.includes('other') && (
            <div className="mt-2">
              <Input value={f.applicantMeansOther} onChange={(e) => updateStep5({ applicantMeansOther: e.target.value })} placeholder="请说明其他方式" />
            </div>
          )}
        </div>
      )}

      {f.fundingSource === 'sponsor' && (
        <div className="mt-4 p-4 bg-morandi-ocean/5 rounded-xl border border-morandi-ocean/20">
          <h3 className="font-medium text-morandi-deep mb-3 text-sm">赞助人支付信息</h3>
          
          <div className="mb-3">
            <label className="block text-sm text-morandi-mist mb-2">赞助人类型</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sponsorType" value="inviter" checked={f.sponsorType === 'inviter'} onChange={() => updateStep5({ sponsorType: 'inviter' })} className="w-4 h-4 text-morandi-ocean" />
                <span className="text-sm">邀请人或邀请方</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sponsorType" value="other" checked={f.sponsorType === 'other'} onChange={() => updateStep5({ sponsorType: 'other' })} className="w-4 h-4 text-morandi-ocean" />
                <span className="text-sm">其他赞助人</span>
              </label>
            </div>
          </div>

          {f.sponsorType === 'other' && (
            <div className="mb-3">
              <Input label="赞助人姓名" value={f.otherSponsorName} onChange={(e) => updateStep5({ otherSponsorName: e.target.value })} placeholder="请输入赞助人姓名" />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-sm text-morandi-mist mb-2">支付方式 (默认勾选"支付所有开支")</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${f.sponsorMeans.includes('cash') ? 'border-morandi-ocean bg-morandi-ocean/5' : 'border-morandi-mist/30'}`}>
                <input type="checkbox" checked={f.sponsorMeans.includes('cash')} onChange={() => handleSponsorMeans('cash')} className="w-3 h-3 text-morandi-ocean rounded" />
                <span className="text-xs">现金 (Cash)</span>
              </label>
              <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${f.sponsorMeans.includes('accommodationProvided') ? 'border-morandi-ocean bg-morandi-ocean/5' : 'border-morandi-mist/30'}`}>
                <input type="checkbox" checked={f.sponsorMeans.includes('accommodationProvided')} onChange={() => handleSponsorMeans('accommodationProvided')} className="w-3 h-3 text-morandi-ocean rounded" />
                <span className="text-xs">提供住宿</span>
              </label>
              <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${f.sponsorMeans.includes('allExpenses') ? 'border-morandi-ocean bg-morandi-ocean/5' : 'border-morandi-mist/30'}`}>
                <input type="checkbox" checked={f.sponsorMeans.includes('allExpenses')} onChange={() => handleSponsorMeans('allExpenses')} className="w-3 h-3 text-morandi-ocean rounded" />
                <span className="text-xs">支付所有开支</span>
              </label>
              <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${f.sponsorMeans.includes('prepaidTransport') ? 'border-morandi-ocean bg-morandi-ocean/5' : 'border-morandi-mist/30'}`}>
                <input type="checkbox" checked={f.sponsorMeans.includes('prepaidTransport')} onChange={() => handleSponsorMeans('prepaidTransport')} className="w-3 h-3 text-morandi-ocean rounded" />
                <span className="text-xs">预付交通</span>
              </label>
              <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${f.sponsorMeans.includes('sponsorOther') ? 'border-morandi-ocean bg-morandi-ocean/5' : 'border-morandi-mist/30'}`}>
                <input type="checkbox" checked={f.sponsorMeans.includes('sponsorOther')} onChange={() => handleSponsorMeans('sponsorOther')} className="w-3 h-3 text-morandi-ocean rounded" />
                <span className="text-xs">其他</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 6: 预览导出 - 完整信息展示
function Step6Preview() {
  const { formData, prevStep } = useSchengenVisaStore();
  const { step1, step2, step3, step4, step5 } = formData;

  // 关系选项映射
  const relationshipMap: Record<string, string> = {
    'spouse': '配偶',
    'parent': '父母',
    'friend': '朋友',
    'colleague': '同事',
    'other_relative': '其他亲属',
    'other': '其他'
  };

  const handleExport = () => {
    const companionRows = step3.companions.map((c, i) => `
      <tr><th>同行人${i + 1}姓名</th><td>${c.name}</td><th>同行人${i + 1}关系</th><td>${c.relationship ? relationshipMap[c.relationship] || c.relationship : ''} ${c.relationshipOther || ''}</td></tr>
      <tr><th>同行人${i + 1}护照号</th><td colspan="3">${c.passportNumber}</td></tr>
    `).join('');

    const content = `
      <html>
      <head>
        <meta charset="utf-8">
        <title>申根签证申请表</title>
        <style>
          body { font-family: 'Noto Sans SC', Arial, sans-serif; padding: 40px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f5f5f5; }
          .section { margin: 20px 0; }
          .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>申根签证申请表</h1>
        
        <div class="section">
          <div class="section-title">一、个人信息</div>
          <table>
            <tr><th>姓</th><td>${step1.surname}</td><th>名</th><td>${step1.givenName}</td></tr>
            <tr><th>出生日期</th><td>${step1.birthDate}</td><th>出生地</th><td>${step1.birthPlace}</td></tr>
            <tr><th>国籍</th><td>${step1.nationality}</td><th>性别</th><td>${step1.gender === 'male' ? '男' : '女'}</td></tr>
            <tr><th>婚姻状况</th><td>${step1.maritalStatus}</td><th>身份证号</th><td>${step1.idCard}</td></tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">二、证件信息</div>
          <table>
            <tr><th>护照号码</th><td>${step2.passportNumber}</td><th>护照类型</th><td>${step2.passportType}</td></tr>
            <tr><th>签发日期</th><td>${step2.passportIssueDate}</td><th>有效期至</th><td>${step2.passportExpiry}</td></tr>
            <tr><th>签发机关</th><td colspan="3">${step2.passportIssuer}</td></tr>
            <tr><th>住址</th><td colspan="3">${step2.address}</td></tr>
            <tr><th>电话</th><td>${step2.phone}</td><th>邮箱</th><td>${step2.email}</td></tr>
            ${step2.occupation === 'student' ? `
            <tr><th>学校名称</th><td colspan="3">${step2.schoolName}</td></tr>
            <tr><th>学校地址</th><td colspan="3">${step2.schoolAddress}</td></tr>
            <tr><th>学校电话</th><td colspan="3">${step2.schoolPhone}</td></tr>
            ` : ''}
          </table>
        </div>

        <div class="section">
          <div class="section-title">三、行程信息</div>
          <table>
            <tr><th>签证申请国</th><td>${step3.visaApplicationCountry}</td><th>首 Jeb国</th><td>${step3.firstEntry}</td></tr>
            <tr><th>入境日期</th><td>${step3.arrivalDate}</td><th>离境日期</th><td>${step3.departureDate}</td></tr>
            <tr><th>停留天数</th><td>${step3.stayDuration}</td><th>入境次数</th><td>${step3.entryType}</td></tr>
            <tr><th>目的地</th><td colspan="3">${step3.destinations.join(', ')}</td></tr>
            <tr><th>旅行目的</th><td colspan="3">${step3.tripPurpose.join(', ')}</td></tr>
            ${step3.hasCompanion ? `
            <tr><th colspan="4" style="background:#e0f2fe;">同行人信息</th></tr>
            ${companionRows}
            ` : ''}
          </table>
        </div>

        <div class="section">
          <div class="section-title">四、邀请/住宿信息</div>
          <table>
            ${step4.hasInviter === 'no' ? `
            <tr><th>酒店名称</th><td>${step4.hotelName}</td><th>酒店电话</th><td>${step4.hotelPhone}</td></tr>
            <tr><th>酒店地址</th><td colspan="3">${step4.hotelAddress}</td></tr>
            ` : step4.hasInviter === 'personal' ? `
            <tr><th>邀请人</th><td>${step4.inviterName}</td><th>邀请人电话</th><td>${step4.inviterPhone}</td></tr>
            <tr><th>邀请人地址</th><td colspan="3">${step4.inviterAddress}</td></tr>
            ` : `
            <tr><th>公司名称</th><td>${step4.orgName}</td><th>公司电话</th><td>${step4.orgPhone}</td></tr>
            <tr><th>公司地址</th><td colspan="3">${step4.orgAddress}</td></tr>
            <tr><th>联系人</th><td>${step4.orgContactName}</td><th>联系人电话</th><td>${step4.orgContactPhone}</td></tr>
            `}
          </table>
        </div>

        <div class="section">
          <div class="section-title">五、费用信息</div>
          <table>
            <tr><th>费用承担</th><td>${step5.fundingSource === 'applicant' ? '本人支付' : '赞助人支付'}</td><th>支付方式</th><td>${step5.fundingSource === 'applicant' ? step5.applicantMeans.join(', ') : step5.sponsorMeans.join(', ')}</td></tr>
          </table>
        </div>
      </body>
      </html>
    `;

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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-morandi-deep flex items-center">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-morandi-ocean/10 text-morandi-ocean rounded-lg text-sm mr-2">06</span>
          预览与导出
        </h2>
      </div>

      {/* 完整信息预览 */}
      <div className="bg-white border border-morandi-mist/30 rounded-xl p-6 max-h-[500px] overflow-y-auto">
        <h3 className="font-bold text-morandi-deep mb-3 text-sm">填写信息预览</h3>
        <p className="text-xs text-morandi-mist mb-4">请核对以下信息，确认无误后导出申请表</p>
        
        <div className="space-y-4 text-xs">
          {/* 个人信息 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-morandi-deep mb-2 border-b pb-1">一、个人信息</h4>
            <div className="grid grid-cols-2 gap-1 text-morandi-mist">
              <p>姓: {step1.surname}</p>
              <p>名: {step1.givenName}</p>
              <p>出生日期: {step1.birthDate}</p>
              <p>出生地: {step1.birthPlace}</p>
              <p>国籍: {step1.nationality}</p>
              <p>性别: {step1.gender === 'male' ? '男' : '女'}</p>
              <p>婚姻: {step1.maritalStatus}</p>
              <p>身份证: {step1.idCard}</p>
            </div>
          </div>

          {/* 证件信息 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-morandi-deep mb-2 border-b pb-1">二、证件信息</h4>
            <div className="grid grid-cols-2 gap-1 text-morandi-mist">
              <p>护照号: {step2.passportNumber}</p>
              <p>有效期至: {step2.passportExpiry}</p>
              <p>签发日期: {step2.passportIssueDate}</p>
              <p>签发机关: {step2.passportIssuer}</p>
              <p>职业: {step2.occupation}</p>
              {step2.occupation === 'student' && (
                <>
                  <p>学校: {step2.schoolName}</p>
                  <p>学校电话: {step2.schoolPhone}</p>
                </>
              )}
            </div>
          </div>

          {/* 行程信息 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-morandi-deep mb-2 border-b pb-1">三、行程信息</h4>
            <div className="grid grid-cols-2 gap-1 text-morandi-mist">
              <p>申请国: {step3.visaApplicationCountry}</p>
              <p>首 Jeb国: {step3.firstEntry}</p>
              <p>入境日期: {step3.arrivalDate}</p>
              <p>离境日期: {step3.departureDate}</p>
              <p>停留天数: {step3.stayDuration}</p>
              <p>旅行目的: {step3.tripPurpose.join(', ')}</p>
            </div>
            {step3.destinations.length > 0 && (
              <p className="mt-1">目的地: {step3.destinations.join(', ')}</p>
            )}
            {/* 同行人信息 */}
            {step3.hasCompanion && step3.companions.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <p className="font-medium">同行人:</p>
                {step3.companions.map((c, i) => (
                  <p key={i} className="ml-2">
                    {i + 1}. {c.name} - {c.relationship ? relationshipMap[c.relationship] || c.relationship : ''} {c.relationshipOther || ''} - 护照: {c.passportNumber}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 邀请/住宿 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-morandi-deep mb-2 border-b pb-1">四、邀请/住宿</h4>
            <div className="grid grid-cols-2 gap-1 text-morandi-mist">
              {step4.hasInviter === 'no' ? (
                <>
                  <p>酒店: {step4.hotelName}</p>
                  <p>电话: {step4.hotelPhone}</p>
                  <p className="col-span-2">地址: {step4.hotelAddress}</p>
                </>
              ) : step4.hasInviter === 'personal' ? (
                <>
                  <p>邀请人: {step4.inviterName}</p>
                  <p>电话: {step4.inviterPhone}</p>
                  <p className="col-span-2">地址: {step4.inviterAddress}</p>
                </>
              ) : (
                <>
                  <p>公司: {step4.orgName}</p>
                  <p>电话: {step4.orgPhone}</p>
                  <p className="col-span-2">地址: {step4.orgAddress}</p>
                  <p>联系人: {step4.orgContactName}</p>
                  <p>联系人电话: {step4.orgContactPhone}</p>
                </>
              )}
            </div>
          </div>

          {/* 费用信息 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-morandi-deep mb-2 border-b pb-1">五、费用信息</h4>
            <div className="grid grid-cols-2 gap-1 text-morandi-mist">
              <p>费用承担: {step5.fundingSource === 'applicant' ? '本人支付' : '赞助人支付'}</p>
              <p>支付方式: {step5.fundingSource === 'applicant' ? step5.applicantMeans.join(', ') : step5.sponsorMeans.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 按钮区域 - 两栏布局 */}
      <div className="flex gap-4 mt-6">
        <motion.button
          onClick={prevStep}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-morandi-deep rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回修改
        </motion.button>
        
        <motion.button
          onClick={handleExport}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-morandi-ocean to-morandi-blush text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          导出Word申请表
        </motion.button>
      </div>
    </div>
  );
}

// 主页面组件
export default function SchengenVisaPage() {
  const { currentStep, nextStep, prevStep } = useSchengenVisaStore();
  
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Personal />;
      case 2: return <Step2Passport />;
      case 3: return <Step3Travel />;
      case 4: return <Step4Invitation />;
      case 5: return <Step5Funding />;
      case 6: return <Step6Preview />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screenbg-gradient-to-br from-slate-50 via-morandi-cream to-morandi-blush">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 pt-24">
        {/* 页面标题 */}
        <div className="bg-white rounded-2xl shadow-lg py-4 px-6 mb-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-morandi-deep">申根签证填表助手</h1>
            <p className="text-morandi-mist text-xs mt-1">智能向导填写，一键生成标准申请表</p>
          </div>
        </div>
        
        {/* 主卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 lg:p-6">
          <StepIndicator />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
          
          {/* 导航按钮 */}
          {currentStep < 6 && (
            <div className="flex justify-between mt-6 pt-4 border-t border-morandi-mist/20">
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 1}
                whileHover={currentStep > 1 ? { scale: 1.02 } : {}}
                whileTap={currentStep > 1 ? { scale: 0.98 } : {}}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  currentStep === 1
                    ? 'bg-morandi-mist/20 text-morandi-mist cursor-not-allowed'
                    : 'bg-morandi-mist/10 text-morandi-deep hover:bg-morandi-mist/20'
                }`}
              >
                ← 上一步
              </motion.button>
              
              <motion.button
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-gradient-to-r from-morandi-ocean to-morandi-blush text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all"
              >
                下一步 →
              </motion.button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
