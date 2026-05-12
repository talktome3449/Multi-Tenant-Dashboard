import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';


export const MENU_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Users', icon: 'group', path: '/users' },
  { label: 'Tenants', icon: 'apartment', path: '/tenants' }
];

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule, MatSidenavModule, MatIconModule, MatListModule ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  menu = MENU_ITEMS;
}
