@echo off
echo ========================================
echo    Car Rental System Startup
echo ========================================
echo.
echo Starting MongoDB (make sure it's installed)...
net start MongoDB 2>nul
if %errorlevel% neq 0 (
    echo MongoDB service not found or already running
)
echo.
echo Setting up admin user...
cd backend
node setup-admin.js
echo.
echo Starting backend server...
start "Backend" cmd /k "npm start"
echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul
echo.
echo Starting frontend...
cd ..
cd frontend
start "Frontend" cmd /k "npm start"
echo.
echo ========================================
echo Both servers are starting...
echo Backend: http://localhost:5005
echo Frontend: http://localhost:3000
echo.
echo Admin Login:
echo Email: admin@gmail.com
echo Password: admin123
echo ========================================
pause