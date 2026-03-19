'use client';

import React, { useState } from 'react';
import { Languages, ArrowLeftRight, Loader2, Copy, Check, Sparkles, X } from 'lucide-react';

const LANGUAGES = [
  { value: 'auto', label: '自动识别', labelEn: 'Auto' },
  { value: 'zh', label: '中文', labelEn: 'Chinese' },
  { value: 'en', label: '英语', labelEn: 'English' },
  { value: 'fr', label: '法语', labelEn: 'French' },
  { value: 'it', label: '意大利语', labelEn: 'Italian' },
  { value: 'es', label: '西班牙语', labelEn: 'Spanish' },
  { value: 'ja', label: '日语', labelEn: 'Japanese' }
];

const TextTranslationZone: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);
    setOutputText('');
    try {
      const response = await fetch('/api/translate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, sourceLang, targetLang })
      });
      const result = await response.json();
      if (result.success) {
        setOutputText(result.translatedText);
      } else {
        setOutputText(`翻译失败: ${result.error}`);
      }
    } catch (error: any) {
      setOutputText(`翻译请求失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return;
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    if (outputText) {
      setInputText(outputText);
      setOutputText('');
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleClear = () => {
    setInputText('');
  };

  const targetLanguages = LANGUAGES.filter(l => l.value !== 'auto');

  return (
    <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-[3rem] border border-slate-100 shadow-xl shadow-morandi-ocean/10 p-8 mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-morandi-ocean/10 p-2 rounded-xl text-morandi-ocean">
            <Languages size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-morandi-deep">文本翻译</h2>
            <p className="text-xs text-gray-400">支持多语言互译</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
          <Sparkles size={14} className="text-morandi-ocean" />
          <span>智能识别 · 精准翻译</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-morandi-ocean/30 transition-all"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label} ({lang.labelEn})</option>
          ))}
        </select>
        <button
          onClick={handleSwapLanguages}
          disabled={sourceLang === 'auto'}
          className={`p-2.5 rounded-xl transition-all ${sourceLang === 'auto' ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-morandi-ocean/10 text-morandi-ocean hover:bg-morandi-ocean/20 active:scale-95'}`}
        >
          <ArrowLeftRight size={18} />
        </button>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-morandi-ocean/30 transition-all"
        >
          {targetLanguages.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label} ({lang.labelEn})</option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim() || isLoading}
          className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all shadow-lg ${
            inputText.trim() && !isLoading ? 'bg-morandi-ocean text-white hover:bg-morandi-deep active:scale-95 shadow-morandi-ocean/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? <><Loader2 size={16} className="animate-spin" /><span>翻译中...</span></> : <><Languages size={16} /><span>开始翻译</span></>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">源文本</label>
            <button
              onClick={handleClear}
              disabled={!inputText}
              className={`flex items-center space-x-1 text-xs font-medium transition-all ${inputText ? 'text-gray-400 hover:text-red-500' : 'text-gray-200 cursor-not-allowed'}`}
            >
              <X size={12} />
              <span>清空</span>
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请输入需要翻译的文本..."
            className="flex-1 min-h-[200px] bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-morandi-ocean/30 focus:border-transparent resize-none transition-all"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">翻译结果</label>
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className={`flex items-center space-x-1 text-xs font-medium transition-all ${outputText ? 'text-morandi-ocean hover:text-morandi-deep' : 'text-gray-300 cursor-not-allowed'}`}
            >
              {copied ? <><Check size={12} /><span>已复制</span></> : <><Copy size={12} /><span>复制</span></>}
            </button>
          </div>
          <div className="flex-1 min-h-[200px] bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 placeholder-gray-400 overflow-auto resize-none">
            {outputText || '翻译结果将显示在这里...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextTranslationZone;
