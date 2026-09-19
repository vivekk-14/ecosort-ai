@echo off
title EcoSort AI Launcher
echo ===================================================
echo           Starting EcoSort AI Full-Stack App
echo ===================================================
echo 1. Starting FastAPI Backend (Port 8000)...
start "EcoSort Backend" cmd /k "cd /d C:\Users\anand\.gemini\antigravity\scratch\ecosort-ai\backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo 2. Waiting 2 seconds for backend...
timeout /t 2 /nobreak >nul

echo 3. Starting React Frontend (Port 5173)...
start "EcoSort Frontend" cmd /k "cd /d C:\Users\anand\.gemini\antigravity\scratch\ecosort-ai\frontend && npm run dev"

echo 4. Opening website in browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo ===================================================
echo EcoSort AI is now running at: http://localhost:5173
echo Keep the backend and frontend terminal windows open!
echo ===================================================
pause
