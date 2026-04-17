import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginDTO, RegisterDTO, UserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:5042/api/auth';
  private readonly TOKEN_KEY = 'qm_token';
  private readonly USER_KEY = 'qm_user';

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  authState$ = this.loggedIn$.asObservable();

  constructor(private http: HttpClient) {}

  register(dto: RegisterDTO): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/register`, dto);
  }

  login(dto: LoginDTO): Observable<{ message: string; userName: string; token: string }> {
    return this.http
      .post<{ message: string; userName: string; token: string }>(`${this.API}/login`, dto)
      .pipe(
        tap((res) => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          localStorage.setItem(this.USER_KEY, res.userName);
          this.loggedIn$.next(true);
        })
      );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API}/me`);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.loggedIn$.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
