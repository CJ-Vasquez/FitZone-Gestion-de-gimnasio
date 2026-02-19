import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Member, Plan, Attendance, Payment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiUrl = `${environment.apiUrl}/members`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Member[]> { return this.http.get<Member[]>(this.apiUrl); }
  getById(id: number): Observable<Member> { return this.http.get<Member>(`${this.apiUrl}/${id}`); }
  create(member: Member): Observable<Member> { return this.http.post<Member>(this.apiUrl, member); }
  update(id: number, member: Partial<Member>): Observable<Member> { return this.http.put<Member>(`${this.apiUrl}/${id}`, member); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private apiUrl = `${environment.apiUrl}/plans`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Plan[]> { return this.http.get<Plan[]>(this.apiUrl); }
  getActive(): Observable<Plan[]> { return this.http.get<Plan[]>(`${this.apiUrl}?activeOnly=true`); }
  getById(id: number): Observable<Plan> { return this.http.get<Plan>(`${this.apiUrl}/${id}`); }
  create(plan: Plan): Observable<Plan> { return this.http.post<Plan>(this.apiUrl, plan); }
  update(id: number, plan: Partial<Plan>): Observable<Plan> { return this.http.put<Plan>(`${this.apiUrl}/${id}`, plan); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Attendance[]> { return this.http.get<Attendance[]>(this.apiUrl); }
  getById(id: number): Observable<Attendance> { return this.http.get<Attendance>(`${this.apiUrl}/${id}`); }
  getByMember(memberId: number): Observable<Attendance[]> { return this.http.get<Attendance[]>(`${this.apiUrl}/member/${memberId}`); }
  checkIn(data: { memberId: number; observation?: string }): Observable<Attendance> { return this.http.post<Attendance>(`${this.apiUrl}/checkin`, data); }
  update(id: number, data: Partial<Attendance>): Observable<Attendance> { return this.http.put<Attendance>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Payment[]> { return this.http.get<Payment[]>(this.apiUrl); }
  getById(id: number): Observable<Payment> { return this.http.get<Payment>(`${this.apiUrl}/${id}`); }
  getByMember(memberId: number): Observable<Payment[]> { return this.http.get<Payment[]>(`${this.apiUrl}/member/${memberId}`); }
  create(payment: Payment): Observable<Payment> { return this.http.post<Payment>(this.apiUrl, payment); }
  update(id: number, data: Partial<Payment>): Observable<Payment> { return this.http.put<Payment>(`${this.apiUrl}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
