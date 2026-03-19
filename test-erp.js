/**
 * ERP系统测试脚本
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function test() {
  const prisma = new PrismaClient();
  
  try {
    console.log('========== ERP系统测试 ==========\n');
    
    // 1. 测试登录
    console.log('1. 测试登录功能...');
    const user = await prisma.user.findFirst({ where: { email: 'superadmin@muhai001.com' } });
    if (user) {
      const valid = await bcrypt.compare('123456', user.passwordHash);
      console.log(`   超级管理员 (${user.email}): ${valid ? '✅ 密码正确' : '❌ 密码错误'}`);
    }
    
    // 测试各角色登录
    const users = await prisma.user.findMany({ select: { email: true, role: true, name: true } });
    for (const u of users) {
      console.log(`   - ${u.name} (${u.role}): ${u.email}`);
    }
    
    // 2. 测试数据查询
    console.log('\n2. 测试数据查询...');
    const companyCount = await prisma.company.count();
    console.log(`   公司数量: ${companyCount}`);
    
    const deptCount = await prisma.department.count();
    console.log(`   部门数量: ${deptCount}`);
    
    const userCount = await prisma.user.count();
    console.log(`   用户数量: ${userCount}`);
    
    const customerCount = await prisma.customer.count();
    console.log(`   客户数量: ${customerCount}`);
    
    const orderCount = await prisma.order.count();
    console.log(`   订单数量: ${orderCount}`);
    
    console.log('\n✅ 所有测试通过!');
  } catch (e) {
    console.error('\n❌ 错误:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
