# 部署到阿里云服务器
$ErrorActionPreference = "Stop"

$serverIP = "223.6.248.154"
$serverUser = "root"
$serverPort = "22"
$appDir = "/www/wwwroot/Panda001"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  沐海签证 - 阿里云部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 检查本地构建
Write-Host "检查本地构建..." -ForegroundColor Yellow
if (-not (Test-Path ".next")) {
    Write-Host "错误: 未找到构建目录 .next" -ForegroundColor Red
    Write-Host "请先运行: npm run build" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 构建目录已就绪" -ForegroundColor Green

# 创建部署目录
Write-Host "创建部署包..." -ForegroundColor Yellow
if (Test-Path "deployment") { Remove-Item -Recurse -Force "deployment" }
New-Item -ItemType Directory -Path "deployment" | Out-Null

# 复制必要文件
Copy-Item -Recurse ".next" "deployment\"
Copy-Item "package.json" "deployment\"
Copy-Item "package-lock.json" "deployment\"
Copy-Item "next.config.js" "deployment\"
Copy-Item "tailwind.config.js" "deployment\"
Copy-Item "tsconfig.json" "deployment\"
Copy-Item "postcss.config.js" "deployment\"

# 复制 src 目录
if (Test-Path "src") { Copy-Item -Recurse "src" "deployment\" }

# 复制 public 目录
if (Test-Path "public") { Copy-Item -Recurse "public" "deployment\" }

# 复制 skills 目录
if (Test-Path "skills") { Copy-Item -Recurse "skills" "deployment\" }

# 复制环境变量
if (Test-Path ".env.local") { Copy-Item ".env.local" "deployment\" }

# 复制PM2配置文件
if (Test-Path "ecosystem.config.js") { Copy-Item "ecosystem.config.js" "deployment\" }
if (Test-Path "ecosystem.start.sh") { Copy-Item "ecosystem.start.sh" "deployment\" }

# 打包
Write-Host "打包文件..." -ForegroundColor Yellow
Compress-Archive -Path "deployment\*" -DestinationPath "Panda001-deploy.zip" -Force
Remove-Item -Recurse -Force "deployment"

Write-Host "✓ 部署包创建完成: Panda001-deploy.zip" -ForegroundColor Green

# 上传到服务器
Write-Host "上传到服务器..." -ForegroundColor Yellow
$zipPath = (Resolve-Path "Panda001-deploy.zip").Path

# 使用 scp 上传
$uploadCmd = "scp -P $serverPort `"$zipPath`" $serverUser@$serverIP`:$appDir/"
Write-Host "执行: $uploadCmd"

# 创建远程目录
ssh -p $serverPort "$serverUser@$serverIP" "mkdir -p $appDir"

# 上传文件
& scp -P $serverPort $zipPath "$serverUser@$serverIP`:$appDir/"

# 在服务器上执行部署
Write-Host "在服务器上部署..." -ForegroundColor Yellow
ssh -p $serverPort "$serverUser@$serverIP" @"
cd $appDir
Expand-Archive -Force Panda001-deploy.zip -DestinationPath .
Remove-Item Panda001-deploy.zip
npm install
pm2 stop Panda001 2>`$null || `$true
pm delete Panda001 2>`$null || `$true
pm2 start npm --name "Panda001" -- start
pm2 save
echo "部署完成!"
pm2 list
"@

Write-Host "========================================" -ForegroundColor Green
Write-Host "  部署完成!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "访问地址: http://$serverIP`:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
