import { Component, OnInit, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsteroidsService } from '../services/asteroids.service';

@Component({
  selector: 'app-asteroids',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="space-container">
      <header class="telemetry-header">
        <div class="brand">
          <div class="badge-tag">PLANETARY DEFENSE RADAR</div>
          <h1>SPACE<span>PULSE</span> NEAR-EARTH ASTEROIDS</h1>
          <span class="subtitle">ORBITAL INTERSECTIONS, CLOSE APPROACH TRAJECTORIES & HAZARD MATRIX</span>
        </div>
        <div class="radar-status-badge" [class.danger]="hazardousCount() > 0">
          <span class="indicator-dot"></span>
          {{ hazardousCount() }} POTENTIALLY HAZARDOUS DETECTED
        </div>
      </header>

      @if (state().status === 'loading') {
        <div class="radar-loader">
          <div class="pulse-ring"></div>
          <p>Scanning orbital vicinity for Near-Earth Objects (NEO)...</p>
        </div>
      }

      @if (state().error) {
        <div class="glass-alert">
          <mat-icon>warning</mat-icon>
          <p>{{ state().error }}</p>
        </div>
      }

      @if (state().data; as asteroids) {
        <div class="asteroids-grid">
          @for (ast of asteroids; track ast.id) {
            <article class="asteroid-card glass-card" [class.hazardous]="ast.isHazardous">
              <div class="card-head">
                <span class="neo-id">NEO #{{ ast.id }}</span>
                @if (ast.isHazardous) {
                  <span class="hazard-badge">HAZARDOUS</span>
                } @else {
                  <span class="safe-badge">SAFE</span>
                }
              </div>

              <h2 class="ast-name">{{ ast.name }}</h2>

              <div class="ast-metrics">
                <div class="metric-row">
                  <span class="metric-k"><mat-icon>radio_button_checked</mat-icon> Proximity:</span>
                  <span class="metric-v highlight">{{ ast.missDistanceLunar | number:'1.1-1' }} LD</span>
                  <span class="sub-v">({{ (ast.missDistanceKm / 1000000) | number:'1.2-2' }}M km)</span>
                </div>

                <div class="metric-row">
                  <span class="metric-k"><mat-icon>speed</mat-icon> Velocity:</span>
                  <span class="metric-v">{{ ast.velocityKmh | number:'1.0-0' }} km/h</span>
                </div>

                <div class="metric-row">
                  <span class="metric-k"><mat-icon>straighten</mat-icon> Diameter:</span>
                  <span class="metric-v">{{ ast.estimatedDiameterMetersMin }} - {{ ast.estimatedDiameterMetersMax }} m</span>
                </div>

                <div class="metric-row">
                  <span class="metric-k"><mat-icon>calendar_today</mat-icon> Approach:</span>
                  <span class="metric-v">{{ ast.closeApproachDate }}</span>
                </div>
              </div>

              <a [href]="ast.jplUrl" target="_blank" rel="noopener noreferrer" class="jpl-link">
                View NASA JPL Trajectory <mat-icon>open_in_new</mat-icon>
              </a>
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
      background: radial-gradient(circle at 50% 10%, #1e112a 0%, #030712 100%);
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
      color: #c084fc;
      letter-spacing: 0.15em;
      margin-bottom: 0.25rem;
    }
    .brand h1 {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      margin: 0;
      span { color: #c084fc; text-shadow: 0 0 16px rgba(192,132,252,0.6); }
    }
    .brand .subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; }
    .radar-status-badge {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      &.danger {
        border-color: rgba(255,75,75,0.5);
        background: rgba(255,75,75,0.1);
        color: #ff4b4b;
        .indicator-dot { background: #ff4b4b; box-shadow: 0 0 10px #ff4b4b; }
      }
    }
    .indicator-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
    .radar-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #c084fc;
    }
    .pulse-ring {
      width: 60px;
      height: 60px;
      border: 2px solid #c084fc;
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
    .asteroids-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }
    .glass-card {
      background: rgba(11, 15, 25, 0.7);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(192, 132, 252, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px 0 rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, border-color 0.2s ease;
      &:hover { transform: translateY(-3px); border-color: rgba(192,132,252,0.5); }
      &.hazardous {
        border-color: rgba(255, 75, 75, 0.4);
        box-shadow: 0 8px 32px 0 rgba(255,75,75,0.15);
      }
    }
    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .neo-id { font-size: 0.7rem; color: rgba(255,255,255,0.5); font-weight: 700; }
    .hazard-badge {
      font-size: 0.65rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(255,75,75,0.2);
      border: 1px solid rgba(255,75,75,0.5);
      color: #ff4b4b;
    }
    .safe-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(16,185,129,0.15);
      border: 1px solid rgba(16,185,129,0.3);
      color: #10b981;
    }
    .ast-name { font-size: 1.2rem; font-weight: 800; color: #ffffff; margin: 0 0 1rem 0; }
    .ast-metrics { display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.8rem; margin-bottom: 1.25rem; }
    .metric-row { display: flex; align-items: center; gap: 0.5rem; }
    .metric-k {
      color: rgba(255,255,255,0.5);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      mat-icon { font-size: 0.95rem; width: 0.95rem; height: 0.95rem; color: #c084fc; }
    }
    .metric-v { font-weight: 700; color: #ffffff; font-variant-numeric: tabular-nums; }
    .metric-v.highlight { color: #00f5ff; }
    .sub-v { font-size: 0.7rem; color: rgba(255,255,255,0.4); }
    .jpl-link {
      margin-top: auto;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #c084fc;
      text-decoration: none;
      transition: color 0.2s ease;
      &:hover { color: #e9d5ff; }
      mat-icon { font-size: 0.85rem; width: 0.85rem; height: 0.85rem; }
    }
  `]
})
export class AsteroidsComponent implements OnInit {
  private readonly asteroidsService = inject(AsteroidsService);
  readonly state = this.asteroidsService.state;

  readonly hazardousCount = computed(() => {
    const list = this.state().data || [];
    return list.filter(a => a.isHazardous).length;
  });

  ngOnInit(): void {
    this.asteroidsService.loadNeoRadar();
  }
}
