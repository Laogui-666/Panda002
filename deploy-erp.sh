#!/bin/bash

# 盼达旅行ERP系统 - 一键部署脚本
# 用于在服务器上自动部署最新代码并初始化数据库

set -e

echo "========================================"
echo "  盼达旅行ERP系统 - 自动化部署"
echo "========================================"

# 1. 进入项目目录
cd /www/wwwroot/Panda001
echo "[1/7] 进入项目目录..."

# 2. 停止PM2服务
echo "[2/7] 停止PM2服务..."
pm2 stop all 2>/dev/null || true

# 3. 拉取最新代码
echo "[3/7] 拉取最新代码..."
git fetch origin main
git reset --hard origin/main

# 4. 安装依赖
echo "[4/7] 安装依赖..."
npm install

# 5. 生成Prisma客户端并同步数据库
echo "[5/7] 同步数据库结构..."
npx prisma generate
npx prisma db push

# 6. 初始化测试数据（创建测试用户）
echo "[6/7] 初始化测试数据..."
node src/lib/erp/init-db.js

# 7. 构建并启动
echo "[7/7] 构建并启动服务..."
npm run build
pm2 start ecosystem.config.js --env production
pm2 save

echo "========================================"
echo "  部署完成!"
echo "========================================"
echo ""
echo "访问地址: http://your-server-ip/erp/login"
echo ""
echo "测试账号:"
echo "  超级管理员: superadmin / 123456"
echo "  公司负责人:   owner1 / owner123456"
echo "  业务部管理员: deptadmin1 / deptadmin123456"
echo "  操作员:       operator1 / operator123456"
echo ""
echo "查看日志: pm2 logs"
echo "========================================"
