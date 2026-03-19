# Check file header to determine actual format
$filePath = "C:\Users\Administrator\Desktop\muhai001\muhai001\在职中文模板.doc"

# Read first 4 bytes to check file signature
$stream = [System.IO.File]::OpenRead($filePath)
$header = New-Object byte[] 4
$stream.Read($header, 0, 4) | Out-Null
$stream.Close()

Write-Host "File header bytes: $($header -join ', ')"

# Check magic numbers
# DOCX/ZIP: 50 4B 03 04
# DOC (old): D0 CF 11 E0
if ($header[0] -eq 0x50 -and $header[1] -eq 0x4B -and $header[2] -eq 0x03 -and $header[3] -eq 0x04) {
    Write-Host "File is actually a ZIP/DOCX format"
} elseif ($header[0] -eq 0xD0 -and $header[1] -eq 0xCF -and $header[2] -eq 0x11 -and $header[3] -eq 0xE0) {
    Write-Host "File is old DOC format (OLE)"
} else {
    Write-Host "Unknown format"
}
