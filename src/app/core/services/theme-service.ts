import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  
  isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem('theme');
    this.isDark.set(saved === 'dark');

    effect(() => {
      document.body.classList.toggle('dark-theme', this.isDark());
      localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
    });
  }

  toggleTheme() {
    this.isDark.update(v => !v);
  }
}
