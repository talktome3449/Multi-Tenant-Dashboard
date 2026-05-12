import { Component, Inject, inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api-service';
import { COUNTRY_LIST, INDUSTRY, STATUS_TYPES, TENANT_PLAN } from '../../../utils/static';
import { toTitleCase } from '../../../utils/util';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tenant-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './tenant-dialog.html',
  styleUrl: './tenant-dialog.scss',
})
export class TenantDialog implements OnInit {

  private snackBar = inject(MatSnackBar);
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  private dialogRef = inject(MatDialogRef<TenantDialog>);

  statusTypes = STATUS_TYPES;
  industryList = INDUSTRY;
  planList = TENANT_PLAN;
  countryList= COUNTRY_LIST;

  tenantForm: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit () {
    this.tenantForm = this.fb.group({
    companyName: ['', [Validators.required, Validators.minLength(3)]],
    industry: ['', Validators.required],
    adminName: ['', Validators.required],
    adminEmail: ['', [Validators.required, Validators.email]],
    plan: ['', Validators.required],
    status: ['', Validators.required],
    totalUsers: ['', [Validators.required, Validators.min(1)]],
    activeUsers: ['', Validators.required],
    monthlyRevenue: ['', Validators.required],
    country: ['', Validators.required]
  });
  }

  saveTenant(): void {

    if (this.tenantForm.invalid) {
      return;
    }

    const rawValue = this.tenantForm.value;
    const payload = {
      ...rawValue,
      companyName: toTitleCase(rawValue.companyName),
      adminName: toTitleCase(rawValue.adminName)
    }

    this.apiService.addTenant(payload)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Tenant Created Successfully',
            'Close',
            {
              duration: 3000
            }
          );
          this.dialogRef.close(true);  
        },
        error: () => {
          this.snackBar.open(
            'Tenant Creation Failed',
            'Close',
            {
              duration: 3000
            }
          );
        }
      });
  }

}
