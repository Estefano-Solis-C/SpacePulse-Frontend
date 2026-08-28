import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../features/iam/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatDividerModule, TranslateModule],
  template: `
    <nav class="sidebar-nav">
      <div class="nav-section">
        <span class="section-label">MAIN MENU</span>
        <mat-nav-list>
          <a mat-list-item routerLink="/iam/dashboard" routerLinkActive="active-item" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>{{ 'APP.DASHBOARD' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/spaces" routerLinkActive="active-item">
            <mat-icon matListItemIcon>apartment</mat-icon>
            <span matListItemTitle>{{ 'APP.SPACES' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/iot" routerLinkActive="active-item">
            <mat-icon matListItemIcon>sensors</mat-icon>
            <span matListItemTitle>{{ 'APP.IOT' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/tasks" routerLinkActive="active-item">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>{{ 'APP.TASKS' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/notifications" routerLinkActive="active-item">
            <mat-icon matListItemIcon>notifications</mat-icon>
            <span matListItemTitle>{{ 'APP.NOTIFICATIONS' | translate }}</span>
          </a>
        </mat-nav-list>
      </div>

      <mat-divider></mat-divider>

      <div class="nav-section">
        <span class="section-label">ACCOUNT</span>
        <mat-nav-list>
          <a mat-list-item routerLink="/iam/profile" routerLinkActive="active-item">
            <mat-icon matListItemIcon>account_circle</mat-icon>
            <span matListItemTitle>{{ 'APP.PROFILE' | translate }}</span>
          </a>
        </mat-nav-list>
      </div>

      <div class="sidebar-footer">
        <div class="iot-status-indicator">
          <span class="pulse-dot active"></span>
          <span class="status-label">IoT Gateway Online</span>
        </div>
        <div class="version-label">SpacePulse v1.0.0 (Clean Arch)</div>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar-nav {
      width: 250px;
      height: 100%;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      padding: 16px 0;
    }
    .nav-section {
      padding: 8px 12px;
      flex: 1 1 auto;
    }
    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.08em;
      padding: 0 12px;
      display: block;
      margin-bottom: 6px;
    }
    mat-nav-list a {
      border-radius: 10px;
      margin-bottom: 4px;
      color: #475569;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    mat-nav-list a:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
    mat-nav-list a.active-item {
      background: #eff6ff;
      color: #2563eb;
      font-weight: 700;
    }
    mat-nav-list a.active-item mat-icon {
      color: #2563eb;
    }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid #f1f5f9;
      background: #fafafa;
    }
    .iot-status-indicator {
      display: flex;
      align-items: center;
      font-size: 0.8rem;
      font-weight: 600;
      color: #16a34a;
      margin-bottom: 4px;
    }
    .version-label {
      font-size: 0.7rem;
      color: #94a3b8;
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);
}
