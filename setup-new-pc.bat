@echo off
echo Configurando MetaMotivation en nueva PC...
echo.

REM Verificar Docker
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta instalado
    echo Instala Docker Desktop primero
    pause
    exit
)

REM Verificar Node
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Instala Node.js primero
    pause
    exit
)

REM Instalar localtunnel
echo Instalando localtunnel...
npm install -g localtunnel

REM Instalar dependencias del backend
echo Instalando dependencias del backend...
cd mot_backend
pip install -r requirements.txt

echo.
echo ¡Listo! Ahora puedes ejecutar:
echo 1. docker-compose up
echo 2. lt --port 8000 --subdomain metamotivacion-api
echo.
pause
