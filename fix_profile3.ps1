$filePath = "C:\Users\Administrator\Desktop\muhai001\muhai001\src\app\profile\page.tsx"
$content = Get-Content $filePath -Raw -Encoding UTF8

# Check what line endings exist
$hasCRLF = $content -match "`r`n"
$hasLF = $content -match "(?<![`r])`n"

Write-Host "Has CRLF: $hasCRLF"
Write-Host "Has LF: $hasLF"

# Try both patterns
$search1 = "];`n`n// 模拟数据`nconst userInfo = {"
$search2 = "];`r`n`r`n// 模拟数据`r`nconst userInfo = {"

$replace = "];`n`n// 获取存储的用户信息（用于静态部署）`nconst getStoredUser = () => {`n  if (typeof window === 'undefined') return null;`n  try {`n    const stored = localStorage.getItem('panda_user');`n    return stored ? JSON.parse(stored) : null;`n  } catch {`n    return null;`n  }`n};`n`n// 模拟数据`nconst userInfo = {"

if ($content.Contains($search1)) {
    $newContent = $content.Replace($search1, $replace)
    $newContent | Set-Content $filePath -Encoding UTF8 -NoNewline
    Write-Host "Replaced using LF pattern"
} elseif ($content.Contains($search2)) {
    $newContent = $content.Replace($search2, $replace)
    $newContent | Set-Content $filePath -Encoding UTF8 -NoNewline
    Write-Host "Replaced using CRLF pattern"
} else {
    Write-Host "Pattern not found - trying to debug"
    # Find the line with ];
    $lines = $content -split "`n"
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match '^\];$') {
            Write-Host "Found ]; at line $i"
            Write-Host "Next line: '$($lines[$i+1])'"
            Write-Host "Next+1 line: '$($lines[$i+2])'"
        }
    }
}
