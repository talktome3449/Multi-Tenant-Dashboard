import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(StorageService);
  private api = 'http://localhost:5000/api/auth';

  /* AUTH STATE */
  currentUser = signal<any>(this.storage.getUser());
  isLoggedIn = computed(() => !!this.currentUser());

  /* LOGIN */
  login(data: any) {
    return this.http.post(`${this.api}/login`, data);
  }

  /* SAVE SESSION */
  saveSession(
    token: string,
    user: any
  ): void {
    this.storage.setToken(token);
    this.storage.setUser(user);
    this.currentUser.set(user);
  }

  /* LOGOUT */
  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /* TOKEN */
  getToken(): string | null {
    return this.storage.getToken();
  }

  /* ROLE */
  getRole(): string {
    return this.currentUser()?.role;
  }

  autoLogout(): void {
    const token = this.getToken();
    if (!token) {
      return;
    }
    const payload =
      JSON.parse(
        atob(
          token.split('.')[1]
        )
      );
    const expiry = payload.exp * 1000;
    const timeout = expiry - Date.now();
    if (timeout > 0) {
      setTimeout(() => {
        this.logout();
      }, timeout);
    }
  }
  
}
