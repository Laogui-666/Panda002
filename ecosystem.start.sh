#!/bin/bash
# 启动脚本 - 自动构建并启动 Next.js

# 切换到应用目录
cd /www/wwwroot/Panda001

# 加载 .env.production 文件中的环境变量
# 尝试多个可能的文件名
if [ -f .env.production ]; then
  set -a
  source .env.production
  set +a
elif [ -f .env.local ]; then
  set -a
  source .env.local
  set +a
fi

# 如果OSS环境变量没有通过文件加载，尝试从PM2环境变量读取
# 确保所有必需的环境变量都存在
export OSS_REGION=${OSS_REGION:-""}
export OSS_ACCESS_KEY_ID=${OSS_ACCESS_KEY_ID:-""}
export OSS_ACCESS_KEY_SECRET=${OSS_ACCESS_KEY_SECRET:-""}
export OSS_BUCKET=${OSS_BUCKET:-""}

# 打印OSS配置状态（仅用于调试，生产环境可删除）
if [ -n "$OSS_REGION" ] && [ -n "$OSS_ACCESS_KEY_ID" ] && [ -n "$OSS_ACCESS_KEY_SECRET" ] && [ -n "$OSS_BUCKET" ]; then
  echo "OSS configuration loaded successfully"
else
  echo "Warning: OSS configuration may be incomplete"
  echo "OSS_REGION: ${OSS_REGION:-not set}"
  echo "OSS_ACCESS_KEY_ID: ${OSS_ACCESS_KEY_ID:-not set}"
  echo "OSS_BUCKET: ${OSS_BUCKET:-not set}"
fi

# 如果没有构建目录，则构建
if [ ! -d ".next" ]; then
  echo "Building Next.js application..."
  npm run build
fi

# 启动 Next.js
exec node_modules/next/dist/bin/next start
