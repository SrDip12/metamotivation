@echo off
title MetaMotivation Backend Tunnel
color 0A
echo.
echo ========================================
echo    MetaMotivation Backend Tunnel
echo ========================================
echo.
echo Iniciando tunnel publico...
echo URL fija: https://metamotivacion-api.loca.lt
echo.
echo IMPORTANTE: Deja esta ventana abierta
echo mientras uses la aplicacion.
echo.
echo ========================================
echo.

lt --port 8000 --subdomain metamotivacion-api

echo.
echo El tunnel se ha cerrado.
pause
