$filePath = "C:\Users\Administrator\Desktop\muhai001\muhai001\src\app\profile\page.tsx"
$content = Get-Content $filePath -Raw -Encoding UTF8

$searchPattern = "];`r`n`r`n// 模拟数据`r`nconst userInfo = {"
$replacePattern = "];`r`n`r`n// 获取存储的用户信息（用于静态部署）`r`nconst getStoredUser = () => {`r`n  if (typeof window === 'undefined') return null;`r`n  try {`r`n    const stored = localStorage.getItem('panda_user');`r`n    return stored ? JSON.parse(stored) : null;`r`n  } catch {`r`n    return null;`r`n  }`r`n};`r`n`r`n// 模拟数据`r`nconst userInfo = {"

$newContent = $content.Replace($searchPattern, $replacePattern)
$newContent | Set-Content $filePath -Encoding UTF8 -NoNewline
Write-Host "Done - Replacement made"
