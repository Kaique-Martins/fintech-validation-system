@echo off
REM Demo Script - Run everything needed for presentation (Windows)

cls
echo.
echo 🎬 FinTech Validation System - Demo Setup
echo ========================================
echo.

echo 📋 Opções:
echo   1 - Start Backend (localhost:3001)
echo   2 - Start Frontend (localhost:3000)
echo   3 - Start Both (Docker Compose)
echo   4 - Run Tests
echo   5 - Clean ^& Rebuild
echo.
set /p choice="Escolha uma opção (1-5): "

if "%choice%"=="1" (
    cls
    echo.
    echo Starting Backend...
    cd backend
    echo Installing dependencies...
    call npm install
    echo.
    echo 🚀 Backend starting...
    call npm run start:dev
)

if "%choice%"=="2" (
    cls
    echo.
    echo Starting Frontend...
    cd frontend
    echo Installing dependencies...
    call npm install
    echo.
    echo 🚀 Frontend starting...
    call npm run dev
)

if "%choice%"=="3" (
    cls
    echo.
    echo Starting Both with Docker Compose...
    echo.
    docker-compose up --build
)

if "%choice%"=="4" (
    cls
    echo.
    echo Running Tests...
    echo.
    call test-system.bat
)

if "%choice%"=="5" (
    cls
    echo.
    echo Clean ^& Rebuild...
    echo.
    
    echo Cleaning backend...
    cd backend
    if exist "node_modules" rmdir /s /q node_modules
    if exist "dist" rmdir /s /q dist
    call npm install
    call npm run build
    
    echo.
    echo Cleaning frontend...
    cd ..\frontend
    if exist "node_modules" rmdir /s /q node_modules
    if exist "dist" rmdir /s /q dist
    call npm install
    call npm run build
    
    echo.
    echo ✅ Clean ^& Rebuild Complete!
    pause
)
