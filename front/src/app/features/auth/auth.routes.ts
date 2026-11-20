import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Feature Auth (connexion / inscription) : chargée en lazy loading depuis app.routes.ts
export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] }
];
