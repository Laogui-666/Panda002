/**
 * 豆包 AI API 工具
 * 字节跳动 Doubao Seed 2.0 Pro
 */

import { config } from './config';

const DOUBAO_API_KEY = config.ai.doubaoApiKey;
const DOUBAO_MODEL = config.ai.doubaoModel || 'doubao-seed-2-0-pro-260215';
const DOUBAO_API_URL = config.ai.doubaoApiUrl || 'https://ark.cn-beijing.volces.com/api/v3/responses';

export interface DoubaoMessage {
  role: 'user' | 'assistant' | 'system';
  content: Array<{
    type: 'input_text' | 'input_image';
    text?: string;
    image_url?: string;
  }>;
}

export interface DoubaoRequest {
  model: string;
  input: DoubaoMessage[];
}

export interface DoubaoResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: Array<{
        type: 'output_text';
        text: string;
      }>;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 调用豆包 AI API
 */
export async function callDoubao(
  prompt: string,
  images?: string[]
): Promise<string> {
  if (!DOUBAO_API_KEY) {
    throw new Error('DOUBAO_API_KEY is not configured');
  }

  const content: Array<{ type: 'input_text' | 'input_image'; text?: string; image_url?: string }> = [];

  // 添加图片（如果有）
  if (images && images.length > 0) {
    for (const imageUrl of images) {
      content.push({
        type: 'input_image',
        image_url: imageUrl
      });
    }
  }

  // 添加文本
  content.push({
    type: 'input_text',
    text: prompt
  });

  const requestBody: DoubaoRequest = {
    model: DOUBAO_MODEL,
    input: [
      {
        role: 'user',
        content
      }
    ]
  };

  const response = await fetch(DOUBAO_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Doubao API error: ${response.status} - ${errorText}`);
  }

  const data: DoubaoResponse = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Doubao API');
  }

  const textContent = data.choices[0].message.content.find(
    (c) => c.type === 'output_text'
  );

  return textContent?.text || '';
}

/**
 * 简化版调用 - 仅文本
 */
export async function chat(prompt: string): Promise<string> {
  return callDoubao(prompt);
}

/**
 * 图片理解 - 分析图片内容
 */
export async function analyzeImage(imageUrl: string, question: string): Promise<string> {
  return callDoubao(question, [imageUrl]);
}
