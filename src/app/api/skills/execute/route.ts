/**
 * Skills 执行 API
 * 
 * 统一入口: POST /api/skills/execute
 * 
 * 请求体:
 * {
 *   skill: "xlsx" | "docx" | "pdf",
 *   action: "create" | "edit" | "export" | ...
 *   params: { ... },
 *   options: { ... }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { skillsExecutor, AVAILABLE_SKILLS, type SkillName } from '@/lib/skills/executor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skill, action, params = {}, options = {} } = body;
    
    // 验证必需参数
    if (!skill || !action) {
      return NextResponse.json({
        status: 'error',
        error: {
          code: 'INVALID_REQUEST',
          message: 'Missing required parameters: skill and action'
        }
      }, { status: 400 });
    }
    
    // 验证 skill 是否有效
    if (!skillsExecutor.isSkillAvailable(skill)) {
      return NextResponse.json({
        status: 'error',
        error: {
          code: 'SKILL_NOT_FOUND',
          message: `Skill '${skill}' not found`,
          availableSkills: skillsExecutor.getAvailableSkills().map(s => s.name)
        }
      }, { status: 404 });
    }
    
    // 执行 Skill
    const result = await skillsExecutor.execute({
      skill: skill as SkillName,
      action,
      params,
      options
    });
    
    // 返回结果
    return NextResponse.json(result, {
      status: result.status === 'success' ? 200 : 400
    });
    
  } catch (error: any) {
    console.error('Skills execution error:', error);
    return NextResponse.json({
      status: 'error',
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Internal server error'
      }
    }, { status: 500 });
  }
}

/**
 * GET /api/skills/execute
 * 
 * 获取可用的 Skills 列表
 */
export async function GET() {
  const skills = skillsExecutor.getAvailableSkills();
  
  return NextResponse.json({
    status: 'success',
    skills,
    total: skills.length,
    message: 'Available skills for execution'
  });
}
