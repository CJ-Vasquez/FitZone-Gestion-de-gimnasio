import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MiembroService } from '../../core/services/api.services';
import { Miembro } from '../../core/models/models';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1"><i class="bi bi-people me-2 text-primary"></i>Miembros</h2>
          <p class="text-muted mb-0">Gestión de miembros del gimnasio</p>
        </div>
        <button class="btn btn-primary" (click)="openModal()">
          <i class="bi bi-plus-lg me-2"></i>Nuevo Miembro
        </button>
      </div>

      <!-- Alert -->
      <div *ngIf="message" class="alert" [ngClass]="isError ? 'alert-danger' : 'alert-success'" role="alert">
        {{ message }}
      </div>

      <!-- Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          <table *ngIf="!loading" class="table table-hover mb-0">
            <thead class="table-dark">
              <tr>
                <th>#</th><th>Nombre</th><th>Email</th><th>DNI</th><th>Teléfono</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of members">
                <td class="text-muted">{{ m.id }}</td>
                <td><strong>{{ m.nombre }} {{ m.apellido }}</strong></td>
                <td>{{ m.email }}</td>
                <td>{{ m.dni }}</td>
                <td>{{ m.telefono || '—' }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': m.estado === 'ACTIVO',
                    'bg-warning text-dark': m.estado === 'PENDIENTE',
                    'bg-danger': m.estado === 'INACTIVO'
                  }">{{ m.estado }}</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" (click)="openModal(m)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteMember(m.id!)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="members.length === 0">
                <td colspan="7" class="text-center text-muted py-4">No hay miembros registrados</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" style="background:rgba(0,0,0,0.5);" *ngIf="showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-person me-2"></i>{{ editMode ? 'Editar' : 'Nuevo' }} Miembro
            </h5>
            <button type="button" class="btn-close btn-close-white" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveMember()">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombres *</label>
                  <input class="form-control" [(ngModel)]="form.nombre" name="nombre" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Apellidos *</label>
                  <input class="form-control" [(ngModel)]="form.apellido" name="apellido" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" [(ngModel)]="form.email" name="email" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">DNI *</label>
                  <input class="form-control" [(ngModel)]="form.dni" name="dni" maxlength="8" required [disabled]="editMode">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input class="form-control" [(ngModel)]="form.telefono" name="telefono">
                </div>
                <div class="col-md-6" *ngIf="editMode">
                  <label class="form-label">Estado</label>
                  <select class="form-select" [(ngModel)]="form.estado" name="estado">
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer px-0 pb-0 mt-3">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving">
                  <span *ngIf="saving" class="spinner-border spinner-border-sm me-1"></span>
                  {{ saving ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MembersComponent implements OnInit {
  members: Miembro[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  saving = false;
  message = '';
  isError = false;
  currentId: number | null = null;
  form: Partial<Miembro> = {};

  constructor(private miembroService: MiembroService) {}

  ngOnInit() { this.loadMembers(); }

  loadMembers() {
    this.loading = true;
    this.miembroService.getAll().subscribe({
      next: data => { this.members = data; this.loading = false; },
      error: () => { this.loading = false; this.showMessage('Error al cargar miembros', true); }
    });
  }

  openModal(member?: Miembro) {
    this.editMode = !!member;
    this.currentId = member?.id || null;
    this.form = member ? { ...member } : {};
    this.showModal = true;
  }

  closeModal() { this.showModal = false; this.form = {}; }

  saveMember() {
    this.saving = true;
    const obs = this.editMode
      ? this.miembroService.update(this.currentId!, this.form)
      : this.miembroService.create(this.form as Miembro);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.loadMembers();
        this.showMessage(this.editMode ? 'Miembro actualizado' : 'Miembro creado', false);
      },
      error: err => {
        this.saving = false;
        this.showMessage(err.error?.message || 'Error al guardar', true);
      }
    });
  }

  deleteMember(id: number) {
    if (!confirm('¿Eliminar este miembro?')) return;
    this.miembroService.delete(id).subscribe({
      next: () => { this.loadMembers(); this.showMessage('Miembro eliminado', false); },
      error: () => this.showMessage('Error al eliminar', true)
    });
  }

  showMessage(msg: string, isError: boolean) {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 4000);
  }
}
