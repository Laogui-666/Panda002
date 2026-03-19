/**
 * @deprecated
 * 数据库连接管理已弃用，请使用 Prisma ORM
 *
 * 原生 mysql2/promise 连接池模式已被 Prisma ORM 替代。
 *
 * 迁移指南：
 * - 使用 src/lib/erp/prisma.ts 中的 prisma 实例
 * - Prisma 自动管理连接池，无需手动管理
 *
 * 此文件保留用于向后兼容，将在后续版本中移除。
 *
 * @example
 * // 旧代码 (已弃用)
 * import { query, insert } from '@/lib/erp/connection';
 * const rows = await query('SELECT * FROM users WHERE id = ?', [id]);
 * const insertId = await insert('users', { name, email });
 *
 * // 新代码 (推荐)
 * import prisma from '@/lib/erp/prisma';
 * const user = await prisma.user.findUnique({ where: { id } });
 * const newUser = await prisma.user.create({ data: { name, email } });
 */

import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbConfig } from './database';

let pool: Pool | null = null;

/**
 * @deprecated 请使用 prisma.$connect() 或直接使用 prisma 实例
 */
export async function getPool(): Promise<Pool> {
  if (!pool) {
    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

/**
 * @deprecated 请使用 Prisma Query
 */
export async function query<T extends RowDataPacket[]>(
  sql: string,
  params?: any[]
): Promise<T> {
  const pool = await getPool();
  const [rows] = await pool.query<T>(sql, params);
  return rows;
}

/**
 * @deprecated 请使用 Prisma Query
 */
export async function queryOne<T extends RowDataPacket>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const pool = await getPool();
  const [rows] = await pool.query<T[]>(sql, params);
  return rows[0] || null;
}

/**
 * @deprecated 请使用 prisma.tableName.create({ data })
 */
export async function insert(
  table: string,
  data: Record<string, any>
): Promise<number> {
  const pool = await getPool();
  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map(() => '?').join(', ');

  const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
  const [result] = await pool.execute<ResultSetHeader>(sql, values);
  return result.insertId;
}

/**
 * @deprecated 请使用 prisma.tableName.update({ where, data })
 */
export async function update(
  table: string,
  data: Record<string, any>,
  where: string,
  params?: any[]
): Promise<number> {
  const pool = await getPool();
  const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), ...(params || [])];

  const sql = `UPDATE ${table} SET ${sets} WHERE ${where}`;
  const [result] = await pool.execute<ResultSetHeader>(sql, values);
  return result.affectedRows;
}

/**
 * @deprecated 请使用 prisma.tableName.delete({ where })
 */
export async function remove(
  table: string,
  where: string,
  params?: any[]
): Promise<number> {
  const pool = await getPool();
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result.affectedRows;
}

/**
 * @deprecated Prisma 自动管理连接状态
 */
export async function getPoolStatus(): Promise<{
  connected: boolean;
  poolConnections: number;
}> {
  try {
    const pool = await getPool();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT 1');
    return {
      connected: rows.length > 0,
      poolConnections: 0,
    };
  } catch (error) {
    return {
      connected: false,
      poolConnections: 0,
    };
  }
}

/**
 * @deprecated Prisma 自动管理连接生命周期
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
