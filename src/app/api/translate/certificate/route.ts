/**
 * 证件翻译 API 路由
 * 使用 Qwen/Qwen3-VL-32B-Instruct 大模型
 * 根据模板提取证件信息并填充
 */

import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// API 配置
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
async function callModel(apiKey: string, messages: any[]): Promise<string> {
  return callWithRetry(async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
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

// 提取JSON内容
const extractJson = (raw: string): string => {
  // 尝试提取JSON块
  const jsonMatch = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch && jsonMatch[1]) return jsonMatch[1].trim();
  
  // 尝试提取纯JSON对象
  const objMatch = raw.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0].trim();
  
  return raw.trim();
};

// 证件翻译的Prompt
const getCertificatePrompt = (templateHtml: string, certificateType: string): string => {
  return `你是一个专业的证件信息提取助手。请仔细识别图片中的证件内容，提取所有关键信息，并按照以下HTML模板格式返回填充好的HTML。

【重要提示】：
1. 必须严格使用下面的HTML模板结构，只填充{{字段名}}部分
2. 不要修改模板的任何样式和布局
3. 如果某个字段在证件上看不到，请填写"-"或留空
4. 所有中文内容都需要翻译成英文
5. 日期格式统一为：YYYY-MM-DD（例如：1990-01-01）
6. 只返回填充好的HTML代码，不要有任何解释说明

【证件类型】：${certificateType}

【HTML模板】：
${templateHtml}

请直接返回填充好的完整HTML代码。`;
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
    
    const fileUrl = formData.get('fileUrl') as string;
    const templateHtml = formData.get('templateHtml') as string;
    const certificateType = formData.get('certificateType') as string;

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing fileUrl' },
        { status: 400 }
      );
    }

    if (!templateHtml) {
      return NextResponse.json(
        { success: false, error: 'Missing templateHtml' },
        { status: 400 }
      );
    }

    // 构建Prompt
    const prompt = getCertificatePrompt(templateHtml, certificateType);

    // 判断文件类型
    const lowerUrl = fileUrl.toLowerCase();
    const isPdf = lowerUrl.endsWith('.pdf') || lowerUrl.includes('.pdf');
    const isWord = lowerUrl.endsWith('.docx') || lowerUrl.includes('.docx') || 
                   lowerUrl.endsWith('.doc') || lowerUrl.includes('.doc');

    let contentPart: any;

    if (isPdf || isWord) {
      // PDF或Word文件
      contentPart = {
        type: 'image_url',
        image_url: { url: fileUrl }
      };
    } else {
      // 图片文件
      contentPart = {
        type: 'image_url',
        image_url: { url: fileUrl }
      };
    }

    try {
      const resultText = await callModel(
        apiKey,
        [
          { role: 'user', content: [contentPart, { type: 'text', text: prompt }] }
        ]
      );

      if (!resultText || resultText.length < 50) {
        throw new Error('模型返回内容过短或为空');
      }

      // 清理并提取HTML
      let translatedHtml = resultText;
      
      // 移除代码块标记
      translatedHtml = translatedHtml.replace(/```html|```/g, '').trim();
      
      // 确保有HTML内容
      if (!translatedHtml.includes('<div') && !translatedHtml.includes('<table')) {
        // 如果没有HTML，尝试包裹成div
        translatedHtml = `<div style="font-family: Arial, sans-serif; padding: 20px;">${translatedHtml}</div>`;
      }

      return NextResponse.json({
        success: true,
        translatedHtml: translatedHtml
      });

    } catch (error: any) {
      console.error('Certificate translation error:', error);
      return NextResponse.json(
        { success: false, error: `证件翻译失败: ${error.message}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Certificate translation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
