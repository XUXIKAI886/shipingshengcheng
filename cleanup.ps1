# 停止所有Node进程
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 停止占用3000和3001端口的进程
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $connections = netstat -ano | Select-String ":$port"
    if ($connections) {
        $connections | ForEach-Object {
            $line = $_ -replace '\s+', ' '
            $pid = ($line -split ' ')[-1]
            if ($pid -match '^\d+$') {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Host "所有相关进程已停止"
