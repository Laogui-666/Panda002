#!/bin/bash

# ========================================
# 沐海签证 - 自动更新脚本
# 用于 GitHub Webhook 触发自动部署
# ========================================

PROJECT_DIR="/www/wwwroot/Panda001"

echo "========== 开始自动更新 =========="
echo "时间: $(date)"

# 进入项目目录
cd $PROJECT_DIR

# 拉取最新代码
echo "[1/4] 拉取最新代码..."
git pull origin master

# 安装新依赖
echo "[2/4] 安装依赖..."
npm install

# 重新构建
echo "[3/4] 构建项目..."
npm run build

# 重启PM2
echo "[4/4] 重启服务..."
pm2 restart Panda001

echo "========== 更新完成 =========="
