$content = Get-Content "C:\Users\Administrator\Desktop\muhai001\muhai001\src\app\profile\page.tsx" -Raw -Encoding UTF8
$insertText = @"

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
"@

$newContent = $content -replace '(\];\r?\n\r?\n// 模拟数据\r?\nconst defaultUserInfo)', ($insertText + '$1')
$newContent | Set-Content "C:\Users\Administrator\Desktop\muhai001\muhai001\src\app\profile\page.tsx" -Encoding UTF8 -NoNewline
