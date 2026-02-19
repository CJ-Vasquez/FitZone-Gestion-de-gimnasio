import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService, PlanService, AttendanceService, PaymentService } from '../../core/services/api.services';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <!-- Header -->
      <div class="mb-4">
        <h2 class="fw-bold text-dark mb-1">
          <i class="bi bi-speedometer2 me-2 text-primary"></i>Dashboard
        </h2>
        <p class="text-muted mb-0">Bienvenido, <strong>{{ authService.getUsername() }}</strong> — Vista general del sistema FitZone</p>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #0d6efd !important;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center text-white"
                   style="width:56px;height:56px;background:#0d6efd;font-size:1.5rem;">
                <i class="bi bi-people"></i>
              </div>
              <div>
                <div class="text-muted small">Total Miembros</div>
                <div class="h3 fw-bold mb-0">{{ totalMembers }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #198754 !important;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center text-white"
                   style="width:56px;height:56px;background:#198754;font-size:1.5rem;">
                <i class="bi bi-card-list"></i>
              </div>
              <div>
                <div class="text-muted small">Planes Activos</div>
                <div class="h3 fw-bold mb-0">{{ totalPlans }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #ffc107 !important;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center text-white"
                   style="width:56px;height:56px;background:#ffc107;font-size:1.5rem;">
                <i class="bi bi-calendar-check"></i>
              </div>
              <div>
                <div class="text-muted small">Asistencias</div>
                <div class="h3 fw-bold mb-0">{{ totalAttendance }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #dc3545 !important;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center text-white"
                   style="width:56px;height:56px;background:#dc3545;font-size:1.5rem;">
                <i class="bi bi-credit-card"></i>
              </div>
              <div>
                <div class="text-muted small">Pagos</div>
                <div class="h3 fw-bold mb-0">{{ totalPayments }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Card -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-dark text-white fw-semibold">
          <i class="bi bi-info-circle me-2"></i>Arquitectura del Sistema
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success">Activo</span>
                <strong>Eureka Server</strong>
                <small class="text-muted">:8761</small>
              </div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success">Activo</span>
                <strong>API Gateway</strong>
                <small class="text-muted">:8080</small>
              </div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success">Activo</span>
                <strong>Auth Service</strong>
                <small class="text-muted">:8081</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success">Activo</span>
                <strong>Member Service</strong>
                <small class="text-muted">:8082</small>
              </div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success">Activo</span>
                <strong>Plan Service</strong>
                <small class="text-muted">:8083</small>
              </div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success">Activo</span>
                <strong>Attendance Service</strong>
                <small class="text-muted">:8084</small>
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-success">Activo</span>
                <strong>Payment Service</strong>
                <small class="text-muted">:8085</small>
              </div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-warning text-dark">Broker</span>
                <strong>RabbitMQ</strong>
                <small class="text-muted">:5672</small>
              </div>
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge bg-info text-dark">Frontend</span>
                <strong>Angular 17</strong>
                <small class="text-muted">Vercel</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  totalMembers = 0;
  totalPlans = 0;
  totalAttendance = 0;
  totalPayments = 0;

  constructor(
    public authService: AuthService,
    private memberService: MemberService,
    private planService: PlanService,
    private attendanceService: AttendanceService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.memberService.getAll().subscribe({ next: data => this.totalMembers = data.length, error: () => {} });
    this.planService.getAll().subscribe({ next: data => this.totalPlans = data.length, error: () => {} });
    this.attendanceService.getAll().subscribe({ next: data => this.totalAttendance = data.length, error: () => {} });
    this.paymentService.getAll().subscribe({ next: data => this.totalPayments = data.length, error: () => {} });
  }
}
