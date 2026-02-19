import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- ========== NAVBAR ========== -->
    <nav style="position:fixed;top:0;width:100%;z-index:1030;
                background:rgba(26,26,46,0.95);backdrop-filter:blur(10px);
                border-bottom:1px solid rgba(255,255,255,0.05);">
      <div class="container d-flex align-items-center py-3">
        <span style="font-size:1.5rem;font-weight:900;color:#e94560;letter-spacing:-0.5px;">
          <i class="bi bi-lightning-charge-fill me-1"></i>FitZone
        </span>
        <ul class="nav ms-auto me-3 d-none d-md-flex gap-1">
          <li><a href="#features" class="nav-link px-3 py-2 text-white-50 small fw-semibold nav-hover">Servicios</a></li>
          <li><a href="#pricing" class="nav-link px-3 py-2 text-white-50 small fw-semibold nav-hover">Planes</a></li>
          <li><a href="#footer" class="nav-link px-3 py-2 text-white-50 small fw-semibold nav-hover">Contacto</a></li>
        </ul>
        <button class="btn btn-sm px-3 py-2 fw-semibold"
                style="background:linear-gradient(135deg,#e94560,#c62a47);color:#fff;border:none;border-radius:8px;"
                (click)="openLoginModal()">
          <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar Sesion
        </button>
      </div>
    </nav>

    <!-- ========== HERO ========== -->
    <section style="min-height:100vh;
      background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);
      display:flex;align-items:center;padding-top:80px;position:relative;overflow:hidden;">
      <!-- Decorative circles -->
      <div style="position:absolute;top:-100px;right:-100px;width:400px;height:400px;
                  border-radius:50%;background:rgba(233,69,96,0.08);"></div>
      <div style="position:absolute;bottom:-150px;left:-100px;width:500px;height:500px;
                  border-radius:50%;background:rgba(233,69,96,0.05);"></div>
      <div class="container text-center text-white position-relative">
        <div class="mb-3">
          <span style="font-size:1rem;letter-spacing:3px;color:#e94560;font-weight:700;text-transform:uppercase;">
            Bienvenido a FitZone
          </span>
        </div>
        <h1 style="font-size:clamp(2.5rem,6vw,4.5rem);font-weight:900;line-height:1.08;margin-bottom:1.5rem;">
          Transforma tu <span style="color:#e94560;">Cuerpo.</span><br>
          Transforma tu <span style="color:#e94560;">Vida.</span>
        </h1>
        <p class="lead mx-auto mb-4"
           style="color:rgba(255,255,255,0.6);font-size:1.15rem;max-width:580px;line-height:1.7;">
          El gimnasio con tecnologia de gestion de ultima generacion.
          Unete a cientos de miembros que ya cambiaron su historia.
        </p>
        <div class="d-flex gap-3 justify-content-center flex-wrap mb-5">
          <button class="btn btn-lg px-5 py-3 fw-bold hero-btn-primary"
                  style="background:linear-gradient(135deg,#e94560,#c62a47);color:#fff;border:none;border-radius:50px;
                         box-shadow:0 8px 30px rgba(233,69,96,0.4);"
                  (click)="openLoginModal()">
            <i class="bi bi-lightning-charge-fill me-2"></i>Comenzar Ahora
          </button>
          <a href="#features" class="btn btn-lg btn-outline-light px-5 py-3 fw-semibold"
             style="border-radius:50px;border-width:2px;">
            <i class="bi bi-arrow-down-circle me-2"></i>Conocer Mas
          </a>
        </div>
        <!-- Stats -->
        <div class="row g-4 justify-content-center pt-4"
             style="border-top:1px solid rgba(255,255,255,0.08);">
          <div class="col-4 col-md-auto px-md-5 text-center">
            <div style="font-size:2.5rem;font-weight:900;color:#e94560;">500+</div>
            <div style="color:rgba(255,255,255,0.5);font-size:0.85rem;">Miembros Activos</div>
          </div>
          <div class="col-4 col-md-auto px-md-5 text-center">
            <div style="font-size:2.5rem;font-weight:900;color:#e94560;">15+</div>
            <div style="color:rgba(255,255,255,0.5);font-size:0.85rem;">Entrenadores</div>
          </div>
          <div class="col-4 col-md-auto px-md-5 text-center">
            <div style="font-size:2.5rem;font-weight:900;color:#e94560;">50+</div>
            <div style="color:rgba(255,255,255,0.5);font-size:0.85rem;">Clases Semanales</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== FEATURES ========== -->
    <section id="features" style="padding:100px 0;background:#f8f9fa;">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge mb-2"
                style="background:rgba(233,69,96,0.1);color:#e94560;font-size:0.8rem;padding:8px 16px;border-radius:20px;">
            NUESTROS SERVICIOS
          </span>
          <h2 style="font-weight:900;color:#1a1a2e;font-size:2.5rem;">Todo lo que necesitas</h2>
          <p class="text-muted" style="max-width:500px;margin:0 auto;">
            Equipamiento de primera clase y entrenadores certificados a tu disposicion
          </p>
        </div>
        <div class="row g-4">
          <div class="col-md-4" *ngFor="let f of features">
            <div class="card border-0 shadow-sm h-100 text-center p-4 feature-card"
                 style="border-radius:16px;border-top:3px solid #e94560 !important;">
              <div style="width:64px;height:64px;border-radius:16px;
                          background:rgba(233,69,96,0.1);display:flex;align-items:center;
                          justify-content:center;margin:0 auto 1rem;font-size:1.5rem;color:#e94560;">
                <i [class]="'bi ' + f.icon"></i>
              </div>
              <h5 style="font-weight:800;color:#1a1a2e;">{{ f.title }}</h5>
              <p class="text-muted small mb-0">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== PRICING ========== -->
    <section id="pricing" style="padding:100px 0;
      background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge mb-2"
                style="background:rgba(233,69,96,0.2);color:#e94560;font-size:0.8rem;padding:8px 16px;border-radius:20px;">
            MEMBRESIAS
          </span>
          <h2 style="font-weight:900;color:#fff;font-size:2.5rem;">Planes para todos</h2>
          <p style="color:rgba(255,255,255,0.5);max-width:500px;margin:0 auto;">
            Elige el plan que se adapte a tu objetivo y presupuesto
          </p>
        </div>
        <div class="row g-4 justify-content-center align-items-center">
          <!-- Plan Basico -->
          <div class="col-md-4">
            <div class="card border-0 h-100 plan-card"
                 style="border-radius:20px;background:rgba(255,255,255,0.05);
                        border:1px solid rgba(255,255,255,0.1) !important;">
              <div class="card-body p-4 text-center text-white">
                <h5 style="font-weight:700;color:rgba(255,255,255,0.8);">Basico</h5>
                <div class="my-3">
                  <span style="font-size:3rem;font-weight:900;">S/. 80</span>
                  <span style="color:rgba(255,255,255,0.5);">/mes</span>
                </div>
                <ul class="list-unstyled mb-4" style="color:rgba(255,255,255,0.6);font-size:0.9rem;">
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.08)!important;">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>Acceso a equipos de cardio
                  </li>
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.08)!important;">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>Sala de pesas
                  </li>
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.08)!important;">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>Casilleros
                  </li>
                  <li class="py-2">
                    <i class="bi bi-x-circle text-secondary me-2"></i>Clases grupales
                  </li>
                </ul>
                <button class="btn w-100 fw-semibold py-2"
                        style="border:2px solid rgba(255,255,255,0.2);color:#fff;border-radius:12px;"
                        (click)="openLoginModal()">
                  Elegir Plan
                </button>
              </div>
            </div>
          </div>
          <!-- Plan Premium (destacado) -->
          <div class="col-md-4">
            <div class="card border-0 h-100 plan-card"
                 style="border-radius:20px;
                        background:linear-gradient(135deg,#e94560,#c62a47);
                        transform:scale(1.05);
                        box-shadow:0 20px 60px rgba(233,69,96,0.3);">
              <div class="card-body p-4 text-center text-white">
                <span class="badge mb-2"
                      style="background:rgba(255,255,255,0.2);font-size:0.7rem;padding:6px 14px;border-radius:20px;">
                  MAS POPULAR
                </span>
                <h5 style="font-weight:700;">Premium</h5>
                <div class="my-3">
                  <span style="font-size:3rem;font-weight:900;">S/. 120</span>
                  <span style="opacity:0.7;">/mes</span>
                </div>
                <ul class="list-unstyled mb-4" style="font-size:0.9rem;opacity:0.9;">
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.2)!important;">
                    <i class="bi bi-check-circle-fill me-2"></i>Todo del plan Basico
                  </li>
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.2)!important;">
                    <i class="bi bi-check-circle-fill me-2"></i>2 clases grupales / semana
                  </li>
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.2)!important;">
                    <i class="bi bi-check-circle-fill me-2"></i>Evaluacion nutricional
                  </li>
                  <li class="py-2">
                    <i class="bi bi-check-circle-fill me-2"></i>Acceso a duchas premium
                  </li>
                </ul>
                <button class="btn btn-light w-100 fw-bold py-2"
                        style="border-radius:12px;color:#e94560;"
                        (click)="openLoginModal()">
                  Elegir Plan
                </button>
              </div>
            </div>
          </div>
          <!-- Plan Anual -->
          <div class="col-md-4">
            <div class="card border-0 h-100 plan-card"
                 style="border-radius:20px;background:rgba(255,255,255,0.05);
                        border:1px solid rgba(255,255,255,0.1) !important;">
              <div class="card-body p-4 text-center text-white">
                <span class="badge mb-2"
                      style="background:rgba(34,197,94,0.2);color:#22c55e;font-size:0.7rem;padding:6px 14px;border-radius:20px;">
                  MEJOR VALOR
                </span>
                <h5 style="font-weight:700;color:rgba(255,255,255,0.8);">Anual</h5>
                <div class="my-3">
                  <span style="font-size:3rem;font-weight:900;">S/. 900</span>
                  <span style="color:rgba(255,255,255,0.5);">/ano</span>
                </div>
                <ul class="list-unstyled mb-4" style="color:rgba(255,255,255,0.6);font-size:0.9rem;">
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.08)!important;">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>Acceso ilimitado total
                  </li>
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.08)!important;">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>Clases ilimitadas
                  </li>
                  <li class="py-2 border-bottom" style="border-color:rgba(255,255,255,0.08)!important;">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>Entrenador personal 1x/sem
                  </li>
                  <li class="py-2">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>Spa y recuperacion
                  </li>
                </ul>
                <button class="btn w-100 fw-semibold py-2"
                        style="border:2px solid rgba(255,255,255,0.2);color:#fff;border-radius:12px;"
                        (click)="openLoginModal()">
                  Elegir Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== FOOTER ========== -->
    <footer id="footer" style="background:#0a0a1a;padding:60px 0 30px;">
      <div class="container">
        <div class="row g-4 mb-4">
          <div class="col-md-4">
            <h5 style="color:#e94560;font-weight:900;">
              <i class="bi bi-lightning-charge-fill me-1"></i>FitZone
            </h5>
            <p class="small" style="color:rgba(255,255,255,0.5);line-height:1.8;">
              Tu mejor inversion eres tu mismo. Unete a nuestra comunidad
              y alcanza tus metas fitness con el respaldo de profesionales.
            </p>
            <div class="d-flex gap-2">
              <a href="#" class="btn btn-sm" style="background:rgba(255,255,255,0.08);color:#fff;border-radius:8px;">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="btn btn-sm" style="background:rgba(255,255,255,0.08);color:#fff;border-radius:8px;">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="#" class="btn btn-sm" style="background:rgba(255,255,255,0.08);color:#fff;border-radius:8px;">
                <i class="bi bi-tiktok"></i>
              </a>
            </div>
          </div>
          <div class="col-md-4">
            <h6 class="text-white fw-bold mb-3">Horarios</h6>
            <div class="small" style="color:rgba(255,255,255,0.5);line-height:2;">
              <div><i class="bi bi-clock me-2 text-danger"></i>Lun - Vie: 6:00 AM - 10:00 PM</div>
              <div><i class="bi bi-clock me-2 text-danger"></i>Sabados: 7:00 AM - 8:00 PM</div>
              <div><i class="bi bi-clock me-2 text-danger"></i>Domingos: 8:00 AM - 6:00 PM</div>
            </div>
          </div>
          <div class="col-md-4">
            <h6 class="text-white fw-bold mb-3">Contacto</h6>
            <div class="small" style="color:rgba(255,255,255,0.5);line-height:2;">
              <div><i class="bi bi-geo-alt-fill me-2 text-danger"></i>Av. Arequipa 1234, Lima</div>
              <div><i class="bi bi-telephone-fill me-2 text-danger"></i>+51 987 654 321</div>
              <div><i class="bi bi-envelope-fill me-2 text-danger"></i>info&#64;fitzone.pe</div>
            </div>
          </div>
        </div>
        <hr style="border-color:rgba(255,255,255,0.08);">
        <div class="text-center small" style="color:rgba(255,255,255,0.3);">
          FitZone &copy; 2026 &mdash; Proyecto Final CIBERTEC
        </div>
      </div>
    </footer>

    <!-- ========== LOGIN MODAL ========== -->
    <div *ngIf="showLoginModal"
         style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:1050;
                background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);
                display:flex;align-items:center;justify-content:center;"
         (click)="closeLoginModal()">
      <div style="width:100%;max-width:420px;margin:1rem;" (click)="$event.stopPropagation()">
        <div style="border-radius:20px;overflow:hidden;background:#fff;
                    box-shadow:0 25px 60px rgba(0,0,0,0.5);">
          <!-- Modal Header -->
          <div class="text-center text-white py-4 position-relative"
               style="background:linear-gradient(135deg,#e94560,#0f3460);">
            <button class="btn btn-sm position-absolute"
                    style="top:12px;right:12px;color:rgba(255,255,255,0.7);font-size:1.2rem;"
                    (click)="closeLoginModal()">
              <i class="bi bi-x-lg"></i>
            </button>
            <div style="font-size:2.5rem;">
              <i class="bi bi-lightning-charge-fill"></i>
            </div>
            <h4 class="fw-bold mb-0">FitZone</h4>
            <p class="opacity-75 mb-0 small">Sistema de Gestion</p>
          </div>
          <!-- Modal Body -->
          <div class="p-4">
            <div *ngIf="errorMsg" class="alert alert-danger d-flex align-items-center py-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <span class="small">{{ errorMsg }}</span>
            </div>
            <form (ngSubmit)="onLogin()">
              <div class="mb-3">
                <label class="form-label fw-semibold small text-muted">
                  <i class="bi bi-person me-1"></i>Usuario
                </label>
                <input type="text" class="form-control form-control-lg"
                       style="border-radius:12px;border-color:#dee2e6;"
                       [(ngModel)]="credentials.username" name="username"
                       placeholder="Ingresa tu usuario" required [disabled]="loading"
                       autocomplete="username">
              </div>
              <div class="mb-4">
                <label class="form-label fw-semibold small text-muted">
                  <i class="bi bi-lock me-1"></i>Contrasena
                </label>
                <div class="input-group">
                  <input [type]="showPassword ? 'text' : 'password'"
                         class="form-control form-control-lg"
                         style="border-radius:12px 0 0 12px;border-color:#dee2e6;"
                         [(ngModel)]="credentials.password" name="password"
                         placeholder="Ingresa tu contrasena" required [disabled]="loading"
                         autocomplete="current-password">
                  <button class="btn btn-outline-secondary"
                          style="border-radius:0 12px 12px 0;" type="button"
                          (click)="showPassword = !showPassword">
                    <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
              </div>
              <button type="submit" class="btn btn-lg w-100 fw-bold text-white py-3"
                      style="background:linear-gradient(135deg,#e94560,#0f3460);border:none;border-radius:12px;
                             box-shadow:0 4px 15px rgba(233,69,96,0.3);"
                      [disabled]="loading || !credentials.username || !credentials.password">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!loading" class="bi bi-box-arrow-in-right me-2"></i>
                {{ loading ? 'Ingresando...' : 'Iniciar Sesion' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .nav-hover:hover { color: #e94560 !important; }
    .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
    .feature-card:hover { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important; }
    .plan-card { transition: transform 0.3s ease; }
    .plan-card:hover { transform: translateY(-6px) !important; }
    .hero-btn-primary { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(233,69,96,0.5) !important; }
  `]
})
export class LandingComponent {
  showLoginModal = false;
  credentials = { username: '', password: '' };
  loading = false;
  errorMsg = '';
  showPassword = false;

  features = [
    { icon: 'bi-trophy-fill', title: 'Musculacion', desc: 'Equipos de ultima generacion con mas de 200 maquinas para todos los niveles.' },
    { icon: 'bi-heart-pulse-fill', title: 'Cardio', desc: 'Zona completa de cardio con cintas, bicicletas y elipticas de alto rendimiento.' },
    { icon: 'bi-fire', title: 'CrossFit', desc: 'Box de CrossFit equipado para entrenamientos funcionales de alta intensidad.' },
    { icon: 'bi-people-fill', title: 'Clases Grupales', desc: 'Yoga, spinning, zumba, boxing y mas. Horarios flexibles toda la semana.' },
    { icon: 'bi-clipboard2-pulse-fill', title: 'Nutricion', desc: 'Asesoria nutricional personalizada con planes de alimentacion a medida.' },
    { icon: 'bi-droplet-fill', title: 'Spa & Recuperacion', desc: 'Sauna, vapor y zona de masajes para tu recuperacion post-entrenamiento.' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  openLoginModal() {
    this.showLoginModal = true;
    this.errorMsg = '';
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.errorMsg = '';
    this.credentials = { username: '', password: '' };
    this.showPassword = false;
  }

  onLogin() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }
}
