import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { PollutionCreateComponent } from './pages/pollution-create/pollution-create.component';
import { PollutionDetailComponent } from './pages/pollution-detail/pollution-detail.component';
import { PollutionListComponent } from './pages/pollution-list/pollution-list.component';

// Feature Pollutions : chargée en lazy loading depuis app.routes.ts
export const POLLUTION_ROUTES: Routes = [
  { path: '', component: PollutionListComponent },
  // Avant ':id', sinon "new" serait pris pour un identifiant
  { path: 'new', component: PollutionCreateComponent, canMatch: [authGuard] },
  { path: ':id', component: PollutionDetailComponent }
];
