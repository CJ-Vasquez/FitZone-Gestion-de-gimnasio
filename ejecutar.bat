@echo off
chcp 65001 >nul
title FitZone - Sistema de Gestion de Gimnasio
color 0A

echo ============================================================
echo    FITZONE - SISTEMA DE GESTION DE GIMNASIO
echo    Iniciando todos los servicios...
echo ============================================================
echo.

:: ──────────────────────────────────────────────
:: VERIFICAR PREREQUISITOS
:: ──────────────────────────────────────────────
echo [*] Verificando prerequisitos...
echo.

where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java no esta instalado. Instala JDK 21 desde https://adoptium.net
    pause
    exit /b 1
)

where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven no esta instalado. Instala Maven desde https://maven.apache.org
    pause
    exit /b 1
)

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado. Instala Node 18+ desde https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Java encontrado:
java -version 2>&1 | findstr /i "version"
echo [OK] Maven encontrado:
mvn -version 2>&1 | findstr /i "Apache Maven"
echo [OK] Node.js encontrado:
node -v
echo.

:: ──────────────────────────────────────────────
:: VERIFICAR POSTGRESQL
:: ──────────────────────────────────────────────
echo [*] Verificando PostgreSQL...
where psql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] psql no encontrado en PATH. Asegurate de que PostgreSQL este corriendo.
) else (
    echo [OK] PostgreSQL encontrado
)
echo.

:: ──────────────────────────────────────────────
:: VERIFICAR RABBITMQ
:: ──────────────────────────────────────────────
echo [*] Verificando RabbitMQ...
where rabbitmqctl >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] RabbitMQ no encontrado en PATH. Asegurate de que este corriendo.
) else (
    echo [OK] RabbitMQ encontrado
)
echo.

:: ──────────────────────────────────────────────
:: CREAR BASES DE DATOS (si no existen)
:: ──────────────────────────────────────────────
echo [*] Creando bases de datos si no existen...
where psql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set PGPASSWORD=postgres
    psql -U postgres -h localhost -tc "SELECT 1 FROM pg_database WHERE datname='fitzone_auth'" | findstr "1" >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        psql -U postgres -h localhost -c "CREATE DATABASE fitzone_auth;" 2>nul
        psql -U postgres -h localhost -c "CREATE DATABASE fitzone_members;" 2>nul
        psql -U postgres -h localhost -c "CREATE DATABASE fitzone_plans;" 2>nul
        psql -U postgres -h localhost -c "CREATE DATABASE fitzone_attendance;" 2>nul
        psql -U postgres -h localhost -c "CREATE DATABASE fitzone_payments;" 2>nul
        echo [OK] Bases de datos creadas
    ) else (
        echo [OK] Las bases de datos ya existen
    )

    echo [*] Ejecutando script de inicializacion...
    psql -U postgres -h localhost -f "%~dp0sql\init.sql" 2>nul
    echo [OK] Script SQL ejecutado
)
echo.

:: ──────────────────────────────────────────────
:: INSTALAR DEPENDENCIAS FRONTEND
:: ──────────────────────────────────────────────
echo [*] Instalando dependencias del frontend...
cd /d "%~dp0fitzone-frontend"
if not exist "node_modules" (
    call npm install
    echo [OK] Dependencias instaladas
) else (
    echo [OK] Dependencias ya existen
)
cd /d "%~dp0"
echo.

echo ============================================================
echo    INICIANDO SERVICIOS (esto tomara ~2 minutos)
echo ============================================================
echo.

:: ──────────────────────────────────────────────
:: 1. EUREKA SERVER (Service Discovery)
:: ──────────────────────────────────────────────
echo [1/7] Iniciando Eureka Server (puerto 8761)...
start "FitZone - Eureka Server :8761" cmd /c "cd /d "%~dp0eureka-server" && mvn spring-boot:run"
echo       Esperando 20 segundos para que Eureka inicie...
timeout /t 20 /nobreak >nul
echo [OK] Eureka Server iniciado
echo.

:: ──────────────────────────────────────────────
:: 2-5. MICROSERVICIOS (en paralelo)
:: ──────────────────────────────────────────────
echo [2/7] Iniciando Auth Service (puerto 8081)...
start "FitZone - Auth Service :8081" cmd /c "cd /d "%~dp0auth-service" && mvn spring-boot:run"

echo [3/7] Iniciando Member Service (puerto 8082)...
start "FitZone - Member Service :8082" cmd /c "cd /d "%~dp0member-service" && mvn spring-boot:run"

echo [4/7] Iniciando Plan Service (puerto 8083)...
start "FitZone - Plan Service :8083" cmd /c "cd /d "%~dp0plan-service" && mvn spring-boot:run"

echo [5/7] Iniciando Attendance Service (puerto 8084)...
start "FitZone - Attendance Service :8084" cmd /c "cd /d "%~dp0attendance-service" && mvn spring-boot:run"

echo [6/7] Iniciando Payment Service (puerto 8085)...
start "FitZone - Payment Service :8085" cmd /c "cd /d "%~dp0payment-service" && mvn spring-boot:run"

echo       Esperando 40 segundos para que los microservicios inicien...
timeout /t 40 /nobreak >nul
echo [OK] Microservicios iniciados
echo.

:: ──────────────────────────────────────────────
:: 6. API GATEWAY
:: ──────────────────────────────────────────────
echo [7/7] Iniciando API Gateway (puerto 8080)...
start "FitZone - API Gateway :8080" cmd /c "cd /d "%~dp0api-gateway" && mvn spring-boot:run"
echo       Esperando 20 segundos para que el Gateway inicie...
timeout /t 20 /nobreak >nul
echo [OK] API Gateway iniciado
echo.

:: ──────────────────────────────────────────────
:: 7. FRONTEND ANGULAR
:: ──────────────────────────────────────────────
echo [*] Iniciando Frontend Angular (puerto 4200)...
start "FitZone - Frontend Angular :4200" cmd /c "cd /d "%~dp0fitzone-frontend" && npx ng serve --open"
echo.

echo ============================================================
echo    FITZONE INICIADO CORRECTAMENTE
echo ============================================================
echo.
echo    Eureka Dashboard:  http://localhost:8761
echo    API Gateway:       http://localhost:8080
echo    Frontend:          http://localhost:4200
echo.
echo    Auth Service:      http://localhost:8081
echo    Member Service:    http://localhost:8082
echo    Plan Service:      http://localhost:8083
echo    Attendance Service:http://localhost:8084
echo    Payment Service:   http://localhost:8085
echo.
echo    Usuario: admin / admin123
echo.
echo    Presiona cualquier tecla para DETENER todos los servicios.
echo ============================================================
pause >nul

:: ──────────────────────────────────────────────
:: DETENER TODOS LOS SERVICIOS
:: ──────────────────────────────────────────────
echo.
echo [*] Deteniendo todos los servicios...
taskkill /FI "WINDOWTITLE eq FitZone - *" /F >nul 2>&1
echo [OK] Todos los servicios detenidos.
pause
