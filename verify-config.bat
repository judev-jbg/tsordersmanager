@echo off
echo ========================================
echo Verificacion de Configuracion
echo ========================================
echo.

echo [Frontend .env]
type .env
echo.

echo ========================================
echo [Backend .env - CORS]
findstr /C:"CORS_ORIGINS" ..\tsorders-api\.env
echo.

echo ========================================
echo IMPORTANTE:
echo 1. Detener AMBOS servicios (Ctrl+C)
echo 2. Reiniciar backend en tsorders-api
echo 3. Reiniciar frontend aqui
echo 4. Acceder via http://localhost:5173
echo ========================================
pause
