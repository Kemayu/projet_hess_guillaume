import { Routes } from '@angular/router';
import { PollutionDetailComponent } from './pages/pollution-detail/pollution-detail.component';
import { PollutionListComponent } from './pages/pollution-list/pollution-list.component';

// Feature Pollutions : chargée en lazy loading depuis app.routes.ts
export const POLLUTION_ROUTES: Routes = [
  { path: '', component: PollutionListComponent },
  { path: ':id', component: PollutionDetailComponent }
];
