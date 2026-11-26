import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';

// Feature Users : chargée en lazy loading, protégée par authGuard dans app.routes.ts
export const USER_ROUTES: Routes = [
  { path: '', component: UserListComponent }
];
