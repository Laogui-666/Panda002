$dirs = Get-ChildItem 'C:\Program Files*' -Directory
foreach ($dir in $dirs) {
    if ($dir.Name -like '*wps*' -or $dir.Name -like '*kingsoft*' -or $dir.Name -like '*office*') {
        Write-Host $dir.Name
    }
}
