@echo off
setlocal
echo ===================================================
echo   Starting DealFlow360 Unified React Application
echo ===================================================
cd /d "%~dp0"
call npm.cmd run dev
