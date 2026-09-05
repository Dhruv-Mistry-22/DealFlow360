@echo off
echo Starting DealFlow360 Development Environment...
echo ==============================================

echo Starting FastAPI Backend...
start cmd /k "cd backend && .\venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Next.js Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows!
echo Backend API will be available at: http://localhost:8000
echo Frontend UI will be available at: http://localhost:3000
echo.
echo Keep those windows open to run the servers.
echo ==============================================
pause
