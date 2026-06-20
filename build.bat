@echo off
echo.
echo =============================
echo   UIForge - Builder
echo =============================
echo.

echo [1/3] Baue Frontend (Vite + React^)...
call npm run build
if %errorlevel% neq 0 ( echo FEHLER & pause & exit /b 1 )

echo [2/3] Erstelle Server-Bundle fuer Node.js...

if exist deploy rmdir /s /q deploy
mkdir deploy

copy index.js deploy\
copy package.json deploy\
if exist dist (
  xcopy /e /i /q dist deploy\dist
)

echo.
echo ========================================
echo   BUILD ERFOLGREICH!
echo ========================================
echo.
echo   Ordner: deploy\ (auf Server kopieren)
echo.
echo   INSTALLATION AUF DEM SERVER:
echo   cd deploy
echo   npm install
echo   node index.js
echo.
echo   Browser: http://localhost:3004
echo.
