import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:3001/api/auth';
  private readonly TOKEN_KEY = 'access_token';

  private currentUserSubject = new BehaviorSubject<any | null>(this.getUserFromStorage());
  readonly currentUser$: Observable<any | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<ApiResponse<{ token: string; user: any }>>(`${this.API_URL}/login`, credentials)
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Fallo de autenticación.');
        }),
        tap((data) => {
          if (typeof localStorage === 'undefined') return;
          localStorage.setItem(this.TOKEN_KEY, data.token);
          this.currentUserSubject.next(data.user);
        })
      );
  }

  register(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/register`, credentials).pipe(
      map((response) => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'No se pudo registrar el usuario.');
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getUserFromStorage(): any | null {
    const token = this.getToken();
    return token ? { rol: 'alumno' } : null;
  }
}
