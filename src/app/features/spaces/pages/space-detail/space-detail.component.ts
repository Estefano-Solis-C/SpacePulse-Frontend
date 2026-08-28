import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { GetSpaceByIdUseCase } from '../../application/use-cases/get-space-by-id.usecase';
import { AcceptSpaceUseCase } from '../../application/use-cases/accept-space.usecase';
import { CancelSpaceUseCase } from '../../application/use-cases/cancel-space.usecase';
import { CompleteSpaceUseCase } from '../../application/use-cases/complete-space.usecase';
import { DeleteSpaceUseCase } from '../../application/use-cases/delete-space.usecase';
import { SpaceModel } from '../../models/space.model';
import { AuthService } from '../../../iam/services/auth.service';
import { ToastService } from '../../../../shared/infrastructure/notification/toast.service';
import { IoTService } from '../../../iot/services/iot.service';
import { IoTDeviceModel } from '../../../iot/models/iot-device.model';

@Component({
  selector: 'app-space-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <div class="container">
      @if (isLoading()) {
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading property details...</p>
        </div>
      } @else if (space()) {
        <div class="page-header">
          <div class="header-titles">
            <button mat-button routerLink="/spaces" class="back-btn">
              <mat-icon>arrow_back</mat-icon>
              {{ 'COMMON.BACK' | translate }}
            </button>
            <h1>{{ space()?.title }}</h1>
            <p>{{ space()?.location?.address }}, {{ space()?.location?.city }}, {{ space()?.location?.country }}</p>
          </div>

          <div class="header-actions">
            @if (authService.userRole() === 'Remodeler' && space()?.status === 'Published') {
              <button mat-flat-button color="primary" (click)="onAcceptProject()">
                <mat-icon>check_circle</mat-icon>
                {{ 'SPACES.ACCEPT' | translate }}
              </button>
            }

            @if (authService.userRole() === 'Homeowner') {
              @if (space()?.status === 'Accepted') {
                <button mat-flat-button color="accent" (click)="onCompleteProject()">
                  <mat-icon>verified</mat-icon>
                  {{ 'SPACES.COMPLETE' | translate }}
                </button>
              }
              @if (space()?.status === 'Published') {
                <button mat-stroked-button color="warn" (click)="onCancelProject()">
                  <mat-icon>cancel</mat-icon>
                  {{ 'SPACES.CANCEL' | translate }}
                </button>
              }
              <button mat-icon-button color="warn" (click)="onDeleteSpace()">
                <mat-icon>delete</mat-icon>
              </button>
            }
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-main">
            <div class="gallery-container">
              <img [src]="activeImage()" alt="Active Image" class="hero-image" />
              <div class="thumbnail-strip">
                @for (img of space()?.images; track img) {
                  <img [src]="img" (click)="activeImage.set(img)" [class.selected]="activeImage() === img" alt="Thumb" class="thumb" />
                }
              </div>
            </div>

            <mat-card class="info-card">
              <mat-card-header>
                <mat-card-title>Overview</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="description-text">{{ space()?.description }}</p>

                <div class="details-spec-grid">
                  <div class="spec-box">
                    <span class="spec-lbl">Property Type</span>
                    <span class="spec-val">{{ space()?.type }}</span>
                  </div>
                  <div class="spec-box">
                    <span class="spec-lbl">Current Status</span>
                    <span class="spec-val badge" [ngClass]="getStatusClass(space()?.status || '')">{{ space()?.status }}</span>
                  </div>
                  <div class="spec-box">
                    <span class="spec-lbl">Price / Month</span>
                    <span class="spec-val text-primary">&#36;{{ space()?.pricePerMonth }}</span>
                  </div>
                  <div class="spec-box">
                    <span class="spec-lbl">Total Estimated Cost</span>
                    <span class="spec-val">&#36;{{ space()?.totalPricing }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="info-card">
              <mat-card-header class="d-flex justify-content-between">
                <mat-card-title>
                  <mat-icon color="primary">sensors</mat-icon>
                  Linked IoT Devices ({{ linkedDevices().length }})
                </mat-card-title>
                <button mat-button color="primary" [routerLink]="['/iot']">Manage Sensors</button>
              </mat-card-header>
              <mat-card-content>
                <div class="devices-row">
                  @for (dev of linkedDevices(); track dev.id) {
                    <div class="dev-tag">
                      <span class="pulse-dot" [ngClass]="dev.isOn ? 'active' : 'inactive'"></span>
                      <strong>{{ dev.name }}</strong>
                      <span class="dev-type">({{ dev.type }})</span>
                    </div>
                  } @empty {
                    <p class="text-muted">No IoT sensors registered for this space yet.</p>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="detail-sidebar">
            <mat-card class="info-card">
              <mat-card-header>
                <mat-card-title>Location & Map</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="location-box">
                  <mat-icon color="primary">pin_drop</mat-icon>
                  <div>
                    <strong>{{ space()?.location?.address }}</strong>
                    <p>{{ space()?.location?.city }}, {{ space()?.location?.country }}</p>
                    <small class="geo-coords">Lat: {{ space()?.location?.latitude }} | Lng: {{ space()?.location?.longitude }}</small>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card class="info-card">
              <mat-card-header>
                <mat-card-title>Quick Shortcuts</mat-card-title>
              </mat-card-header>
              <mat-card-content class="shortcuts-list">
                <button mat-stroked-button class="w-100" [routerLink]="['/tasks']" [queryParams]="{spaceId: space()?.id}">
                  <mat-icon>assignment</mat-icon>
                  View Space Work Items
                </button>
                <button mat-stroked-button class="w-100" [routerLink]="['/iot']" [queryParams]="{spaceId: space()?.id}">
                  <mat-icon>sensors</mat-icon>
                  View Space Live Telemetry
                </button>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .back-btn {
      margin-bottom: 8px;
      color: #64748b;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
    .gallery-container {
      margin-bottom: 24px;
    }
    .hero-image {
      width: 100%;
      height: 380px;
      border-radius: 16px;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .thumbnail-strip {
      display: flex;
      gap: 12px;
      margin-top: 12px;
      .thumb {
        width: 80px;
        height: 60px;
        border-radius: 8px;
        object-fit: cover;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s, transform 0.2s;
        &.selected, &:hover {
          opacity: 1;
          transform: scale(1.05);
          outline: 2px solid #2563eb;
        }
      }
    }
    .info-card {
      border-radius: 16px;
      padding: 20px;
      background: white;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .description-text {
      color: #334155;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .details-spec-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .spec-box {
      background: #f8fafc;
      padding: 14px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      .spec-lbl {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 600;
        text-transform: uppercase;
      }
      .spec-val {
        font-size: 1.1rem;
        font-weight: 700;
        color: #0f172a;
      }
      .text-primary {
        color: #2563eb;
      }
    }
    .devices-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .dev-tag {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: #f1f5f9;
      border-radius: 8px;
      font-size: 0.85rem;
      .dev-type {
        color: #64748b;
        font-size: 0.75rem;
      }
    }
    .location-box {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      p {
        margin: 2px 0 6px 0;
        color: #64748b;
      }
      .geo-coords {
        color: #94a3b8;
        font-family: 'JetBrains Mono', monospace;
      }
    }
    .shortcuts-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      button {
        justify-content: flex-start;
      }
    }
    .w-100 {
      width: 100%;
    }
    .loading-state {
      text-align: center;
      padding: 60px;
    }
  `]
})
export class SpaceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);
  private getSpaceByIdUseCase = inject(GetSpaceByIdUseCase);
  private acceptSpaceUseCase = inject(AcceptSpaceUseCase);
  private cancelSpaceUseCase = inject(CancelSpaceUseCase);
  private completeSpaceUseCase = inject(CompleteSpaceUseCase);
  private deleteSpaceUseCase = inject(DeleteSpaceUseCase);
  private iotService = inject(IoTService);
  private toast = inject(ToastService);

  space = signal<SpaceModel | null>(null);
  linkedDevices = signal<IoTDeviceModel[]>([]);
  activeImage = signal<string>('');
  isLoading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSpace(id);
    }
  }

  loadSpace(id: string): void {
    this.isLoading.set(true);
    this.getSpaceByIdUseCase.execute(id).subscribe({
      next: (data) => {
        this.space.set(data);
        this.activeImage.set(data.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800');
        this.isLoading.set(false);

        // Load space IoT devices using getBySpaceId
        this.iotService.getBySpaceId(Number(id)).subscribe({
          next: (devices: IoTDeviceModel[]) => this.linkedDevices.set(devices),
          error: () => {}
        });
      },
      error: () => {
        this.toast.error('Property not found.');
        this.router.navigate(['/spaces']);
      }
    });
  }

  onAcceptProject() {
    const current = this.space();
    if (!current) return;
    this.acceptSpaceUseCase.execute(current.id).subscribe({
      next: (updated) => {
        this.space.set(updated);
        this.toast.success('Project accepted successfully!');
      },
      error: (err) => this.toast.error(err.error?.error || 'Failed to accept project.')
    });
  }

  onCompleteProject() {
    const current = this.space();
    if (!current) return;
    this.completeSpaceUseCase.execute(current.id).subscribe({
      next: (updated) => {
        this.space.set(updated);
        this.toast.success('Project marked as completed!');
      },
      error: (err) => this.toast.error(err.error?.error || 'Failed to complete project.')
    });
  }

  onCancelProject() {
    const current = this.space();
    if (!current) return;
    this.cancelSpaceUseCase.execute(current.id).subscribe({
      next: (updated) => {
        this.space.set(updated);
        this.toast.info('Project cancelled.');
      },
      error: (err) => this.toast.error(err.error?.error || 'Failed to cancel project.')
    });
  }

  onDeleteSpace() {
    const current = this.space();
    if (!current) return;
    if (confirm('Are you sure you want to delete this space?')) {
      this.deleteSpaceUseCase.execute(current.id).subscribe({
        next: () => {
          this.toast.success('Space deleted.');
          this.router.navigate(['/spaces']);
        },
        error: (err) => this.toast.error(err.error?.error || 'Failed to delete space.')
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Published': return 'badge-success';
      case 'Accepted': return 'badge-info';
      case 'Completed': return 'badge-purple';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-gray';
    }
  }
}
