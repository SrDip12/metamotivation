@echo off
title Subir a Azure DevOps - URLs Corregidas
color 0A
echo.
echo ========================================
echo   Corrigiendo y subiendo a Azure DevOps
echo ========================================
echo.

echo 1. Arreglando mot_iac...
cd mot_iac
echo   - Eliminando remote anterior...
git remote remove origin 2>nul
echo   - Agregando remote correcto...
git remote add origin https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_iac
echo   - Cambiando a branch main...
git branch -M main 2>nul
echo   - Subiendo codigo...
git push -u origin main
if %errorlevel% equ 0 (
    echo   ✅ mot_iac subido correctamente!
) else (
    echo   ❌ Error subiendo mot_iac
)
cd ..

echo.
echo 2. Arreglando mot_back...
cd mot_back
echo   - Eliminando remote anterior...
git remote remove origin 2>nul
echo   - Agregando remote correcto...
git remote add origin https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_back
echo   - Cambiando a branch main...
git branch -M main 2>nul
echo   - Subiendo codigo...
git push -u origin main
if %errorlevel% equ 0 (
    echo   ✅ mot_back subido correctamente!
) else (
    echo   ❌ Error subiendo mot_back
)
cd ..

echo.
echo 3. Arreglando mot_front...
cd mot_front
echo   - Eliminando remote anterior...
git remote remove origin 2>nul
echo   - Agregando remote correcto...
git remote add origin https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_front
echo   - Cambiando a branch main...
git branch -M main 2>nul
echo   - Subiendo codigo...
git push -u origin main
if %errorlevel% equ 0 (
    echo   ✅ mot_front subido correctamente!
) else (
    echo   ❌ Error subiendo mot_front
)
cd ..

echo.
echo ========================================
echo ✅ ¡PROCESO COMPLETADO!
echo ========================================
echo.
echo Tus repositorios en Azure DevOps:
echo 📁 IAC: https://dev.azure.com/biturrao/Meta/_git/mot_iac
echo 🐍 Backend: https://dev.azure.com/biturrao/Meta/_git/mot_back
echo 📱 Frontend: https://dev.azure.com/biturrao/Meta/_git/mot_front
echo.
echo ¡Ahora puedes configurar CI/CD!
echo.
pause
