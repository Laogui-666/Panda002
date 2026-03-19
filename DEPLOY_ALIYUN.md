# 阿里云服务器部署指南

> 由于无法直接 SSH 访问，请按以下步骤手动部署

---

## 方式一：通过宝塔终端部署

### 步骤 1：在本地打包项目

在本地项目目录执行：
```bash
npm run build
```

这将生成 `.next` 目录

### 步骤 2：上传文件

通过宝塔文件管理器上传以下文件/目录到 `/www/wwwroot/Panda001/`：

1. `.next/` 目录
2. `package.json`
3. `package-lock.json`
4. `src/` 目录
5. `skills/` 目录
6. `public/` 目录（如果有）
7. `.env.local`
8. `next.config.js`
9. `tailwind.config.js`
10. `tsconfig.json`
11. `postcss.config.js`

### 步骤 3：在宝塔终端执行

登录宝塔面板 → 终端 → 执行以下命令：

```bash
# 进入项目目录
cd /www/wwwroot/Panda001

# 安装依赖
npm install

# 安装 PM2（如果没有）
npm install -g pm2

# 启动应用
pm2 start npm --name "Panda001" -- start

# 设置开机自启
pm2 startup
pm2 save
```

---

## 方式二：通过本地脚本部署（推荐）

### 步骤 1：确保本地有 SSH 密钥

```bash
# 生成本地 SSH 密钥（如果还没有）
ssh-keygen -t rsa
```

### 步骤 2：复制公钥到服务器

```bash
# 复制公钥
ssh-copy-id root@223.6.248.154
# 输入服务器 root 密码
```

### 步骤 3：运行部署脚本

```bash
chmod +x deploy-aliyun.sh
./deploy-aliyun.sh
```

---

## 验证部署

部署成功后，访问：

| 服务 | 地址 |
|------|------|
| 网站首页 | http://223.6.248.154:3000 |
| API 端点 | http://223.6.248.154:3000/api/skills/execute |
| 文档解析 | http://223.6.248.154:3000/api/skills/parse |

---

## 常用命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs Panda001

# 重启
pm2 restart Panda001

# 停止
pm2 stop Panda001
```

---

## 故障排查

### 1. 端口被占用

```bash
# 查看端口占用
lsof -i:3000

# 释放端口
kill -9 <PID>
```

### 2. 数据库连接失败

检查 `.env.local` 中的 `DATABASE_URL` 是否正确

### 3. API Key 未生效

确保 `.env.local` 文件已正确上传且包含正确的 API Key
