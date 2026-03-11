$filePath = "D:\新建文件夹\wps同步\(A材料模板)\A各种材料模板\在职中文模板.doc"
$bytes = [System.IO.File]::ReadAllBytes($filePath)

# Try to extract text using different encodings
Write-Host "=== Trying UTF-16 LE ==="
$text1 = [System.Text.Encoding]::Unicode.GetString($bytes)
Write-Host $text1.Substring(0, [Math]::Min(2000, $text1.Length))

Write-Host "=== Trying UTF-8 ==="
$text2 = [System.Text.Encoding]::UTF8.GetString($bytes)
Write-Host $text2.Substring(0, [Math]::Min(2000, $text2.Length))
