/**
 * ERP 数据库配置
 * 
 * 阿里云RDS MySQL 生产环境配置
 * 主机: rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com
 * 端口: 3306
 * 数据库: visa
 * 用户: visa
 */

export type DatabaseType = 'mysql' | 'postgresql' | 'sqlite' | 'local';

export interface DatabaseConfig {
  type: DatabaseType;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}

// 阿里云RDS MySQL配置
export const dbConfig: DatabaseConfig = {
  type: 'mysql',
  host: 'rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com',
  port: 3306,
  username: 'visa',
  password: 'Laogui@900327',
  database: 'visa',
};

export const isDatabaseConfigured = (): boolean => {
  return !!dbConfig.host && !!dbConfig.database;
};
