import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { IoTService } from '../../services/iot.service';
import { TelemetryService } from '../../services/telemetry.service';
import { TelemetryReadingModel } from '../../models/telemetry.model';
import { GetSpacesUseCase } from '../../../spaces/application/use-cases/get-spaces.usecase';
import { SpaceModel } from '../../../spaces/models/space.model';
import { ToastService } from '../../../../shared/infrastructure/notification/toast.service';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <h1>
            <mat-icon>sensors</mat-icon>
            {{ 'IOT.DEVICE_MANAGEMENT' | translate }}
          </h1>
          <p>Real-time edge telemetry, safety thresholds and remote actuators</p>
        </div>

        <div class="header-actions">
          <button mat-flat-button color="primary" (click)="showCreateModal = !showCreateModal">
            <mat-icon>{{ showCreateModal ? 'close' : 'add' }}</mat-icon>
            {{ showCreateModal ? 'Cancel' : ('IOT.REGISTER_DEVICE' | translate) }}
          </button>
        </div>
      </div>

      <!-- Device Provisioning Form Box -->
      @if (showCreateModal) {
        <mat-card class="form-card mb-4">
          <mat-card-header>
            <mat-card-title>{{ 'IOT.REGISTER_DEVICE' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="deviceForm" (ngSubmit)="onCreateDevice()" class="dev-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Target Property / Space</mat-label>
                  <mat-select formControlName="spaceId">
                    @for (s of spaces(); track s.id) {
                      <mat-option [value]="s.id">{{ s.title }} ({{ s.location.city }})</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'IOT.DEVICE_NAME' | translate }}</mat-label>
                  <input matInput formControlName="name" placeholder="Living Room AC Unit" />
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'IOT.METRIC_TYPE' | translate }}</mat-label>
                  <mat-select formControlName="type">
                    <mat-option value="AirConditioning">Air Conditioning / HVAC</mat-option>
                    <mat-option value="Thermostat">Thermostat Temperature</mat-option>
                    <mat-option value="Lighting">Smart Lighting</mat-option>
                    <mat-option value="SmartMeter">Smart Energy Meter</mat-option>
                    <mat-option value="HumiditySensor">Humidity Sensor</mat-option>
                    <mat-option value="SmokeDetector">Smoke / Safety Detector</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'IOT.SERIAL_NUMBER' | translate }}</mat-label>
                  <input matInput formControlName="serialNumber" placeholder="IOT-SN-99482" />
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'IOT.MIN_THRESHOLD' | translate }}</mat-label>
                  <input matInput type="number" formControlName="customMinThreshold" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'IOT.MAX_THRESHOLD' | translate }}</mat-label>
                  <input matInput type="number" formControlName="customMaxThreshold" />
                </mat-form-field>
              </div>

              <div class="form-actions">
                <button mat-flat-button color="primary" type="submit" [disabled]="deviceForm.invalid || isSubmitting">
                  <mat-icon>save</mat-icon>
                  Save Device
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      <!-- Real-Time Telemetry Cards Grid -->
      <div class="card-grid">
        @for (item of telemetryReadings(); track item.id) {
          <mat-card class="telemetry-card" [class.alert-card]="item.isInAlertState">
            <div class="card-top">
              <div class="device-badge">
                <span class="pulse-dot" [ngClass]="item.isInAlertState ? 'alert' : (item.isOn ? 'active' : 'inactive')"></span>
                <span class="type-name">{{ item.type }}</span>
              </div>
              <div class="actions">
                <mat-slide-toggle [checked]="item.isOn" (change)="onTogglePower(item.id)">
                  {{ item.isOn ? 'ON' : 'OFF' }}
                </mat-slide-toggle>
                <button mat-icon-button color="warn" (click)="onDelete(item.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <mat-card-content class="telemetry-body">
              <h3 class="dev-title">{{ item.name }}</h3>
              <span class="serial-tag">SN: {{ item.serialNumber }}</span>

              <div class="telemetry-value-box">
                <div class="value-display">
                  <span class="main-val">{{ item.value | number:'1.1-2' }}</span>
                  <span class="unit-val">{{ item.unit }}</span>
                </div>
                <div class="metric-tag">{{ item.metricName }}</div>
              </div>

              @if (item.isInAlertState) {
                <div class="alert-banner">
                  <mat-icon>warning</mat-icon>
                  <span>Critical threshold anomaly detected!</span>
                </div>
              }

              <div class="thresholds-row">
                <span>Safe Range: <strong>{{ item.minThreshold }} - {{ item.maxThreshold }} {{ item.unit }}</strong></span>
              </div>
            </mat-card-content>
          </mat-card>
        } @empty {
          <div class="empty-state">
            <mat-icon>sensors_off</mat-icon>
            <h3>No IoT devices detected</h3>
            <p>Register a new device to start streaming live telemetry data.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .mb-4 {
      margin-bottom: 24px;
    }
    .form-card {
      border-radius: 16px;
      padding: 24px;
      background: white;
      border: 1px solid #e2e8f0;
    }
    .dev-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      mat-form-field {
        flex: 1;
      }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    .telemetry-card {
      border-radius: 16px;
      padding: 20px;
      background: white;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;

      &.alert-card {
        border-color: #ef4444;
        background: #fff8f8;
        box-shadow: 0 0 15px rgba(239, 68, 68, 0.15);
      }
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      .device-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        font-weight: 700;
        color: #475569;
        text-transform: uppercase;
      }
      .actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
    .dev-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
    }
    .serial-tag {
      font-size: 0.75rem;
      color: #94a3b8;
      font-family: 'JetBrains Mono', monospace;
    }
    .telemetry-value-box {
      margin: 18px 0;
      background: #f8fafc;
      padding: 16px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .value-display {
        display: flex;
        align-items: baseline;
        gap: 4px;
        .main-val {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .unit-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748b;
        }
      }
      .metric-tag {
        font-size: 0.8rem;
        font-weight: 700;
        color: #2563eb;
        background: #eff6ff;
        padding: 4px 10px;
        border-radius: 6px;
      }
    }
    .alert-banner {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #fee2e2;
      color: #b91c1c;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 12px;
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    .thresholds-row {
      font-size: 0.8rem;
      color: #64748b;
    }
    .empty-state {
      grid-column: 1 / -1;
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
export class DeviceListComponent implements OnInit {
  private iotService = inject(IoTService);
  private telemetryService = inject(TelemetryService);
  private spacesUseCase = inject(GetSpacesUseCase);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  telemetryReadings = signal<TelemetryReadingModel[]>([]);
  spaces = signal<SpaceModel[]>([]);
  showCreateModal = false;
  isSubmitting = false;

  deviceForm: FormGroup = this.fb.group({
    spaceId: [null, Validators.required],
    name: ['', Validators.required],
    type: ['AirConditioning', Validators.required],
    serialNumber: ['IOT-' + Math.floor(10000 + Math.random() * 90000), Validators.required],
    customMinThreshold: [18, Validators.required],
    customMaxThreshold: [28, Validators.required]
  });

  ngOnInit(): void {
    this.loadData();
    this.startLiveTelemetryStream();
  }

  loadData(): void {
    this.spacesUseCase.execute().subscribe({
      next: (spaces) => {
        this.spaces.set(spaces);
        if (spaces.length > 0 && !this.deviceForm.value.spaceId) {
          this.deviceForm.patchValue({ spaceId: Number(spaces[0].id) });
        }
      }
    });
  }

  startLiveTelemetryStream(): void {
    this.telemetryService.getLiveUserTelemetry(4000).subscribe({
      next: (readings) => {
        this.telemetryReadings.set(readings);
      },
      error: () => {}
    });
  }

  onTogglePower(deviceId: number): void {
    this.iotService.togglePower(deviceId).subscribe({
      next: (res) => {
        this.toast.info(res.message);
        // Refresh reading
        this.iotService.getDeviceTelemetry(deviceId).subscribe(updated => {
          const current = this.telemetryReadings();
          const idx = current.findIndex(d => d.id === deviceId);
          if (idx !== -1) {
            current[idx] = updated;
            this.telemetryReadings.set([...current]);
          }
        });
      },
      error: (err) => this.toast.error(err.error?.error || 'Failed to toggle power.')
    });
  }

  onCreateDevice(): void {
    if (this.deviceForm.invalid) return;

    this.isSubmitting = true;
    this.iotService.createDevice(this.deviceForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toast.success('IoT Device registered successfully!');
        this.showCreateModal = false;
        this.deviceForm.reset({
          spaceId: this.spaces()[0]?.id,
          type: 'AirConditioning',
          serialNumber: 'IOT-' + Math.floor(10000 + Math.random() * 90000),
          customMinThreshold: 18,
          customMaxThreshold: 28
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.error?.error || 'Failed to register device.');
      }
    });
  }

  onDelete(deviceId: number): void {
    if (confirm('Delete this IoT device?')) {
      this.iotService.deleteDevice(deviceId).subscribe({
        next: () => {
          this.toast.success('Device deleted.');
          this.telemetryReadings.set(this.telemetryReadings().filter(d => d.id !== deviceId));
        },
        error: (err) => this.toast.error(err.error?.error || 'Failed to delete device.')
      });
    }
  }
}
