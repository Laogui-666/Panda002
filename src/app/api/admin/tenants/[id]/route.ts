/**
 * 租户(公司)详情管理 API
 * 
 * 超级管理员API，用于管理单个公司
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getTenantById, 
  updateTenant, 
  updateTenantStatus,
  deleteTenant,
  getTenantUserCount,
  getTenantOrderCount
} from '@/lib/erp/dao/tenant';

// 获取单个租户详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: '无效的公司ID' },
        { status: 400 }
      );
    }

    const tenant = await getTenantById(id);
    
    if (!tenant) {
      return NextResponse.json(
        { success: false, message: '公司不存在' },
        { status: 404 }
      );
    }

    // 获取统计数据
    const userCount = await getTenantUserCount(id);
    const orderCount = await getTenantOrderCount(id);

    return NextResponse.json({
      success: true,
      data: {
        ...tenant,
        userCount,
        orderCount,
      },
    });
  } catch (error) {
    console.error('获取租户详情错误:', error);
    return NextResponse.json(
      { success: false, message: '获取公司详情失败' },
      { status: 500 }
    );
  }
}

// 更新租户
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: '无效的公司ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      tenant_name, 
      contact_person, 
      contact_phone, 
      contact_email,
      company_logo,
      subscription_plan,
      max_users,
      config
    } = body;

    // 检查公司是否存在
    const existingTenant = await getTenantById(id);
    if (!existingTenant) {
      return NextResponse.json(
        { success: false, message: '公司不存在' },
        { status: 404 }
      );
    }

    const affectedRows = await updateTenant(id, {
      tenant_name,
      contact_person,
      contact_phone,
      contact_email,
      company_logo,
      subscription_plan,
      max_users,
      config: config ? JSON.stringify(config) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: '公司信息更新成功',
    });
  } catch (error) {
    console.error('更新租户错误:', error);
    return NextResponse.json(
      { success: false, message: '更新公司信息失败' },
      { status: 500 }
    );
  }
}

// 更新租户状态（停用/启用/暂停）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: '无效的公司ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // 验证状态值
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return NextResponse.json(
        { success: false, message: '无效的状态值' },
        { status: 400 }
      );
    }

    // 检查公司是否存在
    const existingTenant = await getTenantById(id);
    if (!existingTenant) {
      return NextResponse.json(
        { success: false, message: '公司不存在' },
        { status: 404 }
      );
    }

    await updateTenantStatus(id, status);

    const statusText = {
      active: '启用',
      inactive: '停用',
      suspended: '暂停',
    };

    return NextResponse.json({
      success: true,
      message: `公司已${statusText[status as keyof typeof statusText]}`,
    });
  } catch (error) {
    console.error('更新租户状态错误:', error);
    return NextResponse.json(
      { success: false,message: '更新公司状态失败' },
      { status: 500 }
    );
  }
}

// 删除租户
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: '无效的公司ID' },
        { status: 400 }
      );
    }

    // 检查公司是否存在
    const existingTenant = await getTenantById(id);
    if (!existingTenant) {
      return NextResponse.json(
        { success: false, message: '公司不存在' },
        { status: 404 }
      );
    }

    await deleteTenant(id);

    return NextResponse.json({
      success: true,
      message: '公司已删除',
    });
  } catch (error) {
    console.error('删除租户错误:', error);
    return NextResponse.json(
      { success: false, message: '删除公司失败' },
      { status: 500 }
    );
  }
}
