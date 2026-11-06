import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserPayload } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/api/users`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoint);
  }

  create(user: UserPayload): Observable<User> {
    return this.http.post<User>(this.endpoint, user);
  }
}
