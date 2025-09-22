@echo off
title Subir MetaMotivation a Azure DevOps
color 0A
echo.
echo ========================================
echo   Subiendo MetaMotivation a Azure DevOps
echo ========================================
echo.
echo Organizacion: biturrao
echo Proyecto: Meta
echo.

echo 1. Subiendo Infrastructure (mot_iac)...
call upload-iac.bat

echo.
echo 2. Subiendo Backend (mot_back)...  
call upload-backend.bat

echo.
echo 3. Subiendo Frontend (mot_front)...
call upload-frontend.bat

echo.
echo ========================================
echo ✅ ¡TODOS LOS REPOSITORIOS SUBIDOS!
echo ========================================
echo.
echo URLs de tus repositorios:
echo 📁 IAC: https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_iac
echo 🐍 Backend: https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_back  
echo 📱 Frontend: https://biturrao@dev.azure.com/biturrao/Meta/_git/mot_front
echo.
echo Ahora puedes configurar CI/CD en Azure DevOps!
echo.
pause
