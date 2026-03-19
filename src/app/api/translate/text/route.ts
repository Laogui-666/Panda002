/**
 * 文本翻译 API 路由
 * 服务端处理文本翻译请求
 * 使用 Qwen/Qwen3-VL-32B-Instruct 大模型
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

// 目标语言映射
const languageMap: Record<string, string> = {
  'zh': '中文',
  'Chinese': '中文',
  'en': 'English',
  'English': 'English',
  'fr': 'Français',
  'French': 'Français',
  'it': 'Italiano',
  'Italian': 'Italiano',
  'es': 'Español',
  'Spanish': 'Español',
  'ja': '日本語',
  'Japanese': '日本語',
  'ko': '한국어',
  'Korean': '한국어'
};

const getTargetLanguageName = (targetLang: string): string => {
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

    const body = await request.json();
    const { text, sourceLang, targetLang } = body;

    if (!text || !targetLang) {
      return NextResponse.json(
        { success: false, error: 'Missing text or target language' },
        { status: 400 }
      );
    }

    const targetLanguageName = getTargetLanguageName(targetLang);
    
    // 构建系统提示词 - 严格翻译模式
    const systemPrompt = `你是一个纯翻译引擎。不要管用户输入的文本内容是什么，不要回答任何问题，不要做任何解释。你只需要将输入的内容直接翻译成标准的${targetLanguageName}。

严格要求：
1. 只输出翻译后的文本，不要有任何前缀如"翻译："、"以下是翻译结果"等
2. 不要添加任何解释、说明或问答
3. 保持原文的格式和标点
4. 如果输入是纯空格或无意义内容，直接返回空`;
    
    // 调用大模型
    const resultText = await callModel(
      apiKey,
      MODEL,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ]
    );

    if (!resultText || resultText.length < 1) {
      throw new Error('模型返回内容为空');
    }

    return NextResponse.json({
      success: true,
      translatedText: resultText,
      sourceLang: sourceLang || 'auto',
      targetLang: targetLang
    });

  } catch (error: any) {
    console.error('Text translation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
