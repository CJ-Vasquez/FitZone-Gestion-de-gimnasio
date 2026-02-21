import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../core/services/api.services';
import { Attendance } from '../../core/models/models';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1"><i class="bi bi-calendar-check me-2 text-warning"></i>Asistencia</h2>
          <p class="text-muted mb-0">Registro de entradas y salidas</p>
        </div>
        <button class="btn btn-warning" (click)="openModal()">
          <i class="bi bi-plus-lg me-2"></i>Registrar Check-in
        </button>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="isError ? 'alert-danger' : 'alert-success'">{{ message }}</div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div *ngIf="loading" class="text-center py-5"><div class="spinner-border text-warning"></div></div>
          <table *ngIf="!loading" class="table table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th>#</th><th>Miembro ID</th><th>Check-in</th><th>Check-out</th><th>Minutos</th><th>Observación</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of attendance">
                <td>{{ a.id }}</td>
                <td><span class="badge bg-primary">ID: {{ a.memberId }}</span></td>
                <td>{{ a.checkIn | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ a.checkOut ? (a.checkOut | date:'dd/MM/yyyy HH:mm') : '—' }}</td>
                <td>{{ a.minutesSpent ? formatMinutes(a.minutesSpent) : '—' }}</td>
                <td>{{ a.observation || '—' }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" (click)="openModal(a)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteAttendance(a.id!)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="attendance.length === 0">
                <td colspan="7" class="text-center text-muted py-4">No hay registros de asistencia</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" style="background:rgba(0,0,0,0.5);" *ngIf="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title">{{ editMode ? 'Editar Registro' : 'Nuevo Check-in' }}</h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveAttendance()">
              <div class="mb-3" *ngIf="!editMode">
                <label class="form-label">ID del Miembro *</label>
                <input type="number" class="form-control" [(ngModel)]="form.memberId" name="memberId" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Observación</label>
                <input class="form-control" [(ngModel)]="form.observation" name="observation">
              </div>
              <div class="mb-3" *ngIf="editMode">
                <label class="form-label">Check-out</label>
                <input type="datetime-local" class="form-control" [(ngModel)]="form.checkOut" name="checkOut">
              </div>
              <div class="modal-footer px-0 pb-0">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-warning" [disabled]="saving">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AttendanceComponent implements OnInit {
  attendance: Attendance[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  saving = false;
  message = '';
  isError = false;
  currentId: number | null = null;
  form: Partial<Attendance> = {};

  constructor(private attendanceService: AttendanceService) {}
  ngOnInit() { this.load(); }

  load() {
    this.attendanceService.getAll().subscribe({
      next: d => { this.attendance = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openModal(a?: Attendance) {
    this.editMode = !!a;
    this.currentId = a?.id || null;
    this.form = a ? { ...a } : {};
    this.showModal = true;
  }
  closeModal() { this.showModal = false; }

  saveAttendance() {
    this.saving = true;
    const obs = this.editMode
      ? this.attendanceService.update(this.currentId!, this.form)
      : this.attendanceService.checkIn({ memberId: this.form.memberId!, observation: this.form.observation });
    obs.subscribe({
      next: () => { this.saving = false; this.closeModal(); this.load(); this.showMessage('Guardado correctamente', false); },
      error: err => { this.saving = false; this.showMessage(err.error?.message || 'Error', true); }
    });
  }

  deleteAttendance(id: number) {
    if (!confirm('¿Eliminar este registro?')) return;
    this.attendanceService.delete(id).subscribe({
      next: () => { this.load(); this.showMessage('Eliminado', false); },
      error: () => this.showMessage('Error al eliminar', true)
    });
  }

  formatMinutes(total: number): string {
    if (total < 60) return total + ' min';
    const days = Math.floor(total / 1440);
    const hours = Math.floor((total % 1440) / 60);
    const mins = total % 60;
    let result = '';
    if (days > 0) result += days + 'd ';
    if (hours > 0) result += hours + 'h ';
    if (mins > 0) result += mins + 'min';
    return result.trim();
  }

  showMessage(msg: string, isError: boolean) {
    this.message = msg; this.isError = isError;
    setTimeout(() => this.message = '', 4000);
  }
}
