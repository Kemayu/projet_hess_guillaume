import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthStateModel, UserProfile } from './auth.model';
import { Login, Logout } from './auth.actions';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    isAuthenticated: false
  }
})
@Injectable()
export class AuthState {

  @Selector()
  static getUser(state: AuthStateModel): UserProfile | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static getUsername(state: AuthStateModel): string | null {
    return state.user?.nom ?? null;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({
      user: {
        id: 1,
        email: action.payload.email,
        nom: action.payload.nom,
        role: 'user'
      },
      isAuthenticated: true
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      user: null,
      isAuthenticated: false
    });
  }
}
