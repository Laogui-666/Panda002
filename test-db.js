/**
 * 数据库连接测试脚本
 * 
 * 测试阿里云RDS MySQL数据库连接
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com',
  port: 3306,
  user: 'visa',
  password: 'Laogui@900327',
  database: 'visa',
  connectTimeout: 10000,
};

async function testConnection() {
  console.log('========== 数据库连接测试 ==========\n');
  console.log('配置信息:');
  console.log(`  主机: ${dbConfig.host}`);
  console.log(`  端口: ${dbConfig.port}`);
  console.log(`  用户: ${dbConfig.user}`);
  console.log(`  数据库: ${dbConfig.database}`);
  console.log('');

  let connection;
  
  try {
    // 步骤1: 尝试建立连接
    console.log('[1/3] 尝试连接数据库...');
    connection = await mysql.createConnection(dbConfig);
    console.log('  ✓ 连接成功!\n');
    
    // 步骤2: 测试查询
    console.log('[2/3] 执行测试查询...');
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('  ✓ 查询成功! 结果:', rows);
    console.log('');
    
    // 步骤3: 检查数据库表
    console.log('[3/3] 检查数据库表结构...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`  ✓ 数据库共有 ${tables.length} 个表:`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`    ${index + 1}. ${tableName}`);
    });
    console.log('');
    
    // 检查关键表是否存在
    console.log('检查关键表:');
    const requiredTables = ['users', 'roles', 'orders', 'documents', 'appointments'];
    for (const tableName of requiredTables) {
      const [exists] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);
      if (exists.length > 0) {
        console.log(`  ✓ ${tableName} 表存在`);
      } else {
        console.log(`  ✗ ${tableName} 表不存在`);
      }
    }
    
    console.log('\n========== 测试完成: 数据库连接正常 ==========');
    
  } catch (error) {
    console.error('\n========== 连接失败 ==========');
    console.error('错误类型:', error.code || error.name);
    console.error('错误信息:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n⚠️ 可能是用户名或密码错误');
    } else if (error.code === 'ER_DB_NOT_EXISTS') {
      console.log('\n⚠️ 数据库不存在');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️ 连接被拒绝 - 检查防火墙或白名单设置');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      console.log('\n⚠️ 连接超时 - 检查网络或DNS解析');
    }
    
    console.log('\n========== 测试结束 ==========');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行测试
testConnection();
