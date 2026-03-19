/**
 * AI 工具模块 - 统一出口
 * 
 * 支持:
 * - 豆包 AI (Doubao Seed 2.0 Pro) - 默认
 * 
 * 使用示例:
 * import { ai } from '@/lib/ai';
 * 
 * // 文本对话
 * const response = await ai.chat('你好');
 * 
 * // 图片理解
 * const analysis = await ai.analyzeImage('https://example.com/image.jpg', '描述这张图片');
 */

export { callDoubao, chat, analyzeImage, type DoubaoMessage, type DoubaoRequest, type DoubaoResponse } from './doubao';

/**
 * AI 工具类 - 提供更便捷的调用方式
 */
export const ai = {
  /**
   * 文本对话
   */
  async chat(prompt: string): Promise<string> {
    const { chat } = await import('./doubao');
    return chat(prompt);
  },

  /**
   * 图片理解
   */
  async analyzeImage(imageUrl: string, question: string): Promise<string> {
    const { analyzeImage } = await import('./doubao');
    return analyzeImage(imageUrl, question);
  },

  /**
   * 通用调用
   */
  async call(prompt: string, images?: string[]): Promise<string> {
    const { callDoubao } = await import('./doubao');
    return callDoubao(prompt, images);
  }
};
