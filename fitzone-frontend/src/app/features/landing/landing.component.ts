import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Navbar -->
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">
          <i class="bi bi-activity me-2"></i>FitZone
        </a>
        <button class="navbar-toggler" type="button" (click)="menuAbierto = !menuAbierto">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" [class.show]="menuAbierto">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="#sobre">Sobre el sistema</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#modulos">Modulos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#tecnologias">Tecnologias</a>
            </li>
          </ul>
          <button class="btn btn-outline-light btn-sm ms-md-3 mt-2 mt-md-0"
                  (click)="showLoginModal = true">
            <i class="bi bi-box-arrow-in-right me-1"></i>Ingresar
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero-section d-flex align-items-center text-white">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <h1 class="fw-bold mb-3" style="font-size:2.4rem;">
              Sistema de Gestion<br>para Gimnasios
            </h1>
            <p class="text-white-50 mb-4" style="max-width:500px;">
              Aplicacion web desarrollada con arquitectura de microservicios
              que permite administrar miembros, planes, pagos y control de
              asistencia de un gimnasio.
            </p>
            <div class="d-flex gap-2 flex-wrap">
              <button class="btn btn-danger" (click)="showLoginModal = true">
                Acceder al sistema
              </button>
              <a href="#modulos" class="btn btn-outline-light">
                Ver modulos
              </a>
            </div>
          </div>
          <div class="col-lg-5 d-none d-lg-block">
            <div class="carousel-3d">
              <div class="carousel-scene">
                <div class="carousel-track" [style.transform]="'rotateY(' + currentAngle + 'deg)'">
                  <div class="carousel-card" *ngFor="let img of carouselImages; let i = index"
                       [style.transform]="'rotateY(' + (i * 90) + 'deg) translateZ(250px)'">
                    <img [src]="img.url" [alt]="img.label">
                    <div class="carousel-label">{{ img.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sobre el sistema -->
    <section id="sobre" class="py-5 bg-light">
      <div class="container">
        <h4 class="fw-bold mb-4">Sobre el proyecto</h4>
        <div class="row g-4">
          <div class="col-md-6">
            <p class="text-muted">
              <strong>FitZone</strong> es un sistema de gestion integral para gimnasios
              desarrollado como proyecto academico. Permite la administracion
              completa de miembros, membresias, pagos y control de asistencia
              a traves de una interfaz web conectada a un backend basado en
              microservicios.
            </p>
            <p class="text-muted">
              El sistema implementa comunicacion asincrona entre servicios mediante
              RabbitMQ: cuando se registra un pago, se activa automaticamente la
              membresia del miembro asociado.
            </p>
          </div>
          <div class="col-md-6">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h6 class="fw-bold mb-3"><i class="bi bi-list-check me-2"></i>Funcionalidades principales</h6>
                <ul class="list-unstyled mb-0">
                  <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Registro y gestion de miembros</li>
                  <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Administracion de planes y tarifas</li>
                  <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Registro de pagos (efectivo, tarjeta, Yape, Plin)</li>
                  <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Control de asistencia (check-in / check-out)</li>
                  <li class="mb-2"><i class="bi bi-check2 text-success me-2"></i>Activacion automatica de membresias via RabbitMQ</li>
                  <li class="mb-0"><i class="bi bi-check2 text-success me-2"></i>Autenticacion y autorizacion con JWT</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modulos -->
    <section id="modulos" class="py-5">
      <div class="container">
        <h4 class="fw-bold mb-4">Modulos del sistema</h4>
        <div class="row g-3">
          <div class="col-md-6 col-lg-3" *ngFor="let modulo of modulos">
            <div class="card h-100 border-0 shadow-sm modulo-card">
              <div class="card-body">
                <div class="modulo-icon mb-2">
                  <i [class]="'bi ' + modulo.icon"></i>
                </div>
                <h6 class="fw-bold">{{ modulo.nombre }}</h6>
                <p class="text-muted small mb-0">{{ modulo.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tecnologias -->
    <section id="tecnologias" class="py-5 bg-light">
      <div class="container">
        <h4 class="fw-bold mb-4">Arquitectura y tecnologias</h4>
        <div class="row g-4">
          <div class="col-md-6">
            <h6 class="fw-bold mb-3">Backend (Microservicios)</h6>
            <table class="table table-sm table-bordered">
              <thead class="table-dark">
                <tr><th>Servicio</th><th>Puerto</th><th>Funcion</th></tr>
              </thead>
              <tbody>
                <tr><td>Eureka Server</td><td>8761</td><td>Service Discovery</td></tr>
                <tr><td>API Gateway</td><td>8080</td><td>Enrutamiento y filtro JWT</td></tr>
                <tr><td>Auth Service</td><td>8081</td><td>Autenticacion (login, registro)</td></tr>
                <tr><td>Miembro Service</td><td>8082</td><td>Gestion de miembros</td></tr>
                <tr><td>Plan Service</td><td>8083</td><td>Gestion de planes</td></tr>
                <tr><td>Asistencia Service</td><td>8084</td><td>Control de asistencia</td></tr>
                <tr><td>Pago Service</td><td>8085</td><td>Registro de pagos</td></tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-6">
            <h6 class="fw-bold mb-3">Stack tecnologico</h6>
            <div class="d-flex flex-wrap gap-2 mb-3">
              <span class="badge bg-success">Spring Boot 3.2</span>
              <span class="badge bg-success">Spring Cloud</span>
              <span class="badge bg-success">Spring Security</span>
              <span class="badge bg-info text-dark">Angular 17</span>
              <span class="badge bg-info text-dark">Bootstrap 5</span>
              <span class="badge bg-primary">PostgreSQL</span>
              <span class="badge bg-warning text-dark">RabbitMQ</span>
              <span class="badge bg-secondary">JWT</span>
              <span class="badge bg-secondary">Netflix Eureka</span>
            </div>
            <div class="card border-0 shadow-sm">
              <div class="card-body small">
                <h6 class="fw-bold"><i class="bi bi-diagram-3 me-2"></i>Flujo de pago con RabbitMQ</h6>
                <ol class="mb-0 text-muted">
                  <li>El admin registra un pago en <strong>Payment Service</strong></li>
                  <li>Se publica un evento <code>payment.confirmed</code> en RabbitMQ</li>
                  <li><strong>Member Service</strong> consume el evento</li>
                  <li>Se activa la membresia del miembro automaticamente</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-3 bg-dark text-center">
      <small class="text-white-50">
        FitZone &copy; 2026 &mdash; Proyecto Academico CIBERTEC
      </small>
    </footer>

    <!-- Login Modal -->
    <div *ngIf="showLoginModal" class="login-overlay" (click)="cerrarModal()">
      <div class="login-modal" (click)="$event.stopPropagation()">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-activity me-2"></i>Iniciar sesion
          </h5>
          <button class="btn-close" (click)="cerrarModal()"></button>
        </div>
        <hr>
        <div *ngIf="errorMsg" class="alert alert-danger py-2 small">
          <i class="bi bi-exclamation-triangle me-1"></i>{{ errorMsg }}
        </div>
        <form (ngSubmit)="onLogin()">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Usuario</label>
            <input type="text" class="form-control"
                   [(ngModel)]="credentials.username" name="username"
                   placeholder="Ingresa tu usuario" required [disabled]="loading"
                   autocomplete="username">
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Contrasena</label>
            <div class="input-group">
              <input [type]="showPassword ? 'text' : 'password'" class="form-control"
                     [(ngModel)]="credentials.password" name="password"
                     placeholder="Ingresa tu contrasena" required [disabled]="loading"
                     autocomplete="current-password">
              <button class="btn btn-outline-secondary" type="button"
                      (click)="showPassword = !showPassword">
                <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
          </div>
          <button type="submit" class="btn btn-dark w-100"
                  [disabled]="loading || !credentials.username || !credentials.password">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>
        <div class="text-center mt-3">
          <small class="text-muted">Usuario de prueba: admin / admin123</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .hero-section {
      min-height: 100vh;
      padding-top: 70px;
      background: #212529;
    }

    .carousel-3d {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }

    .carousel-scene {
      width: 260px;
      height: 340px;
      perspective: 800px;
    }

    .carousel-track {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .carousel-card {
      position: absolute;
      width: 260px;
      height: 340px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .carousel-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .carousel-label {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 8px;
      background: linear-gradient(transparent, rgba(0,0,0,0.85));
      color: #fff;
      font-size: 0.85rem;
      font-weight: 700;
      text-align: center;
      letter-spacing: 0.5px;
    }

    .modulo-card {
      transition: transform 0.2s;
    }
    .modulo-card:hover {
      transform: translateY(-3px);
    }

    .modulo-icon {
      font-size: 1.5rem;
      color: #dc3545;
    }

    .login-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1060;
    }

    .login-modal {
      background: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      width: 100%;
      max-width: 400px;
      margin: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  showLoginModal = false;
  menuAbierto = false;
  credentials = { username: '', password: '' };
  loading = false;
  errorMsg = '';
  showPassword = false;
  currentAngle = 0;
  private carouselInterval: any;

  carouselImages = [
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop', label: 'Equipamiento' },
    { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop', label: 'Entrenamiento' },
    { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop', label: 'Comunidad' },
    { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=500&fit=crop', label: 'Resultados' }
  ];

  modulos = [
    {
      icon: 'bi-people',
      nombre: 'Miembros',
      descripcion: 'Registro, edicion y consulta de miembros del gimnasio con estado de membresia.'
    },
    {
      icon: 'bi-card-list',
      nombre: 'Planes',
      descripcion: 'Administracion de planes con precios, duracion y estado activo/inactivo.'
    },
    {
      icon: 'bi-credit-card',
      nombre: 'Pagos',
      descripcion: 'Registro de pagos con multiples metodos. Activa membresias via RabbitMQ.'
    },
    {
      icon: 'bi-calendar-check',
      nombre: 'Asistencia',
      descripcion: 'Control de entrada y salida con calculo automatico de tiempo en el local.'
    }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.carouselInterval = setInterval(() => {
      this.currentAngle -= 90;
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.carouselInterval);
  }

  cerrarModal() {
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
        this.router.navigate(['/panel']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }
}
