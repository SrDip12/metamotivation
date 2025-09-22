@echo off
title Arreglar railway.toml
color 0A
echo.
echo ========================================
echo   Arreglando configuracion de Railway
echo ========================================
echo.

cd /d C:\Users\srdip\meta

echo 1. Creando railway.toml corregido...
(
echo [build]
echo builder = "dockerfile"
echo.
echo [deploy]
echo healthcheckPath = "/docs"
echo healthcheckTimeout = 300
echo restartPolicyType = "always"
) > railway.toml

echo 2. Verificando contenido...
type railway.toml

echo.
echo 3. Subiendo correccion...
git add railway.toml
git commit -m "fix: correct railway.toml restartPolicyType value"
git push origin main

echo.
echo ========================================
echo ✅ ¡RAILWAY.TOML ARREGLADO!
echo ========================================
echo.
echo Ahora Railway puede parsear la configuracion correctamente
echo Ve a Railway y redeploy el proyecto
echo.
pause
