/**
 * PaddleOCR-VL-1.5 技能包
 * 功能：识别图片/PDF截图中的排版布局，输出结构化 HTML
 * 支持翻译功能：精准排版还原 + 多语言翻译
 * API: SiliconFlow (https://api.siliconflow.cn)
 */

interface PaddleOCRConfig {
  apiKey?: string;
  modelName?: string;
}

export interface LayoutElement {
  type: 'text' | 'title' | 'table' | 'image' | 'equation' | 'header' | 'footer' | 'list';
  bbox: [number, number, number, number];
  content: string;
  page?: number;
}

export interface PaddleOCRResult {
  success: boolean;
  data?: LayoutElement[];
  html?: string;
  markdown?: string;
  error?: string;
}

// 翻译语言类型
export type TranslateMode = 
  | 'zh2en'
  | 'en2zh'
  | 'zh2ja'
  | 'ja2zh'
  | 'zh2ko'
  | 'ko2zh'
  | 'en2ja'
  | 'en2ko'
  | 'custom';

interface TranslateConfig {
  sourceLang?: string;
  targetLang?: string;
  customPrompt?: string;
}

export class PaddleOCRSkill {
  private apiKey: string;
  private modelName: string;
  private apiUrl = 'https://api.siliconflow.cn/v1/chat/completions';
  private defaultTemp = 0.3;
  private defaultMaxTokens = 8192;
  private defaultTimeout = 120000;

  constructor(config: PaddleOCRConfig = {}) {
    this.apiKey = config.apiKey || process.env.SILICONFLOW_API_KEY || '';
    this.modelName = config.modelName || 'PaddlePaddle/PaddleOCR-VL-1.5';
    
    if (!this.apiKey) {
      throw new Error('未提供 API Key。请传入 apiKey 参数或设置 SILICONFLOW_API_KEY 环境变量。');
    }
  }

  /**
   * 获取翻译语言名称
   */
  private getLangName(mode: TranslateMode): { source: string; target: string } {
    const langMap: Record<string, { source: string; target: string }> = {
      'zh2en': { source: '中文', target: '英文' },
      'en2zh': { source: '英文', target: '中文' },
      'zh2ja': { source: '中文', target: '日文' },
      'ja2zh': { source: '日文', target: '中文' },
      'zh2ko': { source: '中文', target: '韩文' },
      'ko2zh': { source: '韩文', target: '中文' },
      'en2ja': { source: '英文', target: '日文' },
      'en2ko': { source: '英文', target: '韩文' },
    };
    return langMap[mode] || { source: '源语言', target: '目标语言' };
  }

  /**
   * 构建分析Prompt - 强化版
   */
  private buildPrompt(mode: 'layout_json' | 'html' | 'markdown' = 'layout_json'): string {
    if (mode === 'html') {
      return `You are a document OCR specialist. Analyze this image and extract ALL text content with EXACT layout preservation.

CRITICAL RULES:
1. Extract EVERY text element exactly as it appears
2. Do NOT repeat or duplicate any content
3. Use HTML tags to preserve structure: <p>, <table>, <tr>, <td>, <th>, <ul>, <ol>, <li>, <h1>-<h6>, <div>, <span>
4. Keep numbers, dates, codes exactly as they appear
5. Output ONLY valid HTML, no explanations

Structure:
- Use <table> for tables with <tr>, <td>, <th>
- Use <ul>/<ol> for lists
- Use <p> for paragraphs
- Use headings tags for titles

Output format: <html>...</html>`;
    }
    
    if (mode === 'layout_json') {
      return `You are a document OCR specialist. Analyze this image carefully.

CRITICAL RULES:
1. Extract EVERY text element exactly as it appears
2. Do NOT repeat or duplicate any content - each piece of text should appear only ONCE
3. Output valid JSON array
4. Keep original order from top to bottom, left to right
5. Preserve all numbers, codes, dates exactly

Format: [{"type":"text","content":"exact text here","bbox":[x1,y1,x2,y2]}]

Output ONLY JSON array, no explanations.`;
    }
    
    return 'Extract text from this image and convert to Markdown format.';
  }

  /**
   * 构建翻译Prompt - 强化版
   */
  private buildTranslatePrompt(mode: TranslateMode, config?: TranslateConfig): string {
    if (mode === 'custom' && config?.customPrompt) {
      return config.customPrompt;
    }

    const lang = this.getLangName(mode);
    
    return `You are a professional document translator. Analyze this image and translate to ${lang.target}.

CRITICAL RULES:
1. Extract EVERY text element exactly as it appears
2. Do NOT repeat or duplicate any content - each piece of text should appear only ONCE
3. Translate all content to ${lang.target}
4. Preserve original document structure using HTML tags: <p>, <table>, <tr>, <td>, <th>, <ul>, <ol>, <li>, <h1>-<h6>
5. Keep numbers, dates, codes, IDs exactly as they are - DO NOT translate them
6. Maintain original formatting and layout

Output format: <html> translated content </html>

Do NOT output JSON. Use HTML to preserve layout.`;
  }

  /**
   * 去重和清理数据
   */
  private deduplicateAndClean(data: LayoutElement[]): LayoutElement[] {
    if (!data || !Array.isArray(data)) return [];
    
    const seen = new Set<string>();
    const result: LayoutElement[] = [];
    
    for (const item of data) {
      if (!item.content) continue;
      
      const cleaned = item.content.trim();
      if (!cleaned) continue;
      
      if (!cleaned.replace(/[\s\u3000]/g, '')) continue;
      
      const key = cleaned.toLowerCase();
      if (seen.has(key)) {
        console.log('[Deduplicate] Skipping duplicate:', cleaned.substring(0, 30));
        continue;
      }
      
      seen.add(key);
      result.push({
        ...item,
        content: cleaned
      });
    }
    
    console.log(`[Deduplicate] Input: ${data.length}, Output: ${result.length}`);
    return result;
  }

  /**
   * HTML转义
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }

  private postProcess(rawContent: string, mode: 'layout_json' | 'html' | 'markdown'): LayoutElement[] | string | null {
    let cleanText = rawContent.trim();
    
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\w*\n/, '').replace(/\n```$/, '').trim();
    }

    if (mode === 'html') {
      const htmlMatch = cleanText.match(/<html[^>]*>([\s\S]*)<\/html>/i) ||
                       cleanText.match(/<div[^>]*>([\s\S]*)<\/div>/i) ||
                       cleanText.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (htmlMatch) {
        return htmlMatch[1] || htmlMatch[0];
      }
      return cleanText;
    }

    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (mode === 'layout_json') {
          const deduplicated = this.deduplicateAndClean(parsed);
          return deduplicated;
        }
        return parsed;
      } catch (e) {
        // JSON解析失败
      }
    }

    if (mode === 'layout_json') {
      const lines = cleanText.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        const deduplicated = this.deduplicateAndClean(
          lines.map((content, index) => ({
            type: 'text' as const,
            bbox: [0, index * 20, 100, index * 20 + 20],
            content: content.trim()
          }))
        );
        return deduplicated;
      }
      return [];
    }
    
    return cleanText;
  }

  /**
   * 分析图片布局
   */
  async analyzeLayout(imageUrl: string, mode: 'layout_json' | 'html' | 'markdown' = 'layout_json'): Promise<PaddleOCRResult> {
    return this.analyzeWithPrompt(imageUrl, this.buildPrompt(mode), mode);
  }

  /**
   * 使用自定义Prompt分析图片
   */
  async analyzeWithCustomPrompt(imageUrl: string, customPrompt: string): Promise<PaddleOCRResult> {
    return this.analyzeWithPrompt(imageUrl, customPrompt, 'layout_json');
  }

  /**
   * 翻译图片文档（保持排版）
   */
  async translate(
    imageUrl: string, 
    mode: TranslateMode = 'zh2en',
    config?: TranslateConfig
  ): Promise<PaddleOCRResult> {
    const prompt = this.buildTranslatePrompt(mode, config);
    return this.analyzeWithPrompt(imageUrl, prompt, 'html');
  }

  /**
   * 内部方法：执行API调用
   */
  private async analyzeWithPrompt(
    imageUrl: string, 
    prompt: string,
    mode: 'layout_json' | 'html' | 'markdown'
  ): Promise<PaddleOCRResult> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const payload = {
      model: this.modelName,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      temperature: this.defaultTemp,
      max_tokens: this.defaultMaxTokens,
      stream: false
    };

    try {
      console.log('[PaddleOCR] Calling API with mode:', mode);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `API 请求失败: ${response.status} - ${errorText}`
        };
      }

      const result = await response.json();
      const rawContent = result.choices?.[0]?.message?.content;

      if (!rawContent) {
        return {
          success: false,
          error: 'API 返回内容为空'
        };
      }

      console.log('[PaddleOCR] Raw response length:', rawContent.length);
      const processedData = this.postProcess(rawContent, mode);

      if (mode === 'layout_json') {
        return {
          success: true,
          data: processedData as LayoutElement[]
        };
      } else if (mode === 'html') {
        return {
          success: true,
          html: processedData as string
        };
      } else {
        return {
          success: true,
          markdown: processedData as string
        };
      }

    } catch (error: any) {
      return {
        success: false,
        error: `发生异常: ${error.message}`
      };
    }
  }

  /**
   * 识别并返回JSON结构
   */
  async analyze(imageUrl: string): Promise<PaddleOCRResult> {
    return this.analyzeLayout(imageUrl, 'layout_json');
  }

  /**
   * 识别并返回HTML
   */
  async analyzeToHtml(imageUrl: string): Promise<PaddleOCRResult> {
    return this.analyzeLayout(imageUrl, 'html');
  }

  /**
   * 识别并返回Markdown
   */
  async analyzeToMarkdown(imageUrl: string): Promise<PaddleOCRResult> {
    return this.analyzeLayout(imageUrl, 'markdown');
  }

  /**
   * 中文翻译为英文（保持排版）
   */
  async translateZhToEn(imageUrl: string): Promise<PaddleOCRResult> {
    return this.translate(imageUrl, 'zh2en');
  }

  /**
   * 英文翻译为中文（保持排版）
   */
  async translateEnToZh(imageUrl: string): Promise<PaddleOCRResult> {
    return this.translate(imageUrl, 'en2zh');
  }
}

// 导出默认实例
let defaultInstance: PaddleOCRSkill | null = null;

export function getPaddleOCRSkill(apiKey?: string): PaddleOCRSkill {
  if (!defaultInstance) {
    defaultInstance = new PaddleOCRSkill({ apiKey });
  }
  return defaultInstance;
}

/**
 * 便捷函数：直接调用 OCR
 */
export async function analyzeImage(
  imageUrl: string,
  mode: 'json' | 'html' | 'markdown' = 'json',
  apiKey?: string
): Promise<PaddleOCRResult> {
  const skill = new PaddleOCRSkill({ apiKey });
  
  if (mode === 'markdown') {
    return skill.analyzeToMarkdown(imageUrl);
  } else if (mode === 'html') {
    return skill.analyzeToHtml(imageUrl);
  }
  return skill.analyze(imageUrl);
}

/**
 * 便捷函数：翻译图片文档
 */
export async function translateImage(
  imageUrl: string,
  mode: TranslateMode = 'zh2en',
  apiKey?: string
): Promise<PaddleOCRResult> {
  const skill = new PaddleOCRSkill({ apiKey });
  return skill.translate(imageUrl, mode);
}

export default PaddleOCRSkill;
