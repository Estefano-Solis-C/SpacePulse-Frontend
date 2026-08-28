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
      <div class="header-left">
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
      </div>

      <div class="header-right">
        <app-language-switcher></app-language-switcher>

        <button mat-icon-button routerLink="/notifications" class="action-icon-btn" [matBadge]="unreadCount()" [matBadgeHidden]="unreadCount() === 0" matBadgeColor="warn" matBadgeSize="small">
          <mat-icon>notifications_none</mat-icon>
        </button>

        @if (authService.isAuthenticated()) {
          <button mat-button [matMenuTriggerFor]="userMenu" class="user-profile-pill">
            <div class="profile-content">
              <div class="avatar-circle">
                {{ getUserInitials() }}
              </div>
              <div class="user-meta">
                <span class="user-name">{{ authService.currentUser()?.fullName || 'User' }}</span>
                <span class="user-role-badge" [class.badge-homeowner]="authService.userRole() === 'Homeowner'" [class.badge-remodeler]="authService.userRole() === 'Remodeler'">
                  {{ authService.userRole() }}
                </span>
              </div>
              <mat-icon class="dropdown-chevron">expand_more</mat-icon>
            </div>
          </button>
          <mat-menu #userMenu="matMenu" class="user-dropdown">
            <div class="user-menu-header">
              <span class="menu-name">{{ authService.currentUser()?.fullName }}</span>
              <span class="menu-email">{{ authService.currentUser()?.email }}</span>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/iam/profile">
              <mat-icon>person_outline</mat-icon>
              <span>{{ 'APP.PROFILE' | translate }}</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()" class="logout-menu-item">
              <mat-icon color="warn">logout</mat-icon>
              <span class="logout-text">{{ 'APP.LOGOUT' | translate }}</span>
            </button>
          </mat-menu>
        } @else {
          <button mat-flat-button color="primary" routerLink="/iam/login" class="login-btn">
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
      height: 68px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .menu-toggle {
      color: #475569;
    }
    .brand-container {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
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
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
    }
    .pulse-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    .brand-text {
      display: flex;
      align-items: baseline;
      gap: 6px;
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
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .action-icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      color: #475569;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
        border-color: #cbd5e1;
      }
    }
    .user-profile-pill {
      height: 44px;
      padding: 0 10px 0 4px !important;
      border-radius: 24px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;

      &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }

      ::ng-deep .mdc-button__label {
        display: flex;
        align-items: center;
      }
    }
    .profile-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .avatar-circle {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      font-weight: 700;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }
    .user-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      text-align: left;
      line-height: 1.15;
    }
    .user-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: #0f172a;
      max-width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role-badge {
      font-size: 0.62rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      padding: 1px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-top: 2px;

      &.badge-homeowner {
        background: #dcfce7;
        color: #15803d;
      }
      &.badge-remodeler {
        background: #f3e8ff;
        color: #7e22ce;
      }
    }
    .dropdown-chevron {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -2px;
    }
    .user-menu-header {
      padding: 12px 16px 8px 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      .menu-name {
        font-weight: 700;
        font-size: 0.9rem;
        color: #0f172a;
      }
      .menu-email {
        font-size: 0.75rem;
        color: #64748b;
      }
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
