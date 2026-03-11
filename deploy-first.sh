#!/bin/bash

# ========================================
# 沐海签证 - 首次部署脚本
# 服务器IP: 223.6.248.154
# ========================================

echo "========== 开始部署沐海签证项目 =========="

# 项目目录
PROJECT_DIR="/www/wwwroot/Panda001"

# 1. 安装Node.js 20（如果未安装）
if ! command -v node &> /dev/null; then
    echo "[1/7] 安装 Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "[1/7] Node.js 已安装: $(node --version)"
fi

# 2. 安装PM2（如果未安装）
if ! command -v pm2 &> /dev/null; then
    echo "[2/7] 安装 PM2..."
    npm install -g pm2
else
    echo "[2/7] PM2 已安装: $(pm2 --version)"
fi

# 3. 克隆项目
echo "[3/7] 克隆项目..."
cd /www/wwwroot
if [ -d "$PROJECT_DIR" ]; then
    echo "项目目录已存在，跳过克隆"
else
    git clone https://github.com/Laogui-666/Panda001.git
fi

# 4. 进入项目目录
cd $PROJECT_DIR
echo "当前目录: $(pwd)"

# 5. 安装依赖
echo "[4/7] 安装项目依赖..."
npm install

# 6. 创建环境变量文件
echo "[5/7] 创建环境变量文件..."
cat > .env.local << 'EOF'
DATABASE_URL=mysql://visa:Laogui%40900327@rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com:3306/visa
DEEPSEEK_API_KEY=sk-490e4bc3829d42738c0944ea9e7abcf2
EOF
echo "环境变量已创建"

# 7. 构建项目
echo "[6/7] 构建项目..."
npm run build

# 8. 启动PM2
echo "[7/7] 启动 PM2..."
pm2 delete Panda001 2>/dev/null
pm2 start npm --name "Panda001" -- start

# 保存PM2进程列表
pm2 save

# 设置开机自启
pm2 startup

echo "========== 部署完成 =========="
echo "项目运行在 http://223.6.248.154:3000"
echo ""
echo "后续命令:"
echo "  查看日志: pm2 logs Panda001"
echo "  重启: pm2 restart Panda001"
echo "  停止: pm2 stop Panda001"
