/**
 * 文档翻译 API 路由
 * 服务端处理文档翻译请求
 * 使用 Qwen/Qwen3-VL-32B-Instruct 大模型
 * 支持图片和Word文档翻译
 */

import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// API 配置 - 使用 Qwen3-VL-32B 模型
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'Qwen/Qwen3-VL-32B-Instruct';

// 带重试的API调用
async function callWithRetry(fn: () => Promise<any>, maxRetries = 3): Promise<any> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.message?.includes('429') || 
                         error?.message?.includes('rate limit') ||
                         error?.message?.includes('quota');
      if (isRateLimit && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i + 1) * 1000;
        console.warn(`API限流，重试中...${waitTime}ms (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// 调用大模型API
async function callModel(apiKey: string, model: string, messages: any[]): Promise<string> {
  return callWithRetry(async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1,
        max_tokens: 10000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content?.trim() || '';
  });
}

// 提取HTML内容
const extractHtml = (raw: string): string => {
  if (raw.trim().startsWith('<!DOCTYPE') || raw.trim().startsWith('<html')) {
    return raw.trim();
  }
  
  const codeBlockMatch = raw.match(/```(?:html)?\s*([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) return codeBlockMatch[1].trim();
  
  const tagMatch = raw.match(/<div[\s\S]*<\/div>/);
  if (tagMatch) return tagMatch[0].trim();
  
  const bodyMatch = raw.match(/<body[\s\S]*<\/body>/);
  if (bodyMatch) return bodyMatch[0].trim();
  
  if (!raw.includes('<')) {
    return `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.8;">
${raw.split('\n').filter(line => line.trim()).map(line => `<p>${line}</p>`).join('\n')}
</div>`;
  }
  
  return raw.replace(/```html|```/g, '').trim();
};

// 翻译Prompt - 简化版（无模板识别）
const getTranslationPrompt = (targetLanguage: string): string => {
  return `保持原文档1：1布局排版帮我翻译成${targetLanguage}，确保所有内容全部必须翻译成${targetLanguage}没有遗漏，将翻译后的完整内容保持原文档1：1布局排版（包括表格）用html发我，你只需要发我翻译后的完整HTML代码不需要任何解释说明。不需要识别：背景、底纹、水印、照片、插图等元素`;
};

// 目标语言映射
const getTargetLanguageName = (targetLang: string): string => {
  const languageMap: Record<string, string> = {
    'zh': 'Chinese',
    'Chinese': 'Chinese',
    'en': 'English',
    'English': 'English',
    'ja': 'Japanese',
    'Japanese': 'Japanese',
    'ko': 'Korean',
    'fr': 'French',
    'French': 'French',
    'de': 'German',
    'es': 'Spanish',
    'Spanish': 'Spanish',
    'it': 'Italian',
    'Italian': 'Italian',
    'ru': 'Russian',
    'ar': 'Arabic'
  };
  return languageMap[targetLang] || 'English';
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = config.ai.siliconflowApiKey;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing API Key: SILICONFLOW_API_KEY not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    
    const fileUrl = formData.get('fileUrl') as string | null;
    const imageUrlsStr = formData.get('imageUrls') as string | null;
    const wordText = formData.get('wordText') as string | null;
    const file = formData.get('file') as File | null;
    const targetLang = formData.get('targetLang') as string || 'en';

    const targetLanguageName = getTargetLanguageName(targetLang);

    // 处理图片/PDF/Word文档翻译
    let imageDataList: string[] = [];
    let pdfUrl: string | null = null;
    let wordUrl: string | null = null;
    
    if (fileUrl) {
      // 判断fileUrl是PDF还是Word
      const lowerUrl = fileUrl.toLowerCase();
      if (lowerUrl.endsWith('.pdf') || lowerUrl.includes('.pdf')) {
        // PDF文件URL - 直接传给LLM
        pdfUrl = fileUrl;
      } else if (lowerUrl.endsWith('.docx') || lowerUrl.includes('.docx') || 
                 lowerUrl.endsWith('.doc') || lowerUrl.includes('.doc')) {
        // Word文件URL - 直接传给LLM
        wordUrl = fileUrl;
      } else {
        // 图片文件URL
        imageDataList = [fileUrl];
      }
    }
    else if (imageUrlsStr) {
      try {
        imageDataList = JSON.parse(imageUrlsStr);
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid imageUrls format' },
          { status: 400 }
        );
      }
    }
    else if (file) {
      if (file.type.startsWith('image/')) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = file.type || 'image/jpeg';
        imageDataList = [`data:${mimeType};base64,${base64}`];
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // 处理上传的PDF文件 - 需要先上传到OSS获取URL，然后让LLM直接读取PDF
        return NextResponse.json(
          { success: false, error: 'PDF文件请先上传到OSS，然后在fileUrl中传入OSS地址' },
          { status: 400 }
        );
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx')) {
        // 处理上传的Word文件 - 需要先上传到OSS获取URL，然后让LLM直接读取Word
        return NextResponse.json(
          { success: false, error: 'Word文件请先上传到OSS，然后在fileUrl中传入OSS地址' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { success: false, error: '请上传图片或Word文档(.docx)' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing fileUrl, imageUrls, or file' },
        { status: 400 }
      );
    }

    // 如果有PDF URL，直接传给LLM处理
    if (pdfUrl) {
      const userPrompt = getTranslationPrompt(targetLanguageName);
      
      const contentPart = {
        type: 'image_url',
        image_url: { url: pdfUrl }
      };

      try {
        const resultText = await callModel(
          apiKey,
          MODEL,
          [
            { role: 'user', content: [contentPart, { type: 'text', text: userPrompt }] }
          ]
        );
        
        if (!resultText || resultText.length < 10) {
          throw new Error('模型返回内容过短或为空');
        }
        
        if (resultText.includes('总结总结') || resultText.includes('同上同上')) {
          throw new Error('模型返回内容异常，请重试');
        }
        
        return NextResponse.json({
          success: true,
          translatedHtml: extractHtml(resultText),
          text: extractHtml(resultText),
          pageCount: 1,
          type: 'pdf'
        });
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: `PDF处理失败: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // 如果有Word URL，直接传给LLM处理
    if (wordUrl) {
      const userPrompt = getTranslationPrompt(targetLanguageName);
      
      const contentPart = {
        type: 'image_url',
        image_url: { url: wordUrl }
      };

      try {
        const resultText = await callModel(
          apiKey,
          MODEL,
          [
            { role: 'user', content: [contentPart, { type: 'text', text: userPrompt }] }
          ]
        );
        
        if (!resultText || resultText.length < 10) {
          throw new Error('模型返回内容过短或为空');
        }
        
        if (resultText.includes('总结总结') || resultText.includes('同上同上')) {
          throw new Error('模型返回内容异常，请重试');
        }
        
        return NextResponse.json({
          success: true,
          translatedHtml: extractHtml(resultText),
          text: extractHtml(resultText),
          pageCount: 1,
          type: 'word'
        });
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: `Word文档处理失败: ${error.message}` },
          { status: 500 }
        );
      }
    }

    // 逐页处理图片
    const translatedPages: string[] = [];
    const userPrompt = getTranslationPrompt(targetLanguageName);
    
    for (let i = 0; i < imageDataList.length; i++) {
      const imageData = imageDataList[i];
      
      let pagePrompt = userPrompt;
      if (imageDataList.length > 1) {
        pagePrompt = `${userPrompt}\n\n这是第 ${i + 1} 页，共 ${imageDataList.length} 页。`;
      }
      
      const contentPart = {
        type: 'image_url',
        image_url: { url: imageData }
      };

      try {
        const resultText = await callModel(
          apiKey,
          MODEL,
          [
            { role: 'user', content: [contentPart, { type: 'text', text: pagePrompt }] }
          ]
        );
        
        if (!resultText || resultText.length < 10) {
          throw new Error('模型返回内容过短或为空');
        }
        
        if (resultText.includes('总结总结') || resultText.includes('同上同上')) {
          throw new Error('模型返回内容异常，请重试');
        }
        
        translatedPages.push(extractHtml(resultText));
      } catch (error: any) {
        return NextResponse.json(
          { success: false, error: `处理第 ${i + 1} 页失败: ${error.message}` },
          { status: 500 }
        );
      }
    }

    const combinedHtml = translatedPages.join('\n<hr style="page-break-after: always; border: none; border-top: 1px dashed #ccc;"/>\n');

    return NextResponse.json({
      success: true,
      translatedHtml: combinedHtml,
      text: combinedHtml,
      pageCount: imageDataList.length,
      type: 'image'
    });

  } catch (error: any) {
    console.error('Document translation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
