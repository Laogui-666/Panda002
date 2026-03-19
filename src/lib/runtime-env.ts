/**
 * 运行时环境变量读取器
 * 
 * 核心原理：
 * 1. 使用 shell source 命令在启动时加载 .env.production 到进程环境变量
 * 2. 本模块在运行时读取 process.env（已被 shell 脚本填充）
 * 3. 不依赖 Next.js 的构建时嵌入
 * 
 * 支持两种配置方式（任选其一）：
 * 
 * 方式A（推荐）：使用 shell 脚本启动
 *   ecosystem.start.sh:
 *   ```bash
 *   source .env.production
 *   exec node_modules/next/dist/bin/next start
 *   ```
 * 
 * 方式B：直接在 PM2 环境变量中配置
 *   ecosystem.config.js:
 *   ```javascript
 *   env: {
 *     SILICONFLOW_API_KEY: 'your-key'
 *   }
 *   ```
 */

/**
 * 获取运行时环境变量
 * @param key 环境变量名
 * @param defaultValue 默认值（可选）
 */
export function getRuntimeEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    // 不抛出错误，让调用方决定如何处理
    return '';
  }
  
  return value;
}

/**
 * 获取必需的环境变量，如果不存在则抛出错误
 * @param key 环境变量名
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
}
