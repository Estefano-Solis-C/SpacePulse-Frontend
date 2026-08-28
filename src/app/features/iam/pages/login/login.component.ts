import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../shared/infrastructure/notification/toast.service';
import { LanguageSwitcherComponent } from '../../../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-login',
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
            <mat-card-title>{{ 'AUTH.LOGIN_TITLE' | translate }}</mat-card-title>
            <mat-card-subtitle>{{ 'AUTH.LOGIN_SUBTITLE' | translate }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'AUTH.EMAIL' | translate }}</mat-label>
                <input matInput type="email" formControlName="email" placeholder="owner@spacepulse.com" />
                <mat-icon matSuffix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'AUTH.PASSWORD' | translate }}</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" />
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </mat-form-field>

              <div class="demo-logins">
                <span class="demo-label">Quick Demo Credentials:</span>
                <div class="demo-buttons">
                  <button type="button" mat-stroked-button (click)="fillDemo('owner@spacepulse.com', 'Password123!')">
                    Homeowner
                  </button>
                  <button type="button" mat-stroked-button (click)="fillDemo('builder@spacepulse.com', 'Password123!')">
                    Remodeler
                  </button>
                </div>
              </div>

              <button mat-flat-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading" class="submit-btn">
                @if (isLoading) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  <span>{{ 'AUTH.SUBMIT_LOGIN' | translate }}</span>
                }
              </button>
            </form>
          </mat-card-content>

          <mat-card-footer class="auth-footer">
            <p>
              {{ 'AUTH.NO_ACCOUNT' | translate }}
              <a routerLink="/iam/register">{{ 'AUTH.SIGN_UP' | translate }}</a>
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
      max-width: 460px;
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
    mat-card-title {
      font-size: 1.5rem !important;
      font-weight: 800;
      color: #0f172a;
    }
    mat-card-subtitle {
      color: #64748b;
      margin-top: 4px;
      font-size: 0.9rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }
    .submit-btn {
      height: 48px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      margin-top: 8px;
    }
    .demo-logins {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      padding: 12px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      .demo-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
      }
      .demo-buttons {
        display: flex;
        gap: 8px;
      }
    }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      color: #64748b;
      a {
        color: #2563eb;
        font-weight: 700;
        margin-left: 4px;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  hidePassword = true;
  isLoading = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  fillDemo(email: string, pass: string) {
    this.loginForm.patchValue({ email, password: pass });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (session) => {
        this.isLoading = false;
        this.toast.success(`Welcome back, ${session.user.fullName}!`);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/iam/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.error?.message || 'Invalid credentials.');
      }
    });
  }
}
