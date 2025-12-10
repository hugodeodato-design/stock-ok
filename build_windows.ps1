# Build script for Windows installer (PowerShell)
Set-StrictMode -Version Latest

Write-Host 'Installing root dependencies...'
npm install

Write-Host 'Installing frontend dependencies...'
Push-Location frontend
npm install
npm run build
Pop-Location

Write-Host 'Installing server dependencies...'
Push-Location server
npm install
Pop-Location

Write-Host 'Running electron-builder...'
npx electron-builder --win --x64

Write-Host 'Build finished. Check dist_electron for installer.'
