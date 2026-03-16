/**
 * 运行时配置中心
 * 
 * 问题根源：Next.js 在构建时将环境变量嵌入代码，运行时无法读取 .env 文件
 * 解决方案：在应用启动时通过 shell source 加载环境变量到进程环境变量
 * 
 * 使用方式：
 * import { config } from '@/lib/config';
 * const apiKey = config.siliconflowApiKey;
 */

import { getRuntimeEnv } from './runtime-env';

// 数据库配置
export const db = {
  host: getRuntimeEnv('DB_HOST', ''),
  port: parseInt(getRuntimeEnv('DB_PORT', '3306'), 10),
  user: getRuntimeEnv('DB_USER', ''),
  password: getRuntimeEnv('DB_PASSWORD', ''),
  name: getRuntimeEnv('DB_NAME', ''),
};

// 服务器配置
export const server = {
  port: parseInt(getRuntimeEnv('PORT', '3000'), 10),
  nodeEnv: getRuntimeEnv('NODE_ENV', 'development'),
  apiUrl: getRuntimeEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
};

// AI 服务配置
export const ai = {
  // SiliconFlow (Qwen翻译)
  siliconflowApiKey: getRuntimeEnv('SILICONFLOW_API_KEY', ''),
  siliconflowApiUrl: getRuntimeEnv('SILICONFLOW_API_URL', 'https://api.siliconflow.cn/v1/chat/completions'),
  siliconflowModel: getRuntimeEnv('SILICONFLOW_MODEL', 'Qwen/Qwen3.5-397B-A17B'),
  
  // 豆包AI
  doubaoApiKey: getRuntimeEnv('DOUBAO_API_KEY', ''),
  doubaoModel: getRuntimeEnv('DOUBAO_MODEL', 'doubao-seed-2-0-pro-260215'),
  doubaoApiUrl: getRuntimeEnv('DOUBAO_API_URL', 'https://ark.cn-beijing.volces.com/api/v3/responses'),
  
  // DeepSeek (备用)
  deepseekApiKey: getRuntimeEnv('DEEPSEEK_API_KEY', ''),
};

// OSS 对象存储配置
export const oss = {
  region: getRuntimeEnv('OSS_REGION', ''),
  accessKeyId: getRuntimeEnv('OSS_ACCESS_KEY_ID', ''),
  accessKeySecret: getRuntimeEnv('OSS_ACCESS_KEY_SECRET', ''),
  bucket: getRuntimeEnv('OSS_BUCKET', ''),
};

// 统一导出
export const config = {
  db,
  server,
  ai,
  oss,
};

// 检查必需配置
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!ai.siliconflowApiKey) {
    errors.push('SILICONFLOW_API_KEY is not configured');
  }
  
  if (!db.host || !db.user || !db.password) {
    errors.push('Database configuration is incomplete');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
