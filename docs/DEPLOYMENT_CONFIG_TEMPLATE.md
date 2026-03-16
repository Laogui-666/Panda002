# 服务器部署环境变量配置

## ⚠️ 重要提示

**请勿将此文件提交到GitHub！**

在服务器上创建 `.env.local` 文件，添加以下内容：

---

## 环境变量配置模板

```bash
# 数据库配置
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# 服务器配置
PORT=3000
NODE_ENV=production

# AI服务API密钥
SILICONFLOW_API_KEY=your_siliconflow_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# 阿里云OSS配置
OSS_REGION=your_oss_region
OSS_ACCESS_KEY_ID=your_oss_access_key_id
OSS_ACCESS_KEY_SECRET=your_oss_access_key_secret
OSS_BUCKET=your_oss_bucket

# API地址
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 获取配置的方法

### 1. 数据库配置
- 如果使用阿里云RDS，请在阿里云控制台获取连接信息

### 2. AI服务API密钥
- **SiliconFlow**: https://siliconflow.cn
- **DeepSeek**: https://platform.deepseek.com

### 3. 阿里云OSS
- 登录阿里云控制台 -> 对象存储OSS -> 创建Bucket后获取配置

---

## 部署步骤

```bash
# 1. 进入项目目录
cd /www/wwwroot/Panda001

# 2. 创建环境变量文件
nano .env.local

# 3. 粘贴上述配置（替换为实际值）

# 4. 安装依赖
npm install

# 5. 构建项目
npm run build

# 6. 使用PM2启动
pm2 start ecosystem.config.js --env production
pm2 save
```

---

## 安全建议

1. **定期更换API密钥** - 建议每3个月更换一次
2. **限制数据库访问IP** - 在阿里云RDS中设置白名单
3. **使用HTTPS** - 生产环境务必使用HTTPS
4. **日志监控** - 定期检查访问日志，及时发现异常
