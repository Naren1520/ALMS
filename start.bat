@echo off
title ALMS — Artisan Linkage and Market System [Launcher]
color 0E

set "ROOT_DIR=%~dp0"

echo ===============================================================================
echo                ALMS - ARTISAN LINKAGE AND MARKET SYSTEM
echo          Ministry of Social Justice and Empowerment (MoSJE)
echo             Smart India Hackathon 2026 - Problem Statement 26090
echo ===============================================================================
echo.
echo  Starting all 3 ALMS microservice tiers:
echo   [1/3] FastAPI AI Service   -^> http://localhost:8000 (Docs: :8000/docs)
echo   [2/3] NestJS Backend API   -^> http://localhost:8080 (API: :8080/api/v1)
echo   [3/3] Next.js Frontend App -^> http://localhost:3000
echo.
echo ===============================================================================
echo.

:: 1. Launch AI Service (FastAPI)
echo [1/3] Launching FastAPI AI Microservice on port 8000...
start "ALMS - AI Microservice (FastAPI :8000)" cmd /k "cd /d "%ROOT_DIR%ai_service" && echo Starting FastAPI AI Service on port 8000... && python -m uvicorn main:app --reload --port 8000"
timeout /t 2 /nobreak >nul

:: 2. Launch Backend (NestJS)
echo [2/3] Launching NestJS Backend on port 8080...
start "ALMS - Backend API (NestJS :8080)" cmd /k "cd /d "%ROOT_DIR%backend" && echo Starting NestJS API Gateway on port 8080... && npm run start:dev"
timeout /t 2 /nobreak >nul

:: 3. Launch Frontend (Next.js)
echo [3/3] Launching Next.js Frontend on port 3000...
start "ALMS - Frontend Web App (Next.js :3000)" cmd /k "cd /d "%ROOT_DIR%frontend" && echo Starting Next.js App Router on port 3000... && npm run dev"

echo.
echo ===============================================================================
echo  SUCCESS: All 3 services have been launched in dedicated terminal windows!
echo ===============================================================================
echo.
echo  Access Points:
echo    • Frontend Web Application : http://localhost:3000
echo    • AI Studio & Cataloger    : http://localhost:3000/artisan/create-product
echo    • Interactive Craft Atlas  : http://localhost:3000/craft-atlas
echo    • Backend REST API         : http://localhost:8080/api/v1
echo    • FastAPI AI Swagger Docs  : http://localhost:8000/docs
echo.
echo  Press [O] to open http://localhost:3000 in your browser, or any other key to exit launcher.
set /p USER_CHOICE="Selection: "

if /i "%USER_CHOICE%"=="O" (
    start http://localhost:3000
)

exit /b 0
