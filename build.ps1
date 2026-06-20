param(
  [switch]$Quick
)

Write-Host "=============================" -ForegroundColor Cyan
Write-Host "  UIForge - Builder" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

if (-not $Quick) {
  Write-Host "[1/3] Installiere Frontend-Dependencies..." -ForegroundColor Yellow
  npm install
  if ($LASTEXITCODE -ne 0) { Write-Host "FEHLER bei npm install" -ForegroundColor Red; exit 1 }
}

Write-Host "[1/3] Baue Frontend (Vite + React)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "FEHLER beim Frontend-Build" -ForegroundColor Red; exit 1 }

Write-Host "[2/3] Erstelle Server-Bundle fur Node.js..." -ForegroundColor Yellow
$deployDir = Join-Path $PSScriptRoot "deploy"
if (Test-Path $deployDir) { Remove-Item -Recurse -Force $deployDir }
New-Item -ItemType Directory -Path $deployDir -Force | Out-Null

Copy-Item -LiteralPath (Join-Path $PSScriptRoot "index.js") -Destination (Join-Path $deployDir "index.js")
Copy-Item -LiteralPath (Join-Path $PSScriptRoot "package.json") -Destination (Join-Path $deployDir "package.json")

$distDir = Join-Path $PSScriptRoot "dist"
if (Test-Path $distDir) {
  Copy-Item -Recurse -LiteralPath $distDir -Destination (Join-Path $deployDir "dist")
}

$size = (Get-ChildItem -Recurse $deployDir | Measure-Object -Property Length -Sum).Sum / 1MB
$sizeStr = "{0:N1}" -f $size

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  BUILD ERFOLGREICH!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Ordner:     deploy\ (auf Server kopieren)"
Write-Host ("  Groesse:    {0} MB" -f $sizeStr)
Write-Host ""
Write-Host "  INSTALLATION AUF DEM SERVER:" -ForegroundColor Yellow
Write-Host "  cd deploy" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  node index.js" -ForegroundColor White
Write-Host ""
Write-Host "  Browser:    http://localhost:3004" -ForegroundColor Cyan
Write-Host "  Port:       3004 (andert via env PORT=xxxx)"
Write-Host ""
