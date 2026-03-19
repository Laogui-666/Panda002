$filePath = "C:\Users\Administrator\Desktop\muhai001\muhai001\src\app\profile\page.tsx"
$content = Get-Content $filePath -Raw -Encoding UTF8

$searchPattern = @'
];

// 模拟数据
const userInfo = {
'@

$replacePattern = @'
];

// 获取存储的用户信息（用于静态部署）
const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('panda_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// 模拟数据
const userInfo = {
'@

$newContent = $content -replace [regex]::Escape($searchPattern), $replacePattern
$newContent | Set-Content $filePath -Encoding UTF8 -NoNewline
Write-Host "Done"
