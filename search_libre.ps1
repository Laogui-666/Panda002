$dirs = Get-ChildItem 'C:\Program Files*' -Directory
foreach ($dir in $dirs) {
    if ($dir.Name -like '*ibre*' -or $dir.Name -like '*Libre*') {
        Write-Host $dir.Name
    }
}

$dirs2 = Get-ChildItem 'C:\Program Files (x86)*' -Directory -ErrorAction SilentlyContinue
foreach ($dir in $dirs2) {
    if ($dir.Name -like '*ibre*' -or $dir.Name -like '*Libre*') {
        Write-Host $dir.Name
    }
}
