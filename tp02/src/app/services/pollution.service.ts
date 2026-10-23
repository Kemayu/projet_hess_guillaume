import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PollutionDeclaration, PollutionPayload } from '../models/pollution-declaration.model';

@Injectable({ providedIn: 'root' })
export class PollutionService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/pollutions`;

  getAll(): Observable<PollutionDeclaration[]> {
    return this.http.get<PollutionDeclaration[]>(this.endpoint);
  }

  getById(id: string): Observable<PollutionDeclaration> {
    return this.http.get<PollutionDeclaration>(`${this.endpoint}/${encodeURIComponent(id)}`);
  }

  create(pollution: PollutionPayload): Observable<PollutionDeclaration> {
    return this.http.post<PollutionDeclaration>(this.endpoint, pollution);
  }

  update(id: string, pollution: PollutionPayload): Observable<PollutionDeclaration> {
    return this.http.put<PollutionDeclaration>(
      `${this.endpoint}/${encodeURIComponent(id)}`,
      pollution
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${encodeURIComponent(id)}`);
  }
}
