import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}


@Injectable({
  providedIn: 'root',
})


export class Auth {
  private http = inject(HttpClient);

  signup(data: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(
      `${environment.apiUrl}/signup`,
      data
    );
  }
}