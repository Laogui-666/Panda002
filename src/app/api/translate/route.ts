/**
 * 翻译 API 路由
 * 服务端处理翻译请求，保护 API Key
 */

import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// API 配置 - 使用腾讯混元翻译模型
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'tencent/Hunyuan-MT-7B';

// 目标语言映射
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

// 从响应中提取 HTML
const extractHtml = (raw: string): string => {
  const codeBlockMatch = raw.match(/```(?:html)?\s*([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) return codeBlockMatch[1].trim();
  
  const tagMatch = raw.match(/<div[\s\S]*<\/div>/);
  if (tagMatch) return tagMatch[0].trim();
  
  const bodyMatch = raw.match(/<body[\s\S]*<\/body>/);
  if (bodyMatch) return bodyMatch[0].trim();
  
  return raw.replace(/```html|```/g, '').trim();
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

    const body = await request.json();
    const { text, targetLang, type = 'text' } = body;

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Missing text content' },
        { status: 400 }
      );
    }

    const targetLanguageName = getTargetLanguageName(targetLang || 'en');

    // 简洁翻译提示词：直接翻译，不添加任何解释
    const prompt = `Translate the following text to ${targetLanguageName}. Output only the translated text, nothing else.\n\n${text}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a professional translator. Translate the given text accurately. Output ONLY the translated text, no explanations, no comments, no additional text.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 8192,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return NextResponse.json(
        { success: false, error: `API Error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    let translatedText = result.choices?.[0]?.message?.content?.trim();

    if (!translatedText) {
      return NextResponse.json(
        { success: false, error: 'Translation service returned empty result' },
        { status: 500 }
      );
    }

    // 简单清理输出 - 只去除代码块标记
    translatedText = translatedText
      .replace(/^```[\s\S]*?```$/, '')
      .replace(/^```$/, '')
      .trim();

    const html = type === 'html' ? translatedText : 
      translatedText.split(/\n\n+/).map((p: string) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

    return NextResponse.json({
      success: true,
      html,
      text: translatedText
    });

  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
