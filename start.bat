@echo off
chcp 65001 >nul
title Code Learning Platform

echo ========================================
echo   Code Learning Platform - Startup
echo ========================================
echo.

:: Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js not found! Install from https://nodejs.org/
    pause
    exit /b 1
)

:: Show versions
echo [INFO] Node.js version:
node -v
echo [INFO] npm version:
call npm -v
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
)

:: Set environment variables
set PORT=5000
set API_PORT=5001
set EXECUTOR_PORT=5002
set NEXT_PUBLIC_API_URL=http://localhost:5001
set NEXT_PUBLIC_WS_URL=ws://localhost:5001
set CORS_ORIGIN=http://localhost:5000
set EXECUTOR_URL=http://localhost:5002

echo [INFO] Ports:
echo   Frontend:      http://localhost:5000
echo   API Backend:   http://localhost:5001
echo   Code Executor: http://localhost:5002
echo.
echo [INFO] Starting development servers...
echo   Press Ctrl+C to stop all services
echo ========================================
echo.

:: Start all services via turbo
call npx turbo run dev --parallel
