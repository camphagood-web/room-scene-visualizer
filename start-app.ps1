# ./start-app.ps1

Write-Host "Starting Room Scene Visualizer..." -ForegroundColor Cyan

$root = Get-Location

function Stop-ProcessOnPort {
    param(
        [int]$Port,
        [string[]]$AllowedNames = @()
    )

    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $connections) {
        return
    }

    foreach ($conn in $connections) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if (-not $proc) {
            continue
        }

        if ($AllowedNames.Count -eq 0 -or $AllowedNames -contains $proc.Name) {
            Write-Host "Stopping process on port ${Port}: $($proc.Name) (PID $($proc.Id))" -ForegroundColor Yellow
            try {
                Stop-Process -Id $proc.Id -ErrorAction Stop
            } catch {
                Write-Host "Failed to stop PID $($proc.Id) on port $Port. Stop it manually." -ForegroundColor Red
            }
        } else {
            Write-Host "Port ${Port} is in use by $($proc.Name) (PID $($proc.Id)). Stop it manually if needed." -ForegroundColor Yellow
        }
    }
}

# Stop existing backend/frontend if they are already running on dev ports
Stop-ProcessOnPort -Port 8000 -AllowedNames @('python', 'uvicorn')
Stop-ProcessOnPort -Port 5173 -AllowedNames @('node', 'npm', 'pnpm', 'yarn', 'bun')

# Start Backend in a new PowerShell window
Write-Host "Launching Backend Server..." -ForegroundColor Green
# We use Set-Location to ensure we are in the correct directory regardless of how the script is called if running from root
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$root\server'; ..\.venv\Scripts\activate; python main.py}"

# Start Frontend in the current window
Write-Host "Launching Frontend Client..." -ForegroundColor Green
Set-Location "$root\client"
npm run dev
