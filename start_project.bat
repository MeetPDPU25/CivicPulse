@echo off
title CivicPulse Launcher
echo ========================================================
echo   Launching CivicPulse System
echo ========================================================
echo.

echo [1/3] Starting Backend Server (Port 5000)...
start "CivicPulse - Backend API (Port 5000)" cmd /k "cd /d ""%~dp0civic-complaint-system\backend"" && npm start"

echo [2/3] Starting Frontend Client (Port 3000)...
start "CivicPulse - Frontend Client (Port 3000)" cmd /k "cd /d ""%~dp0civic-complaint-system\frontend"" && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 4 /nobreak >nul

echo Opening CivicPulse in your browser...
start http://localhost:3000

echo.
echo ========================================================
echo   CivicPulse is running!
echo   - Web Portal: http://localhost:3000
echo   - Backend API: http://localhost:5000
echo.
echo   Keep the two open command windows running while using
echo   the portal. Close them whenever you wish to stop.
echo ========================================================
pause
