# 🏋️ FitZone — Sistema de Gestión de Gimnasio

**Arquitectura de Microservicios | Spring Boot 3.x | Java 21 | PostgreSQL | Angular 17**

Proyecto final del curso **Desarrollo de Servicios Web II** — CIBERTEC 2026-II

---

## 🏗️ Arquitectura

```
Angular Frontend (Vercel)
        │
        ▼
API Gateway (Spring Cloud Gateway) :8080
        │
        ├── auth-service        :8081  (Spring Security + JWT + BCrypt)
        ├── member-service      :8082  (CRUD + RabbitMQ Consumer)
        ├── plan-service        :8083  (CRUD)
        ├── attendance-service  :8084  (CRUD)
        └── payment-service     :8085  (CRUD + RabbitMQ Publisher)
        
Eureka Server (Service Discovery) :8761
RabbitMQ (Message Broker)         :5672
PostgreSQL (5 databases)          :5432
```

---

## 🚀 Orden de Arranque (Local)

> **IMPORTANTE:** Arrancar los servicios en este orden exacto.

### Requisitos previos
- Java 21+
- Maven 3.9+
- PostgreSQL 15+
- RabbitMQ 3.12+
- Node.js 20+ (para el frontend)

### Paso 1 — Bases de datos
```bash
psql -U postgres -f sql/init.sql
```

### Paso 2 — Eureka Server
```bash
cd eureka-server
mvn spring-boot:run
# Verificar: http://localhost:8761
```

### Paso 3 — Auth Service
```bash
cd auth-service
mvn spring-boot:run
# Verificar: http://localhost:8081/auth/health
```

### Paso 4 — Servicios de negocio (en cualquier orden)
```bash
cd member-service && mvn spring-boot:run      # :8082
cd plan-service && mvn spring-boot:run         # :8083
cd attendance-service && mvn spring-boot:run   # :8084
cd payment-service && mvn spring-boot:run      # :8085
```

### Paso 5 — API Gateway
```bash
cd api-gateway
mvn spring-boot:run
# Verificar: http://localhost:8080
```

### Paso 6 — Frontend Angular
```bash
cd fitzone-frontend
npm install
npm start
# Abrir: http://localhost:4200
```

---

## 🔑 Credenciales por defecto

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | ADMIN |

---

## 📡 Endpoints principales (vía API Gateway)

| Servicio | Método | Endpoint |
|---------|--------|----------|
| Auth | POST | `/auth/login` |
| Auth | POST | `/auth/register` |
| Members | GET/POST/PUT/DELETE | `/members`, `/members/{id}` |
| Plans | GET/POST/PUT/DELETE | `/plans`, `/plans/{id}` |
| Attendance | GET/POST/PUT/DELETE | `/attendance`, `/attendance/{id}` |
| Payments | GET/POST/PUT/DELETE | `/payments`, `/payments/{id}` |

---

## 🐰 Flujo RabbitMQ

```
POST /payments → payment-service
    → Guarda pago en PostgreSQL
    → Publica evento "PAYMENT_CONFIRMED" en fitzone.exchange
    → member-service consume el evento
    → Actualiza status del miembro a ACTIVE
```

---

## ☁️ Deploy en la nube

### Backend — Railway
1. Crear nuevo proyecto en [railway.app](https://railway.app)
2. Agregar plugin PostgreSQL y RabbitMQ
3. Conectar repositorio GitHub
4. Deployar cada microservicio como servicio separado
5. Configurar variables de entorno en Railway

### Frontend — Vercel
1. Actualizar `src/environments/environment.prod.ts` con URL de Railway
2. Push a GitHub
3. Conectar repositorio en [vercel.com](https://vercel.com)
4. Deploy automático

---

## 🔧 Variables de entorno Railway

```env
# Todas las instancias de microservicios
SPRING_DATASOURCE_URL=jdbc:postgresql://${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}
SPRING_DATASOURCE_USERNAME=${{PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{PGPASSWORD}}
SPRING_RABBITMQ_HOST=${{CLOUDAMQP_URL}}
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server.railway.internal:8761/eureka/
JWT_SECRET=ZitaZdI0MmM4NjFkMTc5NzBhYjRiYzhjYmQ5ZTI0NWQ2ZTQ4NjE0ZGNhNWM5NjlkNWYz
```

---

## 📁 Estructura del repositorio

```
fitzone/
├── eureka-server/
├── api-gateway/
├── auth-service/
├── member-service/
├── plan-service/
├── attendance-service/
├── payment-service/
├── fitzone-frontend/
├── postman/
│   └── FitZone.postman_collection.json
├── sql/
│   └── init.sql
└── README.md
```

---

## 👥 Equipo

| Nombre | Código | Rol |
|--------|--------|-----|
| [Coordinador] | | Coordinador |
| [Integrante 2] | | Desarrollador |
| [Integrante 3] | | Desarrollador |
| [Integrante 4] | | Desarrollador |

---

*CIBERTEC — Desarrollo de Servicios Web II — 2026-II*
