import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryReadingModel } from '../../models/telemetry.model';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslateModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <h1>
            <mat-icon>insights</mat-icon>
            Space Telemetry Tracking
          </h1>
          <p>Real-time continuous telemetry stream with simulated edge sensors</p>
        </div>
      </div>

      <div class="card-grid">
        @for (item of readings(); track item.id) {
          <mat-card class="tracking-card">
            <mat-card-header>
              <mat-card-title>{{ item.name }}</mat-card-title>
              <mat-card-subtitle>{{ item.type }} • SN: {{ item.serialNumber }}</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="gauge-box">
                <div class="gauge-val">{{ item.value | number:'1.2-2' }}</div>
                <div class="gauge-unit">{{ item.unit }}</div>
              </div>

              <div class="time-stamp">
                <mat-icon>schedule</mat-icon>
                <span>{{ item.timestamp | date:'mediumTime' }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        } @empty {
          <p class="text-center w-100 text-muted">Awaiting telemetry telemetry packets...</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .tracking-card {
      border-radius: 16px;
      padding: 20px;
      background: white;
      border: 1px solid #e2e8f0;
      text-align: center;
    }
    .gauge-box {
      margin: 20px 0;
      .gauge-val {
        font-size: 2.5rem;
        font-weight: 800;
        color: #2563eb;
      }
      .gauge-unit {
        font-size: 1rem;
        color: #64748b;
      }
    }
    .time-stamp {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 0.8rem;
      color: #94a3b8;
    }
    .w-100 { width: 100%; }
    .text-center { text-align: center; }
  `]
})
export class TrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private telemetryService = inject(TelemetryService);

  readings = signal<TelemetryReadingModel[]>([]);

  ngOnInit(): void {
    const spaceId = this.route.snapshot.queryParams['spaceId'];
    if (spaceId) {
      this.telemetryService.getLiveSpaceTelemetry(Number(spaceId), 3000).subscribe({
        next: (data) => this.readings.set(data),
        error: () => {}
      });
    } else {
      this.telemetryService.getLiveUserTelemetry(3000).subscribe({
        next: (data) => this.readings.set(data),
        error: () => {}
      });
    }
  }
}
