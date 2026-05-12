import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  login(): void {
    if (this.form.invalid) {
      return;
    }
    this.authService.login(this.form.value)
      .subscribe({
        next: (response: any) => {
          const data = response.data;
          this.authService.saveSession(data.accessToken, data.user);
          this.snackBar.open(
            'Login successful',
            'Close',
            {
              duration: 3000
            }
          );
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.snackBar.open(
            'Invalid Credentials',
            'Close',
            {
              duration: 3000
            }
          );
        }
      });
  }
}