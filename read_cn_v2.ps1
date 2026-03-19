try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = $false
    
    $docPath = "C:\Users\Administrator\Desktop\muhai001\muhai001\在职中文模板.doc"
    Write-Host "Opening: $docPath"
    
    $doc = $word.Documents.Open($docPath)
    
    # Get all text content
    $fullText = $doc.Content.Text
    
    # Get document properties
    $paraCount = $doc.Paragraphs.Count
    $tableCount = $doc.Tables.Count
    
    Write-Host "Paragraph count: $paraCount"
    Write-Host "Table count: $tableCount"
    Write-Host ""
    
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
