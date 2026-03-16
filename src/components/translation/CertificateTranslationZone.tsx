'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, FileImage, FileText, X, Eye, Loader2, 
  CreditCard, BookOpen, Heart, Home, Briefcase, 
  Store, Calendar, Car, MapPin, CheckCircle
} from 'lucide-react';
import { CERTIFICATE_TYPES, getCertificateTemplateById } from '@/lib/translation/certificateTemplates';

// 图标映射
const iconMap: Record<string, React.ElementType> = {
  'credit-card': CreditCard,
  'book-open': BookOpen,
  'heart': Heart,
  'home': Home,
  'briefcase': Briefcase,
  'store': Store,
  'calendar': Calendar,
  'car': Car,
  'map-pin': MapPin,
};

interface CertificateModalProps {
  certificate: typeof CERTIFICATE_TYPES[0];
  isOpen: boolean;
  onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedHtml, setTranslatedHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setTranslatedHtml(null);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await response.json();
    
    if (result.success && result.url) {
      return result.url;
    } else {
      throw new Error(result.error || '文件上传失败');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    
    try {
      const url = await uploadFile(file);
      setFileUrl(url);
    } catch (err: any) {
      setError(err.message || '上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTranslate = async () => {
    if (!fileUrl) return;
    setIsTranslating(true);
    setError(null);
    
    try {
      const template = getCertificateTemplateById(certificate.id);
      if (!template) throw new Error('模板不存在');

      const formData = new FormData();
      formData.append('fileUrl', fileUrl);
      formData.append('templateHtml', template.html);
      formData.append('certificateType', certificate.id);

      const response = await fetch('/api/translate/certificate', { method: 'POST', body: formData });
      const result = await response.json();
      
      if (result.success) {
        setTranslatedHtml(result.translatedHtml);
      } else {
        throw new Error(result.error || '翻译失败');
      }
    } catch (err: any) {
      setError(err.message || '翻译失败，请重试');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownload = () => {
    if (!translatedHtml) return;
    
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${certificate.name} - Translation</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
      .container { max-width: 800px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">${translatedHtml}</div>
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${certificate.name}_翻译.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setFileUrl(null);
    setTranslatedHtml(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-morandi-ocean to-morandi-deep">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl">
              {React.createElement(iconMap[certificate.icon] || CreditCard, { className: "text-white", size: 24 })}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{certificate.name}</h3>
              <p className="text-sm text-white/70">{certificate.nameEn}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/20 text-white rounded-xl hover:bg-white/30">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          {error && (
            <div className="mb-6 flex items-center justify-center space-x-2 text-red-500 bg-red-50 py-3 px-4 rounded-xl">
              <span className="text-sm font-bold">{error}</span>
            </div>
)}

          {!file && (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-[2rem] p-16 text-center cursor-pointer hover:border-morandi-ocean hover:bg-morandi-ocean/5 transition-all">
              <div className="w-20 h-20 bg-morandi-ocean/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Upload className="text-morandi-ocean w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-morandi-deep mb-2">上传{certificate.name}</h3>
              <p className="text-gray-400">点击或拖拽上传文件（支持 PDF、JPG、PNG、Word）</p>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} />
            </div>
          )}

          {file && !translatedHtml && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-morandi-ocean/10 p-3 rounded-xl">
                      {file.type.includes('image') ? <FileImage className="text-morandi-ocean w-6 h-6" /> : <FileText className="text-morandi-ocean w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-bold text-morandi-deep">{file.name}</p>
                      <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={handleReset} className="p-2 text-gray-400 hover:text-red-500"><X size={20} /></button>
                </div>
              </div>

              {!fileUrl && (
                <button onClick={handleUpload} disabled={isUploading} className="w-full bg-morandi-ocean hover:bg-morandi-deep text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-70">
                  {isUploading ? <><Loader2 className="animate-spin" size={20} /><span>上传中...</span></> : <><Upload size={20} /><span>上传并开始翻译</span></>}
                </button>
              )}

              {fileUrl && !translatedHtml && (
                <button onClick={handleTranslate} disabled={isTranslating} className="w-full bg-morandi-ocean hover:bg-morandi-deep text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 disabled:opacity-70">
                  {isTranslating ? <><Loader2 className="animate-spin" size={20} /><span>智能翻译中...</span></> : <><CheckCircle size={20} /><span>开始翻译</span></>}
                </button>
              )}

              {isTranslating && (
                <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Loader2 className="animate-spin text-morandi-ocean" size={24} />
                    <span className="text-morandi-deep font-bold">智能识别翻译中...</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-morandi-ocean to-morandi-mist rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {translatedHtml && (
            <div className="space-y-6">
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
                <div className="preview-content" dangerouslySetInnerHTML={{ __html: translatedHtml }} />
              </div>
              <div className="flex space-x-4">
                <button onClick={handleDownload} className="flex-1 bg-morandi-ocean hover:bg-morandi-deep text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2">
                  <FileText size={20} /><span>下载 HTML</span>
                </button>
                <button onClick={handleReset} className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-xl font-bold">翻译其他文件</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .preview-content { font-family: Arial, sans-serif; color: #000; line-height: 1.4; }
        .preview-content table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .preview-content th, .preview-content td { border: 1px solid #000; padding: 10px; vertical-align: top; text-align: left; }
        .preview-content th { background-color: #f2f2f2; font-weight: bold; }
        .preview-content div { max-width: 100%; }
      `}</style>
    </div>
  );
};

const CertificateTranslationZone: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<typeof CERTIFICATE_TYPES[0] | null>(null);

  return (
    <div className="max-w-7xl mx-auto mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">证件翻译</h2>
        <p className="text-gray-500 text-base">标准化证件翻译，精准提取关键信息</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {CERTIFICATE_TYPES.map((cert) => {
          const IconComponent = iconMap[cert.icon] || CreditCard;
          return (
            <button key={cert.id} onClick={() => setSelectedCertificate(cert)} className="group bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-100 shadow-lg shadow-morandi-ocean/10 p-6 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-morandi-ocean/20 hover:border-morandi-ocean/30">
              <div className="w-14 h-14 bg-gradient-to-br from-morandi-ocean/10 to-morandi-mist/10 rounded-[1rem] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <IconComponent className="text-morandi-ocean w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-morandi-deep text-center leading-tight">{cert.name}</span>
            </button>
          );
        })}
      </div>

      {selectedCertificate && <CertificateModal certificate={selectedCertificate} isOpen={!!selectedCertificate} onClose={() => setSelectedCertificate(null)} />}
    </div>
  );
};

export default CertificateTranslationZone;
