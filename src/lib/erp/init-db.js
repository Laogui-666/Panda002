/**
 * ERP数据库初始化脚本 (JavaScript版本)
 * 
 * 运行命令: node src/lib/erp/init-db.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('========== 沐海旅行签证ERP系统数据库初始化 ==========\n');

  try {
    // 1. 创建测试公司
    console.log('1. 创建测试公司...');
    const company1 = await prisma.company.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: '沐海旅行',
        shortName: '沐海',
        phone: '400-888-8888',
        email: 'contact@muhai001.com',
        address: '上海市浦东新区世纪大道100号',
        status: 'active',
      },
    });

    const company2 = await prisma.company.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: '签证宝',
        shortName: '签证宝',
        phone: '400-666-6666',
        email: 'service@qianzhengbao.com',
        address: '北京市朝阳区建国门外大街1号',
        status: 'active',
      },
    });

    console.log(`   公司1: ${company1.name} (ID: ${company1.id})`);
    console.log(`   公司2: ${company2.name} (ID: ${company2.id})`);

    // 2. 创建部门
    console.log('\n2. 创建部门...');
    
    const dept1 = await prisma.department.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: '客服部',
        code: 'CS',
        companyId: company1.id,
        status: 'active',
      },
    });

    const dept2 = await prisma.department.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: '资料部',
        code: 'DC',
        companyId: company1.id,
        status: 'active',
      },
    });

    const dept3 = await prisma.department.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: '操作部',
        code: 'OP',
        companyId: company1.id,
        status: 'active',
      },
    });

    console.log(`   客服部 (ID: ${dept1.id})`);
    console.log(`   资料部 (ID: ${dept2.id})`);
    console.log(`   操作部 (ID: ${dept3.id})`);

    // 3. 创建用户
    console.log('\n3. 创建测试用户...');
    
    // 超级管理员 - 密码: 123456
    const superAdmin = await prisma.user.upsert({
      where: { username: 'superadmin' },
      update: {},
      create: {
        username: 'superadmin',
        email: 'superadmin@muhai001.com',
        passwordHash: await bcrypt.hash('123456', 10),
        name: '超级管理员',
        phone: '13800000000',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
    });
    console.log(`   超级管理员: superadmin / 123456 (ID: ${superAdmin.id}, Role: ${superAdmin.role})`);

    // 公司负责人 - 密码: owner123456
    const companyOwner = await prisma.user.upsert({
      where: { username: 'owner1' },
      update: {},
      create: {
        username: 'owner1',
        email: 'owner1@muhai001.com',
        passwordHash: await bcrypt.hash('owner123456', 10),
        name: '张总',
        phone: '13800000001',
        role: 'COMPANY_OWNER',
        companyId: company1.id,
        status: 'ACTIVE',
      },
    });
    console.log(`   公司负责人: owner1 / owner123456 (ID: ${companyOwner.id}, Role: ${companyOwner.role})`);

    // 签证部管理员 - 密码: visaadmin123456
    const visaAdmin = await prisma.user.upsert({
      where: { username: 'visaadmin1' },
      update: { role: 'VISA_ADMIN' },
      create: {
        username: 'visaadmin1',
        email: 'visaadmin1@muhai001.com',
        passwordHash: await bcrypt.hash('visaadmin123456', 10),
        name: '李经理',
        phone: '13800000002',
        role: 'VISA_ADMIN',
        companyId: company1.id,
        departmentId: dept3.id,
        status: 'ACTIVE',
      },
    });
    console.log(`   签证部管理员: visaadmin1 / visaadmin123456 (ID: ${visaAdmin.id}, Role: ${visaAdmin.role})`);

    // 客服部管理员 - 密码: csadmin123456
    const csAdmin = await prisma.user.upsert({
      where: { username: 'csadmin1' },
      update: { role: 'CS_ADMIN' },
      create: {
        username: 'csadmin1',
        email: 'csadmin1@muhai001.com',
        passwordHash: await bcrypt.hash('csadmin123456', 10),
        name: '陈主管',
        phone: '13800000005',
        role: 'CS_ADMIN',
        companyId: company1.id,
        departmentId: dept2.id,
        status: 'ACTIVE',
      },
    });
    console.log(`   客服部管理员: csadmin1 / csadmin123456 (ID: ${csAdmin.id}, Role: ${csAdmin.role})`);

    // 客服 - 密码: cs123456
    const customerService = await prisma.user.upsert({
      where: { username: 'customer_service1' },
      update: { role: 'CUSTOMER_SERVICE' },
      create: {
        username: 'customer_service1',
        email: 'cs@muhai001.com',
        passwordHash: await bcrypt.hash('cs123456', 10),
        name: '张客服',
        phone: '13800000006',
        role: 'CUSTOMER_SERVICE',
        companyId: company1.id,
        departmentId: dept2.id,
        status: 'ACTIVE',
      },
    });
    console.log(`   客服: customer_service1 / cs123456 (ID: ${customerService.id}, Role: ${customerService.role})`);

    // 资料员 - 密码: collector123456
    const collector = await prisma.user.upsert({
      where: { username: 'collector1' },
      update: { role: 'DOC_COLLECTOR' },
      create: {
        username: 'collector1',
        email: 'collector1@muhai001.com',
        passwordHash: await bcrypt.hash('collector123456', 10),
        name: '周资料',
        phone: '13800000007',
        role: 'DOC_COLLECTOR',
        companyId: company1.id,
        departmentId: dept3.id,
        status: 'ACTIVE',
      },
    });
    console.log(`   资料员: collector1 / collector123456 (ID: ${collector.id}, Role: ${collector.role})`);

    // 操作员 - 密码: operator123456
    const operator = await prisma.user.upsert({
      where: { username: 'operator1' },
      update: {},
      create: {
        username: 'operator1',
        email: 'operator1@muhai001.com',
        passwordHash: await bcrypt.hash('operator123456', 10),
        name: '王操作',
        phone: '13800000003',
        role: 'OPERATOR',
        companyId: company1.id,
        departmentId: dept3.id,
        status: 'ACTIVE',
      },
    });
    console.log(`   操作员: operator1 / operator123456 (ID: ${operator.id}, Role: ${operator.role})`);

    // 外包业务员 - 密码: outsource123456
    const outsource = await prisma.user.upsert({
      where: { username: 'outsource1' },
      update: {},
      create: {
        username: 'outsource1',
        email: 'outsource1@muhai001.com',
        passwordHash: await bcrypt.hash('outsource123456', 10),
        name: '赵外包',
        phone: '13800000004',
        role: 'OUTSOURCE',
        companyId: company1.id,
        status: 'ACTIVE',
      },
    });
    console.log(`   外包业务员: outsource1 / outsource123456 (ID: ${outsource.id}, Role: ${outsource.role})`);

    // 普通用户 - 密码: customer123456
    const customer = await prisma.user.upsert({
      where: { username: 'customer1' },
      update: {},
      create: {
        username: 'customer1',
        email: 'customer1@example.com',
        passwordHash: await bcrypt.hash('customer123456', 10),
        name: '陈客户',
        phone: '13800000005',
        role: 'CUSTOMER',
        companyId: company1.id,
        status: 'ACTIVE',
      },
    });
    console.log(`   普通用户: customer1 / customer123456 (ID: ${customer.id}, Role: ${customer.role})`);

    // 4. 创建客户
    console.log('\n4. 创建测试客户...');
    
    const customer1 = await prisma.customer.upsert({
      where: { id: 1 },
      update: {},
      create: {
id: 1,
        name: '张三',
        phone: '13900000001',
        email: 'zhangsan@example.com',
        passportNo: 'E12345678',
        idCardNo: '110101199001011234',
        gender: '男',
        nationality: '中国',
        companyId: company1.id,
        userId: customer.id,
      },
    });
    console.log(`   客户: ${customer1.name} (ID: ${customer1.id})`);

    // 5. 创建测试订单
    console.log('\n5. 创建测试订单...');
    
    const order1 = await prisma.order.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        orderNo: 'VH20240317001',
        visaCountry: '日本',
        visaType: '旅游签证',
        entryType: '单次',
        stayDuration: 15,
        validityDays: 90,
        status: 'PENDING_CONNECTION',
        visaFee: 400,
        serviceFee: 200,
        totalFee: 600,
        paymentStatus: 'paid',
        companyId: company1.id,
        customerId: customer1.id,
        csId: companyOwner.id,
        remark: '测试订单1',
      },
    });
    console.log(`   订单: ${order1.orderNo} (状态: ${order1.status})`);

    console.log('\n========== 数据库初始化完成 ==========');
    console.log('\n测试账号:');
    console.log('  超级管理员: superadmin / 123456');
    console.log('  公司负责人:   owner1 / owner123456');
    console.log('  业务部管理员: deptadmin1 / deptadmin123456');
    console.log('  操作员:       operator1 / operator123456');
    console.log('  外包业务员:   outsource1 / outsource123456');
    console.log('  普通用户:     customer1 / customer123456');

  } catch (error) {
    console.error('初始化失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
