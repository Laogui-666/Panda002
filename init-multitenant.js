/**
 * 多租户数据库结构初始化脚本
 * 
 * 添加租户(公司)相关表结构
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com',
  port: 3306,
  user: 'visa',
  password: 'Laogui@900327',
  database: 'visa',
};

async function initMultiTenant() {
  console.log('========== 多租户数据库结构初始化 ==========\n');

  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ 连接成功!\n');

    // 1. 创建租户(公司)表
    console.log('[1/5] 创建租户(公司)表...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tenant_name VARCHAR(100) NOT NULL COMMENT '公司名称',
        tenant_key VARCHAR(50) NOT NULL UNIQUE COMMENT '公司标识(唯一)',
        contact_person VARCHAR(50) COMMENT '联系人',
        contact_phone VARCHAR(20) COMMENT '联系电话',
        contact_email VARCHAR(100) COMMENT '联系邮箱',
        company_logo VARCHAR(500) COMMENT '公司Logo',
        subscription_plan VARCHAR(20) DEFAULT 'basic' COMMENT '订阅套餐: basic/pro/enterprise',
        max_users INT DEFAULT 10 COMMENT '最大用户数',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active' COMMENT '状态',
        config JSON COMMENT '自定义配置',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tenant_key (tenant_key),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='租户(公司)表'
    `);
    console.log('  ✓ tenants 表创建成功\n');

    // 2. 检查并添加 users 表的租户关联字段
    console.log('[2/5] 检查 users 表结构...');
    const [columns] = await connection.query('DESCRIBE users');
    const columnNames = columns.map(c => c.Field);
    
    const userFieldsToAdd = {
      'tenant_id': 'ALTER TABLE users ADD COLUMN tenant_id INT DEFAULT NULL COMMENT "租户ID"',
      'role_type': 'ALTER TABLE users ADD COLUMN role_type VARCHAR(20) DEFAULT "user" COMMENT "角色类型: super_admin/tenant_admin/user"'
    };
    
    for (const [field, sql] of Object.entries(userFieldsToAdd)) {
      if (!columnNames.includes(field)) {
        try {
          await connection.query(sql);
          console.log(`  ✓ ${field} 字段已添加`);
        } catch (e) {
          console.log(`  ⚠️ 添加 ${field} 失败: ${e.message}`);
        }
      } else {
        console.log(`  ✓ ${field} 字段已存在`);
      }
    }
    console.log('');

    // 3. 为业务表添加 tenant_id 字段
    console.log('[3/5] 为业务表添加租户隔离字段...');
    const businessTables = ['orders', 'documents', 'appointments', 'messages'];
    
    for (const table of businessTables) {
      try {
        const [tableColumns] = await connection.query(`DESCRIBE ${table}`);
        const tableColNames = tableColumns.map(c => c.Field);
        
        if (!tableColNames.includes('tenant_id')) {
          await connection.query(`ALTER TABLE ${table} ADD COLUMN tenant_id INT DEFAULT NULL COMMENT '租户ID'`);
          console.log(`  ✓ ${table} 表添加 tenant_id 成功`);
        } else {
          console.log(`  ✓ ${table} 表已有 tenant_id 字段`);
        }
      } catch (e) {
        console.log(`  ⚠️ ${table} 表处理失败: ${e.message}`);
      }
    }
    console.log('');

    // 4. 插入默认租户数据
    console.log('[4/5] 插入默认租户数据...');
    const [existingTenants] = await connection.query("SELECT * FROM tenants WHERE tenant_key = 'default'");
    
    if (existingTenants.length === 0) {
      await connection.query(`
        INSERT INTO tenants (tenant_name, tenant_key, contact_person, contact_email, subscription_plan, max_users, status)
        VALUES ('盼达旅行', 'panda001', '管理员', 'admin@panda.com', 'enterprise', 100, 'active')
      `);
      console.log('  ✓ 默认租户创建成功');
    } else {
      console.log('  ✓ 默认租户已存在');
    }
    console.log('');

    // 5. 更新 admin 用户为超级管理员
    console.log('[5/5] 配置 admin 用户为超级管理员...');
    await connection.query(`
      UPDATE users SET 
        role_type = 'super_admin',
        tenant_id = NULL
      WHERE mobile = 'admin'
    `);
    console.log('  ✓ admin 用户已配置为超级管理员\n');

    // 验证结果
    console.log('========== 验证结果 ==========');
    const [tenants] = await connection.query('SELECT * FROM tenants');
    console.log(`\n租户列表 (共 ${tenants.length} 个):`);
    tenants.forEach(t => {
      console.log(`  ${t.id}. ${t.tenant_name} (${t.tenant_key}) - 状态: ${t.status}`);
    });

    const [users] = await connection.query('SELECT id, mobile, nickname, role_type, tenant_id FROM users');
    console.log(`\n用户列表 (共 ${users.length} 个):`);
    users.forEach(u => {
      console.log(`  ${u.id}. ${u.mobile} (${u.nickname}) - 角色: ${u.role_type} - 租户ID: ${u.tenant_id || 'NULL(超级管理员)'}`);
    });

    console.log('\n========== 多租户结构初始化完成 ==========');
    
  } catch (error) {
    console.error('\n========== 初始化失败 ==========');
    console.error('错误:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initMultiTenant();
