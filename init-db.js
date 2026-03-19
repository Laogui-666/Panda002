/**
 * ERP 数据库表结构初始化脚本
 * 
 * 创建ERP系统所需的表结构
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

const createTablesSQL = `
-- 角色表
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
  role_key VARCHAR(50) NOT NULL UNIQUE COMMENT '角色标识',
  description VARCHAR(255) COMMENT '角色描述',
  permissions TEXT COMMENT '权限JSON',
  level INT DEFAULT 1 COMMENT '角色级别',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 用户表（扩展）
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INT DEFAULT 1 COMMENT '角色ID';
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id INT COMMENT '部门ID';
ALTER TABLE users ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive', 'deleted') DEFAULT 'active';

-- 部门表
CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL COMMENT '部门名称',
  parent_id INT DEFAULT NULL COMMENT '父部门ID',
  leader VARCHAR(50) COMMENT '负责人',
  phone VARCHAR(20) COMMENT '联系电话',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
  customer_name VARCHAR(100) NOT NULL COMMENT '客户姓名',
  customer_phone VARCHAR(20) COMMENT '客户电话',
  customer_email VARCHAR(100) COMMENT '客户邮箱',
  id_card VARCHAR(20) COMMENT '身份证号',
  visa_country VARCHAR(50) COMMENT '签证国家',
  visa_type VARCHAR(50) COMMENT '签证类型',
  status ENUM('pending', 'connected', 'collecting', 'to_review', 'reviewing', 'processing', 'to_deliver', 'delivered', 'approved', 'rejected') DEFAULT 'pending' COMMENT '订单状态',
  assigned_to INT COMMENT '分配给的操作员ID',
  created_by INT COMMENT '创建人ID',
  extra_info TEXT COMMENT '扩展信息JSON',
  remark TEXT COMMENT '备注',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order_no (order_no),
  INDEX idx_status (status),
  INDEX idx_customer_phone (customer_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 资料表
CREATE TABLE IF NOT EXISTS documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL COMMENT '订单ID',
  document_type VARCHAR(50) NOT NULL COMMENT '资料类型',
  file_name VARCHAR(255) NOT NULL COMMENT '文件名',
  file_path VARCHAR(500) COMMENT '文件路径',
  file_size INT COMMENT '文件大小',
  mime_type VARCHAR(100) COMMENT 'MIME类型',
  uploaded_by INT COMMENT '上传人ID',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' COMMENT '审核状态',
  review_remark VARCHAR(500) COMMENT '审核备注',
  reviewed_by INT COMMENT '审核人ID',
  reviewed_at TIMESTAMP NULL COMMENT '审核时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id),
  INDEX idx_document_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资料表';

-- 预约表
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL COMMENT '订单ID',
  appointment_date DATE NOT NULL COMMENT '预约日期',
  appointment_time VARCHAR(10) COMMENT '预约时间',
  location VARCHAR(200) COMMENT '预约地点',
  contact_person VARCHAR(50) COMMENT '联系人',
  contact_phone VARCHAR(20) COMMENT '联系电话',
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled' COMMENT '状态',
  remark TEXT COMMENT '备注',
  document_path VARCHAR(500) COMMENT '材料路径',
  created_by INT COMMENT '创建人ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id),
  INDEX idx_appointment_date (appointment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约表';

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户ID',
  title VARCHAR(200) NOT NULL COMMENT '消息标题',
  content TEXT NOT NULL COMMENT '消息内容',
  type ENUM('system', 'order', 'appointment', 'reminder') DEFAULT 'system' COMMENT '消息类型',
  is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- 登录日志表
CREATE TABLE IF NOT EXISTS login_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT COMMENT '用户ID',
  username VARCHAR(50) COMMENT '用户名',
  ip_address VARCHAR(50) COMMENT 'IP地址',
  user_agent TEXT COMMENT '用户代理',
  login_status ENUM('success', 'failed') DEFAULT 'success' COMMENT '登录状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录日志表';

-- 插入默认管理员角色
INSERT IGNORE INTO roles (id, role_name, role_key, description, permissions, level, status) 
VALUES (1, '超级管理员', 'admin', '拥有所有权限', '{"all": true}', 1, 'active');

INSERT IGNORE INTO roles (id, role_name, role_key, description, permissions, level, status) 
VALUES (2, '操作员', 'operator', '普通操作员', '{"orders": ["read", "write", "update"], "documents": ["read", "write"], "appointments": ["read", "write"]}', 2, 'active');

INSERT IGNORE INTO roles (id, role_name, role_key, description, permissions, level, status) 
VALUES (3, '资料员', 'clerk', '资料管理人员', '{"documents": ["read", "write", "update"], "orders": ["read"]}', 3, 'active');

-- 更新users表中admin用户的role_id
UPDATE users SET role_id = 1 WHERE username = 'admin';
`;

async function initDatabase() {
  console.log('========== ERP 数据库初始化 ==========\n');

  let connection;
  
  try {
    // 先连接不带数据库，创建数据库（如不存在）
    console.log('[1/4] 连接到MySQL服务器...');
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      connectTimeout: 10000,
    });
    console.log('  ✓ 连接成功!\n');

    // 创建数据库
    console.log('[2/4] 创建数据库 visa（如不存在）...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS visa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('  ✓ 数据库就绪!\n');

    // 使用visa数据库
    console.log('[3/4] 选择数据库 visa...');
    await connection.query(`USE visa`);
    console.log('  ✓ 数据库已选中!\n');

    // 执行建表语句
    console.log('[4/4] 创建ERP表结构...\n');
    
    // 分批执行SQL（因为mysql2不支持一次执行多条语句）
    const statements = createTablesSQL.split(';').filter(s => s.trim());
    
    for (let i = 0; i < statements.length; i++) {
      const sql = statements[i].trim();
      if (sql) {
        try {
          await connection.query(sql);
          console.log(`  ✓ 执行: ${sql.substring(0, 60)}...`);
        } catch (err) {
          if (err.code !== 'ER_TABLE_EXISTS_ERROR') {
            console.log(`  ⚠️ 警告: ${err.message}`);
          } else {
            console.log(`  ○ 表已存在，跳过`);
          }
        }
      }
    }
    
    console.log('\n========== 数据库初始化完成 ==========');
    
    // 验证表结构
    console.log('\n验证表结构...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`数据库共有 ${tables.length} 个表:`);
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`  ${index + 1}. ${tableName}`);
    });

    // 检查角色数据
    console.log('\n检查角色数据...');
    const [roles] = await connection.query('SELECT * FROM roles');
    console.log(`  角色数量: ${roles.length}`);
    roles.forEach(role => {
      console.log(`    - ${role.role_name} (${role.role_key})`);
    });
    
    console.log('\n========== ERP 数据库初始化成功! ==========');
    
  } catch (error) {
    console.error('\n========== 初始化失败 ==========');
    console.error('错误类型:', error.code || error.name);
    console.error('错误信息:', error.message);
    console.log('\n========== 初始化结束 ==========');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 运行初始化
initDatabase();
