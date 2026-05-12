import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIconModule, MatMenuModule, MatToolbarModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private router = inject(Router);

  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  login() {
    this.router.navigate(['/login']);
  }
  
}
