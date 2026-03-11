#!/bin/bash

# ===========================================
# 沐海签证 - 阿里云服务器部署脚本
# ===========================================

echo "========================================"
echo "  沐海签证 - 阿里云部署脚本"
echo "========================================"

# 服务器配置
SERVER_IP="223.6.248.154"
SERVER_USER="root"
SERVER_PORT="22"
APP_DIR="/www/wwwroot/Panda001"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查本地构建
echo -e "${YELLOW}检查本地构建...${NC}"
if [ ! -d ".next" ]; then
    echo -e "${RED}错误: 未找到构建目录 .next${NC}"
    echo "请先运行: npm run build"
    exit 1
fi

echo -e "${GREEN}✓ 构建目录已就绪${NC}"

# 创建部署包
echo -e "${YELLOW}创建部署包...${NC}"
mkdir -p deployment
cp -r .next deployment/
cp package.json deployment/
cp package-lock.json deployment/
cp -r src deployment/
cp -r public deployment/ 2>/dev/null || true
cp -r skills deployment/
cp .env.local deployment/
cp next.config.js deployment/
cp tailwind.config.js deployment/
cp tsconfig.json deployment/
cp postcss.config.js deployment/
cp -r src/lib deployment/src/ 2>/dev/null || true

# 打包
cd deployment
tar -czf ../Panda001-deploy.tar.gz ./*
cd ..
rm -rf deployment

echo -e "${GREEN}✓ 部署包创建完成: Panda001-deploy.tar.gz${NC}"

# 上传到服务器
echo -e "${YELLOW}上传到服务器...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "mkdir -p $APP_DIR"
scp -P $SERVER_PORT Panda001-deploy.tar.gz $SERVER_USER@$SERVER_IP:$APP_DIR/

# 在服务器上执行部署命令
echo -e "${YELLOW}在服务器上部署...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << 'EOF'
    cd /www/wwwroot/Panda001
    
    # 解压
    tar -xzf Panda001-deploy.tar.gz
    rm Panda001-deploy.tar.gz
    
    # 安装依赖
    npm install
    
    # 使用 PM2 启动
    pm2 stop Panda001 2>/dev/null || true
    pm delete Panda001 2>/dev/null || true
    pm2 start npm --name "Panda001" -- start
    pm2 save
    
    echo "部署完成!"
    pm2 list
EOF

echo -e "${GREEN}========================================"
echo "  部署完成!"
echo "========================================"
echo -e "访问地址: http://$SERVER_IP:3000"
echo -e "API 端点:"
echo -e "  - http://$SERVER_IP:3000/api/skills/execute"
echo -e "  - http://$SERVER_IP:3000/api/skills/parse"
echo "========================================"
