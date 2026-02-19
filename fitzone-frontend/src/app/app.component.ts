import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div *ngIf="authService.isLoggedIn(); else loginLayout">
      <!-- Sidebar Layout -->
      <div class="d-flex" style="min-height: 100vh;">
        <!-- Sidebar -->
        <nav class="sidebar d-flex flex-column p-3 text-white" style="width: 250px; min-height: 100vh; background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
          <div class="text-center mb-4">
            <div class="mb-2" style="font-size: 2.5rem;">🏋️</div>
            <h4 class="fw-bold text-white mb-0">FitZone</h4>
            <small class="text-white-50">Sistema de Gestión</small>
          </div>

          <hr class="border-secondary">

          <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item mb-1">
              <a routerLink="/dashboard" routerLinkActive="active"
                 class="nav-link text-white d-flex align-items-center gap-2">
                <i class="bi bi-speedometer2"></i> Dashboard
              </a>
            </li>
            <li class="nav-item mb-1">
              <a routerLink="/members" routerLinkActive="active"
                 class="nav-link text-white d-flex align-items-center gap-2">
                <i class="bi bi-people"></i> Miembros
              </a>
            </li>
            <li class="nav-item mb-1">
              <a routerLink="/plans" routerLinkActive="active"
                 class="nav-link text-white d-flex align-items-center gap-2">
                <i class="bi bi-card-list"></i> Planes
              </a>
            </li>
            <li class="nav-item mb-1">
              <a routerLink="/attendance" routerLinkActive="active"
                 class="nav-link text-white d-flex align-items-center gap-2">
                <i class="bi bi-calendar-check"></i> Asistencia
              </a>
            </li>
            <li class="nav-item mb-1">
              <a routerLink="/payments" routerLinkActive="active"
                 class="nav-link text-white d-flex align-items-center gap-2">
                <i class="bi bi-credit-card"></i> Pagos
              </a>
            </li>
          </ul>

          <hr class="border-secondary">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-person-circle" style="font-size: 1.5rem;"></i>
            <div>
              <div class="small fw-bold">{{ authService.getUsername() }}</div>
              <div class="text-white-50" style="font-size: 0.7rem;">{{ authService.getRole() }}</div>
            </div>
            <button class="btn btn-sm btn-outline-light ms-auto" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-grow-1" style="background-color: #f8f9fa;">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <ng-template #loginLayout>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .nav-link:hover { background-color: rgba(255,255,255,0.1) !important; }
    .nav-link.active { background-color: rgba(255,255,255,0.2) !important; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
