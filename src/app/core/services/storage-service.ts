import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /* ACCESS TOKEN */
  setToken(token: string): void {
    localStorage.setItem(
      'accessToken',
      token
    );
  }

  getToken(): string | null {
    return localStorage.getItem(
      'accessToken'
    );
  }

  removeToken(): void {
    localStorage.removeItem(
      'accessToken'
    );
  }

  /* USER */
  setUser(user: any): void {
    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );
  }

  getUser(): any {
    const user =
      localStorage.getItem('user');
    return user
      ? JSON.parse(user)
      : null;
  }

  clear(): void {
    localStorage.clear();
  }

}