#!/bin/bash
# 启动脚本 - 自动构建并启动 Next.js

# 切换到应用目录
cd /www/wwwroot/Panda001

# 加载 .env.local 文件中的环境变量
if [ -f .env.local ]; then
  set -a
  source .env.local
  set +a
  echo "Environment variables loaded successfully"
else
  echo "Warning: .env.local not found"
fi

# 设置默认端口（如果没有定义）
export PORT=${PORT:-3000}
echo "Starting Next.js on port $PORT"

# 如果没有构建目录，则构建
if [ ! -d ".next" ]; then
  echo "Building Next.js application..."
  npm run build
fi

# 启动 Next.js，监听所有网卡 (0.0.0.0)
exec node_modules/next/dist/bin/next start -H 0.0.0.0 -p $PORT
