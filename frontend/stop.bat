@echo off
setlocal
echo ===================================================
echo   Stopping DealFlow360 React Application (Port 5173)
echo ===================================================
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Terminating process with PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)
echo DealFlow360 stopped.
