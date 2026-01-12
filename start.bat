@echo off
echo Starting Car Rental System...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5005
echo Frontend: http://localhost:3000
echo.
echo Admin Login: admin@gmail.com / admin123
echo.
pause