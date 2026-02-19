import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center"
         style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
      <div class="card shadow-lg" style="width: 420px; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div class="card-header text-white text-center py-4 border-0"
             style="background: linear-gradient(135deg, #e94560, #0f3460);">
          <div style="font-size: 3rem;">🏋️</div>
          <h3 class="fw-bold mb-1">FitZone</h3>
          <p class="mb-0 opacity-75">Sistema de Gestión de Gimnasio</p>
        </div>

        <!-- Body -->
        <div class="card-body p-4">
          <div *ngIf="errorMsg" class="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMsg }}
          </div>

          <form (ngSubmit)="onLogin()">
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-person me-1"></i>Usuario
              </label>
              <input type="text" class="form-control form-control-lg"
                     [(ngModel)]="credentials.username" name="username"
                     placeholder="Ingresa tu usuario" required [disabled]="loading">
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold">
                <i class="bi bi-lock me-1"></i>Contraseña
              </label>
              <div class="input-group">
                <input [type]="showPassword ? 'text' : 'password'"
                       class="form-control form-control-lg"
                       [(ngModel)]="credentials.password" name="password"
                       placeholder="Ingresa tu contraseña" required [disabled]="loading">
                <button class="btn btn-outline-secondary" type="button"
                        (click)="showPassword = !showPassword">
                  <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100 fw-semibold"
                    style="background: linear-gradient(135deg, #e94560, #0f3460); border: none;"
                    [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!loading" class="bi bi-box-arrow-in-right me-2"></i>
              {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
            </button>
          </form>
        </div>

        <div class="card-footer text-center text-muted py-3">
          <small>FitZone &copy; 2026 — CIBERTEC</small>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  loading = false;
  errorMsg = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }
}
