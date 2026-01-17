# start-app.ps1

Write-Host "Starting Room Scene Visualizer..." -ForegroundColor Cyan

$root = Get-Location

# Start Backend in a new PowerShell window
Write-Host "Launching Backend Server..." -ForegroundColor Green
# We use Set-Location to ensure we are in the correct directory regardless of how the script is called if running from root
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$root\server'; ..\.venv\Scripts\activate; python main.py}"

# Start Frontend in the current window
Write-Host "Launching Frontend Client..." -ForegroundColor Green
Set-Location "$root\client"
npm run dev
