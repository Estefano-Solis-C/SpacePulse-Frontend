import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { GetSpacesUseCase } from '../../../spaces/application/use-cases/get-spaces.usecase';
import { SpaceModel } from '../../../spaces/models/space.model';
import { IoTService } from '../../../iot/services/iot.service';
import { IoTDeviceModel } from '../../../iot/models/iot-device.model';
import { TaskService } from '../../../tasks/services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TranslateModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <h1>
            <mat-icon>dashboard</mat-icon>
            {{ 'APP.DASHBOARD' | translate }}
          </h1>
          <p>{{ 'APP.WELCOME_BACK' | translate }}, <strong>{{ authService.currentUser()?.fullName }}</strong> ({{ authService.userRole() }})</p>
        </div>
        <div class="header-actions">
          @if (authService.userRole() === 'Homeowner') {
            <button mat-flat-button color="primary" routerLink="/spaces/new">
              <mat-icon>add</mat-icon>
              {{ 'SPACES.CREATE_SPACE' | translate }}
            </button>
          }
          <button mat-stroked-button routerLink="/iot">
            <mat-icon>sensors</mat-icon>
            {{ 'APP.IOT' | translate }}
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>apartment</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ spacesCount() }}</div>
            <div class="stat-label">Total Properties</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <mat-icon>sensors</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ devicesCount() }}</div>
            <div class="stat-label">Connected IoT Sensors</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon amber">
            <mat-icon>engineering</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ tasksCount() }}</div>
            <div class="stat-label">Active Work Items</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <mat-icon>security</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">100%</div>
            <div class="stat-label">System Health</div>
          </div>
        </div>
      </div>

      <div class="dashboard-content-grid">
        <mat-card class="section-card">
          <mat-card-header>
            <div class="section-header">
              <div class="section-title">
                <mat-icon color="primary">domain</mat-icon>
                <span>Recent Properties</span>
              </div>
              <button mat-button color="primary" routerLink="/spaces">View All</button>
            </div>
          </mat-card-header>
          <mat-card-content>
            <div class="recent-list">
              @for (space of recentSpaces(); track space.id) {
                <div class="recent-item" [routerLink]="['/spaces', space.id]">
                  <img [src]="space.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300'" alt="Space" class="item-thumb" />
                  <div class="item-info">
                    <h4>{{ space.title }}</h4>
                    <p>{{ space.location.city }}, {{ space.location.country }} • \&#36;{{ space.pricePerMonth }}/mo</p>
                  </div>
                  <span class="badge" [ngClass]="space.status === 'Published' || space.status === 'Available' ? 'badge-success' : 'badge-info'">
                    {{ space.status }}
                  </span>
                </div>
              } @empty {
                <p class="empty-text">No properties found.</p>
              }
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="section-card">
          <mat-card-header>
            <div class="section-header">
              <div class="section-title">
                <mat-icon color="accent">sensors</mat-icon>
                <span>Real-Time IoT Telemetry</span>
              </div>
              <button mat-button color="accent" routerLink="/iot">IoT Central</button>
            </div>
          </mat-card-header>
          <mat-card-content>
            <div class="devices-quick-list">
              @for (dev of recentDevices(); track dev.id) {
                <div class="device-mini-card">
                  <div class="dev-header">
                    <span class="pulse-dot" [ngClass]="dev.isOn ? 'active' : 'inactive'"></span>
                    <span class="dev-name">{{ dev.name }}</span>
                  </div>
                  <div class="dev-body">
                    <span class="metric-val">{{ dev.type }}</span>
                    <span class="serial">{{ dev.serialNumber }}</span>
                  </div>
                </div>
              } @empty {
                <p class="empty-text">No devices provisioned yet.</p>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    }
    .dashboard-content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 992px) {
      .dashboard-content-grid {
        grid-template-columns: 1fr;
      }
    }
    .section-card {
      border-radius: 16px;
      padding: 20px;
      background: white;
      border: 1px solid #e2e8f0;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 12px;
      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-weight: 700;
        color: #0f172a;
      }
    }
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .recent-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      border-radius: 12px;
      background: #f8fafc;
      cursor: pointer;
      transition: background 0.2s;
      &:hover {
        background: #eff6ff;
      }
      .item-thumb {
        width: 56px;
        height: 56px;
        border-radius: 8px;
        object-fit: cover;
      }
      .item-info {
        flex: 1;
        h4 {
          margin: 0 0 4px 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }
        p {
          margin: 0;
          font-size: 0.8rem;
          color: #64748b;
        }
      }
    }
    .devices-quick-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
    .device-mini-card {
      background: #f8fafc;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      .dev-header {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        .dev-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #0f172a;
        }
      }
      .dev-body {
        display: flex;
        flex-direction: column;
        .metric-val {
          font-size: 0.85rem;
          color: #2563eb;
          font-weight: 600;
        }
        .serial {
          font-size: 0.75rem;
          color: #94a3b8;
          font-family: 'JetBrains Mono', monospace;
        }
      }
    }
    .empty-text {
      color: #94a3b8;
      text-align: center;
      padding: 24px;
      font-style: italic;
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private spacesUseCase = inject(GetSpacesUseCase);
  private iotService = inject(IoTService);
  private taskService = inject(TaskService);

  spacesCount = signal(0);
  devicesCount = signal(0);
  tasksCount = signal(0);
  recentSpaces = signal<SpaceModel[]>([]);
  recentDevices = signal<IoTDeviceModel[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.spacesUseCase.execute().subscribe({
      next: (spaces) => {
        this.spacesCount.set(spaces.length);
        this.recentSpaces.set(spaces.slice(0, 4));
      },
      error: () => {}
    });

    this.iotService.getMyDevices().subscribe({
      next: (devices) => {
        this.devicesCount.set(devices.length);
        this.recentDevices.set(devices.slice(0, 4));
      },
      error: () => {}
    });

    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        this.tasksCount.set(tasks.length);
      },
      error: () => {}
    });
  }
}
