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

// models/member.model.ts
export interface Member {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dni: string;
  status?: string;
  planId?: number;
  registeredAt?: string;
  updatedAt?: string;
}

// models/plan.model.ts
export interface Plan {
  id?: number;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  active?: boolean;
  createdAt?: string;
}

// models/attendance.model.ts
export interface Attendance {
  id?: number;
  memberId: number;
  checkIn?: string;
  checkOut?: string;
  observation?: string;
  minutesSpent?: number;
}

// models/payment.model.ts
export interface Payment {
  id?: number;
  memberId: number;
  planId: number;
  amount: number;
  paymentMethod: string;
  status?: string;
  paymentDate?: string;
  notes?: string;
}
