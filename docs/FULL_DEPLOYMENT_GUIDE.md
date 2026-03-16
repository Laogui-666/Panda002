# 盼达旅行 - 服务器完整部署指南

## 服务器信息
- **IP地址**: 223.6.248.154
- **SSH端口**: 22 (默认)
- **网站目录**: /www/wwwroot/Panda001

---

## 第一步：连接服务器

在本地终端执行：

```bash
ssh root@223.6.248.154
```

输入密码后登录服务器。

---

## 第二步：进入项目目录并拉取代码

```bash
# 进入网站目录
cd /www/wwwroot/Panda001

# 拉取最新代码（如果已有代码）
git pull origin master

# 如果是新服务器，先克隆仓库
# cd /www/wwwroot
# git clone https://github.com/Laogui-666/Panda001.git Panda001
# cd Panda001
```

---

## 第三步：创建环境变量文件（关键步骤）

```bash
# 在项目目录下创建 .env.local 文件
nano .env.local
```

**复制以下内容粘贴进去（注意替换为您的真实值）：**

```bash
# ============================================
# 数据库配置（请替换为您的真实值）
# ============================================
DB_HOST=your_db_host.mysql.rds.aliyuncs.com
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# ============================================
# 服务器配置
# ============================================
PORT=3000
NODE_ENV=production

# ============================================
# AI服务API密钥（请替换为您的真实值）
# ============================================
SILICONFLOW_API_KEY=your_siliconflow_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# ============================================
# 阿里云OSS对象存储配置（请替换为您的真实值）
# ============================================
OSS_REGION=your_oss_region
OSS_ACCESS_KEY_ID=your_oss_access_key_id
OSS_ACCESS_KEY_SECRET=your_oss_access_key_secret
OSS_BUCKET=your_oss_bucket

# ============================================
# API地址配置
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**保存并退出：**
- 按 `Ctrl + O` 保存
- 按 `Enter` 确认
- 按 `Ctrl + X` 退出

---

## 第四步：安装PM2（如果没有）

```bash
# 安装 Node.js（如果没有）
# curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
# apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 设置开机自启
pm2 startup
```

---

## 第五步：安装依赖并构建

```bash
# 进入项目目录
cd /www/wwwroot/Panda001

# 安装依赖
npm install

# 构建项目
npm run build
```

---

## 第六步：启动服务

```bash
# 使用 PM2 启动（生产模式）
pm2 start ecosystem.config.js --env production

# 查看启动状态
pm2 status

# 查看日志
pm2 logs
```

---

## 第七步：保存PM2配置

```bash
# 保存当前运行状态（开机自启需要）
pm2 save

# 设置开机自启
pm2 startup
```

---

## 第八步：配置Nginx反向代理（可选但推荐）

```bash
# 安装 Nginx
apt-get install -y nginx

# 创建站点配置
nano /etc/nginx/sites-available/panda001
```

**添加以下配置：**

```nginx
server {
    listen 80;
    server_name 223.6.248.154;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**启用配置：**

```bash
# 启用站点
ln -s /etc/nginx/sites-available/panda001 /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

---

## 第九步：开放端口

```bash
# 开放 3000 端口（PM2使用）
firewall-cmd --permanent --add-port=3000/tcp

# 开放 80 端口
firewall-cmd --permanent --add-port=80/tcp

# 重启防火墙
firewall-cmd --reload
```

---

## 常用命令

```bash
# 查看网站状态
pm2 status

# 查看实时日志
pm2 logs

# 重启网站
pm2 restart all

# 停止网站
pm2 stop all

# 重新加载（不中断服务）
pm2 reload all
```

---

## 访问网站

部署完成后，通过以下地址访问：

- **IP地址访问**: http://223.6.248.154
- **管理后台**: http://223.6.248.154/admin

---

## 测试登录

- **普通用户**: user123 / user123
- **管理员**: admin / admin123

---

## 注意事项

1. **.env.local 文件必须创建**，否则网站无法读取数据库和API密钥
2. **确保PM2处于运行状态**，`pm2 status` 显示 "online"
3. **如果无法访问**，检查防火墙端口是否开放

---

**创建日期**: 2026-03-16
