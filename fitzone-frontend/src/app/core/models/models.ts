// models/auth.model.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  email: string;
  role: string;
  message: string;
}

// models/miembro.model.ts
export interface Miembro {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  dni: string;
  estado?: string;
  planId?: number;
  fechaRegistro?: string;
  fechaActualizacion?: string;
}

// models/plan.model.ts
export interface Plan {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionDias: number;
  activo?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

// models/asistencia.model.ts
export interface Asistencia {
  id?: number;
  miembroId: number;
  entrada?: string;
  salida?: string;
  observacion?: string;
  minutosEnLocal?: number;
}

// models/pago.model.ts
export interface Pago {
  id?: number;
  miembroId: number;
  planId: number;
  monto: number;
  metodoPago: string;
  estado?: string;
  fechaPago?: string;
  notas?: string;
}
