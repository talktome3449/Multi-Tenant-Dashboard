import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { UserDialog } from './user-dialog/user-dialog';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { ApiService } from '../../core/services/api-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    FormsModule,
    MatSortModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {

  destroyRef = inject(DestroyRef);
  isLoading = signal(false);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  @ViewChild(MatSort) sort!: MatSort;

  private apiService = inject(ApiService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'username',
    'email',
    'role',
    'tenant',
    'status',
    'action'
  ];
  dataSource = new MatTableDataSource([]);

  ngOnInit() {
    this.getUsers();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      case 'trial':
        return 'trial';
      default:
        return 'status-default';
    }
  }

  getUsers(): void {
    this.isLoading.set(true);
    /* this.apiService.getUsers()
      .subscribe( (response: any) => {
        console.log(response);
        this.dataSource.data = response.data;
        this.isLoading.set(false);
      }); */

    this.apiService.getUsers()
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError((error) => {
        console.error('API Error:', error);
        this.dataSource.data = [];
        return of({
          data: []
        });
      }),
      finalize(() => {
        this.isLoading.set(false);
      })
    )
    .subscribe((response: any) => {
      this.dataSource.data = response.data || [];
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSortChange(column: string) {
  this.dataSource.sort?.sort({
    id: column, 
    start: 'asc', 
    disableClear: false 
  });
}

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialog, {
      width: '500px'
    });
    dialogRef.afterClosed()
      .subscribe( (result: any) => {
        if (result) {
          this.getUsers();
        }
      }); 

  }

  editUser(row: any): void {
    const dialogRef = this.dialog.open(UserDialog, {
      width: '500px',
      data: row
    });
    dialogRef.afterClosed()
      .subscribe( (res: any) => {
        if (res) {
          this.getUsers();
        }
      });
  }

  deleteUser(row: any): void {
    const confirmDelete = confirm( `Do you want to delete ${row.userName}?`);
    if (!confirmDelete) {
      return;
    }

    this.apiService.deleteUser(row._id)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'User deleted successfully',
            'Close',
            {
              duration: 3000
            }
          );
          this.getUsers();
        },
        error: () => {
          this.snackBar.open(
            'Delete failed',
            'Close',
            {
              duration: 3000
            }
          );
        }
      });
  }
}
