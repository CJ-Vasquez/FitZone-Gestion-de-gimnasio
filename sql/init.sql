-- FitZone — Script de creacion de bases de datos
-- Ejecutar como superusuario PostgreSQL

CREATE DATABASE fitzone_auth;
CREATE DATABASE fitzone_members;
CREATE DATABASE fitzone_plans;
CREATE DATABASE fitzone_attendance;
CREATE DATABASE fitzone_payments;

-- =====================================
-- fitzone_auth — Tabla users (usuarios)
-- =====================================
\c fitzone_auth;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MIEMBRO',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Usuario admin inicial (password: admin123)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@fitzone.pe', '$2a$10$vzLqWD2ZCeL.g5.CRfHRCejGIRpLF5k.UtZAXr5WFsBvDMTPG88fe', 'ADMIN')
ON CONFLICT DO NOTHING;

-- =====================================
-- fitzone_members — Tabla members (miembros)
-- =====================================
\c fitzone_members;

CREATE TABLE IF NOT EXISTS members (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),
    dni VARCHAR(8) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    plan_id BIGINT,
    registered_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

INSERT INTO members (first_name, last_name, email, phone, dni, status) VALUES
('Juan Carlos', 'Perez Lopez', 'juan.perez@email.com', '987654321', '12345678', 'ACTIVO'),
('Maria Elena', 'Garcia Torres', 'maria.garcia@email.com', '976543210', '87654321', 'PENDIENTE'),
('Luis Antonio', 'Ramirez Soto', 'luis.ramirez@email.com', '965432109', '11223344', 'ACTIVO');

-- =====================================
-- fitzone_plans — Tabla plans (planes)
-- =====================================
\c fitzone_plans;

CREATE TABLE IF NOT EXISTS plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price NUMERIC(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

INSERT INTO plans (name, description, price, duration_days) VALUES
('Plan Basico', 'Acceso a equipos de cardio y pesas', 80.00, 30),
('Plan Plus', 'Acceso completo + 2 clases grupales por semana', 120.00, 30),
('Plan Anual', 'Acceso ilimitado todo el ano + clases ilimitadas', 900.00, 365),
('Plan Estudiante', 'Tarifa especial para estudiantes universitarios', 60.00, 30);

-- =====================================
-- fitzone_attendance — Tabla attendance (asistencia)
-- =====================================
\c fitzone_attendance;

CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,
    check_in TIMESTAMP NOT NULL DEFAULT NOW(),
    check_out TIMESTAMP,
    observation VARCHAR(255)
);

-- =====================================
-- fitzone_payments — Tabla payments (pagos)
-- =====================================
\c fitzone_payments;

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    payment_date TIMESTAMP DEFAULT NOW(),
    notes VARCHAR(255)
);
