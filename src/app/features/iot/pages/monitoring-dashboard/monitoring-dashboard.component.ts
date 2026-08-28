import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryReadingModel } from '../../models/telemetry.model';

@Component({
  selector: 'app-monitoring-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, TranslateModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <h1>
            <mat-icon>monitor_heart</mat-icon>
            Telemetry Central & Anomaly Detection
          </h1>
          <p>Continuous edge monitoring across all properties</p>
        </div>
      </div>

      <div class="card-grid">
        @for (r of telemetry(); track r.id) {
          <mat-card class="status-card" [class.border-alert]="r.isInAlertState">
            <mat-card-header>
              <mat-card-title>{{ r.name }}</mat-card-title>
              <mat-card-subtitle>{{ r.type }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="metric-row">
                <span class="value">{{ r.value | number:'1.1-2' }} {{ r.unit }}</span>
                <span class="badge" [ngClass]="r.isInAlertState ? 'badge-danger' : 'badge-success'">
                  {{ r.isInAlertState ? 'Anomaly Detected' : 'Normal' }}
                </span>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .status-card {
      border-radius: 16px;
      padding: 20px;
      background: white;
      border: 1px solid #e2e8f0;
      &.border-alert {
        border-color: #ef4444;
      }
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      .value {
        font-size: 1.5rem;
        font-weight: 800;
      }
    }
  `]
})
export class MonitoringDashboardComponent implements OnInit {
  private telemetryService = inject(TelemetryService);
  telemetry = signal<TelemetryReadingModel[]>([]);

  ngOnInit(): void {
    this.telemetryService.getLiveUserTelemetry(3500).subscribe({
      next: (data) => this.telemetry.set(data),
      error: () => {}
    });
  }
}
