@echo off
title Limpiar Git y Preparar para Railway
color 0A
echo.
echo ========================================
echo   Limpiando repositorios Git embebidos
echo ========================================
echo.

echo 1. Eliminando repositorios Git existentes...
if exist "mot_back\.git" rmdir /s /q "mot_back\.git"
if exist "mot_front\.git" rmdir /s /q "mot_front\.git"  
if exist "mot_iac\.git" rmdir /s /q "mot_iac\.git"
if exist ".git" rmdir /s /q ".git"

echo 2. Eliminando archivos temporales...
del /f /q git_status.txt 2>nul

echo 3. Creando estructura limpia...
echo ✅ Repositorios embebidos eliminados

echo 4. Inicializando repositorio principal...
git init

echo 5. Creando .gitignore principal...
(
echo # Python
echo __pycache__/
echo *.py[cod]
echo *$py.class
echo *.so
echo build/
echo dist/
echo *.egg-info/
echo venv/
echo env/
echo .env
echo *.db
echo *.sqlite
echo.
echo # Node.js
echo node_modules/
echo npm-debug.log*
echo yarn-error.log*
echo .expo/
echo .expo-shared/
echo build/
echo *.tgz
echo.
echo # Docker
echo postgres-data/
echo .docker/
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
echo.
echo # IDE
echo .vscode/
echo .idea/
echo.
echo # Logs
echo *.log
) > .gitignore

echo 6. Creando railway.toml...
(
echo [build]
echo builder = "dockerfile"
echo dockerfilePath = "mot_back/Dockerfile"
echo.
echo [deploy]
echo healthcheckPath = "/docs"
echo healthcheckTimeout = 300
echo restartPolicyType = "never"
) > railway.toml

echo 7. Actualizando Dockerfile para Railway...
cd mot_back
(
echo FROM python:3.9-slim
echo.
echo WORKDIR /app
echo.
echo # Copy requirements first for better caching
echo COPY requirements.txt .
echo RUN pip install --no-cache-dir -r requirements.txt
echo.
echo # Copy application code
echo COPY . .
echo.
echo # Railway provides PORT environment variable
echo CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
) > Dockerfile
cd ..

echo 8. Creando README.md...
(
echo # MetaMotivation - Free Version
echo.
echo Aplicacion de metamotivacion para adolescentes
echo.
echo ## Estructura del Proyecto
echo - `mot_back/` - Backend FastAPI + PostgreSQL
echo - `mot_front/` - App React Native 
echo - `mot_iac/` - Docker compose para desarrollo local
echo.
echo ## Deploy en Railway
echo Este proyecto esta configurado para desplegarse automaticamente en Railway.
echo.
echo ## Uso
echo 1. Descargar APK
echo 2. Instalar en Android
echo 3. Registrarse y usar la aplicacion
echo.
echo Backend corriendo 24/7 en: Railway
) > README.md

echo 9. Agregando archivos al repositorio...
git add .
git config --global user.email "biturrao@example.com"
git config --global user.name "biturrao"
git commit -m "MetaMotivation - Configured for Railway deployment"

echo.
echo ========================================
echo ✅ ¡REPOSITORIO LIMPIO Y LISTO!
echo ========================================
echo.
echo PROXIMOS PASOS:
echo 1. Crear repo en GitHub: https://github.com/new
echo 2. Nombre: metamotivation-free  
echo 3. Público
echo 4. NO crear README (ya lo tenemos)
echo 5. Ejecutar: git remote add origin TU_URL
echo 6. Ejecutar: git push -u origin main
echo.
echo Despues vamos a Railway!
echo.
pause
