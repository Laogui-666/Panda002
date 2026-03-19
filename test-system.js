/**
 * 系统测试脚本
 * 验证数据结构完整性和登录功能
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com',
  port: 3306,
  user: 'visa',
  password: 'Laogui@900327',
  database: 'visa',
};

async function testSystem() {
  console.log('========== 系统测试开始 ==========\n');

  let connection;
  let passCount = 0;
  let failCount = 0;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ 数据库连接成功\n');

    // ========== 1. 数据库结构测试 ==========
    console.log('=== 1. 数据库结构测试 ===\n');

    // 1.1 检查核心表是否存在
    const requiredTables = ['users', 'tenants', 'departments', 'roles', 'orders', 'documents', 'appointments', 'messages'];
    console.log('[1.1] 检查核心表...');
    
    for (const table of requiredTables) {
      try {
        const [rows] = await connection.query(`SHOW TABLES LIKE '${table}'`);
        if (rows.length > 0) {
          console.log(`  ✓ ${table} 表存在`);
          passCount++;
        } else {
          console.log(`  ✗ ${table} 表不存在`);
          failCount++;
        }
      } catch(e) {
        console.log(`  ✗ ${table} 检查失败: ${e.message}`);
        failCount++;
      }
    }

    // 1.2 检查users表必要字段
    console.log('\n[1.2] 检查 users 表字段...');
    const [userCols] = await connection.query('DESCRIBE users');
    const requiredUserFields = ['mobile', 'password', 'nickname', 'role', 'tenant_id', 'department_id', 'role_type'];
    
    for (const field of requiredUserFields) {
      const exists = userCols.some(c => c.Field === field);
      if (exists) {
        console.log(`  ✓ ${field} 字段存在`);
        passCount++;
      } else {
        console.log(`  ✗ ${field} 字段缺失`);
        failCount++;
      }
    }

    // 1.3 检查tenants表必要字段
    console.log('\n[1.3] 检查 tenants 表字段...');
    const [tenantCols] = await connection.query('DESCRIBE tenants');
    const requiredTenantFields = ['tenant_name', 'tenant_key', 'status', 'contact_email'];
    
    for (const field of requiredTenantFields) {
      const exists = tenantCols.some(c => c.Field === field);
      if (exists) {
        console.log(`  ✓ ${field} 字段存在`);
        passCount++;
      } else {
        console.log(`  ✗ ${field} 字段缺失`);
        failCount++;
      }
    }

    // 1.4 检查业务表tenant_id字段
    console.log('\n[1.4] 检查业务表租户隔离字段...');
    const businessTables = ['orders', 'documents', 'appointments', 'messages'];
    
    for (const table of businessTables) {
      try {
        const [cols] = await connection.query(`DESCRIBE ${table}`);
        const hasTenantId = cols.some(c => c.Field === 'tenant_id');
        if (hasTenantId) {
          console.log(`  ✓ ${table}.tenant_id 存在 (数据隔离支持)`);
          passCount++;
        } else {
          console.log(`  ✗ ${table}.tenant_id 缺失 (无法数据隔离)`);
          failCount++;
        }
      } catch(e) {
        console.log(`  ✗ ${table} 检查失败`);
        failCount++;
      }
    }

    // ========== 2. 测试数据验证 ==========
    console.log('\n=== 2. 测试数据验证 ===\n');

    // 2.1 检查租户数据
    console.log('[2.1] 检查租户数据...');
    const [tenants] = await connection.query('SELECT * FROM tenants');
    if (tenants.length > 0) {
      console.log(`  ✓ 已有 ${tenants.length} 个公司`);
      tenants.forEach(t => console.log(`    - ${t.tenant_name} (${t.tenant_key})`));
      passCount++;
    } else {
      console.log('  ✗ 没有公司数据');
      failCount++;
    }

    // 2.2 检查部门数据
    console.log('\n[2.2] 检查部门数据...');
    const [depts] = await connection.query('SELECT * FROM departments');
    if (depts.length > 0) {
      console.log(`  ✓ 已有 ${depts.length} 个部门`);
      passCount++;
    } else {
      console.log('  ⚠ 没有部门数据 (可选)');
    }

    // 2.3 检查角色数据
    console.log('\n[2.3] 检查角色数据...');
    const [roles] = await connection.query('SELECT * FROM roles');
    if (roles.length > 0) {
      console.log(`  ✓ 已有 ${roles.length} 个角色`);
      roles.forEach(r => console.log(`    - ${r.role_name} (${r.role_key})`));
      passCount++;
    } else {
      console.log('  ✗ 没有角色数据');
      failCount++;
    }

    // 2.4 检查测试账号
    console.log('\n[2.4] 检查测试账号...');
    const testAccounts = ['admin', 'ceo001', 'manager001', 'operator001', 'external001', 'ceob001', 'user001'];
    for (const mobile of testAccounts) {
      const [users] = await connection.query('SELECT * FROM users WHERE mobile = ?', [mobile]);
      if (users.length > 0) {
        const u = users[0];
        console.log(`  ✓ ${mobile} (role_type: ${u.role_type}, tenant_id: ${u.tenant_id})`);
        passCount++;
      } else {
        console.log(`  ✗ ${mobile} 不存在`);
        failCount++;
      }
    }

    // ========== 3. 登录验证 ==========
    console.log('\n=== 3. 登录验证测试 ===\n');

    const loginTests = [
      { mobile: 'admin', password: 'admin123', expected: 'super_admin', desc: '超级管理员' },
      { mobile: 'ceo001', password: 'pass1234', expected: 'company_admin', desc: '公司负责人' },
      { mobile: 'manager001', password: 'pass1234', expected: 'dept_admin', desc: '部门管理员' },
      { mobile: 'operator001', password: 'pass1234', expected: 'operator', desc: '操作员' },
      { mobile: 'external001', password: 'pass1234', expected: 'external', desc: '外包业务员' },
      { mobile: 'ceob001', password: 'pass1234', expected: 'company_admin', desc: '公司B负责人' },
    ];

    for (const test of loginTests) {
      const [users] = await connection.query(
        'SELECT * FROM users WHERE mobile = ? AND password = ?',
        [test.mobile, test.password]
      );
      
      if (users.length > 0) {
        const user = users[0];
        if (user.role_type === test.expected) {
          console.log(`  ✓ ${test.desc} (${test.mobile}) 登录验证通过`);
          passCount++;
        } else {
          console.log(`  ✗ ${test.desc} (${test.mobile}) 角色类型不匹配: 期望 ${test.expected}, 实际 ${user.role_type}`);
          failCount++;
        }
      } else {
        console.log(`  ✗ ${test.desc} (${test.mobile}) 登录失败: 用户名或密码错误`);
        failCount++;
      }
    }

    // ========== 4. 数据隔离验证 ==========
    console.log('\n=== 4. 数据隔离验证 ===\n');

    // 4.1 公司数据隔离
    console.log('[4.1] 公司数据隔离验证...');
    const [companyAUsers] = await connection.query('SELECT * FROM users WHERE tenant_id = 1');
    const [companyBUsers] = await connection.query('SELECT * FROM users WHERE tenant_id = 2');
    
    console.log(`  ✓ 公司A (盼达旅行): ${companyAUsers.length} 个用户`);
    console.log(`  ✓ 公司B (测试公司): ${companyBUsers.length} 个用户`);
    
    // 确保两个公司的用户是分离的
    const companyAIds = companyAUsers.map(u => u.mobile);
    const companyBIds = companyBUsers.map(u => u.mobile);
    
    const overlap = companyAIds.filter(m => companyBIds.includes(m));
    if (overlap.length === 0) {
      console.log('  ✓ 两家公司用户无重叠，数据隔离正确');
      passCount++;
    } else {
      console.log(`  ✗ 两家公司用户有重叠: ${overlap.join(', ')}`);
      failCount++;
    }

    // ========== 汇总结果 ==========
    console.log('\n========== 测试汇总 ==========');
    console.log(`  通过: ${passCount} 项`);
    console.log(`  失败: ${failCount} 项`);
    
    if (failCount === 0) {
      console.log('\n✅ 所有测试通过！系统可以正常运行。');
    } else {
      console.log('\n⚠️ 部分测试失败，请检查上述问题。');
    }

  } catch (error) {
    console.error('\n========== 测试异常 ==========');
    console.error('错误:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testSystem();
