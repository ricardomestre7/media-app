@echo off
echo ========================================
echo    MEDIAHUB - LIMPEZA DE CACHE
echo ========================================
echo.

echo [1/4] Fechando navegadores...
taskkill /f /im chrome.exe 2>nul
taskkill /f /im firefox.exe 2>nul
taskkill /f /im msedge.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Limpando cache do Chrome...
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" (
    rmdir /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" 2>nul
)
if exist "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Code Cache" (
    rmdir /s /q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Code Cache" 2>nul
)

echo [3/4] Verificando servidor...
echo Servidor Vite rodando em: http://localhost:3000
echo.

echo [4/4] Abrindo aplicacao com cache limpo...
echo.
echo Escolha uma opcao:
echo [1] Chrome (Incognito + Cache Desabilitado)
echo [2] Firefox (Modo Privado)
echo [3] Edge (InPrivate)
echo [4] Arquivo de Limpeza de Cache
echo [5] Todos os navegadores
echo.

set /p choice="Digite sua escolha (1-5): "

if "%choice%"=="1" (
    echo Abrindo Chrome com cache desabilitado...
    start chrome --incognito --disable-cache --disable-application-cache --disable-offline-load-stale-cache --disk-cache-size=0 "http://localhost:3000?t=%time%"
) else if "%choice%"=="2" (
    echo Abrindo Firefox em modo privado...
    start firefox -private-window "http://localhost:3000?t=%time%"
) else if "%choice%"=="3" (
    echo Abrindo Edge em modo InPrivate...
    start msedge -inprivate "http://localhost:3000?t=%time%"
) else if "%choice%"=="4" (
    echo Abrindo arquivo de limpeza de cache...
    start "force-cache-clear.html"
) else if "%choice%"=="5" (
    echo Abrindo em todos os navegadores...
    start chrome --incognito --disable-cache "http://localhost:3000?t=%time%&browser=chrome"
    timeout /t 1 /nobreak >nul
    start firefox -private-window "http://localhost:3000?t=%time%&browser=firefox"
    timeout /t 1 /nobreak >nul
    start msedge -inprivate "http://localhost:3000?t=%time%&browser=edge"
) else (
    echo Opcao invalida. Abrindo Chrome por padrao...
    start chrome --incognito --disable-cache "http://localhost:3000?t=%time%"
)

echo.
echo ========================================
echo   APLICACAO ABERTA COM SUCESSO!
echo ========================================
echo.
echo Se ainda houver problemas de cache:
echo 1. Pressione Ctrl+Shift+R no navegador
echo 2. Ou pressione F12 ^> Network ^> Disable Cache
echo 3. Ou execute este script novamente
echo.
pause