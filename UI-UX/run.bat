@echo off
title DealFlow360 - Intelligent Sales Operations Platform
echo ===================================================
echo Starting DealFlow360 Frontend (React + Vite)...
echo ===================================================
cd /d "%~dp0"
start http://localhost:5173
cmd.exe /c "npm.cmd run dev"
pause
