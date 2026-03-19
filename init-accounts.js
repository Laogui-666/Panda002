/**
 * 账号体系初始化脚本（修复版）
 * 
 * 创建完整的账号层级体系
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com',
  port: 3306,
  user: 'visa',
  password: 'Laogui@900327',
  database: 'visa',
};

async function initAccountSystem() {
  console.log('========== 账号体系初始化 ==========\n');

  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ 数据库连接成功!\n');

    // 1. 检查并完善部门表
    console.log('[1/7] 检查部门表结构...');
    const [deptColumns] = await connection.query('DESCRIBE departments');
    const deptColNames = deptColumns.map(c => c.Field);
    console.log('  部门表字段:', deptColNames.join(', '));
    
    // 添加缺失的字段
    if (!deptColNames.includes('tenant_id')) {
      try {
        await connection.query('ALTER TABLE departments ADD COLUMN tenant_id INT DEFAULT NULL COMMENT "租户ID" AFTER id');
        console.log('  ✓ tenant_id 字段已添加');
      } catch(e) { console.log('  ⚠️ ', e.message); }
    }
    if (!deptColNames.includes('department_key')) {
      try {
        await connection.query('ALTER TABLE departments ADD COLUMN department_key VARCHAR(50) DEFAULT NULL COMMENT "部门标识"');
        console.log('  ✓ department_key 字段已添加');
      } catch(e) { console.log('  ⚠️ ', e.message); }
    }
    if (!deptColNames.includes('leader_id')) {
      try {
        await connection.query('ALTER TABLE departments ADD COLUMN leader_id INT DEFAULT NULL COMMENT "部门负责人"');
        console.log('  ✓ leader_id 字段已添加');
      } catch(e) { console.log('  ⚠️ ', e.message); }
    }
    console.log('');

    // 2. 检查用户表字段
    console.log('[2/7] 检查用户表字段...');
    const [userColumns] = await connection.query('DESCRIBE users');
    const userColNames = userColumns.map(c => c.Field);
    
    const userFields = {
      'department_id': 'INT DEFAULT NULL COMMENT "部门ID"',
      'role_type': 'VARCHAR(20) DEFAULT "user" COMMENT "角色类型"',
      'tenant_id': 'INT DEFAULT NULL COMMENT "租户ID"'
    };
    
    for (const [field, definition] of Object.entries(userFields)) {
      if (!userColNames.includes(field)) {
        try {
          await connection.query(`ALTER TABLE users ADD COLUMN ${field} ${definition}`);
          console.log(`  ✓ ${field} 字段已添加`);
        } catch(e) { console.log(`  ⚠️ ${field}: ${e.message}`); }
      } else {
        console.log(`  ✓ ${field} 字段已存在`);
      }
    }
    console.log('');

    // 3. 获取租户信息
    console.log('[3/7] 获取租户信息...');
    let [tenants] = await connection.query('SELECT * FROM tenants');
    console.log(`  已有 ${tenants.length} 个公司\n`);
    
    // 确保有默认租户
    if (tenants.length === 0) {
      await connection.query(`
        INSERT INTO tenants (tenant_name, tenant_key, contact_person, contact_email, subscription_plan, max_users, status)
        VALUES ('盼达旅行', 'panda001', '张总', 'zhang@panda.com', 'enterprise', 100, 'active')
      `);
      [tenants] = await connection.query('SELECT * FROM tenants');
      console.log('  ✓ 创建默认租户: 盼达旅行\n');
    }

    // 4. 创建测试公司
    console.log('[4/7] 创建测试公司...');
    let companyAId, companyBId;
    
    // 公司A - 盼达旅行
    [tenants] = await connection.query("SELECT * FROM tenants WHERE tenant_key = 'panda001'");
    if (tenants.length > 0) {
      companyAId = tenants[0].id;
      console.log('  ✓ 公司A已存在: 盼达旅行 (ID:' + companyAId + ')');
    }
    
    // 公司B - 测试公司
    [tenants] = await connection.query("SELECT * FROM tenants WHERE tenant_key = 'testcompany'");
    if (tenants.length > 0) {
      companyBId = tenants[0].id;
      console.log('  ✓ 公司B已存在: 测试公司 (ID:' + companyBId + ')');
    } else {
      const [result] = await connection.query(`
        INSERT INTO tenants (tenant_name, tenant_key, contact_person, contact_email, subscription_plan, max_users, status)
        VALUES ('测试公司', 'testcompany', '李总', 'li@test.com', 'basic', 20, 'active')
      `);
      companyBId = result.insertId;
      console.log('  ✓ 创建公司B: 测试公司 (ID:' + companyBId + ')\n');
    }
    console.log('');

    // 5. 创建部门
    console.log('[5/7] 创建部门...');
    
    // 清除旧部门数据（可选）
    try {
      await connection.query('DELETE FROM departments');
    } catch(e) {}
    
    // 公司A的部门
    const deptAData = [
      { name: '销售部', key: 'sales', tenant: companyAId },
      { name: '运营部', key: 'operations', tenant: companyAId },
      { name: '外交部', key: 'foreign', tenant: companyAId },
      // 公司B的部门
      { name: '销售部', key: 'sales', tenant: companyBId },
    ];
    
    for (const dept of deptAData) {
      try {
        await connection.query(`
          INSERT INTO departments (tenant_id, department_name, department_key, status)
          VALUES (?, ?, ?, 'active')
        `, [dept.tenant, dept.name, dept.key]);
        console.log(`  ✓ 部门: ${dept.name} (${dept.tenant === companyAId ? '公司A' : '公司B'})`);
      } catch(e) {
        console.log(`  ⚠️ ${dept.name}: ${e.message}`);
      }
    }
    console.log('');

    // 6. 创建测试账号
    console.log('[6/7] 创建测试账号...\n');

    // 获取部门ID
    const [depts] = await connection.query('SELECT * FROM departments ORDER BY id');
    const salesDeptA = depts.find(d => d.tenant_id === companyAId && d.department_key === 'sales')?.id;
    const opsDeptA = depts.find(d => d.tenant_id === companyAId && d.department_key === 'operations')?.id;
    const foreignDeptA = depts.find(d => d.tenant_id === companyAId && d.department_key === 'foreign')?.id;
    const salesDeptB = depts.find(d => d.tenant_id === companyBId && d.department_key === 'sales')?.id;
    
    console.log('  部门ID映射:', { salesDeptA, opsDeptA, foreignDeptA, salesDeptB });

    const testAccounts = [
      // 公司A账号
      {
        mobile: 'ceo001',
        nickname: '张总',
        real_name: '张明',
        password: 'pass1234',
        role_type: 'company_admin',
        tenant_id: companyAId,
        department_id: null,
        role: 'admin',
        desc: '公司A-负责人'
      },
      {
        mobile: 'manager001',
        nickname: '王经理',
        real_name: '王芳',
        password: 'pass1234',
        role_type: 'dept_admin',
        tenant_id: companyAId,
        department_id: salesDeptA,
        role: 'manager',
        desc: '公司A-销售部管理员'
      },
      {
        mobile: 'operator001',
        nickname: '李操作',
        real_name: '李静',
        password: 'pass1234',
        role_type: 'operator',
        tenant_id: companyAId,
        department_id: salesDeptA,
        role: 'operator',
        desc: '公司A-销售部操作员'
      },
      {
        mobile: 'external001',
        nickname: '赵外包',
        real_name: '赵强',
        password: 'pass1234',
        role_type: 'external',
        tenant_id: companyAId,
        department_id: foreignDeptA,
        role: 'external',
        desc: '公司A-外包业务员'
      },
      // 公司B账号
      {
        mobile: 'ceob001',
        nickname: '李总',
        real_name: '李明',
        password: 'pass1234',
        role_type: 'company_admin',
        tenant_id: companyBId,
        department_id: null,
        role: 'admin',
        desc: '公司B-负责人'
      },
      // 普通用户
      {
        mobile: 'user001',
        nickname: '普通用户',
        real_name: '测试用户',
        password: 'pass1234',
        role_type: 'user',
        tenant_id: companyAId,
        department_id: opsDeptA,
        role: 'user',
        desc: '公司A-普通用户'
      }
    ];

    for (const account of testAccounts) {
      // 检查是否存在
      const [exists] = await connection.query('SELECT id FROM users WHERE mobile = ?', [account.mobile]);
      
      if (exists.length === 0) {
        await connection.query(`
          INSERT INTO users (mobile, nickname, real_name, password, role_type, tenant_id, department_id, role, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
        `, [account.mobile, account.nickname, account.real_name, account.password, account.role_type, account.tenant_id, account.department_id, account.role]);
        console.log(`  ✓ 创建: ${account.mobile} (${account.desc})`);
      } else {
        await connection.query(`
          UPDATE users SET nickname=?, real_name=?, role_type=?, tenant_id=?, department_id=?, role=?
          WHERE mobile=?
        `, [account.nickname, account.real_name, account.role_type, account.tenant_id, account.department_id, account.role, account.mobile]);
        console.log(`  ✓ 更新: ${account.mobile} (${account.desc})`);
      }
    }
    console.log('');

    // 7. 显示汇总
    console.log('========== 测试账号汇总 ==========\n');
    console.log('【平台超级管理员】');
    console.log('  用户名: admin');
    console.log('  密码: admin123');
    console.log('  权限: 最高权限，可管理所有公司和数据\n');

    console.log('【公司A - 盼达旅行】(tenant_id=' + companyAId + ')');
    console.log('  ├─ 公司负责人(company_admin): ceo001 / pass1234');
    console.log('  ├─ 业务部管理员(dept_admin): manager001 / pass1234');
    console.log('  ├─ 业务部门操作员(operator): operator001 / pass1234');
    console.log('  └─ 外包业务员(external): external001 / pass1234\n');

    console.log('【公司B - 测试公司】(tenant_id=' + companyBId + ')');
    console.log('  └─ 公司负责人(company_admin): ceob001 / pass1234\n');

    console.log('【普通用户】');
    console.log('  └─ user001 / pass1234\n');

    console.log('========== 初始化完成 ==========');
    
  } catch (error) {
    console.error('\n========== 初始化失败 ==========');
    console.error('错误:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initAccountSystem();
