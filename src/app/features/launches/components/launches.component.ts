import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LaunchesService } from '../services/launches.service';
import { RocketLaunch } from '../../../core/models/space-telemetry.models';

@Component({
  selector: 'app-launches',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="space-container">
      <header class="telemetry-header">
        <div class="brand">
          <div class="badge-tag">PROPULSION & ORBITAL LAUNCHES</div>
          <h1>SPACE<span>PULSE</span> LAUNCH SCHEDULE</h1>
          <span class="subtitle">UPCOMING GLOBAL SPACE MISSIONS & COUNTDOWN TELEMETRY</span>
        </div>
      </header>

      @if (state().status === 'loading') {
        <div class="radar-loader">
          <div class="pulse-ring"></div>
          <p>Syncing global spaceport manifest & mission countdowns...</p>
        </div>
      }

      @if (state().error) {
        <div class="glass-alert">
          <mat-icon>warning</mat-icon>
          <p>{{ state().error }}</p>
        </div>
      }

      @if (state().data; as launches) {
        <div class="launches-grid">
          @for (launch of launches; track launch.id) {
            <article class="launch-card glass-card">
              @if (launch.imageUrl) {
                <div class="card-img-box">
                  <img [src]="launch.imageUrl" [alt]="launch.name" class="launch-img" />
                  <span class="status-badge" [class.go]="launch.statusAbbrev === 'Go'">{{ launch.statusName }}</span>
                </div>
              }

              <div class="card-content">
                <div class="countdown-bar">
                  <span class="t-minus-label">T-MINUS</span>
                  <span class="countdown-val">{{ getCountdown(launch.netTime) }}</span>
                </div>

                <h2 class="launch-title">{{ launch.name }}</h2>
                <div class="mission-desc">{{ launch.missionDescription }}</div>

                <div class="meta-details">
                  <div class="meta-row">
                    <span class="meta-k"><mat-icon>rocket_launch</mat-icon> Rocket:</span>
                    <span class="meta-v">{{ launch.rocketName }}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-k"><mat-icon>place</mat-icon> Pad:</span>
                    <span class="meta-v">{{ launch.padName }} ({{ launch.padLocation }})</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-k"><mat-icon>schedule</mat-icon> NET:</span>
                    <span class="meta-v">{{ launch.netTime | date:'yyyy-MM-dd HH:mm UTC' }}</span>
                  </div>
                </div>
              </div>
            </article>
          }
        </div>
      }
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - 70px);
      background: radial-gradient(circle at 50% 10%, #081a17 0%, #030712 100%);
      color: #f8fafc;
      font-family: 'Inter', system-ui, sans-serif;
      padding: 1.5rem;
    }
    .space-container { max-width: 1400px; margin: 0 auto; }
    .telemetry-header { margin-bottom: 2rem; }
    .badge-tag {
      font-size: 0.65rem;
      font-weight: 800;
      color: #10b981;
      letter-spacing: 0.15em;
      margin-bottom: 0.25rem;
    }
    .brand h1 {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      margin: 0;
      span { color: #10b981; text-shadow: 0 0 16px rgba(16,185,129,0.6); }
    }
    .brand .subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; }
    .radar-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #10b981;
    }
    .pulse-ring {
      width: 60px;
      height: 60px;
      border: 2px solid #10b981;
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
    .launches-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
    }
    .glass-card {
      background: rgba(11, 15, 25, 0.7);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 16px;
      box-shadow: 0 8px 32px 0 rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.2s ease, border-color 0.2s ease;
      &:hover { transform: translateY(-4px); border-color: rgba(16,185,129,0.5); }
    }
    .card-img-box { position: relative; height: 180px; overflow: hidden; }
    .launch-img { width: 100%; height: 100%; object-fit: cover; }
    .status-badge {
      position: absolute;
      top: 12px; right: 12px;
      background: rgba(0,0,0,0.75);
      border: 1px solid rgba(255,255,255,0.2);
      color: #cbd5e1;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      &.go { background: rgba(16,185,129,0.25); border-color: #10b981; color: #10b981; }
    }
    .card-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
    .countdown-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.3);
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    .t-minus-label { font-size: 0.65rem; font-weight: 800; color: #10b981; }
    .countdown-val {
      font-size: 1.1rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      color: #ffffff;
    }
    .launch-title { font-size: 1.15rem; font-weight: 800; color: #ffffff; margin: 0 0 0.5rem 0; line-height: 1.3; }
    .mission-desc {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.6);
      line-height: 1.5;
      margin-bottom: 1.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .meta-details { margin-top: auto; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; }
    .meta-row { display: flex; align-items: center; gap: 0.5rem; }
    .meta-k {
      color: rgba(255,255,255,0.5);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      mat-icon { font-size: 1rem; width: 1rem; height: 1rem; color: #10b981; }
    }
    .meta-v { color: #ffffff; font-weight: 600; }
  `]
})
export class LaunchesComponent implements OnInit, OnDestroy {
  private readonly launchesService = inject(LaunchesService);
  readonly state = this.launchesService.state;

  private timerInterval: any;
  currentTime = signal(Date.now());

  ngOnInit(): void {
    this.launchesService.loadUpcomingLaunches();
    this.timerInterval = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  getCountdown(target: Date): string {
    const diff = target.getTime() - this.currentTime();
    if (diff <= 0) return 'LIFTOFF / IN FLIGHT';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `T- ${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
}
