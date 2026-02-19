import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'members',
    canActivate: [authGuard],
    loadComponent: () => import('./features/members/members.component').then(m => m.MembersComponent)
  },
  {
    path: 'plans',
    canActivate: [authGuard],
    loadComponent: () => import('./features/plans/plans.component').then(m => m.PlansComponent)
  },
  {
    path: 'attendance',
    canActivate: [authGuard],
    loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent)
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () => import('./features/payments/payments.component').then(m => m.PaymentsComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
