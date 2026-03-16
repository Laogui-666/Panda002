/**
 * 租户(公司)管理 API
 * 
 * 超级管理员API，用于管理所有公司
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getTenantList, 
  getTenantById, 
  createTenant, 
  updateTenant, 
  updateTenantStatus,
  deleteTenant,
  getTenantUserCount,
  getTenantOrderCount
} from '@/lib/erp/dao/tenant';

// 获取租户列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const keyword = searchParams.get('keyword') || '';
    const status = searchParams.get('status') || '';

    const { list, total } = await getTenantList({
      page,
      pageSize,
      keyword: keyword || undefined,
      status: status || undefined,
    });

    // 为每个租户添加用户数和订单数
    const listWithStats = await Promise.all(
      list.map(async (tenant) => {
        const userCount = await getTenantUserCount(tenant.id);
        const orderCount = await getTenantOrderCount(tenant.id);
        return {
          ...tenant,
          userCount,
          orderCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        list: listWithStats,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('获取租户列表错误:', error);
    return NextResponse.json(
      { success: false, message: '获取租户列表失败' },
      { status: 500 }
    );
  }
}

// 创建租户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      tenant_name, 
      tenant_key, 
      contact_person, 
      contact_phone, 
      contact_email,
      subscription_plan,
      max_users 
    } = body;

    // 验证必填字段
    if (!tenant_name || !tenant_key) {
      return NextResponse.json(
        { success: false, message: '公司名称和标识不能为空' },
        { status: 400 }
      );
    }

    // 验证tenant_key格式（只能包含字母数字下划线）
    if (!/^[a-zA-Z0-9_]+$/.test(tenant_key)) {
      return NextResponse.json(
        { success: false, message: '公司标识只能包含字母、数字和下划线' },
        { status: 400 }
      );
    }

    const id = await createTenant({
      tenant_name,
      tenant_key,
      contact_person,
      contact_phone,
      contact_email,
      subscription_plan,
      max_users,
    });

    return NextResponse.json({
      success: true,
      message: '公司创建成功',
      data: { id },
    });
  } catch (error: any) {
    console.error('创建租户错误:', error);
    
    // 检查唯一键冲突
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: '公司标识已存在' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: '创建公司失败' },
      { status: 500 }
    );
  }
}
