import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../core/services/api.services';
import { Plan } from '../../core/models/models';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1"><i class="bi bi-card-list me-2 text-success"></i>Planes de Membresía</h2>
          <p class="text-muted mb-0">Gestión de planes disponibles</p>
        </div>
        <button class="btn btn-success" (click)="openModal()">
          <i class="bi bi-plus-lg me-2"></i>Nuevo Plan
        </button>
      </div>

      <div *ngIf="message" class="alert" [ngClass]="isError ? 'alert-danger' : 'alert-success'">{{ message }}</div>

      <div class="row g-4">
        <div class="col-md-4" *ngFor="let p of plans">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header text-white fw-bold"
                 style="background: linear-gradient(135deg, #0f3460, #0d6efd);">
              {{ p.name }}
              <span class="badge float-end" [ngClass]="p.active ? 'bg-success' : 'bg-secondary'">
                {{ p.active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="card-body">
              <p class="text-muted small">{{ p.description || 'Sin descripción' }}</p>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="text-muted small">Precio</div>
                  <div class="h4 fw-bold text-success">S/. {{ p.price }}</div>
                </div>
                <div class="text-end">
                  <div class="text-muted small">Duración</div>
                  <div class="h5 fw-bold">{{ p.durationDays }} días</div>
                </div>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <button class="btn btn-sm btn-outline-primary me-2" (click)="openModal(p)">
                <i class="bi bi-pencil me-1"></i>Editar
              </button>
              <button class="btn btn-sm btn-outline-danger" (click)="deletePlan(p.id!)">
                <i class="bi bi-trash me-1"></i>Eliminar
              </button>
            </div>
          </div>
        </div>
        <div class="col-12 text-center text-muted py-4" *ngIf="plans.length === 0 && !loading">
          No hay planes registrados
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" style="background:rgba(0,0,0,0.5);" *ngIf="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">{{ editMode ? 'Editar' : 'Nuevo' }} Plan</h5>
            <button type="button" class="btn-close btn-close-white" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="savePlan()">
              <div class="mb-3">
                <label class="form-label">Nombre del Plan *</label>
                <input class="form-control" [(ngModel)]="form.name" name="name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" [(ngModel)]="form.description" name="description" rows="2"></textarea>
              </div>
              <div class="row g-3">
                <div class="col-6">
                  <label class="form-label">Precio (S/.) *</label>
                  <input type="number" step="0.01" class="form-control" [(ngModel)]="form.price" name="price" required>
                </div>
                <div class="col-6">
                  <label class="form-label">Duración (días) *</label>
                  <input type="number" class="form-control" [(ngModel)]="form.durationDays" name="durationDays" required>
                </div>
              </div>
              <div class="form-check mt-3">
                <input type="checkbox" class="form-check-input" [(ngModel)]="form.active" name="active" id="active">
                <label class="form-check-label" for="active">Plan Activo</label>
              </div>
              <div class="modal-footer px-0 pb-0 mt-3">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-success" [disabled]="saving">
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
export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  saving = false;
  message = '';
  isError = false;
  currentId: number | null = null;
  form: Partial<Plan> = { active: true };

  constructor(private planService: PlanService) {}
  ngOnInit() { this.loadPlans(); }

  loadPlans() {
    this.planService.getAll().subscribe({
      next: data => { this.plans = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openModal(plan?: Plan) {
    this.editMode = !!plan;
    this.currentId = plan?.id || null;
    this.form = plan ? { ...plan } : { active: true };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  savePlan() {
    this.saving = true;
    const obs = this.editMode
      ? this.planService.update(this.currentId!, this.form)
      : this.planService.create(this.form as Plan);
    obs.subscribe({
      next: () => { this.saving = false; this.closeModal(); this.loadPlans(); this.showMessage('Plan guardado', false); },
      error: err => { this.saving = false; this.showMessage(err.error?.message || 'Error', true); }
    });
  }

  deletePlan(id: number) {
    if (!confirm('¿Eliminar este plan?')) return;
    this.planService.delete(id).subscribe({
      next: () => { this.loadPlans(); this.showMessage('Plan eliminado', false); },
      error: () => this.showMessage('Error al eliminar', true)
    });
  }

  showMessage(msg: string, isError: boolean) {
    this.message = msg; this.isError = isError;
    setTimeout(() => this.message = '', 4000);
  }
}
