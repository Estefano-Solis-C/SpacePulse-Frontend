import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MarsRoverService } from '../services/mars-rover.service';
import { MarsPhoto } from '../../../core/models/space-telemetry.models';

@Component({
  selector: 'app-mars-rover',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="space-container">
      <header class="telemetry-header">
        <div class="brand">
          <div class="badge-tag">SURFACE RECONNAISSANCE</div>
          <h1>SPACE<span>PULSE</span> MARS ROVER IMAGERY</h1>
          <span class="subtitle">EXPLORING RED PLANET SURFACE WITH ACTIVE SCIENTIFIC ROVERS</span>
        </div>
      </header>

      <!-- Filters Matrix -->
      <section class="filters-panel glass-card">
        <div class="filter-group">
          <span class="filter-label">SELECT ROVER:</span>
          <div class="rover-chips">
            @for (r of rovers; track r) {
              <button class="chip-btn" [class.active]="selectedRover === r" (click)="selectRover(r)">
                {{ r | uppercase }}
              </button>
            }
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-label">MARTIAN SOL:</span>
          <input type="number" [(ngModel)]="sol" (change)="onFilterChange()" min="1" max="4000" class="glass-input-sol" />
        </div>

        <div class="filter-group">
          <span class="filter-label">CAMERA FILTER:</span>
          <select [(ngModel)]="selectedCamera" (change)="onFilterChange()" class="glass-select">
            @for (c of cameras; track c) {
              <option [value]="c">{{ c }}</option>
            }
          </select>
        </div>
      </section>

      @if (state().status === 'loading') {
        <div class="radar-loader">
          <div class="pulse-ring"></div>
          <p>Transmitting martian surface imagery across deep space network...</p>
        </div>
      }

      @if (state().error) {
        <div class="glass-alert">
          <mat-icon>warning</mat-icon>
          <p>{{ state().error }}</p>
        </div>
      }

      @if (state().data; as photos) {
        @if (photos.length === 0) {
          <div class="empty-box glass-card">
            <mat-icon>no_photography</mat-icon>
            <p>No telemetry photos found for {{ selectedRover | uppercase }} on Sol {{ sol }} with camera {{ selectedCamera }}. Try Sol 1000.</p>
          </div>
        } @else {
          <div class="photos-grid">
            @for (photo of photos; track photo.id) {
              <article class="photo-card glass-card" (click)="openImageModal(photo)">
                <img [src]="photo.imgSrc" [alt]="photo.cameraFullName" loading="lazy" class="mars-img" />
                <div class="photo-overlay">
                  <div class="photo-tags">
                    <span class="cam-tag">{{ photo.cameraName }}</span>
                    <span class="sol-tag">Sol {{ photo.sol }}</span>
                  </div>
                  <div class="date-tag">{{ photo.earthDate }}</div>
                </div>
              </article>
            }
          </div>
        }
      }

      @if (activeModalPhoto()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <img [src]="activeModalPhoto()!.imgSrc" [alt]="activeModalPhoto()!.cameraFullName" class="modal-img" />
            <div class="modal-details">
              <h3>{{ activeModalPhoto()!.roverName }} — {{ activeModalPhoto()!.cameraFullName }}</h3>
              <p>Martian Sol: {{ activeModalPhoto()!.sol }} | Earth Date: {{ activeModalPhoto()!.earthDate }} | Status: {{ activeModalPhoto()!.roverStatus }}</p>
            </div>
            <button mat-icon-button class="modal-close" (click)="closeModal()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
      }
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 70px);
      background: radial-gradient(circle at 50% 10%, #1f0b08 0%, #030712 100%);
      color: #f8fafc;
      font-family: 'Inter', system-ui, sans-serif;
      padding: 1.5rem;
    }
    .space-container { max-width: 1400px; margin: 0 auto; }
    .telemetry-header {
      margin-bottom: 2rem;
    }
    .badge-tag {
      font-size: 0.65rem;
      font-weight: 800;
      color: #ff6b4a;
      letter-spacing: 0.15em;
      margin-bottom: 0.25rem;
    }
    .brand h1 {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      margin: 0;
      span { color: #ff6b4a; text-shadow: 0 0 16px rgba(255,107,74,0.6); }
    }
    .brand .subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; }
    .filters-panel {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: center;
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
    }
    .filter-group { display: flex; align-items: center; gap: 0.75rem; }
    .filter-label { font-size: 0.75rem; font-weight: 700; color: #ff6b4a; letter-spacing: 0.08em; }
    .rover-chips { display: flex; gap: 0.5rem; }
    .chip-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.15);
      color: #cbd5e1;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      &.active {
        background: rgba(255,107,74,0.2);
        border-color: #ff6b4a;
        color: #ff6b4a;
        box-shadow: 0 0 10px rgba(255,107,74,0.3);
      }
    }
    .glass-input-sol, .glass-select {
      background: rgba(11, 15, 25, 0.8);
      border: 1px solid rgba(255,107,74,0.3);
      color: #ff6b4a;
      font-weight: 700;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      outline: none;
    }
    .radar-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #ff6b4a;
    }
    .pulse-ring {
      width: 60px;
      height: 60px;
      border: 2px solid #ff6b4a;
      border-radius: 50%;
      animation: pulseAnim 1.5s infinite ease-out;
      margin-bottom: 1rem;
    }
    @keyframes pulseAnim {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    .glass-card {
      background: rgba(11, 15, 25, 0.7);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 107, 74, 0.2);
      border-radius: 16px;
      box-shadow: 0 8px 32px 0 rgba(0,0,0,0.4);
    }
    .photos-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
    }
    .photo-card {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      padding: 0;
      transition: transform 0.2s ease, border-color 0.2s ease;
      &:hover { transform: translateY(-4px); border-color: rgba(255,107,74,0.6); }
    }
    .mars-img {
      width: 100%;
      height: 240px;
      object-fit: cover;
      display: block;
    }
    .photo-overlay {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 0.75rem;
      background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .cam-tag {
      font-size: 0.65rem;
      font-weight: 800;
      background: rgba(255,107,74,0.3);
      border: 1px solid rgba(255,107,74,0.5);
      color: #ff6b4a;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 4px;
    }
    .sol-tag { font-size: 0.65rem; color: #ffffff; }
    .date-tag { font-size: 0.65rem; color: rgba(255,255,255,0.6); }
    .empty-box {
      text-align: center;
      padding: 3rem;
      mat-icon { font-size: 3rem; width: 3rem; height: 3rem; color: #ff6b4a; margin-bottom: 1rem; }
    }
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.92);
      backdrop-filter: blur(16px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .modal-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .modal-img { max-width: 100%; max-height: 70vh; border-radius: 12px; border: 1px solid rgba(255,107,74,0.4); }
    .modal-details { margin-top: 1rem; text-align: center; }
    .modal-details h3 { margin: 0; font-size: 1.1rem; color: #ffffff; }
    .modal-details p { margin: 4px 0 0 0; font-size: 0.8rem; color: rgba(255,255,255,0.6); }
    .modal-close { position: absolute; top: -40px; right: 0; color: #ffffff; }
  `]
})
export class MarsRoverComponent implements OnInit {
  private readonly marsService = inject(MarsRoverService);
  readonly state = this.marsService.state;

  rovers = ['curiosity', 'opportunity', 'perseverance'];
  cameras = ['ALL', 'FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'];

  selectedRover = 'curiosity';
  sol = 1000;
  selectedCamera = 'ALL';
  activeModalPhoto = signal<MarsPhoto | null>(null);

  ngOnInit(): void {
    this.fetchPhotos();
  }

  selectRover(r: string): void {
    this.selectedRover = r;
    this.fetchPhotos();
  }

  onFilterChange(): void {
    this.fetchPhotos();
  }

  fetchPhotos(): void {
    this.marsService.loadRoverPhotos(this.selectedRover, this.sol, this.selectedCamera);
  }

  openImageModal(photo: MarsPhoto): void {
    this.activeModalPhoto.set(photo);
  }

  closeModal(): void {
    this.activeModalPhoto.set(null);
  }
}
