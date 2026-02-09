@echo off
echo Starting StaticFile Backend...
cd backend
start cmd /k "npm run dev"
cd ..
echo Backend is starting on http://localhost:3001
echo.
echo Starting StaticFile Frontend...
cd frontend
start cmd /k "npm run dev"
echo Frontend is starting on http://localhost:3000
echo.
echo Both services are starting. Please wait a moment...
echo.
echo Press any key to open the application in your browser...
pause >nul
start http://localhost:3000
