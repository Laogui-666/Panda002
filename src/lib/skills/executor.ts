/**
 * Skills 执行器 - 统一调度中心
 * 
 * 负责加载和执行各种 Skills 模块
 * 支持: xlsx, docx, pdf 等文档处理技能
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

// Skills 配置
const SKILLS_PATH = path.join(process.cwd(), 'skills');

// 可用的 Skills 列表
export const AVAILABLE_SKILLS = {
  xlsx: {
    name: 'xlsx',
    description: 'Excel 表格处理: 创建、编辑、分析 .xlsx/.xlsm/.csv 文件',
    script: 'skills/xlsx/scripts/recalc.py',
    actions: ['create', 'edit', 'analyze', 'export', 'import']
  },
  docx: {
    name: 'docx',
    description: 'Word 文档处理: 创建、编辑 .docx 文件',
    script: 'skills/docx/scripts/office/validate.py',
    actions: ['create', 'edit', 'generate', 'parse', 'convert']
  },
  pdf: {
    name: 'pdf',
    description: 'PDF 处理: 读取、提取文本/表格、合并、分割',
    script: 'skills/pdf/scripts/extract_form_structure.py',
    actions: ['read', 'extract', 'merge', 'split', 'convert']
  },
  'paddle-ocr': {
    name: 'paddle-ocr',
    description: 'PaddleOCR-VL 图片/文档识别: 布局分析、OCR文字提取、Markdown转换、精准排版翻译、PDF处理',
    script: 'skills/paddle_ocr/process_pdf.py',
    actions: [
      'analyze',           // 布局分析JSON
      'analyze_json',      // 同上
      'analyze_markdown',  // 转为Markdown
      'translate_zh2en',   // 中译英（保持排版）
      'translate_en2zh',   // 英译中（保持排版）
      'translate_zh2ja',   // 中译日（保持排版）
      'translate_zh2ko',   // 中译韩（保持排版）
      'translate_custom',  // 自定义Prompt翻译
      'process_pdf'        // PDF转图片OCR
    ]
  },
  'webapp-testing': {
    name: 'webapp-testing',
    description: 'Web 应用测试: Playwright 自动化测试',
    script: null, // Python 脚本，后续添加
    actions: ['test', 'screenshot', 'automate']
  },
  'web-artifacts-builder': {
    name: 'web-artifacts-builder',
    description: '前端工件构建: React 组件打包',
    script: null,
    actions: ['build', 'bundle']
  },
  'frontend-design': {
    name: 'frontend-design',
    description: '前端界面设计',
    script: null,
    actions: ['design', 'generate']
  },
  'doc-coauthoring': {
    name: 'doc-coauthoring',
    description: '文档协作: 结构化文档编写',
    script: null,
    actions: ['guide', 'write', 'review']
  },
  'brand-guidelines': {
    name: 'brand-guidelines',
    description: '品牌样式: Anthropic 品牌规范',
    script: null,
    actions: ['apply', 'generate']
  },
  'algorithmic-art': {
    name: 'algorithmic-art',
    description: '算法艺术: p5.js 生成艺术',
    script: null,
    actions: ['create', 'generate']
  }
} as const;

export type SkillName = keyof typeof AVAILABLE_SKILLS;

// 执行结果类型
export interface ExecutionResult {
  status: 'success' | 'error';
  skill: string;
  action: string;
  result?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    processedAt: string;
    processingTime: string;
  };
}

// 执行参数类型
export interface ExecuteParams {
  skill: SkillName;
  action: string;
  params?: Record<string, any>;
  options?: Record<string, any>;
}

/**
 * Skills 执行器类
 */
export class SkillsExecutor {
  private skillsPath: string;
  
  constructor(customSkillsPath?: string) {
    this.skillsPath = customSkillsPath || SKILLS_PATH;
  }
  
  /**
   * 检查 Skill 是否可用
   */
  isSkillAvailable(skillName: string): boolean {
    return skillName in AVAILABLE_SKILLS;
  }
  
  /**
   * 获取 Skill 信息
   */
  getSkillInfo(skillName: string) {
    return AVAILABLE_SKILLS[skillName as SkillName];
  }
  
  /**
   * 执行 Python 脚本
   */
  private async executePython(
    scriptPath: string, 
    args: string[] = []
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve, reject) => {
      const python = spawn('python', [scriptPath, ...args], {
        cwd: process.cwd(),
        shell: true
      });
      
      let stdout = '';
      let stderr = '';
      
      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      python.on('close', (code) => {
        resolve({
          stdout,
          stderr,
          exitCode: code || 0
        });
      });
      
      python.on('error', (err) => {
        reject(err);
      });
    });
  }
  
  /**
   * 执行 Skill
   */
  async execute(params: ExecuteParams): Promise<ExecutionResult> {
    const startTime = Date.now();
    const { skill, action, params: executeParams = {}, options = {} } = params;
    
    // 检查 Skill 是否存在
    if (!this.isSkillAvailable(skill)) {
      return {
        status: 'error',
        skill,
        action,
        error: {
          code: 'SKILL_NOT_FOUND',
          message: `Skill '${skill}' not found. Available: ${Object.keys(AVAILABLE_SKILLS).join(', ')}`
        },
        metadata: {
          processedAt: new Date().toISOString(),
          processingTime: `${Date.now() - startTime}ms`
        }
      };
    }
    
    const skillInfo = AVAILABLE_SKILLS[skill as SkillName];
    
    // 检查 Action 是否支持
    const supportedActions = skillInfo.actions as readonly string[];
    if (!supportedActions.includes(action)) {
      return {
        status: 'error',
        skill,
        action,
        error: {
          code: 'ACTION_NOT_SUPPORTED',
          message: `Action '${action}' not supported for skill '${skill}'. Available: ${supportedActions.join(', ')}`
        },
        metadata: {
          processedAt: new Date().toISOString(),
          processingTime: `${Date.now() - startTime}ms`
        }
      };
    }
    
    // 如果没有脚本，返回提示
    if (!skillInfo.script) {
      return {
        status: 'error',
        skill,
        action,
        error: {
          code: 'SCRIPT_NOT_IMPLEMENTED',
          message: `Skill '${skill}' execution script not yet implemented`
        },
        metadata: {
          processedAt: new Date().toISOString(),
          processingTime: `${Date.now() - startTime}ms`
        }
      };
    }
    
    try {
      // 构建脚本参数
      const scriptArgs = this.buildScriptArgs(skill, action, executeParams, options);
      
      // 执行脚本
      const scriptPath = path.join(process.cwd(), skillInfo.script);
      const result = await this.executePython(scriptPath, scriptArgs);
      
      if (result.exitCode !== 0) {
        return {
          status: 'error',
          skill,
          action,
          error: {
            code: 'EXECUTION_FAILED',
            message: result.stderr || 'Script execution failed',
            details: { exitCode: result.exitCode }
          },
          metadata: {
            processedAt: new Date().toISOString(),
            processingTime: `${Date.now() - startTime}ms`
          }
        };
      }
      
      // 解析输出
      let parsedResult;
      try {
        parsedResult = JSON.parse(result.stdout);
      } catch {
        parsedResult = { output: result.stdout };
      }
      
      return {
        status: 'success',
        skill,
        action,
        result: parsedResult,
        metadata: {
          processedAt: new Date().toISOString(),
          processingTime: `${Date.now() - startTime}ms`
        }
      };
      
    } catch (error: any) {
      return {
        status: 'error',
        skill,
        action,
        error: {
          code: 'EXECUTION_ERROR',
          message: error.message || 'Unknown error occurred'
        },
        metadata: {
          processedAt: new Date().toISOString(),
          processingTime: `${Date.now() - startTime}ms`
        }
      };
    }
  }
  
  /**
   * 构建脚本参数
   */
  private buildScriptArgs(
    skill: string, 
    action: string, 
    params: Record<string, any>,
    options: Record<string, any>
  ): string[] {
    const args: string[] = [];
    
    // 添加动作参数
    args.push('--action', action);
    
    // 添加参数
    if (Object.keys(params).length > 0) {
      args.push('--params', JSON.stringify(params));
    }
    
    // 添加选项
    if (Object.keys(options).length > 0) {
      args.push('--options', JSON.stringify(options));
    }
    
    return args;
  }
  
  /**
   * 获取所有可用的 Skills 列表
   */
  getAvailableSkills() {
    return Object.entries(AVAILABLE_SKILLS).map(([name, info]) => ({
      name,
      description: info.description,
      actions: info.actions
    }));
  }
}

// 导出单例
export const skillsExecutor = new SkillsExecutor();
