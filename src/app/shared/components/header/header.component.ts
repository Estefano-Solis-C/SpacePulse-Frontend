import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../features/iam/services/auth.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { AppNotificationService } from '../../../features/notifications/services/app-notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    TranslateModule,
    LanguageSwitcherComponent
  ],
  template: `
    <mat-toolbar class="main-header">
      <button mat-icon-button (click)="toggleSidebar.emit()" class="menu-toggle">
        <mat-icon>menu</mat-icon>
      </button>

      <div class="brand-container" routerLink="/iam/dashboard">
        <div class="brand-logo">
          <mat-icon class="pulse-icon">sensors</mat-icon>
        </div>
        <div class="brand-text">
          <span class="brand-title">SpacePulse</span>
          <span class="brand-tag">RentalPe</span>
        </div>
      </div>

      <div class="spacer"></div>

      <div class="header-actions">
        <app-language-switcher></app-language-switcher>

        <button mat-icon-button routerLink="/notifications" class="action-btn" [matBadge]="unreadCount()" [matBadgeHidden]="unreadCount() === 0" matBadgeColor="warn">
          <mat-icon>notifications</mat-icon>
        </button>

        @if (authService.isAuthenticated()) {
          <button mat-button [matMenuTriggerFor]="userMenu" class="user-profile-btn">
            <div class="avatar-circle">
              {{ getUserInitials() }}
            </div>
            <div class="user-meta">
              <span class="user-name">{{ authService.currentUser()?.fullName || 'User' }}</span>
              <span class="user-role badge" [ngClass]="authService.userRole() === 'Homeowner' ? 'badge-success' : 'badge-purple'">
                {{ authService.userRole() }}
              </span>
            </div>
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu" class="user-dropdown">
            <button mat-menu-item routerLink="/iam/profile">
              <mat-icon>person</mat-icon>
              <span>{{ 'APP.PROFILE' | translate }}</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon color="warn">logout</mat-icon>
              <span class="logout-text">{{ 'APP.LOGOUT' | translate }}</span>
            </button>
          </mat-menu>
        } @else {
          <button mat-flat-button color="primary" routerLink="/iam/login">
            {{ 'APP.LOGIN' | translate }}
          </button>
        }
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .main-header {
      background: #ffffff;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      height: 64px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .brand-container {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      margin-left: 8px;
    }
    .brand-logo {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
    }
    .brand-tag {
      font-size: 0.7rem;
      background: #e0e7ff;
      color: #4338ca;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 6px;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-profile-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 24px;
    }
    .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.2;
    }
    .user-role {
      font-size: 0.65rem;
      padding: 1px 6px;
    }
    .logout-text {
      color: #dc2626;
      font-weight: 600;
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  authService = inject(AuthService);
  private notificationService = inject(AppNotificationService);

  unreadCount() {
    return this.notificationService.unreadCount();
  }

  getUserInitials(): string {
    const name = this.authService.currentUser()?.fullName || 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
  }
}
