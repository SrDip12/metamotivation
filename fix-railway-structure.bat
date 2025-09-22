@echo off
title Arreglar estructura para Railway
color 0A
echo.
echo ========================================
echo   Arreglando estructura para Railway
echo ========================================
echo.

cd /d C:\Users\srdip\meta

echo 1. Respaldando archivos importantes...
if not exist "backup" mkdir backup
xcopy mot_front backup\mot_front /E /I /Y 2>nul
xcopy mot_iac backup\mot_iac /E /I /Y 2>nul

echo 2. Moviendo archivos de backend a la raiz...
copy "mot_back\requirements.txt" . /Y
if not exist "app" mkdir app
xcopy "mot_back\app" app /E /I /Y

echo 3. Creando nuevo Dockerfile optimizado...
(
echo FROM python:3.9-slim
echo.
echo WORKDIR /app
echo.
echo # Install system dependencies
echo RUN apt-get update ^&^& apt-get install -y \
echo     gcc \
echo     postgresql-client \
echo     ^&^& rm -rf /var/lib/apt/lists/*
echo.
echo # Copy requirements first for better caching
echo COPY requirements.txt .
echo RUN pip install --no-cache-dir -r requirements.txt
echo.
echo # Copy application code
echo COPY app ./app
echo.
echo # Create non-root user
echo RUN useradd --create-home --shell /bin/bash app
echo USER app
echo.
echo # Railway provides PORT environment variable
echo EXPOSE $PORT
echo CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
) > Dockerfile

echo 4. Actualizando railway.toml...
(
echo [build]
echo builder = "dockerfile"
echo.
echo [deploy]
echo healthcheckPath = "/docs"
echo healthcheckTimeout = 300
echo restartPolicyType = "on-failure"
echo.
echo [env]
echo PORT = "8000"
) > railway.toml

echo 5. Creando .dockerignore...
(
echo node_modules
echo npm-debug.log
echo .git
echo .gitignore
echo README.md
echo .env
echo .nyc_output
echo coverage
echo .nyc_output
echo .coverage
echo .pytest_cache
echo __pycache__
echo *.pyc
echo *.pyo
echo *.pyd
echo .Python
echo backup
echo mot_front
echo mot_iac
) > .dockerignore

echo 6. Creando Procfile como backup...
echo web: uvicorn app.main:app --host 0.0.0.0 --port $PORT > Procfile

echo 7. Actualizando .gitignore...
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
echo .env.*
echo *.db
echo *.sqlite
echo.
echo # Backup
echo backup/
echo.
echo # Docker
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

echo 8. Actualizando README...
(
echo # MetaMotivation - Backend API
echo.
echo Backend FastAPI para la aplicacion MetaMotivation desplegado en Railway.
echo.
echo ## 🚀 En Vivo
echo - Backend API: Desplegado automaticamente en Railway
echo - Documentacion: /docs
echo.
echo ## 📁 Estructura
echo ```
echo /
echo ├── app/                 # Codigo FastAPI
echo │   ├── main.py         # Aplicacion principal
echo │   ├── api/            # Endpoints API
echo │   ├── models/         # Modelos de base de datos
echo │   └── schemas/        # Esquemas Pydantic
echo ├── requirements.txt    # Dependencias Python
echo ├── Dockerfile         # Configuracion Docker
echo └── railway.toml       # Configuracion Railway
echo ```
echo.
echo ## 🔧 Endpoints Principales
echo - `GET /docs` - Documentacion interactiva
echo - `POST /api/v1/login/access-token` - Iniciar sesion
echo - `POST /api/v1/users/register` - Registrar usuario
echo - `POST /api/v1/check-in/` - Check-in diario de motivacion
echo - `GET /api/v1/dashboard/motivation-history` - Historial motivacion
echo - `GET /api/v1/questions/` - Cuestionario metamotivacion
echo.
echo ## 📱 App Movil
echo El frontend React Native se conecta a esta API para funcionar.
echo.
echo ## 🔄 Auto-Deploy
echo Cada push a main hace deploy automatico en Railway.
) > README.md

echo 9. Verificando estructura...
echo.
echo Nueva estructura:
dir /b
echo.

echo 10. Subiendo cambios a GitHub...
git add .
git commit -m "fix: Restructure for Railway - move backend to root, optimize build"
git push origin main

echo.
echo ========================================
echo ✅ ¡ESTRUCTURA ARREGLADA PARA RAILWAY!
echo ========================================
echo.
echo Cambios realizados:
echo ✅ requirements.txt movido a la raiz
echo ✅ Dockerfile optimizado para Railway
echo ✅ app/ movida a la raiz
echo ✅ railway.toml actualizado
echo ✅ .dockerignore creado
echo ✅ Backup de archivos originales
echo ✅ Cambios subidos a GitHub
echo.
echo PROXIMOS PASOS:
echo 1. Ve a Railway dashboard
echo 2. Tu proyecto se redespliegue automaticamente
echo 3. En 2-3 minutos tendras la URL funcionando
echo.
echo Si hay errores, Railway ahora puede encontrar todo!
echo.
pause
