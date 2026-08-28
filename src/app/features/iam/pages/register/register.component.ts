import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../shared/infrastructure/notification/toast.service';
import { LanguageSwitcherComponent } from '../../../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TranslateModule,
    LanguageSwitcherComponent
  ],
  template: `
    <div class="auth-page">
      <div class="auth-card-container">
        <div class="auth-top-bar">
          <div class="brand">
            <mat-icon class="pulse-icon">sensors</mat-icon>
            <span>SpacePulse</span>
          </div>
          <app-language-switcher></app-language-switcher>
        </div>

        <mat-card class="auth-card">
          <mat-card-header>
            <mat-card-title>{{ 'APP.REGISTER' | translate }}</mat-card-title>
            <mat-card-subtitle>{{ 'AUTH.LOGIN_SUBTITLE' | translate }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'AUTH.FULL_NAME' | translate }}</mat-label>
                <input matInput formControlName="fullName" autocomplete="name" placeholder="Carlos Perez" />
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'AUTH.EMAIL' | translate }}</mat-label>
                <input matInput type="email" formControlName="email" autocomplete="username" placeholder="carlos@example.com" />
                <mat-icon matSuffix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'AUTH.PASSWORD' | translate }}</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" autocomplete="new-password" />
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'AUTH.PHONE' | translate }}</mat-label>
                <input matInput formControlName="phone" autocomplete="tel" placeholder="+51 999 888 777" />
                <mat-icon matSuffix>phone</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'AUTH.ROLE' | translate }}</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="Homeowner">{{ 'AUTH.HOMEOWNER' | translate }}</mat-option>
                  <mat-option value="Remodeler">{{ 'AUTH.REMODELER' | translate }}</mat-option>
                </mat-select>
                <mat-icon matSuffix>badge</mat-icon>
              </mat-form-field>

              <button mat-flat-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading" class="submit-btn">
                @if (isLoading) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  <span>{{ 'AUTH.SUBMIT_REGISTER' | translate }}</span>
                }
              </button>
            </form>
          </mat-card-content>

          <mat-card-footer class="auth-footer">
            <p>
              {{ 'AUTH.HAVE_ACCOUNT' | translate }}
              <a routerLink="/iam/login">{{ 'AUTH.SIGN_IN' | translate }}</a>
            </p>
          </mat-card-footer>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      padding: 24px;
    }
    .auth-card-container {
      width: 100%;
      max-width: 480px;
    }
    .auth-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      color: white;
      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.4rem;
        font-weight: 800;
      }
    }
    .auth-card {
      border-radius: 20px;
      padding: 32px;
      background: #ffffff;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 20px;
    }
    .submit-btn {
      height: 48px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      margin-top: 8px;
    }
    .auth-footer {
      text-align: center;
      margin-top: 20px;
      color: #64748b;
      a {
        color: #2563eb;
        font-weight: 700;
        margin-left: 4px;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  hidePassword = true;
  isLoading = false;

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required]],
    role: ['Homeowner', [Validators.required]],
    photo: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150']
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Registration successful! Please log in.');
        this.router.navigate(['/iam/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Registration failed.');
      }
    });
  }
}
