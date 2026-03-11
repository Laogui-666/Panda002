'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, X, Eye, Download, Loader2, Upload, 
  FileText, CheckCircle, RefreshCw, Languages
} from 'lucide-react';
import { 
  PROOF_DOCUMENT_TYPES, 
  EMPLOYMENT_PROOF_CN_TEMPLATE,
  EMPLOYMENT_PROOF_EN_TEMPLATE,
  fillProofTemplate,
  EmploymentProofFields
} from '@/lib/translation/proofTemplates';

// 字段配置
const EMPLOYMENT_FIELDS = [
  { key: 'COMPANY_NAME', label: '公司中文名称', labelEn: 'Company Name (CN)', type: 'text', required: true },
  { key: 'COMPANY_NAME_EN', label: '公司英文名称', labelEn: 'Company Name (EN)', type: 'text', required: true },
  { key: 'COMPANY_ADDRESS', label: '公司地址', labelEn: 'Company Address', type: 'text', required: true },
  { key: 'COMPANY_PHONE', label: '公司电话', labelEn: 'Company Phone', type: 'text', required: true },
  { key: 'EMPLOYEE_NAME', label: '员工姓名(中文)', labelEn: 'Employee Name (CN)', type: 'text', required: true, ocrSupported: true },
  { key: 'EMPLOYEE_NAME_EN', label: '员工姓名(拼音)', labelEn: 'Employee Name (Pinyin)', type: 'text', required: true },
  { key: 'PASSPORT_NUMBER', label: '护照号码', labelEn: 'Passport Number', type: 'text', required: true, ocrSupported: true },
  { key: 'DATE_OF_BIRTH', label: '出生日期', labelEn: 'Date of Birth', type: 'text', required: true },
  { key: 'POSITION', label: '职位', labelEn: 'Position', type: 'text', required: true },
  { key: 'MONTHLY_SALARY', label: '月薪(人民币)', labelEn: 'Monthly Salary (RMB)', type: 'text', required: true },
  { key: 'HIRE_DATE', label: '入职日期', labelEn: 'Hire Date', type: 'text', required: true },
  { key: 'LEAVE_START_DATE', label: '准假开始日期', labelEn: 'Leave Start Date', type: 'text', required: true },
  { key: 'LEAVE_END_DATE', label: '准假结束日期', labelEn: 'Leave End Date', type: 'text', required: true },
  { key: 'ISSUING_DATE', label: '开具日期', labelEn: 'Issuing Date', type: 'text', required: true },
  { key: 'DESTINATION', label: '目的地', labelEn: 'Destination', type: 'text', required: true },
  { key: 'EXPENSE_BEARER', label: '费用承担人', labelEn: 'Expense Bearer', type: 'select', required: true, 
    options: [
      { value: '本人', labelEn: 'himself/herself' },
      { value: '公司', labelEn: 'the company' }
    ]
  },
  { key: 'LEADER_NAME', label: '领导人姓名', labelEn: 'Leader Name', type: 'text', required: true },
  { key: 'LEADER_POSITION', label: '领导人职位', labelEn: 'Leader Position', type: 'text', required: true },
  { key: 'RECIPENT', label: '收件人', labelEn: 'Recipient', type: 'text', required: true, placeholder: 'XX国家使领馆' },
];

interface ProofDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateType?: string;
}

// 默认字段值
const getDefaultFields = (): EmploymentProofFields => ({
  COMPANY_NAME: '',
  COMPANY_NAME_EN: '',
  COMPANY_ADDRESS: '',
  COMPANY_PHONE: '',
  EMPLOYEE_NAME: '',
  EMPLOYEE_NAME_EN: '',
  PASSPORT_NUMBER: '',
  DATE_OF_BIRTH: '',
  POSITION: '',
  MONTHLY_SALARY: '',
  HIRE_DATE: '',
  LEAVE_START_DATE: '',
  LEAVE_END_DATE: '',
  ISSUING_DATE: new Date().toLocaleDateString('zh-CN'),
  DESTINATION: '欧洲',
  DESTINATION_OTHER: '',
  SCHENGEN_COUNTRY: '',
  EXPENSE_BEARER: '本人',
  EXPENSE_BEARER_OTHER: '',
  COMPANY_NATURE: '公司',
  GENDER: '男',
  LEADER_NAME: '',
  LEADER_POSITION: '',
  RECIPIENT: '',
});

const ProofDocumentModal: React.FC<ProofDocumentModalProps> = ({ 
  isOpen, 
  onClose, 
  templateType = 'PROOF_EMPLOYMENT' 
}) => {
  const [fields, setFields] = useState<EmploymentProofFields>(getDefaultFields());
  const [previewMode, setPreviewMode] = useState<'CN' | 'EN'>('CN');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 预览内容
  const previewHtml = useMemo(() => {
    const template = previewMode === 'CN' ? EMPLOYMENT_PROOF_CN_TEMPLATE : EMPLOYMENT_PROOF_EN_TEMPLATE;
    return fillProofTemplate(template.html, fields);
  }, [fields, previewMode]);

  // 处理字段变更
  const handleFieldChange = (key: keyof EmploymentProofFields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  // 处理护照上传并OCR识别
  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPassportFile(file);
    setIsUploading(true);
    
    try {
      // 1. 先上传文件到OSS
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadResult = await uploadRes.json();
      
      if (!uploadResult.success) {
        throw new Error('文件上传失败');
      }
      
      const fileUrl = uploadResult.url;
      
      // 2. 调用OCR识别API
      const ocrFormData = new FormData();
      ocrFormData.append('fileUrl', fileUrl);
      
      const ocrRes = await fetch('/api/ocr/passport', {
        method: 'POST',
        body: ocrFormData
      });
      const ocrResult = await ocrRes.json();
      
      if (ocrResult.success && ocrResult.data) {
        const passportData = ocrResult.data as { name?: string; passportNumber?: string; dateOfBirth?: string };
        // 自动填充识别的信息
        setFields(prev => ({
          ...prev,
          EMPLOYEE_NAME_EN: passportData.name || prev.EMPLOYEE_NAME_EN,
          PASSPORT_NUMBER: passportData.passportNumber || prev.PASSPORT_NUMBER,
          DATE_OF_BIRTH: passportData.dateOfBirth || prev.DATE_OF_BIRTH,
        }));
      }
    } catch (error) {
      console.error('OCR识别失败:', error);
      alert('护照识别失败，请手动填写信息');
    } finally {
      setIsUploading(false);
    }
  };

  // 生成PDF
  const generatePDF = async (isEnglish: boolean) => {
    setIsGenerating(true);
    
    try {
      const template = isEnglish ? EMPLOYMENT_PROOF_EN_TEMPLATE : EMPLOYMENT_PROOF_CN_TEMPLATE;
      const filledHtml = fillProofTemplate(template.html, fields);
      
      // 使用html2pdf生成PDF
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.createElement('div');
      element.innerHTML = filledHtml;
      document.body.appendChild(element);
      
      const opt = {
        margin: 10,
        filename: `在职证明_${isEnglish ? 'EN' : 'CN'}_${fields.EMPLOYEE_NAME || 'document'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };
      
      await html2pdf().set(opt).from(element).save();
      document.body.removeChild(element);
      
    } catch (error) {
      console.error('PDF生成失败:', error);
      alert('PDF生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex overflow-hidden">
        
        {/* 左侧：表单区域 */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Briefcase className="mr-3 text-morandi-ocean" />
              在职证明
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* 护照上传区域 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">上传护照自动识别</h3>
                <p className="text-sm text-gray-500">支持自动提取姓名、护照号、出生日期</p>
              </div>
              <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-600 transition-colors">
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 mr-2" />
                )}
                <span>{isUploading ? '识别中...' : '上传护照'}</span>
                <input 
                  type="file" 
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handlePassportUpload}
                />
              </label>
            </div>
          </div>

          {/* 表单字段 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">公司信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">公司中文名称 *</label>
                <input
                  type="text"
                  value={fields.COMPANY_NAME}
                  onChange={(e) => handleFieldChange('COMPANY_NAME', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：成都市辉瑞商贸有限公司"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">公司英文名称 *</label>
                <input
                  type="text"
                  value={fields.COMPANY_NAME_EN}
                  onChange={(e) => handleFieldChange('COMPANY_NAME_EN', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：Chengdu Huirui Trading Co., Ltd."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">公司地址 *</label>
                <input
                  type="text"
                  value={fields.COMPANY_ADDRESS}
                  onChange={(e) => handleFieldChange('COMPANY_ADDRESS', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">公司电话 *</label>
                <input
                  type="text"
                  value={fields.COMPANY_PHONE}
                  onChange={(e) => handleFieldChange('COMPANY_PHONE', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">员工信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">员工姓名(中文) *</label>
                <input
                  type="text"
                  value={fields.EMPLOYEE_NAME}
                  onChange={(e) => handleFieldChange('EMPLOYEE_NAME', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">员工姓名(拼音) *</label>
                <input
                  type="text"
                  value={fields.EMPLOYEE_NAME_EN}
                  onChange={(e) => handleFieldChange('EMPLOYEE_NAME_EN', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：Zhang San"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">护照号码 *</label>
                <input
                  type="text"
                  value={fields.PASSPORT_NUMBER}
                  onChange={(e) => handleFieldChange('PASSPORT_NUMBER', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">出生日期 *</label>
                <input
                  type="text"
                  value={fields.DATE_OF_BIRTH}
                  onChange={(e) => handleFieldChange('DATE_OF_BIRTH', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：1990-01-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">职位 *</label>
                <input
                  type="text"
                  value={fields.POSITION}
                  onChange={(e) => handleFieldChange('POSITION', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">月薪(人民币) *</label>
                <input
                  type="text"
                  value={fields.MONTHLY_SALARY}
                  onChange={(e) => handleFieldChange('MONTHLY_SALARY', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">入职日期 *</label>
                <input
                  type="text"
                  value={fields.HIRE_DATE}
                  onChange={(e) => handleFieldChange('HIRE_DATE', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：2020-01-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">开具日期 *</label>
                <input
                  type="text"
                  value={fields.ISSUING_DATE}
                  onChange={(e) => handleFieldChange('ISSUING_DATE', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">请假信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">准假开始日期 *</label>
                <input
                  type="text"
                  value={fields.LEAVE_START_DATE}
                  onChange={(e) => handleFieldChange('LEAVE_START_DATE', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：2025-01-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">准假结束日期 *</label>
                <input
                  type="text"
                  value={fields.LEAVE_END_DATE}
                  onChange={(e) => handleFieldChange('LEAVE_END_DATE', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：2025-01-10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">目的地 *</label>
                <input
                  type="text"
                  value={fields.DESTINATION}
                  onChange={(e) => handleFieldChange('DESTINATION', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：欧洲"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">费用承担人 *</label>
                <select
                  value={fields.EXPENSE_BEARER}
                  onChange={(e) => handleFieldChange('EXPENSE_BEARER', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                >
                  <option value="本人">本人 (himself/herself)</option>
                  <option value="公司">公司 (the company)</option>
                </select>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">领导信息</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">领导人姓名 *</label>
                <input
                  type="text"
                  value={fields.LEADER_NAME}
                  onChange={(e) => handleFieldChange('LEADER_NAME', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">领导人职位 *</label>
                <input
                  type="text"
                  value={fields.LEADER_POSITION}
                  onChange={(e) => handleFieldChange('LEADER_POSITION', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">收件人 *</label>
                <input
                  type="text"
                  value={fields.RECIPIENT}
                  onChange={(e) => handleFieldChange('RECIPIENT', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-morandi-ocean focus:border-transparent"
                  placeholder="例如：意大利驻上海总领事馆"
                />
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              onClick={() => generatePDF(false)}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-morandi-ocean text-white rounded-xl hover:bg-morandi-deep transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <FileText className="w-5 h-5 mr-2" />
              )}
              一键生成中文版
            </button>
            <button
              onClick={() => generatePDF(true)}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Languages className="w-5 h-5 mr-2" />
              )}
              一键生成英文版
            </button>
          </div>
        </div>

        {/* 右侧：预览区域 */}
        <div className="w-1/2 bg-gray-100 flex flex-col">
          {/* 预览工具栏 */}
          <div className="p-4 bg-white border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              实时预览
            </h3>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('CN')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  previewMode === 'CN' 
                    ? 'bg-white text-morandi-ocean shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                中文版
              </button>
              <button
                onClick={() => setPreviewMode('EN')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  previewMode === 'EN' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                英文版
              </button>
            </div>
          </div>

          {/* 预览内容 */}
          <div className="flex-1 overflow-auto p-8">
            <div 
              className="bg-white shadow-lg mx-auto"
              style={{ 
                width: '210mm', 
                minHeight: '297mm',
                padding: '20mm'
              }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofDocumentModal;
