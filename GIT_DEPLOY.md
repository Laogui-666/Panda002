# Git + Webhook 自动部署指南

> 通过 GitHub/Gitee 实现代码提交后自动部署

---

## 方案概述

```
本地提交代码 (git push)
       │
       ▼
   GitHub/Gitee
       │
       ▼ (Webhook 触发)
   服务器自动拉取
       │
       ▼
   构建并重启服务
```

---

## 步骤 1：在 GitHub/Gitee 创建仓库

### GitHub（推荐）

1. 访问 https://github.com
2. 创建新仓库 `Panda001`
3. 复制仓库地址

### 或 Gitee

1. 访问 https://gitee.com
2. 创建新仓库 `Panda001`
3. 复制仓库地址

---

## 步骤 2：本地初始化 Git

```bash
# 进入项目目录
cd C:\Users\Administrator\Desktop\muhai001\muhai001

# 初始化 Git（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/你的用户名/Panda001.git
# 或 Gitee
git remote add origin https://gitee.com/你的用户名/Panda001.git
```

---

## 步骤 3：创建 .gitignore

在项目根目录创建 `.gitignore` 文件：

```gitignore
# 环境变量（包含敏感信息，不上传）
.env.local
.env
.env.*.local

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/
dist/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# 日志
logs/
*.log
```

---

## 步骤 4：提交代码到仓库

```bash
# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 沐海签证项目"

# 推送到远程仓库
git push -u origin main
```

---

## 步骤 5：服务器配置

在阿里云服务器上执行：

### 5.1 安装 Git（如果没有）

```bash
yum install git -y
```

### 5.2 创建部署目录

```bash
mkdir -p /www/wwwroot/Panda001
cd /www/wwwroot/Panda001
git init
git config user.name "deploy"
git config user.email "deploy@Panda001.com"
```

### 5.3 拉取代码

```bash
# GitHub
git remote add origin https://github.com/你的用户名/Panda001.git
# 或 Gitee
git remote add origin https://gitee.com/你的用户名/Panda001.git

# 拉取代码
git pull origin main
```

### 5.4 安装依赖

```bash
npm install
```

---

## 步骤 6：配置 Webhook

### 6.1 安装 PM2（如果没有）

```bash
npm install -g pm2
```

### 6.2 创建部署脚本

在项目目录创建 `deploy.sh`：

```bash
#!/bin/bash

echo "开始部署..."

# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 构建项目
npm run build

# 重启 PM2
pm2 restart Panda001

echo "部署完成!"
```

```bash
chmod +x deploy.sh
```

### 6.3 创建 PM2 启动脚本

```bash
# 创建 start.sh
cat > start.sh << 'EOF'
#!/bin/bash
cd /www/wwwroot/Panda001
npm start
EOF

chmod +x start.sh

# 使用 PM2 管理
pm2 start start.sh --name Panda001
pm2 save
```

---

## 步骤 7：配置 GitHub Webhook

### 7.1 在 GitHub 仓库设置

1. 进入仓库 → Settings → Webhooks
2. 点击 "Add webhook"
3. 配置：

| 配置项 | 值 |
|--------|-----|
| Payload URL | `http://你的服务器IP:3000/api/webhook` |
| Content type | application/json |
| Events | Just the push event |

### 7.2 安装 Webhook 服务

创建一个简单的 Webhook 处理脚本：

```bash
# 创建 webhook 处理脚本
cat > /www/wwwroot/Panda001/webhook.js << 'EOF'
const { exec } = require('child_process');

require('http').createServer((req, res) => {
  if (req.url === '/api/webhook' && req.method === 'POST') {
    exec('cd /www/wwwroot/Panda001 && ./deploy.sh', (err, stdout, stderr) => {
      console.log(stdout);
      res.end('OK');
    });
  } else {
    res.end('Not Found');
  }
}).listen(3001);

console.log('Webhook listening on port 3001');
EOF

# 使用 PM2 管理
pm2 start /www/wwwroot/Panda001/webhook.js --name webhook
pm2 save
```

---

## 步骤 8：更新 GitHub Webhook

将 Payload URL 改为：
```
http://223.6.248.154:3001/api/webhook
```

---

## ✅ 使用流程

### 以后更新代码：

```bash
# 1. 修改代码
# 2. 提交
git add .
git commit -m "更新内容"
git push origin main
```

### 自动触发：

1. GitHub 收到推送
2. 发送 Webhook 到服务器
3. 服务器自动执行 `deploy.sh`
4. 重启服务

---

## 故障排查

### 查看部署日志

```bash
pm2 logs Panda001
pm2 logs webhook
```

### 手动触发部署

```bash
cd /www/wwwroot/Panda001
./deploy.sh
```

### 检查 GitHub Webhook 发送状态

在 GitHub 仓库 Settings → Webhooks 中查看 delivery 记录

---

## 📋 快速命令汇总

```bash
# 服务器上常用命令
cd /www/wwwroot/Panda001

# 手动部署
./deploy.sh

# 查看状态
pm2 status

# 查看日志
pm2 logs Panda001

# 重启
pm2 restart Panda001
```

---

## ⚠️ 注意事项

1. **安全**：将 `.env.local` 添加到 `.gitignore`，不要提交到 Git
2. **端口**：确保 3001 端口在防火墙中开放
3. **首次**：首次部署需要手动在服务器上配置好环境

---

*完成配置后，每次 git push 就会自动部署！*
