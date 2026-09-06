@echo off
echo Starting DealFlow360 Development Environment...
echo ==============================================

if exist backend (
    echo Starting FastAPI Backend...
    start "DealFlow360 Backend" cmd /k "cd backend && .\venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
)

echo Starting DealFlow360 React Frontend (Vite)...
start "DealFlow360 Frontend" cmd /k "cd frontend && call npm.cmd run dev"

echo.
echo Servers are starting in separate windows!
if exist backend (
    echo Backend API:  http://localhost:8000
)
echo Frontend UI:  http://localhost:5173
echo.
echo Keep the terminal windows open while developing.
echo ==============================================
pause
