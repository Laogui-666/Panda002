/**
 * @deprecated
 * 数据库配置已弃用，请使用 Prisma + .env
 *
 * 原生 MySQL 配置已被 Prisma ORM 替代。
 *
 * 迁移指南：
 * - 在 .env 文件中设置 DATABASE_URL
 * - Prisma 从 .env 读取数据库连接配置
 * - 运行 npx prisma generate 生成 Prisma Client
 *
 * .env 示例：
 * DATABASE_URL="mysql://visa:password@host:3306/visa"
 *
 * 此文件保留用于向后兼容，将在后续版本中移除。
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

/**
 * @deprecated 请在 .env 中设置 DATABASE_URL
 */
export const dbConfig: DatabaseConfig = {
  type: 'mysql',
  host: 'rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com',
  port: 3306,
  username: 'visa',
  password: 'Laogui@900327',
  database: 'visa',
};

/**
 * @deprecated 请确保 .env 中正确配置 DATABASE_URL
 */
export const isDatabaseConfigured = (): boolean => {
  return !!dbConfig.host && !!dbConfig.database;
};
