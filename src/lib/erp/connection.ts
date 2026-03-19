/**
 * ERP 数据库连接管理
 * 
 * 使用 mysql2/promisified 连接池模式
 * 支持连接池管理、查询执行、事务操作
 */

import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbConfig } from './database';

let pool: Pool | null = null;

/**
 * 获取数据库连接池
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
 * 执行查询并返回结果
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
 * 执行单条查询
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
 * 执行插入操作
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
 * 执行更新操作
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
 * 执行删除操作
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
 * 获取连接池状态
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
 * 关闭连接池
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
