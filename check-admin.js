/**
 * 检查并初始化 admin 用户（完全适配现有表结构）
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com',
  port: 3306,
  user: 'visa',
  password: 'Laogui@900327',
  database: 'visa',
};

async function checkAdminUser() {
  console.log('========== 检查 Admin 用户 ==========\n');

  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // 检查users表结构
    console.log('[1/5] 检查 users 表结构...');
    const [columns] = await connection.query('DESCRIBE users');
    const columnNames = columns.map(c => c.Field);
    console.log('  用户表字段:', columnNames.join(', '));
    console.log('');

    // 检查并添加缺失的字段
    console.log('[2/5] 添加缺失的字段...');
    
    const fieldsToAdd = {
      'role_id': 'ALTER TABLE users ADD COLUMN role_id INT DEFAULT 1',
      'real_name': 'ALTER TABLE users ADD COLUMN real_name VARCHAR(50)',
      'status': 'ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT "active"'
    };
    
    for (const [field, sql] of Object.entries(fieldsToAdd)) {
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

    // 重新获取表结构
    const [newColumns] = await connection.query('DESCRIBE users');
    const newColumnNames = newColumns.map(c => c.Field);

    // 检查是否有 admin 用户
    console.log('[3/5] 检查 admin 用户...');
    const [users] = await connection.query("SELECT * FROM users WHERE mobile = 'admin'");
    
    if (users.length === 0) {
      console.log('  ⚠️ admin 用户不存在，正在创建...\n');
      
      // 构建动态插入语句
      console.log('[4/5] 创建 admin 用户...');
      let insertSQL = "INSERT INTO users (mobile, password, nickname, role, role_id, created_at, updated_at";
      let values = "VALUES ('admin', 'admin123', '管理员', 'admin', 1, NOW(), NOW()";
      
      if (newColumnNames.includes('real_name')) {
        insertSQL += ", real_name";
        values += ", '系统管理员'";
      }
      if (newColumnNames.includes('status')) {
        insertSQL += ", status";
        values += ", 'active'";
      }
      
      insertSQL += ") " + values + ")";
      
      await connection.query(insertSQL);
      console.log('  ✓ admin 用户创建成功!');
      console.log('    用户名: admin');
      console.log('    密码: admin123');
    } else {
      console.log('  ✓ admin 用户已存在');
      const user = users[0];
      console.log(`    ID: ${user.id}`);
      console.log(`    用户名(mobile): ${user.mobile}`);
      console.log(`    昵称: ${user.nickname}`);
      console.log(`    角色: ${user.role}`);
      console.log(`    状态: ${user.status || 'N/A'}`);
      
      // 更新 admin 用户信息
      console.log('\n  更新 admin 用户信息...');
      const updates = ["role = 'admin'", "role_id = 1"];
      if (newColumnNames.includes('status')) {
        updates.push("status = 'active'");
      }
      if (newColumnNames.includes('real_name')) {
        updates.push("real_name = '系统管理员'");
      }
      
      await connection.query(`UPDATE users SET ${updates.join(', ')} WHERE mobile = 'admin'`);
      console.log('  ✓ admin 用户信息已更新');
    }
    
    // 再次查询确认
    console.log('\n========== 当前用户列表 ==========');
    const [allUsers] = await connection.query('SELECT * FROM users');
    allUsers.forEach(u => {
      console.log(`  ${u.id}. ${u.mobile} (${u.nickname}) - 角色: ${u.role} - 角色ID: ${u.role_id || 'N/A'} - 状态: ${u.status || 'N/A'}`);
    });
    
    console.log('\n========== 检查完成 ==========');
    console.log('\n可以使用以下账号登录ERP系统:');
    console.log('  用户名: admin');
    console.log('  密码: admin123');
    console.log('  角色: 超级管理员');
    
  } catch (error) {
    console.error('\n========== 检查失败 ==========');
    console.error('错误:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkAdminUser();
