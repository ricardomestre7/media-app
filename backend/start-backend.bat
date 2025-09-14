@echo off
echo ========================================
echo    MIDIA APP - BACKEND
echo ========================================
echo.

echo [1/2] Verificando dependencias do backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias do backend
    pause
    exit /b 1
)

echo.
echo [2/2] Iniciando servidor backend...
echo.
echo 🚀 Backend estara disponivel em:
echo    - API: http://localhost:3001
echo    - Health: http://localhost:3001/health
echo.
echo ⚠️  Mantenha este terminal aberto
echo.

call npm start

pause
