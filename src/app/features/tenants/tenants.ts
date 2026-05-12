import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TenantDialog } from './tenant-dialog/tenant-dialog';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api-service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-tenants',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tenants.html',
  styleUrl: './tenants.css',
})
export class Tenants {

  private dialog = inject(MatDialog);
  private apiService = inject(ApiService);

  tenants$: Observable<any[]>;
  private refreshTenants$ = new BehaviorSubject<void>(undefined);

  constructor() {
    /* this.tenants$ = this.apiService.getTenants().pipe(
      map((response: any) => response.data)
    ); */
    this.tenants$ = this.refreshTenants$.pipe(
      switchMap(() => this.apiService.getTenants()),
      map((response: any) => response.data)
    );
  }

  openTenantDialog(): void {
    const dialogRef = this.dialog.open(TenantDialog, {
      width: '500px'
    });
    dialogRef.afterClosed()
      .subscribe( (result: any) => {
        if (result) {
          this.refreshTenants$.next();
        }
      });
  }

}
