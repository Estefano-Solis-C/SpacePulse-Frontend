import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { AppNotificationService } from '../../services/app-notification.service';
import { ToastService } from '../../../../shared/infrastructure/notification/toast.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule, MatDividerModule, TranslateModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <h1>
            <mat-icon>notifications</mat-icon>
            {{ 'NOTIFICATIONS.TITLE' | translate }}
          </h1>
          <p>System alerts, IoT telemetry anomalies, and project milestone updates</p>
        </div>

        <div class="header-actions">
          <button mat-stroked-button (click)="refresh()">
            <mat-icon>refresh</mat-icon>
            {{ 'COMMON.REFRESH' | translate }}
          </button>
        </div>
      </div>

      <div class="notifications-container">
        @for (n of notificationService.notifications(); track n.id) {
          <mat-card class="notification-card" [class.unread]="!n.isRead">
            <div class="notif-icon-col">
              <div class="icon-circle" [class.alert-circle]="n.title.includes('Alerta') || n.title.includes('Alert')">
                <mat-icon>{{ n.title.includes('Alerta') || n.title.includes('Alert') ? 'warning' : 'info' }}</mat-icon>
              </div>
            </div>

            <div class="notif-content-col">
              <div class="notif-head">
                <h3 class="notif-title">{{ n.title }}</h3>
                <span class="notif-time">{{ n.createdAt | date:'medium' }}</span>
              </div>
              <p class="notif-msg">{{ n.message }}</p>

              @if (!n.isRead) {
                <div class="notif-actions">
                  <button mat-button color="primary" (click)="markAsRead(n.id)">
                    <mat-icon>done</mat-icon>
                    Mark as Read
                  </button>
                </div>
              }
            </div>
          </mat-card>
        } @empty {
          <div class="empty-state">
            <mat-icon>notifications_off</mat-icon>
            <h3>{{ 'NOTIFICATIONS.NO_NOTIFICATIONS' | translate }}</h3>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 900px;
    }
    .notification-card {
      border-radius: 14px;
      padding: 20px;
      background: white;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: row;
      gap: 20px;
      align-items: flex-start;

      &.unread {
        border-left: 5px solid #2563eb;
        background: #f8fafc;
      }
    }
    .icon-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;

      &.alert-circle {
        background: #fee2e2;
        color: #dc2626;
      }
    }
    .notif-content-col {
      flex: 1;
    }
    .notif-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .notif-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .notif-time {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .notif-msg {
      font-size: 0.9rem;
      color: #475569;
      line-height: 1.5;
      margin: 0 0 10px 0;
    }
    .notif-actions {
      display: flex;
      justify-content: flex-end;
    }
    .empty-state {
      text-align: center;
      padding: 60px;
      color: #94a3b8;
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    }
  `]
})
export class NotificationListComponent implements OnInit {
  notificationService = inject(AppNotificationService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.notificationService.getUserNotifications().subscribe({
      error: () => {}
    });
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => this.toast.info('Notification marked as read.'),
      error: () => this.toast.error('Failed to mark as read.')
    });
  }
}
