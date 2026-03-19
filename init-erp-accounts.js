/**
 * ERP系统测试账号初始化脚本
 * 
 * 创建符合Prisma模型的测试账号（使用bcrypt加密密码）
 * 
 * 运行方式: npx ts-node init-erp-accounts.ts
 */

const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://visa:Laogui@900327@rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com:3306/visa'
    }
  }
});

async function main() {
  console.log('========== ERP系统账号初始化 ==========\n');

  try {
    // 1. 创建公司
    console.log('[1/5] 创建公司...');
    
    let company = await prisma.company.findFirst();
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: '盼达旅行',
          shortName: '盼达',
          phone: '400-888-8888',
          email: 'contact@panda.com',
          address: '北京市朝阳区建国门外大街1号',
          status: 'active'
        }
      });
      console.log('  ✓ 创建公司: 盼达旅行 (ID:', company.id + ')');
    } else {
      console.log('  ✓ 公司已存在: 盼达旅行 (ID:', company.id + ')');
    }
    console.log('');

    // 2. 创建部门
    console.log('[2/5] 创建部门...');
    
    const deptNames = ['客服部', '签证部', '外交部', '财务部'];
    const depts = [];
    
    for (const name of deptNames) {
      let dept = await prisma.department.findFirst({ where: { name, companyId: company.id } });
      if (!dept) {
        dept = await prisma.department.create({
          data: { name, code: name.slice(0, 2), companyId: company.id }
        });
        console.log('  ✓ 创建部门:', name);
      } else {
        console.log('  ✓ 部门已存在:', name);
      }
      depts.push({ name, ...dept });
    }
    console.log('');

    // 3. 密码加密
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('[3/5] 密码加密完成\n');

    // 4. 创建9级角色测试账号
    console.log('[4/5] 创建测试账号...\n');

    const testAccounts = [
      // 超级管理员
      { username: 'superadmin', name: '超级管理员', role: UserRole.SUPER_ADMIN, phone: '13800000001', email: 'superadmin@test.com', companyId: company.id, deptIndex: null },
      
      // 公司负责人
      { username: 'ceo001', name: '张总', role: UserRole.COMPANY_OWNER, phone: '13800000002', email: 'ceo@panda.com', companyId: company.id, deptIndex: null },
      
      // 客服部
      { username: 'csadmin001', name: '客服主管', role: UserRole.CS_ADMIN, phone: '13800000003', email: 'csadmin@panda.com', companyId: company.id, deptIndex: 0 },
      { username: 'cs001', name: '客服小王', role: UserRole.CUSTOMER_SERVICE, phone: '13800000004', email: 'cs@panda.com', companyId: company.id, deptIndex: 0 },
      
      // 签证部
      { username: 'visaadmin001', name: '签证主管', role: UserRole.VISA_ADMIN, phone: '13800000005', email: 'visaadmin@panda.com', companyId: company.id, deptIndex: 1 },
      { username: 'collector001', name: '资料员小李', role: UserRole.DOC_COLLECTOR, phone: '13800000006', email: 'collector@panda.com', companyId: company.id, deptIndex: 1 },
      { username: 'operator001', name: '操作员小张', role: UserRole.OPERATOR, phone: '13800000007', email: 'operator@panda.com', companyId: company.id, deptIndex: 1 },
      
      // 外包
      { username: 'outsource001', name: '外包小赵', role: UserRole.OUTSOURCE, phone: '13800000008', email: 'outsource@panda.com', companyId: company.id, deptIndex: 2 },
      
      // 客户
      { username: 'customer001', name: '测试客户', role: UserRole.CUSTOMER, phone: '13800000009', email: 'customer@test.com', companyId: company.id, deptIndex: null },
    ];

    for (const account of testAccounts) {
      const deptId = account.deptIndex !== null ? depts[account.deptIndex]?.id : null;
      
      // 检查是否已存在
      const existing = await prisma.user.findUnique({ where: { username: account.username } });
      
      if (existing) {
        // 更新
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: account.name,
            role: account.role,
            phone: account.phone,
            email: account.email,
            companyId: account.companyId,
            departmentId: deptId,
          }
        });
        console.log('  ✓ 更新账号:', account.username, '-', account.name, '-', account.role);
      } else {
        // 创建
        await prisma.user.create({
          data: {
            username: account.username,
            passwordHash,
            name: account.name,
            role: account.role,
            phone: account.phone,
            email: account.email,
            companyId: account.companyId,
            departmentId: deptId,
            status: 'ACTIVE',
          }
        });
        console.log('  ✓ 创建账号:', account.username, '-', account.name, '-', account.role);
      }
    }
    console.log('');

    // 5. 显示汇总
    console.log('========== 测试账号汇总 ==========\n');
    console.log('【通用密码】: admin123 (所有账号)\n');
    
    console.log('┌─────────────────────────────────────────────────────────────────┐');
    console.log('│  角色              │  用户名            │  密码      │  菜单权限     │');
    console.log('├─────────────────────────────────────────────────────────────────┤');
    console.log('│  SUPER_ADMIN       │  superadmin       │  admin123 │  全部菜单     │');
    console.log('│  COMPANY_OWNER     │  ceo001           │  admin123 │  公司全部     │');
    console.log('│  CS_ADMIN          │  csadmin001       │  admin123 │  客服部       │');
    console.log('│  CUSTOMER_SERVICE  │  cs001            │  admin123 │  录入订单     │');
    console.log('│  VISA_ADMIN        │  visaadmin001     │  admin123 │  签证部       │');
    console.log('│  DOC_COLLECTOR     │  collector001     │  admin123 │  收集资料     │');
    console.log('│  OPERATOR          │  operator001      │  admin123 │  审核制作     │');
    console.log('│  OUTSOURCE         │  outsource001     │  admin123 │  受限视图     │');
    console.log('│  CUSTOMER          │  customer001      │  admin123 │  我的订单     │');
    console.log('└─────────────────────────────────────────────────────────────────┘\n');

    console.log('========== 初始化完成 ==========');
    
  } catch (error) {
    console.error('\n========== 初始化失败 ==========');
    console.error('错误:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();
