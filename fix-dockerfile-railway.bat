@echo off
title Arreglar Dockerfile para Railway
color 0A
echo.
echo ========================================
echo   Arreglando Dockerfile para Railway
echo ========================================
echo.

cd /d C:\Users\srdip\meta

echo 1. Creando Dockerfile simplificado...
(
echo FROM python:3.9-slim
echo.
echo WORKDIR /app
echo.
echo # Install system dependencies
echo RUN apt-get update ^&^& apt-get install -y \
echo     gcc \
echo     libpq-dev \
echo     ^&^& rm -rf /var/lib/apt/lists/*
echo.
echo # Copy requirements and install dependencies
echo COPY requirements.txt .
echo RUN pip install --no-cache-dir --upgrade pip
echo RUN pip install --no-cache-dir -r requirements.txt
echo.
echo # Copy application code
echo COPY app ./app
echo.
echo # Expose port for Railway
echo EXPOSE $PORT
echo.
echo # Start the application
echo CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
) > Dockerfile

echo 2. Removiendo railway.toml para usar defaults...
if exist railway.toml del railway.toml

echo 3. Verificando que app/main.py existe...
if exist "app\main.py" (
    echo ✅ app/main.py encontrado
) else (
    echo ❌ app/main.py NO ENCONTRADO - PROBLEMA!
    pause
    exit
)

echo 4. Subiendo cambios...
git add .
git commit -m "fix: Simplify Dockerfile for Railway deployment"
git push origin main

echo.
echo ========================================
echo ✅ ¡DOCKERFILE SIMPLIFICADO!
echo ========================================
echo.
echo Railway debe redeployed automaticamente
echo Si sigue fallando, necesitamos verificar:
echo 1. DATABASE_URL en variables
echo 2. PostgreSQL agregado al proyecto
echo 3. Logs de Railway para ver error especifico
echo.
pause
