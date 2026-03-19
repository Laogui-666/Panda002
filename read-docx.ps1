# Read Word Document
$docPath = "D:\新建文件夹\wps同步\(A材料模板)\AI项目\签证平台\模块化后台管理系统框架.docx"

# Try to read using COM object
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open($docPath)
    $content = $doc.Content.Text
    $doc.Close($false)
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    Write-Output $content
} catch {
    # Fallback: try to extract as zip and read xml
    Write-Output "Trying alternative method..."
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($docPath)
    $entry = $zip.Entries | Where-Object { $_.FullName -match "word/document.xml" }
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $xmlContent = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        
        # Extract text from XML
        $xml = [xml]$xmlContent
        $ns = @{w = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        $texts = Select-Xml -Xml $xml -XPath "//w:t" -Namespace $ns
        foreach ($t in $texts) {
            Write-Output $t.Node.InnerText
        }
    }
    $zip.Dispose()
}
