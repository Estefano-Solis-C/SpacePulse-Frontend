import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApodService } from '../services/apod.service';

@Component({
  selector: 'app-apod-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="space-container">
      <header class="telemetry-header">
        <div class="brand">
          <div class="badge-tag">DEEP SPACE OBSERVATORY</div>
          <h1>SPACE<span>PULSE</span> APOD EXPLORER</h1>
          <span class="subtitle">ASTRONOMY PICTURE OF THE DAY & COSMIC CHRONICLES</span>
        </div>
        <div class="date-picker-box">
          <input type="date" [(ngModel)]="selectedDate" (change)="onDateChange()" class="glass-input" />
        </div>
      </header>

      @if (state().status === 'loading') {
        <div class="radar-loader">
          <div class="pulse-ring"></div>
          <p>Downloading deep space high-resolution telemetry...</p>
        </div>
      }

      @if (state().error) {
        <div class="glass-alert">
          <mat-icon>warning</mat-icon>
          <p>{{ state().error }}</p>
        </div>
      }

      @if (state().data; as apod) {
        <section class="apod-layout">
          <div class="apod-media-card glass-card">
            @if (apod.mediaType === 'image') {
              <img [src]="apod.hdUrl" [alt]="apod.title" class="apod-img" (click)="openHdModal(apod.hdUrl)" />
              <button mat-flat-button color="primary" class="zoom-btn" (click)="openHdModal(apod.hdUrl)">
                <mat-icon>fullscreen</mat-icon> View Full HD Master
              </button>
            } @else {
              <div class="video-container">
                <iframe [src]="apod.url" frameborder="0" allowfullscreen class="apod-video"></iframe>
              </div>
            }
          </div>

          <div class="apod-info-card glass-card">
            <div class="card-head">
              <span class="date-tag">{{ apod.date }}</span>
              @if (apod.copyright) {
                <span class="credit-tag">© {{ apod.copyright }}</span>
              }
            </div>
            <h2>{{ apod.title }}</h2>
            <div class="explanation-box">
              <p>{{ apod.explanation }}</p>
            </div>
          </div>
        </section>

        @if (modalImageUrl()) {
          <div class="modal-backdrop" (click)="closeModal()">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <img [src]="modalImageUrl()" alt="HD Preview" class="modal-img" />
              <button mat-icon-button class="modal-close" (click)="closeModal()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        }
      }
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 70px);
      background: radial-gradient(circle at 50% 10%, #0c1527 0%, #030712 100%);
      color: #f8fafc;
      font-family: 'Inter', system-ui, sans-serif;
      padding: 1.5rem;
    }
    .space-container { max-width: 1400px; margin: 0 auto; }
    .telemetry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .badge-tag {
      font-size: 0.65rem;
      font-weight: 800;
      color: #00f5ff;
      letter-spacing: 0.15em;
      margin-bottom: 0.25rem;
    }
    .brand h1 {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      margin: 0;
      span { color: #00f5ff; text-shadow: 0 0 16px rgba(0,245,255,0.6); }
    }
    .brand .subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; }
    .glass-input {
      background: rgba(11, 15, 25, 0.7);
      border: 1px solid rgba(0, 245, 255, 0.3);
      color: #00f5ff;
      font-weight: 700;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      outline: none;
      font-family: inherit;
    }
    .radar-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #00f5ff;
    }
    .pulse-ring {
      width: 60px;
      height: 60px;
      border: 2px solid #00f5ff;
      border-radius: 50%;
      animation: pulseAnim 1.5s infinite ease-out;
      margin-bottom: 1rem;
    }
    @keyframes pulseAnim {
      0% { transform: scale(0.6); opacity: 1; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    .glass-alert {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #fca5a5;
    }
    .apod-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      @media (min-width: 1024px) { grid-template-columns: 3fr 2fr; }
    }
    .glass-card {
      background: rgba(11, 15, 25, 0.7);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(0, 245, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px 0 rgba(0,0,0,0.4);
    }
    .apod-img {
      width: 100%;
      height: 480px;
      object-fit: cover;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .zoom-btn {
      margin-top: 1rem;
      width: 100%;
      background: rgba(0,245,255,0.15) !important;
      border: 1px solid rgba(0,245,255,0.4) !important;
      color: #00f5ff !important;
      font-weight: 700 !important;
    }
    .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      border-radius: 12px;
    }
    .apod-video { position: absolute; top:0; left: 0; width: 100%; height: 100%; }
    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .date-tag { color: #00f5ff; }
    .credit-tag { color: rgba(255,255,255,0.5); }
    h2 { font-size: 1.5rem; font-weight: 800; color: #ffffff; margin-bottom: 1rem; }
    .explanation-box p {
      line-height: 1.7;
      color: rgba(255,255,255,0.8);
      font-size: 0.95rem;
    }
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.9);
      backdrop-filter: blur(16px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .modal-content { position: relative; max-width: 90vw; max-height: 90vh; }
    .modal-img { max-width: 100%; max-height: 85vh; border-radius: 12px; border: 1px solid rgba(0,245,255,0.3); }
    .modal-close {
      position: absolute;
      top: -40px;
      right: 0;
      color: #ffffff;
    }
  `]
})
export class ApodExplorerComponent implements OnInit {
  private readonly apodService = inject(ApodService);
  readonly state = this.apodService.state;
  selectedDate = '';
  modalImageUrl = signal<string | null>(null);

  ngOnInit(): void {
    this.apodService.loadApod();
  }

  onDateChange(): void {
    if (this.selectedDate) {
      this.apodService.loadApod(this.selectedDate);
    }
  }

  openHdModal(url: string): void {
    this.modalImageUrl.set(url);
  }

  closeModal(): void {
    this.modalImageUrl.set(null);
  }
}
