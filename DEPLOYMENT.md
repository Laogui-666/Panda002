# 沐海签证 - 自有服务器部署指南

> 本文档指导您将项目部署到您自己的服务器和数据库

---

## 📋 部署前准备

### 1. 服务器要求

| 资源 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 2 核 | 4 核 |
| 内存 | 4 GB | 8 GB |
| 硬盘 | 40 GB | 100 GB |
| 带宽 | 5 Mbps | 10 Mbps |

### 2. 推荐的服务器/云服务

- **国内**: 阿里云、腾讯云、华为云
- **国外**: AWS、DigitalOcean、Linode、Vultr

### 3. 需要安装的软件

- Node.js 18+ 
- npm 或 yarn
- PostgreSQL 或 MySQL (可选，用于数据持久化)
- PM2 (Node.js 进程管理器)
- Nginx (反向代理，可选)

---

## 🔧 环境变量配置

在项目根目录创建 `.env.local` 文件：

```env
# ===========================================
# 基础配置
# ===========================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# ===========================================
# 数据库 (如使用)
# ===========================================
DATABASE_URL=postgresql://username:password@localhost:5432/Panda001

# ===========================================
# API Keys (保护在服务器端)
# ===========================================
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAP_API_KEY=your_google_map_api_key

# OpenAI API Key (用于 AI 文档解析)
OPENAI_API_KEY=sk-xxxxx

# Azure Vision OCR (可选，用于 PDF/图片文字识别)
AZURE_VISION_KEY=your_azure_vision_key
AZURE_VISION_ENDPOINT=https://your-endpoint.cognitiveservices.azure.com/

# ===========================================
# 文件处理配置
# ===========================================
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=.pdf,.docx,.doc,.jpg,.jpeg,.png

# ===========================================
# Skills 路径配置
# ===========================================
SKILLS_PATH=./skills
```

---

## 🚀 部署步骤

### 方式一：使用 PM2 部署 (推荐)

#### 1. 上传项目到服务器

```bash
# 在本地打包
npm run build

# 上传以下文件/文件夹到服务器:
# - out/ (构建输出)
# - public/ (静态资源)
# - .env.local (环境变量)
# - package.json
# - package-lock.json
# - next.config.js
# - node_modules/ (或使用 npm install)
```

#### 2. 在服务器上安装依赖

```bash
npm install
```

#### 3. 使用 PM2 启动应用

```bash
# 安装 PM2
npm install -g pm2

# 启动应用 (生产模式)
pm2 start npm --name "Panda001" -- start

# 设置开机自启
pm2 startup
pm2 save
```

#### 4. 配置 Nginx (可选)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        # 静态部署 (使用 out 目录)
        root /var/www/Panda001/out;
        try_files $uri $uri.html /index.html;
        
        # 启用缓存
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理 (如果使用 Next.js API)
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 方式二：使用 Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm install --production

# 复制应用代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/Panda001
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: Panda001
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 3. 启动服务

```bash
docker-compose up -d
```

---

### 方式三：静态部署 (纯前端)

如果您只需要静态页面部署（不需要后端 API）：

```bash
# 构建静态版本
npm run build

# out 目录包含所有静态文件
# 直接将 out 目录内容部署到任何静态托管服务
```

**支持的静态托管**:
- Vercel (官方支持)
- Netlify
- 阿里云 OSS
- 腾讯云 COS
- GitHub Pages

---

## 🗄️ 数据库设置 (可选)

### 使用 Supabase (推荐)

1. 访问 [supabase.com](https://supabase.com) 创建项目
2. 获取连接字符串
3. 在 `.env.local` 中配置 `DATABASE_URL`

### 使用自建 PostgreSQL

```bash
# 创建数据库
createdb Panda001

# 创建用户
createuser muhai_user with password 'your_password';

# 授权
grant all privileges on database Panda001 to muhai_user;
```

---

## 🔒 安全建议

### 1. 使用 .env 文件

确保 `.env.local` 不提交到 Git：

```bash
# .gitignore 中添加
.env.local
.env.production
```

### 2. 定期更新 API Keys

- 定期更换 OpenAI API Key
- 使用环境变量，不要硬编码

### 3. 启用 HTTPS

```nginx
# Nginx 配置 SSL
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # ... 其他配置
}
```

### 4. 防火墙配置

```bash
# 只开放必要端口
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

---

## 📊 部署检查清单

- [ ] 服务器环境准备完成
- [ ] 环境变量配置完成
- [ ] 域名解析配置完成 (如使用域名)
- [ ] SSL 证书配置完成 (推荐)
- [ ] 数据库配置完成 (如使用)
- [ ] 构建测试通过 (`npm run build`)
- [ ] PM2/Docker 服务启动成功
- [ ] Nginx 反向代理配置完成 (如使用)
- [ ] 防火墙配置完成

---

## 🔧 常用命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs Panda001

# 重启应用
pm2 restart Panda001

# 停止应用
pm2 stop Panda001

# 重新加载 (零 downtime)
pm2 reload Panda001
```

---

## 📞 后续步骤

1. **购买服务器**: 选择云服务商，购买服务器
2. **配置域名**: 将域名解析到服务器 IP
3. **上传代码**: 使用 FTP/SCP/Git 上传项目
4. **配置环境变量**: 创建 .env.local
5. **启动服务**: 使用 PM2 或 Docker
6. **配置 Nginx**: 设置反向代理和 SSL

---

*如需进一步帮助，请告知您的服务器配置和具体需求*
