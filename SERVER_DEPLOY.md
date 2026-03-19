# 沐海签证 - 服务器部署指南

## 服务器信息
- **公网IP**: 223.6.248.154
- **项目目录**: /www/wwwroot/Panda001

---

## 首次部署（只需要执行一次）

### 方式一：使用脚本自动部署

1. 将 `deploy-first.sh` 上传到服务器
2. 执行以下命令：
```bash
# 给脚本添加执行权限
chmod +x deploy-first.sh

# 运行部署脚本
./deploy-first.sh
```

### 方式二：手动执行命令

```bash
# 1. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 2. 安装 PM2
npm install -g pm2

# 3. 克隆项目
cd /www/wwwroot
git clone https://github.com/Laogui-666/Panda001.git
cd Panda001

# 4. 安装依赖
npm install

# 5. 创建环境变量文件
cat > .env.local << 'EOF'
DATABASE_URL=mysql://visa:Laogui%40900327@rm-bp159g3iw669447778o.mysql.rds.aliyuncs.com:3306/visa
DEEPSEEK_API_KEY=sk-490e4bc3829d42738c0944ea9e7abcf2
EOF

# 6. 构建项目
npm run build

# 7. 启动 PM2
pm2 start npm --name "Panda001" -- start
pm2 save
```

---

## 配置宝塔反向代理

1. 登录宝塔面板 (http://223.6.248.154:8888)
2. 点击「网站」
3. 点击你的网站 → 「设置」
4. 点击「反向代理」→ 「添加反向代理」
5. 配置：
   - 代理名称：`Panda001`
   - 目标URL：`http://127.0.0.1:3000`
   - 发送域名：`$host`

---

## 常用命令

```bash
# 查看运行状态
pm2 status

# 查看日志
pm2 logs Panda001

# 重启服务
pm2 restart Panda001

# 停止服务
pm2 stop Panda001
```

---

## 自动部署配置（可选）

### 方式一：手动更新

每次本地代码推送到 GitHub 后，在服务器执行：
```bash
cd /www/wwwroot/Panda001
git pull origin master
npm install
npm run build
pm2 restart Panda001
```

### 方式二：Webhook 自动部署（推荐）

1. 将 `deploy-update.sh` 上传到服务器 `/www/wwwroot/Panda001/`
2. 给脚本添加执行权限：
```bash
chmod +x /www/wwwroot/Panda001/deploy-update.sh
```

3. 在宝塔面板安装「Webhook」插件
4. 添加Webhook，填写：
   - 名称：`自动部署`
   - 脚本路径：`/www/wwwroot/Panda001/deploy-update.sh`

5. 在 GitHub 仓库设置 Webhooks：
   - URL：`http://223.6.248.154:8888/hook?access_key=你的密钥`
   - 事件：选择 `push` 事件

---

## 目录结构

```
/www/wwwroot/Panda001/
├── .env.local          # 环境变量
├── node_modules/       # 依赖
├── .next/              # 构建产物
├── src/                # 源代码
├── package.json
└── deploy-update.sh    # 更新脚本
```
