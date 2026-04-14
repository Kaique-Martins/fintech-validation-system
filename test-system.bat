@echo off
REM FinTech Validation System - Test Script (Windows)
REM Valida se o projeto inteiro funciona corretamente

setlocal enabledelayedexpansion

cls
echo.
echo 🧪 FinTech Validation System - Test Suite
echo ==========================================
echo.

set TESTS_PASSED=0
set TESTS_FAILED=0

REM Check Node.js
echo   Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   [OK] Node.js instalado
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] Node.js não encontrado
    set /a TESTS_FAILED+=1
)

REM Check npm
echo   Verificando npm...
npm --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   [OK] npm instalado
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] npm não encontrado
    set /a TESTS_FAILED+=1
)

echo.
echo 🔨 BUILD TESTS:
echo.

REM Backend build
echo   Backend build...
cd backend
call npm run build >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   [OK] Backend compila sem erros
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] Backend build falhou
    set /a TESTS_FAILED+=1
)
cd ..

REM Frontend build
echo   Frontend build...
cd frontend
call npm run build >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   [OK] Frontend compila sem erros
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] Frontend build falhou
    set /a TESTS_FAILED+=1
)
cd ..

echo.
echo 📦 FILE CHECKS:
echo.

if exist "docker-compose.yml" (
    echo   [OK] docker-compose.yml existe
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] docker-compose.yml não encontrado
    set /a TESTS_FAILED+=1
)

if exist "README.md" (
    echo   [OK] README.md existe
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] README.md não encontrado
    set /a TESTS_FAILED+=1
)

if exist "ARCHITECTURE.md" (
    echo   [OK] ARCHITECTURE.md existe
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] ARCHITECTURE.md não encontrado
    set /a TESTS_FAILED+=1
)

if exist "PRESENTATION_GUIDE.md" (
    echo   [OK] PRESENTATION_GUIDE.md existe
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] PRESENTATION_GUIDE.md não encontrado
    set /a TESTS_FAILED+=1
)

echo.
echo 📚 CI/CD FILES:
echo.

if exist ".github\workflows\ci-cd.yml" (
    echo   [OK] CI/CD workflow existe
    set /a TESTS_PASSED+=1
) else (
    echo   [FAIL] CI/CD workflow não encontrado
    set /a TESTS_FAILED+=1
)

echo.
echo ==========================================
echo.
echo 📊 RESULTADO:
echo   [OK] Tests Passed: %TESTS_PASSED%
echo   [FAIL] Tests Failed: %TESTS_FAILED%
echo.

if %TESTS_FAILED% equ 0 (
    echo 🎉 TUDO FUNCIONANDO! Projeto pronto para apresentação!
    pause
    exit /b 0
) else (
    echo ⚠️  %TESTS_FAILED% testes falharam. Verifique os erros.
    pause
    exit /b 1
)
