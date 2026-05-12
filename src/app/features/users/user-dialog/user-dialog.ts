import { Component, inject, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api-service';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STATUS_TYPES, USER_ROLE } from '../../../utils/static';

@Component({
  selector: 'app-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
})
export class UserDialog implements OnInit {

  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<UserDialog>);
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  userForm:any;

  userRoles = USER_ROLE;
  tenantList: any;
  statusTypes = STATUS_TYPES;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.apiService.getTenantNames()
      .subscribe( (response: any) => {
        const uniqueData = 
          [...new Map(response.data
              .map((item: any) => 
                  [item.companyName, item]
              )).values()
          ];
        this.tenantList = uniqueData;
        console.log('this.tenantList', this.tenantList);
      });
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      tenant: ['', Validators.required],
      status: ['', Validators.required]
    });
    if (this.data) {
      this.userForm.patchValue({
        username: this.data.userName,
        email: this.data.email,
        role: this.data.role,
        tenant: this.data.tenant,
        status: this.data.status
      });
    }
  }
  
  save(): void {
    if (this.userForm.invalid) {
      return;
    }

    if (this.data) {
      this.apiService.editUser(this.data._id, this.userForm.value)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'User updated successfully',
            'Close',
            {
              duration: 3000
            }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open(
            'Update Failed',
            'Close',
            {
              duration: 3000
            }
          );
        }
      });
    } else {
      this.apiService.addUser(this.userForm.value)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'User added successfully',
            'Close',
            {
              duration: 3000
            }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open(
            'Add user failed',
            'Close',
            {
              duration: 3000
            }
          );
        }
      });
    }
  }
}
