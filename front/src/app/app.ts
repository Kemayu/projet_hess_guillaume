import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './core/states/auth/auth.state';
import { Logout } from './core/states/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly store = inject(Store);
  readonly isLoggedIn = this.store.selectSignal(AuthState.isAuthenticated);
  readonly username = this.store.selectSignal(AuthState.getUsername);

  logout(): void {
    this.store.dispatch(new Logout());
  }
}
