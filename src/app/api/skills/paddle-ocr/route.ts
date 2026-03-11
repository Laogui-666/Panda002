/**
 * PaddleOCR-VL 翻译 API
 * 
 * 用途: 文本翻译、文档OCR翻译
 * 
 * POST /api/skills/paddle-ocr
 * 
 * 请求体:
 * {
 *   action: "analyze" | "translate_zh2en" | "translate_en2zh" | ...
 *   imageUrl?: string (图片URL或base64)
 *   text?: string (纯文本)
 *   apiKey?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import PaddleOCRSkill, { TranslateMode } from '@/lib/skills/paddle-ocr';

// ============================================
// 辅助函数：将 Base64 转换为可访问的 URL
// ============================================

async function ensureImageUrl(imageData: string, apiUrl: string): Promise<string> {
  if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
    return imageData;
  }

  try {
    const uploadResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData })
    });

    if (!uploadResponse.ok) {
      throw new Error('Image upload failed');
    }

    const uploadResult = await uploadResponse.json();
    
    if (!uploadResult.success) {
      throw new Error(uploadResult.error || 'Upload failed');
    }

    return uploadResult.url;
  } catch (error: any) {
    console.error('[Upload] Error:', error);
    if (imageData.startsWith('data:')) {
      return imageData;
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, imageUrl, text, apiKey } = body;

    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: action'
      }, { status: 400 });
    }

    if (!imageUrl && !text) {
      return NextResponse.json({
        success: false,
        error: 'Either imageUrl or text must be provided'
      }, { status: 400 });
    }

    const skillApiKey = apiKey || process.env.SILICONFLOW_API_KEY;
    const skill = new PaddleOCRSkill({ apiKey: skillApiKey });

    let result;
    let processedImageUrl = imageUrl;

    if (imageUrl) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
      const uploadApiUrl = `${baseUrl}/api/upload/image`;
      
      processedImageUrl = await ensureImageUrl(imageUrl, uploadApiUrl);
      console.log('[OCR] Processed image URL:', processedImageUrl.substring(0, 100) + '...');
    }

    if (action === 'analyze') {
      if (processedImageUrl) {
        result = await skill.analyze(processedImageUrl);
      } else {
        return NextResponse.json({
          success: false,
          error: 'imageUrl is required for analyze action'
        }, { status: 400 });
      }
    } else if (action.startsWith('translate_')) {
      const mode = action.replace('translate_', '') as TranslateMode;
      
      if (processedImageUrl) {
        // 文档翻译 - 使用HTML模式保持排版
        result = await skill.translate(processedImageUrl, mode);
      } else if (text) {
        // 文本翻译 - 使用LLM
        const textApiKey = apiKey || process.env.SILICONFLOW_API_KEY;
        
        if (!textApiKey) {
          return NextResponse.json({
            success: false,
            error: 'API Key is required for text translation'
          }, { status: 400 });
        }
        
        result = await translateText(text, mode, textApiKey);
        
        if (!result.success) {
          return NextResponse.json({
            success: false,
            error: result.error || 'Text translation failed'
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: 'imageUrl or text is required for translate action'
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: `Unknown action: ${action}`
      }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('PaddleOCR API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    supportedModes: [
      { mode: 'analyze', description: 'OCR分析（不翻译）' },
      { mode: 'translate_zh2en', description: '中文→英文' },
      { mode: 'translate_en2zh', description: '英文→中文' },
      { mode: 'translate_zh2ja', description: '中文→日文' },
      { mode: 'translate_zh2ko', description: '中文→韩文' },
      { mode: 'translate_custom', description: '自定义翻译' },
    ]
  });
}

// ============================================
// 文本翻译函数 - 使用高质量LLM
// ============================================

async function translateText(
  text: string,
  mode: string,
  apiKey: string
): Promise<{ success: boolean; data?: any[]; html?: string; error?: string; message?: string }> {
  const langMap: Record<string, { source: string; target: string }> = {
    'zh2en': { source: 'Chinese', target: 'English' },
    'en2zh': { source: 'English', target: 'Chinese' },
    'zh2ja': { source: 'Chinese', target: 'Japanese' },
    'ja2zh': { source: 'Japanese', target: 'Chinese' },
    'zh2ko': { source: 'Chinese', target: 'Korean' },
    'ko2zh': { source: 'Korean', target: 'Chinese' },
    'en2ja': { source: 'English', target: 'Japanese' },
    'en2ko': { source: 'English', target: 'Korean' },
    'fr2zh': { source: 'French', target: 'Chinese' },
    'de2zh': { source: 'German', target: 'Chinese' },
    'es2zh': { source: 'Spanish', target: 'Chinese' },
    'ru2zh': { source: 'Russian', target: 'Chinese' },
  };

  const lang = langMap[mode] || { source: 'source', target: 'target' };

  // 改进的Prompt
  const prompt = `You are a professional translator. Translate the following ${lang.source} text to ${lang.target}.

REQUIREMENTS:
1. Only output the translated text, nothing else
2. Do not add any explanations or comments
3. Keep numbers, codes, dates, and technical terms exactly as they are
4. Preserve the original formatting and line breaks
5. If the text is already in ${lang.target}, return it unchanged

Text to translate:
${text}

Translation:`;

  try {
    console.log('[Translate] Calling LLM for text translation...');
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'THUDM/glm-4-9b-chat',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 8192,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Translate] API Error:', errorText);
      return { success: false, error: `API error: ${response.status} - ${errorText}` };
    }

    const result = await response.json();
    let translatedText = result.choices?.[0]?.message?.content?.trim();

    if (!translatedText) {
      return { success: false, error: 'No translation result' };
    }

    // 清理输出
    translatedText = translatedText
      .replace(/^```[\s\S]*?```$/, '')
      .replace(/^```$/, '')
      .trim();

    // 返回格式统一
    return {
      success: true,
      data: [{
        type: 'text',
        bbox: [0, 0, 0, 0],
        content: translatedText
      }],
      html: `<div class="translated-text">${translatedText.replace(/\n/g, '<br>')}</div>`,
      message: '文本翻译完成'
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
