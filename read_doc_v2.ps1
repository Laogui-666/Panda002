try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = $false
    
    $docPath = "D:\新建文件夹\wps同步\(A材料模板)\A各种材料模板\在职中文模板.doc"
    Write-Host "Opening: $docPath"
    
    $doc = $word.Documents.Open($docPath)
    
    # Get all text content
    $fullText = $doc.Content.Text
    
    # Get paragraphs to understand structure
    $paraCount = $doc.Paragraphs.Count
    Write-Host "Paragraph count: $paraCount"
    
    # Get tables if any
    $tableCount = $doc.Tables.Count
    Write-Host "Table count: $tableCount"
    
    $doc.Close($false)
    $word.Quit($false)
    
    # Release COM objects
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    
    # Force garbage collection
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
    
    Write-Host "=== DOCUMENT CONTENT ==="
    Write-Host $fullText
    
} catch {
    Write-Host "ERROR: $_"
    Write-Host "Stack Trace: $($_.ScriptStackTrace)"
    if ($word) {
        try { $word.Quit($false) } catch {}
    }
}
