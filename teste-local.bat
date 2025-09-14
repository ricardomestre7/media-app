@echo off
echo ========================================
echo    MIDIA APP - TESTE LOCAL
echo ========================================
echo.

echo [1/3] Verificando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/3] Iniciando servidor de desenvolvimento...
echo.
echo 🌐 Aplicacao estara disponivel em:
echo    - Local: http://localhost:3000
echo    - Rede: http://[SEU_IP]:3000
echo.
echo 📱 Para testar em dispositivos moveis:
echo    1. Descubra seu IP: ipconfig
echo    2. Acesse: http://[SEU_IP]:3000
echo.
echo ⚠️  Certifique-se de que o backend esta rodando na porta 3001
echo.

call npm run dev

pause
