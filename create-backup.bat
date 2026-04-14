@echo off
REM Criar backup para apresentação na faculdade

setlocal enabledelayedexpansion

echo 📦 Criando backup para apresentação...
echo.

REM Get timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=%mydate%_%mytime%
set BACKUP_FILE=fintech-presentation-%TIMESTAMP%.zip

echo Arquivo: %BACKUP_FILE%
echo.

REM Check if 7z or tar is available
where 7z >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   Usando 7z...
    7z a "%BACKUP_FILE%" -xr!node_modules -xr!.git README.md ARCHITECTURE.md DEPLOYMENT.md PRESENTATION_GUIDE.md docker-compose.yml backend frontend .github backend\package.json frontend\package.json
) else (
    where tar >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo   Usando tar...
        tar -czf "%BACKUP_FILE%" --exclude=node_modules --exclude=.git README.md ARCHITECTURE.md DEPLOYMENT.md PRESENTATION_GUIDE.md docker-compose.yml backend frontend .github
    ) else (
        echo ❌ Nenhuma ferramenta de compressão encontrada (7z ou tar)
        echo    Instale 7-Zip em: https://7-zip.org/
        pause
        exit /b 1
    )
)

echo.
echo ✅ Backup criado: %BACKUP_FILE%
echo.
echo 📌 Próximos passos:
echo 1. Copia este arquivo para USB
echo 2. Se internet cair na faculdade, você tem tudo offline
echo 3. Descompacta e roda: docker-compose up --build
echo.
pause
