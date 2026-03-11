# Check file header to determine actual format
$filePath = "C:\Users\Administrator\Desktop\muhai001\muhai001\在职中文模板.doc"

# Read first 8 bytes to check file signature
$stream = [System.IO.File]::OpenRead($filePath)
$header = New-Object byte[] 8
$stream.Read($header, 0, 8) | Out-Null
$stream.Close()

Write-Host "File header bytes (hex): $($header | ForEach-Object { '{0:X2}' -f $_ })"
Write-Host "File header bytes (dec): $($header -join ', ')"

# Check magic numbers
# DOCX/ZIP: 50 4B 03 04
# DOC (old): D0 CF 11 E0
if ($header[0] -eq 0x50 -and $header[1] -eq 0x4B) {
    Write-Host "File is actually a ZIP/DOCX format"
    # Rename to docx
    $newPath = $filePath -replace '\.doc$', '.docx'
    Rename-Item -Path $filePath -NewName "在职中文模板_temp.docx"
    Write-Host "Renamed to: $('在职中文模板_temp.docx')"
} elseif ($header[0] -eq 0xD0 -and $header[1] -eq 0xCF) {
    Write-Host "File is old DOC format (OLE)"
} else {
    Write-Host "Unknown format - trying to read anyway"
}
