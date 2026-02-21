import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Miembro, Plan, Asistencia, Pago } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MiembroService {
  private apiUrl = `${environment.apiUrl}/miembros`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Miembro[]> { return this.http.get<Miembro[]>(this.apiUrl); }
  getById(id: number): Observable<Miembro> { return this.http.get<Miembro>(`${this.apiUrl}/${id}`); }
  create(miembro: Miembro): Observable<Miembro> { return this.http.post<Miembro>(this.apiUrl, miembro); }
  update(id: number, miembro: Partial<Miembro>): Observable<Miembro> { return this.http.put<Miembro>(`${this.apiUrl}/${id}`, miembro); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private apiUrl = `${environment.apiUrl}/planes`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Plan[]> { return this.http.get<Plan[]>(this.apiUrl); }
  getActive(): Observable<Plan[]> { return this.http.get<Plan[]>(`${this.apiUrl}?soloActivos=true`); }
  getById(id: number): Observable<Plan> { return this.http.get<Plan>(`${this.apiUrl}/${id}`); }
  create(plan: Plan): Observable<Plan> { return this.http.post<Plan>(this.apiUrl, plan); }
  update(id: number, plan: Partial<Plan>): Observable<Plan> { return this.http.put<Plan>(`${this.apiUrl}/${id}`, plan); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}/asistencia`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Asistencia[]> { return this.http.get<Asistencia[]>(this.apiUrl); }
  getById(id: number): Observable<Asistencia> { return this.http.get<Asistencia>(`${this.apiUrl}/${id}`); }
  getByMember(miembroId: number): Observable<Asistencia[]> { return this.http.get<Asistencia[]>(`${this.apiUrl}/miembro/${miembroId}`); }
  checkIn(data: { miembroId: number; observacion?: string }): Observable<Asistencia> { return this.http.post<Asistencia>(`${this.apiUrl}/entrada`, data); }
  update(id: number, data: Partial<Asistencia>): Observable<Asistencia> { return this.http.put<Asistencia>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class PagoService {
  private apiUrl = `${environment.apiUrl}/pagos`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Pago[]> { return this.http.get<Pago[]>(this.apiUrl); }
  getById(id: number): Observable<Pago> { return this.http.get<Pago>(`${this.apiUrl}/${id}`); }
  getByMember(miembroId: number): Observable<Pago[]> { return this.http.get<Pago[]>(`${this.apiUrl}/miembro/${miembroId}`); }
  create(pago: Pago): Observable<Pago> { return this.http.post<Pago>(this.apiUrl, pago); }
  update(id: number, data: Partial<Pago>): Observable<Pago> { return this.http.put<Pago>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
