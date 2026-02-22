#!/bin/bash

# ============================================================
#    FITZONE - SISTEMA DE GESTION DE GIMNASIO
#    Script para iniciar todos los servicios en Linux/Mac
# ============================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PIDS=()

cleanup() {
    echo ""
    echo -e "${YELLOW}[*] Deteniendo todos los servicios...${NC}"
    for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null || true
    done
    # Matar cualquier proceso java de fitzone que quede
    pkill -f "fitzone" 2>/dev/null || true
    echo -e "${GREEN}[OK] Todos los servicios detenidos.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}   FITZONE - SISTEMA DE GESTION DE GIMNASIO${NC}"
echo -e "${CYAN}   Iniciando todos los servicios...${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# ──────────────────────────────────────────────
# VERIFICAR PREREQUISITOS
# ──────────────────────────────────────────────
echo -e "${YELLOW}[*] Verificando prerequisitos...${NC}"

if ! command -v java &>/dev/null; then
    echo -e "${RED}[ERROR] Java no esta instalado. Instala JDK 21.${NC}"
    echo "  Ubuntu/Debian: sudo apt install openjdk-21-jdk"
    echo "  Fedora: sudo dnf install java-21-openjdk-devel"
    exit 1
fi

if ! command -v mvn &>/dev/null; then
    echo -e "${RED}[ERROR] Maven no esta instalado.${NC}"
    echo "  Ubuntu/Debian: sudo apt install maven"
    exit 1
fi

if ! command -v node &>/dev/null; then
    echo -e "${RED}[ERROR] Node.js no esta instalado. Instala Node 18+.${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] Java: $(java -version 2>&1 | head -1)${NC}"
echo -e "${GREEN}[OK] Maven: $(mvn -version 2>&1 | head -1)${NC}"
echo -e "${GREEN}[OK] Node: $(node -v)${NC}"
echo ""

# ──────────────────────────────────────────────
# VERIFICAR POSTGRESQL Y RABBITMQ
# ──────────────────────────────────────────────
echo -e "${YELLOW}[*] Verificando PostgreSQL...${NC}"
if pg_isready -h localhost -p 5432 &>/dev/null; then
    echo -e "${GREEN}[OK] PostgreSQL esta corriendo${NC}"
else
    echo -e "${RED}[ERROR] PostgreSQL no esta corriendo.${NC}"
    echo "  Iniciar: sudo systemctl start postgresql"
    exit 1
fi

echo -e "${YELLOW}[*] Verificando RabbitMQ...${NC}"
if sudo rabbitmqctl status &>/dev/null 2>&1; then
    echo -e "${GREEN}[OK] RabbitMQ esta corriendo${NC}"
else
    echo -e "${YELLOW}[AVISO] No se pudo verificar RabbitMQ. Asegurate de que este corriendo.${NC}"
    echo "  Iniciar: sudo systemctl start rabbitmq-server"
fi
echo ""

# ──────────────────────────────────────────────
# CREAR BASES DE DATOS (si no existen)
# ──────────────────────────────────────────────
echo -e "${YELLOW}[*] Creando bases de datos si no existen...${NC}"
export PGPASSWORD=postgres

for DB in fitzone_auth fitzone_members fitzone_plans fitzone_attendance fitzone_payments; do
    EXISTS=$(psql -U postgres -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname='$DB'" 2>/dev/null || echo "0")
    if [ "$EXISTS" != "1" ]; then
        psql -U postgres -h localhost -c "CREATE DATABASE $DB;" 2>/dev/null
        echo -e "${GREEN}[OK] Base de datos $DB creada${NC}"
    fi
done

echo -e "${YELLOW}[*] Ejecutando script de inicializacion...${NC}"
psql -U postgres -h localhost -f "$PROJECT_DIR/sql/init.sql" 2>/dev/null || true
echo -e "${GREEN}[OK] Script SQL ejecutado${NC}"
echo ""

# ──────────────────────────────────────────────
# INSTALAR DEPENDENCIAS FRONTEND
# ──────────────────────────────────────────────
echo -e "${YELLOW}[*] Verificando dependencias del frontend...${NC}"
if [ ! -d "$PROJECT_DIR/fitzone-frontend/node_modules" ]; then
    echo "  Instalando dependencias (npm install)..."
    cd "$PROJECT_DIR/fitzone-frontend" && npm install
    cd "$PROJECT_DIR"
    echo -e "${GREEN}[OK] Dependencias instaladas${NC}"
else
    echo -e "${GREEN}[OK] Dependencias ya existen${NC}"
fi
echo ""

echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}   INICIANDO SERVICIOS (esto tomara ~2 minutos)${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# ──────────────────────────────────────────────
# 1. EUREKA SERVER
# ──────────────────────────────────────────────
echo -e "${YELLOW}[1/7] Iniciando Eureka Server (puerto 8761)...${NC}"
cd "$PROJECT_DIR/eureka-server" && mvn spring-boot:run -q &>/dev/null &
PIDS+=($!)
echo "       Esperando 25 segundos..."
sleep 25
echo -e "${GREEN}[OK] Eureka Server iniciado${NC}"
echo ""

# ──────────────────────────────────────────────
# 2-6. MICROSERVICIOS (en paralelo)
# ──────────────────────────────────────────────
echo -e "${YELLOW}[2/7] Iniciando Auth Service (puerto 8081)...${NC}"
cd "$PROJECT_DIR/auth-service" && mvn spring-boot:run -q &>/dev/null &
PIDS+=($!)

echo -e "${YELLOW}[3/7] Iniciando Member Service (puerto 8082)...${NC}"
cd "$PROJECT_DIR/member-service" && mvn spring-boot:run -q &>/dev/null &
PIDS+=($!)

echo -e "${YELLOW}[4/7] Iniciando Plan Service (puerto 8083)...${NC}"
cd "$PROJECT_DIR/plan-service" && mvn spring-boot:run -q &>/dev/null &
PIDS+=($!)

echo -e "${YELLOW}[5/7] Iniciando Attendance Service (puerto 8084)...${NC}"
cd "$PROJECT_DIR/attendance-service" && mvn spring-boot:run -q &>/dev/null &
PIDS+=($!)

echo -e "${YELLOW}[6/7] Iniciando Payment Service (puerto 8085)...${NC}"
cd "$PROJECT_DIR/payment-service" && mvn spring-boot:run -q &>/dev/null &
PIDS+=($!)

echo "       Esperando 45 segundos para que los microservicios inicien..."
sleep 45
echo -e "${GREEN}[OK] Microservicios iniciados${NC}"
echo ""

# ──────────────────────────────────────────────
# 7. API GATEWAY
# ──────────────────────────────────────────────
echo -e "${YELLOW}[7/7] Iniciando API Gateway (puerto 8080)...${NC}"
cd "$PROJECT_DIR/api-gateway" && mvn spring-boot:run -q &>/dev/null &
PIDS+=($!)
echo "       Esperando 20 segundos..."
sleep 20
echo -e "${GREEN}[OK] API Gateway iniciado${NC}"
echo ""

# ──────────────────────────────────────────────
# FRONTEND ANGULAR
# ──────────────────────────────────────────────
echo -e "${YELLOW}[*] Iniciando Frontend Angular (puerto 4200)...${NC}"
cd "$PROJECT_DIR/fitzone-frontend" && npx ng serve --host 0.0.0.0 &>/dev/null &
PIDS+=($!)
sleep 10
echo -e "${GREEN}[OK] Frontend Angular iniciado${NC}"
echo ""

# ──────────────────────────────────────────────
# RESUMEN
# ──────────────────────────────────────────────
echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}   FITZONE INICIADO CORRECTAMENTE${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""
echo -e "   Eureka Dashboard:   ${CYAN}http://localhost:8761${NC}"
echo -e "   API Gateway:        ${CYAN}http://localhost:8080${NC}"
echo -e "   Frontend:           ${CYAN}http://localhost:4200${NC}"
echo ""
echo -e "   Auth Service:       http://localhost:8081"
echo -e "   Member Service:     http://localhost:8082"
echo -e "   Plan Service:       http://localhost:8083"
echo -e "   Attendance Service: http://localhost:8084"
echo -e "   Payment Service:    http://localhost:8085"
echo ""
echo -e "   Usuario: ${GREEN}admin${NC} / Password: ${GREEN}admin123${NC}"
echo ""
echo -e "${YELLOW}   Presiona Ctrl+C para DETENER todos los servicios.${NC}"
echo -e "${CYAN}============================================================${NC}"

# Esperar hasta que el usuario presione Ctrl+C
wait
