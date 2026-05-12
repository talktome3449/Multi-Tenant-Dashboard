import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { map } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, Header, MatSidenavModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

 
} 
