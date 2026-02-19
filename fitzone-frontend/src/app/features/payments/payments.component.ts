import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/api.services';
import { Payment } from '../../core/models/models';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1"><i class="bi bi-credit-card me-2 text-danger"></i>Pagos</h2>
          <p class="text-muted mb-0">Registro de pagos — Al confirmar un pago, la membresía se activa automáticamente vía RabbitMQ</p>
        </div>
        <button class="btn btn-danger" (click)="openModal()">
          <i class="bi bi-plus-lg me-2"></i>Registrar Pago
        </button>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="isError ? 'alert-danger' : 'alert-success'">{{ message }}</div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div *ngIf="loading" class="text-center py-5"><div class="spinner-border text-danger"></div></div>
          <table *ngIf="!loading" class="table table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th>#</th><th>Miembro ID</th><th>Plan ID</th><th>Monto</th><th>Método</th><th>Estado</th><th>Fecha</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of payments">
                <td>{{ p.id }}</td>
                <td><span class="badge bg-primary">ID: {{ p.memberId }}</span></td>
                <td><span class="badge bg-info text-dark">Plan: {{ p.planId }}</span></td>
                <td class="fw-bold text-success">S/. {{ p.amount }}</td>
                <td>{{ p.paymentMethod }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': p.status === 'CONFIRMED',
                    'bg-warning text-dark': p.status === 'PENDING',
                    'bg-danger': p.status === 'CANCELLED'
                  }">{{ p.status }}</span>
                </td>
                <td>{{ p.paymentDate | date:'dd/MM/yyyy' }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" (click)="openModal(p)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deletePayment(p.id!)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="payments.length === 0">
                <td colspan="8" class="text-center text-muted py-4">No hay pagos registrados</td>
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
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">{{ editMode ? 'Editar Pago' : 'Registrar Pago' }}</h5>
            <button type="button" class="btn-close btn-close-white" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <div *ngIf="!editMode" class="alert alert-info small">
              <i class="bi bi-info-circle me-1"></i>
              Al registrar el pago, se enviará un evento a RabbitMQ que activará automáticamente la membresía del miembro.
            </div>
            <form (ngSubmit)="savePayment()">
              <div class="row g-3" *ngIf="!editMode">
                <div class="col-6">
                  <label class="form-label">ID del Miembro *</label>
                  <input type="number" class="form-control" [(ngModel)]="form.memberId" name="memberId" required>
                </div>
                <div class="col-6">
                  <label class="form-label">ID del Plan *</label>
                  <input type="number" class="form-control" [(ngModel)]="form.planId" name="planId" required>
                </div>
                <div class="col-6">
                  <label class="form-label">Monto (S/.) *</label>
                  <input type="number" step="0.01" class="form-control" [(ngModel)]="form.amount" name="amount" required>
                </div>
                <div class="col-6">
                  <label class="form-label">Método de Pago *</label>
                  <select class="form-select" [(ngModel)]="form.paymentMethod" name="paymentMethod" required>
                    <option value="CASH">Efectivo</option>
                    <option value="CARD">Tarjeta</option>
                    <option value="TRANSFER">Transferencia</option>
                    <option value="YAPE">Yape</option>
                    <option value="PLIN">Plin</option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Notas</label>
                  <input class="form-control" [(ngModel)]="form.notes" name="notes">
                </div>
              </div>

              <div *ngIf="editMode">
                <div class="mb-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" [(ngModel)]="form.status" name="status">
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Notas</label>
                  <input class="form-control" [(ngModel)]="form.notes" name="notes">
                </div>
              </div>

              <div class="modal-footer px-0 pb-0 mt-3">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-danger" [disabled]="saving">
                  <span *ngIf="saving" class="spinner-border spinner-border-sm me-1"></span>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  saving = false;
  message = '';
  isError = false;
  currentId: number | null = null;
  form: Partial<Payment> = {};

  constructor(private paymentService: PaymentService) {}
  ngOnInit() { this.load(); }

  load() {
    this.paymentService.getAll().subscribe({
      next: d => { this.payments = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openModal(p?: Payment) {
    this.editMode = !!p;
    this.currentId = p?.id || null;
    this.form = p ? { ...p } : { paymentMethod: 'CASH' };
    this.showModal = true;
  }
  closeModal() { this.showModal = false; }

  savePayment() {
    this.saving = true;
    const obs = this.editMode
      ? this.paymentService.update(this.currentId!, this.form)
      : this.paymentService.create(this.form as Payment);
    obs.subscribe({
      next: () => { this.saving = false; this.closeModal(); this.load(); this.showMessage('Pago guardado. Membresía activada via RabbitMQ.', false); },
      error: err => { this.saving = false; this.showMessage(err.error?.message || 'Error', true); }
    });
  }

  deletePayment(id: number) {
    if (!confirm('¿Eliminar este pago?')) return;
    this.paymentService.delete(id).subscribe({
      next: () => { this.load(); this.showMessage('Pago eliminado', false); },
      error: () => this.showMessage('Error al eliminar', true)
    });
  }

  showMessage(msg: string, isError: boolean) {
    this.message = msg; this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}
