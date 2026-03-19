/**
 * Qwen 翻译服务
 * AI 驱动层 - 使用 Qwen/Qwen3.5-397B-A17B 模型进行文档翻译和OCR识别
 */

import { getTemplateCatalog, TEMPLATE_REGISTRY } from './templates';
import { TranslationType, TranslateResponse } from '@/types/translation';

// API 配置
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'Qwen/Qwen3.5-397B-A17B';

// 认证翻译的宣誓词页脚
const CERTIFICATION_FOOTER_HTML = (date: string) => `
  <div class="certification-footer" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #000; font-family: Arial, sans-serif; font-size: 11px; text-align: left; width: 100%;">
    <p>I, <strong>[Certified Translator]</strong>, confirm this is a true and accurate translation of the original document.</p>
    <p>Date of Translation: ${date}</p>
    <p>Certified Translation Seal:</p>
    <div style="border: 2px solid #000; padding: 10px; display: inline-block; margin-top: 10px;">
      <div style="font-weight: bold;">CERTIFIED TRANSLATION</div>
      <div>Translation Service Provider</div>
    </div>
  </div>
`;

// 获取 API Key
const getApiKey = () => process.env.SILICONFLOW_API_KEY;

// 文件转 Base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 从 HTML 中提取内容
const extractHtml = (raw: string): string => {
  // 尝试提取代码块
  const codeBlockMatch = raw.match(/```(?:html)?\s*([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) return codeBlockMatch[1].trim();
  
  // 尝试提取 div 标签
  const tagMatch = raw.match(/<div[\s\S]*<\/div>/);
  if (tagMatch) return tagMatch[0].trim();
  
  // 尝试提取 body 标签
  const bodyMatch = raw.match(/<body[\s\S]*<\/body>/);
  if (bodyMatch) return bodyMatch[0].trim();
  
  // 清理并返回
  return raw.replace(/```html|```/g, '').trim();
};

// 获取目标语言名称
const getTargetLanguageName = (targetLang: string): string => {
  const languageMap: Record<string, string> = {
    'zh': 'Chinese',
    'en': 'English',
    'ja': 'Japanese',
    'ko': 'Korean',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish',
    'it': 'Italian',
    'ru': 'Russian',
    'ar': 'Arabic'
  };
  return languageMap[targetLang] || 'English';
};

/**
 * 处理文档翻译
 * @param file 文件对象
 * @param targetLang 目标语言代码
 * @param translationType 翻译类型
 */
export const processDocument = async (
  file: File, 
  targetLang: string = 'en',
  translationType: TranslationType = TranslationType.NORMAL
): Promise<TranslateResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'Missing API Key' };
  }

  let contentPart: any;

  // 1. 文件预处理
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.type === 'application/msword') {
    // Word 文件 - 使用 mammoth 提取文本
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    contentPart = { 
      type: 'text', 
      text: `[DOCUMENT CONTENT START]\n${result.value}\n[DOCUMENT CONTENT END]` 
    };
  } else {
    // 图片或 PDF - 转 Base64
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || 'image/jpeg';
    contentPart = {
      type: 'image_url',
      image_url: { url: `data:${mimeType};base64,${base64Data}` }
    };
  }

  const catalog = getTemplateCatalog();
  const targetLanguageName = getTargetLanguageName(targetLang);

  // 2. 核心 Prompt 构造
  const prompt = `
### SYSTEM ROLE: HIGH-SPEED STRUCTURAL TRANSLATION ENGINE ###
Your mission is to perform high-fidelity document translation by matching input content to standardized structural frameworks.
Target Language: ${targetLanguageName}

### CRITICAL PRIORITY: ACCURACY & ADAPTABILITY ###
1. Identify the document type from the uploaded file.
2. Match with Template Catalog: ${JSON.stringify(catalog)}
3. DOCUMENT-SPECIFIC RULES:
   - If it's an "Identity Card", strictly use the ID_CARD template structure.
   - If it's a "Business License", strictly use the BUSINESS_LICENSE template structure.
   - If it's a "Passport", strictly use the PASSPORT template structure.
   - If it's a "Driver License", strictly use the DRIVER_LICENSE template structure.
   - If it's a "Property Certificate", strictly use the PROPERTY_CERTIFICATE template structure.
   - If it's a "Marriage Certificate", strictly use the MARRIAGE_CERTIFICATE template structure.
   - If it's a "Birth Certificate", strictly use the BIRTH_CERTIFICATE template structure.
   - For any other general text documents, use the GENERAL_DOCUMENT template.
   - If the document has a layout that differs from the standard template, create a custom HTML layout that mirrors the ACTUAL source document.
   - Ensure EVERY piece of text, seal, and date on the source document is translated and included. Accuracy is the highest priority.

### PHASE 2: OUTPUT ###
Use the FULL HTML structure from the matched template. Fill in the {{VARIABLES}} with translated content.
Repository: ${JSON.stringify(TEMPLATE_REGISTRY)}

Return ONLY the final HTML code. No markdown, no explanations.
`;

  // 3. 调用 Qwen 大模型
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'You area professional document translation engine. You must output ONLY valid HTML code, no markdown, no explanations.' 
          },
          { 
            role: 'user', 
            content: [
              contentPart,
              { type: 'text', text: prompt }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 8192,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return { success: false, error: `API Error: ${response.status}` };
    }

    const result = await response.json();
    let html = extractHtml(result.choices?.[0]?.message?.content || '');

    if (!html) {
      return { success: false, error: 'Translation service returned empty result' };
    }

    // 4. 附加认证页脚
    if (translationType === TranslationType.CERTIFIED) {
      const formattedDate = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      const footer = CERTIFICATION_FOOTER_HTML(formattedDate);
      if (html.includes('</div>')) {
        const lastIndex = html.lastIndexOf('</div>');
        html = html.substring(0, lastIndex) + footer + html.substring(lastIndex);
      } else {
        html += footer;
      }
    }

    // 提取纯文本用于预览
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    return {
      success: true,
      html,
      text
    };
  } catch (error: any) {
    console.error('Translation error:', error);
    return { success: false, error: error.message || 'Translation failed' };
  }
};

/**
 * 处理纯文本翻译
 * @param text 文本内容
 * @param targetLang 目标语言
 * @param preserveHtml 是否保留HTML格式
 */
export const translateText = async (
  text: string,
  targetLang: string = 'en',
  preserveHtml: false = false
): Promise<TranslateResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'Missing API Key' };
  }

  const targetLanguageName = getTargetLanguageName(targetLang);

  let prompt: string;
  if (preserveHtml) {
    prompt = `请将以下HTML文档内容翻译成${targetLanguageName}，保持HTML标签和排版结构不变。只翻译标签内的文本内容，保留所有HTML标签。\n\n${text}\n\n翻译结果：`;
  } else {
    prompt = `请将以下文本翻译成${targetLanguageName}。\n\n要求：\n1. 首先识别原文的语言\n2. 确保翻译准确完整，忠实原文\n3. 确保语法正确，无拼写错误\n4. 保持原文的风格和语气\n5. 数字、日期、代码保持原样\n6. 只输出翻译结果，不要添加任何解释\n\n原文：\n${text}\n\n翻译结果：`;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a professional translator. Output only the translation result, no explanations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 8192,
        stream: false
      })
    });

    if (!response.ok) {
      return { success: false, error: `API Error: ${response.status}` };
    }

    const result = await response.json();
    let translatedText = result.choices?.[0]?.message?.content?.trim();

    if (!translatedText) {
      return { success: false, error: 'Translation service returned empty result' };
    }

    // 清理输出
    translatedText = translatedText
      .replace(/^```[\s\S]*?```$/, '')
      .replace(/^```$/, '')
      .replace(/^翻译结果：/gi, '')
      .replace(/^翻译：/gi, '')
      .trim();

    const html = preserveHtml ? translatedText : 
      translatedText.split(/\n\n+/).map((p: string) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

    return {
      success: true,
      html,
      text: translatedText
    };
  } catch (error: any) {
    console.error('Translation error:', error);
    return { success: false, error: error.message || 'Translation failed' };
  }
};

/**
 * 处理图片翻译（直接发送图片进行OCR+翻译）
 * @param imageBase64 图片Base64
 * @param targetLang 目标语言
 */
export const translateImage = async (
  imageBase64: string,
  targetLang: string = 'en',
  width?: number,
  height?: number
): Promise<TranslateResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'Missing API Key' };
  }

  const targetLanguageName = getTargetLanguageName(targetLang);
  const catalog = getTemplateCatalog();

  const prompt = `
### SYSTEM ROLE: HIGH-SPEED STRUCTURAL TRANSLATION ENGINE ###
Your mission is to perform high-fidelity document translation by matching input content to standardized structural frameworks.
Target Language: ${targetLanguageName}

### CRITICAL PRIORITY: ACCURACY & ADAPTABILITY ###
1. Identify the document type from the uploaded image.
2. Match with Template Catalog: ${JSON.stringify(catalog)}
3. DOCUMENT-SPECIFIC RULES:
   - If it's an "Identity Card", strictly use the ID_CARD template structure.
   - If it's a "Business License", strictly use the BUSINESS_LICENSE template structure.
   - If it's a "Passport", strictly use the PASSPORT template structure.
   - If it's a "Driver License", strictly use the DRIVER_LICENSE template structure.
   - If it's a "Property Certificate", strictly use the PROPERTY_CERTIFICATE template structure.
   - If it's a "Marriage Certificate", strictly use the MARRIAGE_CERTIFICATE template structure.
   - If it's a "Birth Certificate", strictly use the BIRTH_CERTIFICATE template structure.
   - For any other general text documents, use the GENERAL_DOCUMENT template.
   - If the document has a layout that differs from the standard template, create a custom HTML layout that mirrors the ACTUAL source document.
   - Ensure EVERY piece of text, seal, and date on the source document is translated and included. Accuracy is the highest priority.

### PHASE 2: OUTPUT ###
Use the FULL HTML structure from the matched template. Fill in the {{VARIABLES}} with translated content.
Repository: ${JSON.stringify(TEMPLATE_REGISTRY)}

Return ONLY the final HTML code. No markdown, no explanations.
`;

  try {
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional document translation engine. You must output ONLY valid HTML code, no markdown, no explanations.' 
          },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 8192,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return { success: false, error: `API Error: ${response.status}` };
    }

    const result = await response.json();
    let html = extractHtml(result.choices?.[0]?.message?.content || '');

    if (!html) {
      return { success: false, error: 'Translation service returned empty result' };
    }

    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    return {
      success: true,
      html,
      text
    };
  } catch (error: any) {
    console.error('Translation error:', error);
    return { success: false, error: error.message || 'Translation failed' };
  }
};

export default {
  processDocument,
  translateText,
  translateImage
};
