/**
 * ERP 数据库初始化脚本
 * 
 * 创建所有必要的数据库表
 * 运行此脚本初始化数据库
 */

import { getPool } from './connection';

export async function initializeDatabase(): Promise<void> {
  const pool = await getPool();
  
  // 1. 创建用户表
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS erp_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      real_name VARCHAR(50) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(100),
      role_id INT NOT NULL DEFAULT 3,
      department_id INT,
      status ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      last_login_at DATETIME,
      INDEX idx_username (username),
      INDEX idx_status (status),
      INDEX idx_role_id (role_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP用户表'
  `);

  // 2. 创建角色表
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS erp_roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role_name VARCHAR(50) NOT NULL,
      role_key VARCHAR(50) NOT NULL UNIQUE,
      description VARCHAR(255),
      permissions TEXT,
      level INT NOT NULL DEFAULT 3,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_role_key (role_key),
      INDEX idx_level (level)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP角色表'
  `);

  // 3. 创建部门表
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS erp_departments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      department_name VARCHAR(100) NOT NULL,
      parent_id INT,
      leader VARCHAR(50),
      phone VARCHAR(20),
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_parent_id (parent_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP部门表'
  `);

  // 4. 创建订单表
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS erp_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_no VARCHAR(50) NOT NULL UNIQUE,
      customer_name VARCHAR(50) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      customer_email VARCHAR(100),
      id_card VARCHAR(20),
      visa_country VARCHAR(50) NOT NULL,
      visa_type VARCHAR(50) NOT NULL,
      status ENUM('pending', 'connected', 'collecting', 'to_review', 'reviewing', 'processing', 'to_deliver', 'delivered', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      assigned_to INT,
      created_by INT,
      extra_info TEXT,
      remark TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_order_no (order_no),
      INDEX idx_status (status),
      INDEX idx_assigned_to (assigned_to),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP订单表'
  `);

  // 5. 创建资料表
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS erp_documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      document_type VARCHAR(50) NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      file_size BIGINT,
      mime_type VARCHAR(100),
      uploaded_by INT,
      status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      review_remark TEXT,
      reviewed_by INT,
      reviewed_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_order_id (order_id),
      INDEX idx_document_type (document_type),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP资料表'
  `);

  // 6. 创建预约表
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS erp_appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time VARCHAR(10),
      location VARCHAR(200),
      contact_person VARCHAR(50),
      contact_phone VARCHAR(20),
      status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
      remark TEXT,
      document_path VARCHAR(500),
      created_by INT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_order_id (order_id),
      INDEX idx_appointment_date (appointment_date),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP预约表'
  `);

  // 7. 创建消息表
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS erp_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      type ENUM('system', 'order', 'appointment', 'reminder') NOT NULL DEFAULT 'system',
      is_read TINYINT NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_is_read (is_read),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP消息表'
  `);

  // 8. 创建登录日志表
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS erp_login_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      username VARCHAR(50) NOT NULL,
      ip_address VARCHAR(50),
      user_agent VARCHAR(500),
      login_status ENUM('success', 'failed') NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ERP登录日志表'
  `);

  // 插入默认角色数据
  await pool.execute(`
    INSERT IGNORE INTO erp_roles (id, role_name, role_key, description, permissions, level) VALUES
    (1, '公司负责人', 'admin', '公司最高管理员，拥有全部权限', '{"all": true}', 1),
    (2, '业务部管理员', 'manager', '业务部门管理员，管理本部门数据', '{"orders": ["read", "write", "delete"], "documents": ["read", "write", "review"], "users": ["read"]}', 2),
    (3, '业务部门操作员', 'operator', '普通操作员，处理订单和资料', '{"orders": ["read", "write"], "documents": ["read", "write"]}', 3),
    (4, '外包业务员', 'outsource', '外包人员，只能查看受限数据', '{"orders": ["read"], "documents": ["read"]}', 4)
  `);

  // 插入默认管理员账号 (密码: admin123)
  await pool.execute(`
    INSERT IGNORE INTO erp_users (id, username, password, real_name, role_id, status) VALUES
    (1, 'admin', '$2a$10$rQEY7Zj7YqKfG3m8fZQjXe5VxU8xQvzWvBJhBHfF0qJqKNwLkKzKy', '系统管理员', 1, 'active')
  `);

  // 插入默认部门数据
  await pool.execute(`
    INSERT IGNORE INTO erp_departments (id, department_name, leader) VALUES
    (1, '总部', '系统管理员'),
    (2, '签证业务部', '张经理'),
    (3, '翻译部', '李经理')
  `);

  console.log('数据库初始化完成！');
}

/**
 * 检查数据库连接
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const pool = await getPool();
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    return false;
  }
}
