# GUIA DE EXPOSICION - FitZone: Sistema de Gestion de Gimnasio

## INDICE
1. [Introduccion (2 min)](#1-introduccion)
2. [Arquitectura General (3 min)](#2-arquitectura-general)
3. [Stack Tecnologico (2 min)](#3-stack-tecnologico)
4. [Flujo de Autenticacion JWT (3 min)](#4-flujo-de-autenticacion-jwt)
5. [Microservicios - Detalle (5 min)](#5-microservicios---detalle)
6. [Comunicacion Asincrona con RabbitMQ (2 min)](#6-comunicacion-asincrona-con-rabbitmq)
7. [Frontend Angular (3 min)](#7-frontend-angular)
8. [Demo en Vivo (5 min)](#8-demo-en-vivo)
9. [Conclusiones (2 min)](#9-conclusiones)

---

## 1. INTRODUCCION

**Que es FitZone?**
> FitZone es un sistema de gestion integral para gimnasios, construido con arquitectura de microservicios. Permite administrar miembros, planes, asistencia y pagos de forma independiente y escalable.

**Problema que resuelve:**
- Los gimnasios manejan multiples procesos: registro de clientes, control de planes, cobros, asistencia
- Un sistema monolitico se vuelve dificil de mantener y escalar
- Se necesita un sistema donde cada modulo sea independiente, pueda fallar sin afectar a los demas, y se pueda escalar segun la demanda

**Solucion:**
- 5 microservicios independientes, cada uno con su propia base de datos
- Un API Gateway como punto unico de entrada
- Service Discovery para localizacion dinamica de servicios
- Comunicacion asincrona entre servicios mediante mensajeria

---

## 2. ARQUITECTURA GENERAL

### Diagrama de Arquitectura (dibujar en pizarra o mostrar)

```
                            ┌──────────────┐
                            │   FRONTEND   │
                            │  Angular 17  │
                            │  :4200       │
                            └──────┬───────┘
                                   │ HTTP
                            ┌──────▼───────┐
                            │ API GATEWAY  │
                            │ Spring Cloud │
                            │ :8080        │
                            │ (JWT Filter) │
                            └──────┬───────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
     ┌────────▼───────┐  ┌───────▼────────┐  ┌────────▼───────┐
     │  AUTH SERVICE  │  │ MEMBER SERVICE │  │  PLAN SERVICE  │
     │  :8081         │  │ :8082          │  │  :8083         │
     │  fitzone_auth  │  │ fitzone_members│  │  fitzone_plans │
     └────────────────┘  └───────▲────────┘  └────────────────┘
                                 │ RabbitMQ
              ┌──────────────────┼──────────────────────┐
              │                  │                      │
     ┌────────▼────────┐  ┌─────┴──────────┐
     │ATTENDANCE SERVICE│  │PAYMENT SERVICE │
     │ :8084            │  │ :8085          │
     │fitzone_attendance│  │fitzone_payments│
     └─────────────────┘  └────────────────┘

                    ┌─────────────────┐
                    │  EUREKA SERVER  │
                    │  :8761          │
                    │ Service Registry│
                    └─────────────────┘
```

### Puntos clave para explicar:
1. **El frontend NUNCA habla directo con los microservicios** - todo pasa por el Gateway (:8080)
2. **Cada servicio tiene su propia base de datos** (patron Database per Service)
3. **Eureka** permite que los servicios se encuentren entre si sin hardcodear IPs
4. **RabbitMQ** conecta Payment con Member de forma asincrona

---

## 3. STACK TECNOLOGICO

### Backend
| Tecnologia | Version | Para que se usa |
|------------|---------|-----------------|
| Java | 21 | Lenguaje principal del backend |
| Spring Boot | 3.2.5 | Framework para crear microservicios |
| Spring Cloud | 2023.0.1 | Gateway, Eureka (Discovery), Config |
| Spring Security | 6.x | Autenticacion y autorizacion |
| Spring Data JPA | 6.x | ORM - mapeo objeto-relacional |
| PostgreSQL | 16 | Base de datos relacional |
| RabbitMQ | 3.x | Mensajeria asincrona entre servicios |
| JJWT | 0.11.5 | Generacion y validacion de tokens JWT |
| Lombok | 1.18.42 | Reducir codigo boilerplate |

### Frontend
| Tecnologia | Version | Para que se usa |
|------------|---------|-----------------|
| Angular | 17.3.0 | Framework SPA (Single Page Application) |
| TypeScript | 5.4.2 | Lenguaje tipado para Angular |
| Bootstrap | 5.3.3 | Framework CSS responsive |
| RxJS | 7.8.0 | Programacion reactiva (Observables) |

### Infraestructura
| Servicio | Puerto | Descripcion |
|----------|--------|-------------|
| PostgreSQL | 5432 | 5 bases de datos independientes |
| RabbitMQ | 5672 | Broker de mensajeria |
| Eureka Server | 8761 | Registro de servicios |
| API Gateway | 8080 | Punto unico de entrada |
| Auth Service | 8081 | Autenticacion |
| Member Service | 8082 | Gestion de miembros |
| Plan Service | 8083 | Gestion de planes |
| Attendance Service | 8084 | Control de asistencia |
| Payment Service | 8085 | Procesamiento de pagos |
| Frontend Angular | 4200 | Interfaz de usuario |

---

## 4. FLUJO DE AUTENTICACION JWT

### Que es JWT?
> JSON Web Token - un estandar para transmitir informacion de forma segura entre partes como un objeto JSON firmado digitalmente.

### Flujo paso a paso:

```
PASO 1: Login
──────────────
Usuario → POST /auth/login { username, password }
                    │
                    ▼
          Auth Service valida credenciales
          (BCrypt compara el hash del password)
                    │
                    ▼
          Genera 2 tokens:
          - Access Token (24 horas)
          - Refresh Token (7 dias)
                    │
                    ▼
          Respuesta: { token, refreshToken, username, role }


PASO 2: Frontend almacena tokens
─────────────────────────────────
          localStorage.setItem('token', token)
          localStorage.setItem('role', role)


PASO 3: Peticiones subsecuentes
────────────────────────────────
          AuthInterceptor agrega automaticamente:
          Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
                    │
                    ▼
          API Gateway recibe la peticion
                    │
                    ▼
          AuthenticationFilter:
          1. Extrae el token del header
          2. Valida firma (HMAC-SHA256)
          3. Verifica que no este expirado
          4. Agrega header X-Username
          5. Redirige al microservicio destino
                    │
                    ▼
          Microservicio procesa la peticion
```

### Estructura del Token JWT:
```
Header:    { "alg": "HS256", "typ": "JWT" }
Payload:   { "sub": "admin", "role": "ROLE_ADMIN", "iat": 1708000, "exp": 1708086 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), SECRET_KEY)
```

### Archivos clave para mostrar:
- `auth-service/.../util/JwtUtil.java` → Generacion de tokens
- `api-gateway/.../filter/AuthenticationFilter.java` → Validacion en gateway
- `api-gateway/.../filter/RouteValidator.java` → Rutas publicas vs protegidas
- `fitzone-frontend/.../interceptors/auth.interceptor.ts` → Interceptor Angular

---

## 5. MICROSERVICIOS - DETALLE

### Patron comun en TODOS los microservicios:

```
┌─────────────────────────────────────────────┐
│              MICROSERVICIO                   │
│                                             │
│  Controller → Service → Repository → DB     │
│  (REST API)   (Logica)  (JPA/SQL)   (PG)   │
│                                             │
│  Entity: Modelo de datos + @Column          │
│  DTOs:   Objetos de transferencia           │
│  Config: Seguridad, RabbitMQ, etc.          │
└─────────────────────────────────────────────┘
```

### A. Auth Service (Autenticacion)

**Tabla:** `users`
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,          -- Hash BCrypt
    role VARCHAR(20) DEFAULT 'MIEMBRO',      -- ADMIN | ENTRENADOR | MIEMBRO
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Endpoints:**
| Metodo | Ruta | Acceso | Descripcion |
|--------|------|--------|-------------|
| POST | `/auth/register` | Publico | Registrar usuario |
| POST | `/auth/login` | Publico | Iniciar sesion |
| POST | `/auth/refresh` | Publico | Refrescar token |
| GET | `/auth/users` | ADMIN | Listar usuarios |
| PUT | `/auth/users/{id}` | ADMIN | Actualizar usuario |
| DELETE | `/auth/users/{id}` | ADMIN | Eliminar usuario |

**Codigo clave:** `AuthService.java`
- `register()` → Valida unicidad, encripta password, genera tokens
- `login()` → Autentica con AuthenticationManager, genera tokens

---

### B. Member Service (Miembros)

**Tabla:** `members`
```sql
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,     -- @Column(name="first_name") → campo: nombre
    last_name VARCHAR(100) NOT NULL,      -- @Column(name="last_name") → campo: apellido
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),                    -- campo: telefono
    dni VARCHAR(8) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDIENTE',  -- ACTIVO | INACTIVO | PENDIENTE
    plan_id BIGINT,
    registered_at TIMESTAMP DEFAULT NOW()
);
```

**Endpoints:**
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/miembros` | Listar todos los miembros |
| GET | `/miembros/{id}` | Obtener miembro por ID |
| POST | `/miembros` | Crear nuevo miembro |
| PUT | `/miembros/{id}` | Actualizar miembro |
| DELETE | `/miembros/{id}` | Eliminar miembro |

**Dato importante:** La entidad usa `@Column(name="first_name")` para mapear el campo Java `nombre` a la columna SQL `first_name`. Esto permite tener codigo en espanol con BD en ingles.

---

### C. Plan Service (Planes)

**Tabla:** `plans`
```sql
CREATE TABLE plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,           -- campo: nombre
    description VARCHAR(500),             -- campo: descripcion
    price NUMERIC(10,2) NOT NULL,         -- campo: precio
    duration_days INTEGER NOT NULL,       -- campo: duracionDias
    active BOOLEAN DEFAULT TRUE,          -- campo: activo
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Endpoints:**
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/planes` | Listar todos los planes |
| GET | `/planes?soloActivos=true` | Solo planes activos |
| POST | `/planes` | Crear plan |
| PUT | `/planes/{id}` | Actualizar plan |
| DELETE | `/planes/{id}` | Eliminar plan |

---

### D. Attendance Service (Asistencia)

**Tabla:** `attendance`
```sql
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,            -- campo: miembroId
    check_in TIMESTAMP DEFAULT NOW(),     -- campo: entrada
    check_out TIMESTAMP,                  -- campo: salida
    observation VARCHAR(255)              -- campo: observacion
);
```

**Endpoints:**
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/asistencia` | Listar asistencias |
| GET | `/asistencia/miembro/{id}` | Asistencia por miembro |
| POST | `/asistencia/entrada` | Registrar entrada |
| PUT | `/asistencia/{id}` | Actualizar (registrar salida) |
| DELETE | `/asistencia/{id}` | Eliminar registro |

**Caracteristica especial:** Calcula automaticamente `minutosEnLocal` (tiempo en el local) basado en la diferencia entre entrada y salida.

---

### E. Payment Service (Pagos)

**Tabla:** `payments`
```sql
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,            -- campo: miembroId
    plan_id BIGINT NOT NULL,              -- campo: planId
    amount NUMERIC(10,2) NOT NULL,        -- campo: monto
    payment_method VARCHAR(30) NOT NULL,  -- EFECTIVO|TARJETA|TRANSFERENCIA|YAPE|PLIN
    status VARCHAR(20) DEFAULT 'PENDIENTE', -- PENDIENTE|CONFIRMADO|CANCELADO
    payment_date TIMESTAMP DEFAULT NOW(),
    notes VARCHAR(255)                    -- campo: notas
);
```

**Endpoints:**
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/pagos` | Listar pagos |
| GET | `/pagos/miembro/{id}` | Pagos por miembro |
| POST | `/pagos` | Registrar pago (dispara evento RabbitMQ) |
| PUT | `/pagos/{id}` | Actualizar estado de pago |
| DELETE | `/pagos/{id}` | Eliminar pago |

**Dato clave:** Al crear o confirmar un pago, se envia automaticamente un evento a RabbitMQ que activa la membresia del miembro.

---

## 6. COMUNICACION ASINCRONA CON RABBITMQ

### Que es RabbitMQ?
> Es un broker de mensajeria que permite comunicacion asincrona entre servicios. Un servicio envia un mensaje y otro lo consume cuando pueda, sin necesidad de que ambos esten disponibles al mismo tiempo.

### Flujo del evento de pago:

```
┌──────────────────┐         ┌───────────────┐         ┌──────────────────┐
│  PAYMENT SERVICE │         │   RABBITMQ    │         │  MEMBER SERVICE  │
│                  │         │               │         │                  │
│ 1. Crear pago    │         │               │         │                  │
│    estado:       │  ──────>│ Exchange:     │  ──────>│ 4. Escucha cola  │
│    CONFIRMADO    │ Publica │ fitzone.      │ Consume │    @RabbitListener│
│                  │ evento  │ exchange      │ mensaje │                  │
│ 2. Construye     │         │     │         │         │ 5. Activa        │
│    EventoPago:   │         │     ▼         │         │    membresia:    │
│    {miembroId,   │         │ Queue:        │         │    estado=ACTIVO │
│     planId,      │         │ payment.      │         │    planId=X      │
│     tipoEvento:  │         │ confirmed.    │         │                  │
│     PAGO_        │         │ queue         │         │ 6. Guarda en BD  │
│     CONFIRMADO}  │         │               │         │                  │
│                  │         │               │         │                  │
│ 3. rabbitTemplate│         │               │         │                  │
│    .convertAndSend│        │               │         │                  │
└──────────────────┘         └───────────────┘         └──────────────────┘
```

### Por que RabbitMQ y no una llamada HTTP directa?

| Aspecto | HTTP Directo | RabbitMQ |
|---------|-------------|----------|
| Acoplamiento | Fuerte (Payment conoce a Member) | Debil (solo conoce la cola) |
| Disponibilidad | Si Member cae, Payment falla | El mensaje espera en la cola |
| Escalabilidad | 1 a 1 | Multiples consumidores |
| Patron | Request-Response | Publish-Subscribe |

### Archivos clave para mostrar:
- `payment-service/.../config/RabbitMQConfig.java` → Configuracion del exchange y cola
- `payment-service/.../service/PaymentService.java` → `rabbitTemplate.convertAndSend(...)`
- `member-service/.../config/RabbitMQConfig.java` → `@RabbitListener` que consume el evento
- `member-service/.../service/MemberService.java` → `activateMembershipFromPayment()`

---

## 7. FRONTEND ANGULAR

### Arquitectura del Frontend:

```
src/app/
├── app.component.ts          ← Layout principal (sidebar + contenido)
├── app.routes.ts              ← Definicion de rutas
├── core/
│   ├── guards/
│   │   └── auth.guard.ts      ← Proteccion de rutas (canActivate)
│   ├── interceptors/
│   │   └── auth.interceptor.ts ← Agrega token JWT a cada peticion
│   ├── models/
│   │   └── models.ts          ← Interfaces TypeScript (Miembro, Plan, etc.)
│   └── services/
│       ├── auth.service.ts    ← Login, logout, manejo de tokens
│       └── api.services.ts    ← MiembroService, PlanService, etc.
└── features/
    ├── landing/               ← Pagina publica con carrusel 3D
    ├── dashboard/             ← Panel principal con estadisticas
    ├── members/               ← CRUD de miembros
    ├── plans/                 ← CRUD de planes
    ├── attendance/            ← Control de asistencia
    └── payments/              ← Gestion de pagos
```

### Conceptos clave de Angular implementados:

1. **Standalone Components** (Angular 17) - Sin modulos NgModule
2. **Lazy Loading** - Las rutas cargan componentes bajo demanda
3. **HTTP Interceptor** - Inyecta token JWT automaticamente
4. **Route Guards** - Protege rutas que requieren autenticacion
5. **Reactive Forms** - Formularios con validacion
6. **Services con HttpClient** - Comunicacion con el backend via Observables

### Rutas:
```typescript
export const routes: Routes = [
    { path: '',           component: LandingComponent },               // Publico
    { path: 'panel',      component: DashboardComponent, canActivate: [authGuard] },
    { path: 'miembros',   component: MembersComponent,   canActivate: [authGuard] },
    { path: 'planes',     component: PlansComponent,     canActivate: [authGuard] },
    { path: 'asistencia', component: AttendanceComponent, canActivate: [authGuard] },
    { path: 'pagos',      component: PaymentsComponent,  canActivate: [authGuard] },
    { path: '**',         redirectTo: '' }
];
```

### Interceptor (explica como se agrega el token):
```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    if (token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }
    return next(req);
};
```

---

## 8. DEMO EN VIVO

### Orden sugerido para la demostracion:

**Paso 1: Mostrar Eureka Dashboard**
- Abrir http://localhost:8761
- Mostrar los 6 servicios registrados
- Explicar: "Cada servicio se registra aqui automaticamente al arrancar"

**Paso 2: Landing Page**
- Abrir http://localhost:4200
- Mostrar el carrusel 3D y la descripcion del proyecto
- Hacer clic en "Iniciar Sesion"

**Paso 3: Login**
- Usuario: `admin` / Password: `admin123`
- Explicar: "El password se compara con un hash BCrypt en la BD"
- Mostrar en DevTools (F12 > Network) el token JWT recibido

**Paso 4: Panel (Dashboard)**
- Mostrar estadisticas generales
- Explicar: "Cada tarjeta consulta un microservicio diferente"

**Paso 5: CRUD de Miembros**
- Ir a `/miembros`
- Crear un nuevo miembro (mostrar validaciones)
- Editar un miembro existente
- Mostrar que los campos son en espanol (nombre, apellido, telefono, estado)

**Paso 6: CRUD de Planes**
- Ir a `/planes`
- Mostrar los 4 planes precargados
- Crear un plan nuevo
- Filtrar solo planes activos

**Paso 7: Registrar Asistencia**
- Ir a `/asistencia`
- Registrar una entrada (check-in)
- Actualizar con salida
- Mostrar el calculo automatico de tiempo en el local

**Paso 8: Flujo de Pago + RabbitMQ (PUNTO FUERTE)**
- Ir a `/pagos`
- Crear un pago para un miembro con estado PENDIENTE
- Mostrar que el pago se confirma automaticamente
- Ir a `/miembros` y mostrar que el estado cambio a ACTIVO
- Explicar: "Esto sucedio via RabbitMQ, sin llamada HTTP directa"

**Paso 9: Postman (opcional)**
- Mostrar la coleccion Postman con todos los endpoints
- Ejecutar login y mostrar el token
- Probar un endpoint protegido sin token (401)
- Probar con token (200)

---

## 9. CONCLUSIONES

### Patrones implementados:
- **Microservicios** - Separacion de responsabilidades
- **API Gateway** - Punto unico de entrada
- **Service Discovery** - Localizacion dinamica de servicios
- **Database per Service** - Cada servicio con su propia BD
- **Event-Driven Architecture** - Comunicacion asincrona con RabbitMQ
- **JWT Authentication** - Autenticacion stateless entre servicios
- **DTO Pattern** - Separacion entre entidades y datos de transferencia
- **Repository Pattern** - Abstraccion de la capa de datos

### Beneficios de la arquitectura:
1. **Escalabilidad** - Cada servicio se puede escalar independientemente
2. **Resiliencia** - Si un servicio cae, los demas siguen funcionando
3. **Independencia** - Cada equipo puede desarrollar su servicio por separado
4. **Mantenibilidad** - Codigo mas organizado y facil de entender
5. **Tecnologia flexible** - Cada servicio puede usar tecnologias diferentes

### Posibles mejoras futuras:
- Docker/Kubernetes para contenedorizacion
- Spring Cloud Config para configuracion centralizada
- Circuit Breaker (Resilience4j) para tolerancia a fallos
- Monitoring con Spring Boot Actuator + Prometheus + Grafana
- Notificaciones por email/SMS

---

## TIPS PARA LA EXPOSICION

1. **No leas codigo linea por linea** - Explica el flujo general y muestra codigo solo en puntos clave
2. **Enfocate en el "por que"** - No solo que hace cada cosa, sino por que se eligio esa solucion
3. **La demo vale mas que mil slides** - Dedica tiempo suficiente a la demo en vivo
4. **El flujo de RabbitMQ es tu punto fuerte** - Es lo que diferencia este proyecto de un CRUD basico
5. **Si te preguntan algo que no sabes**, di "Es un buen punto, lo investigo" - No inventes
6. **Practica el flujo de demo** antes de la exposicion para que sea fluido

### Posibles preguntas del jurado:

**P: Por que microservicios y no monolito?**
> R: Porque permite escalar servicios individuales, despliegue independiente, y si el servicio de pagos falla, la asistencia sigue funcionando.

**P: Por que 5 bases de datos separadas?**
> R: Es el patron "Database per Service". Cada microservicio es dueno de sus datos. Esto evita acoplamiento a nivel de datos y permite que cada servicio evolucione su esquema independientemente.

**P: Que pasa si RabbitMQ se cae?**
> R: Los mensajes se pierden si la cola no es durable. En nuestro caso la cola ES durable (QueueBuilder.durable), asi que los mensajes persisten en disco y se entregan cuando RabbitMQ vuelve.

**P: Por que JWT y no sesiones?**
> R: Porque JWT es stateless. El Gateway no necesita consultar una BD de sesiones para validar. Simplemente verifica la firma del token. Esto es ideal para microservicios.

**P: Como se protegen los endpoints?**
> R: Triple capa: 1) AuthGuard en Angular impide navegacion sin login. 2) AuthenticationFilter en Gateway valida el JWT. 3) Spring Security en cada servicio valida permisos por rol.

**P: Que pasa si un microservicio se cae?**
> R: Eureka detecta que el servicio no responde y lo marca como DOWN. El Gateway deja de enviar peticiones a esa instancia. Los demas servicios siguen funcionando normalmente.
