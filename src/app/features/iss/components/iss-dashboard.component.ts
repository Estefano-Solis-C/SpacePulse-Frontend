import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IssTelemetryService } from '../services/iss-telemetry.service';

@Component({
  selector: 'app-iss-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="space-container">
      <header class="telemetry-header">
        <div class="brand">
          <div class="badge-tag">ORBITAL OBSERVATORY</div>
          <h1>SPACE<span>PULSE</span> ISS TELEMETRY</h1>
          <span class="subtitle">INTERNATIONAL SPACE STATION REAL-TIME TRACKING</span>
        </div>
        <div class="header-actions">
          <div class="link-badge" [class.active]="state().status === 'success'">
            <span class="indicator-dot"></span>
            {{ state().status === 'success' ? 'TELEMETRY LINK ACTIVE' : 'ACQUIRING SIGNAL...' }}
          </div>
        </div>
      </header>

      @if (state().status === 'loading') {
        <div class="radar-loader">
          <div class="pulse-ring"></div>
          <p>Acquiring orbital telemetry stream...</p>
        </div>
      }

      @if (state().error) {
        <div class="glass-alert">
          <mat-icon>warning</mat-icon>
          <p>{{ state().error }}</p>
        </div>
      }

      @if (state().data; as iss) {
        <section class="telemetry-grid">
          <article class="glass-card">
            <div class="card-head">
              <span>ORBITAL VELOCITY</span>
              <span class="glow-icon">⚡</span>
            </div>
            <div class="metric-body">
              <span class="metric-val">{{ iss.velocityKmh | number:'1.0-0' }}</span>
              <span class="metric-unit">km/h</span>
            </div>
            <div class="sub-metric">~ {{ (iss.velocityKmh / 3600) | number:'1.2-2' }} km/s orbital transit</div>
          </article>

          <article class="glass-card">
            <div class="card-head">
              <span>ORBITAL ALTITUDE</span>
              <span class="glow-icon">🛰️</span>
            </div>
            <div class="metric-body">
              <span class="metric-val">{{ iss.altitudeKm | number:'1.1-1' }}</span>
              <span class="metric-unit">km</span>
            </div>
            <div class="sub-metric">Low Earth Orbit (LEO)</div>
          </article>

          <article class="glass-card full-mobile">
            <div class="card-head">
              <span>COORDINATES</span>
              <span class="glow-icon">🌐</span>
            </div>
            <div class="coords-body">
              <div><span class="coord-k">LAT:</span> {{ iss.latitude | number:'1.4-4' }}°</div>
              <div><span class="coord-k">LON:</span> {{ iss.longitude | number:'1.4-4' }}°</div>
            </div>
            <span class="tag" [class.day]="iss.visibility === 'daylight'">
              {{ iss.visibility | uppercase }}
            </span>
          </article>
        </section>

        <!-- Orbital Map & Status View -->
        <section class="orbital-monitor-card glass-card">
          <div class="card-head">
            <span>LIVE POSITION & GROUND TRACK MATRIX</span>
            <span class="timestamp-tag">EPOCH: {{ iss.timestamp | date:'yyyy-MM-dd HH:mm:ss UTC' }}</span>
          </div>
          <div class="radar-display">
            <div class="radar-sweep"></div>
            <div class="radar-center-cross"></div>
            <div class="satellite-marker" [style.top.%]="((90 - iss.latitude) / 180) * 100" [style.left.%]="((iss.longitude + 180) / 360) * 100">
              <span class="sat-ping"></span>
              <span class="sat-icon">🛰️</span>
              <span class="sat-label">ISS (ZARYA)</span>
            </div>
          </div>
        </section>
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
    .space-container {
      max-width: 1400px;
      margin: 0 auto;
    }
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
    .brand .subtitle {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.5);
      letter-spacing: 0.08em;
    }
    .link-badge {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      &.active {
        border-color: rgba(0,245,255,0.4);
        background: rgba(0,245,255,0.08);
        .indicator-dot { background: #00f5ff; box-shadow: 0 0 10px #00f5ff; }
      }
    }
    .indicator-dot { width: 8px; height: 8px; border-radius: 50%; background: #64748b; }
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
      margin-bottom: 1.5rem;
    }
    .telemetry-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
      @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
    }
    .glass-card {
      background: rgba(11, 15, 25, 0.7);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(0, 245, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px 0 rgba(0,0,0,0.4);
      transition: transform 0.2s ease, border-color 0.2s ease;
      &:hover { transform: translateY(-2px); border-color: rgba(0,245,255,0.5); }
    }
    .card-head {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      font-weight: 700;
      color: rgba(255,255,255,0.6);
      margin-bottom: 1rem;
    }
    .metric-body {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      .metric-val {
        font-size: 2.5rem;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }
      .metric-unit { font-size: 0.95rem; color: #00f5ff; font-weight: 600; }
    }
    .sub-metric {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.4);
      margin-top: 0.5rem;
    }
    .coords-body {
      display: flex;
      justify-content: space-between;
      font-variant-numeric: tabular-nums;
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
      .coord-k { color: rgba(255,255,255,0.5); font-size: 0.8rem; }
    }
    .tag {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      background: rgba(255,255,255,0.1);
      &.day { background: rgba(255,187,0,0.2); color: #ffbb00; border: 1px solid rgba(255,187,0,0.4); }
    }
    .orbital-monitor-card {
      padding: 1.5rem;
    }
    .radar-display {
      position: relative;
      width: 100%;
      height: 340px;
      background: #020617 radial-gradient(circle, rgba(0,245,255,0.05) 0%, rgba(0,0,0,0.8) 100%);
      border-radius: 12px;
      border: 1px solid rgba(0,245,255,0.15);
      overflow: hidden;
    }
    .radar-sweep {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: conic-gradient(from 0deg at 50% 50%, transparent 70%, rgba(0,245,255,0.15) 100%);
      animation: sweepAnim 4s linear infinite;
    }
    @keyframes sweepAnim {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .satellite-marker {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 10;
      transition: top 1s linear, left 1s linear;
    }
    .sat-icon { font-size: 1.5rem; }
    .sat-label {
      font-size: 0.65rem;
      font-weight: 800;
      color: #00f5ff;
      letter-spacing: 0.05em;
      background: rgba(0,0,0,0.7);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(0,245,255,0.3);
      white-space: nowrap;
    }
    .sat-ping {
      position: absolute;
      width: 24px;
      height: 24px;
      border: 2px solid #00f5ff;
      border-radius: 50%;
      animation: satPingAnim 1.2s infinite ease-out;
    }
    @keyframes satPingAnim {
      0% { transform: scale(0.3); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
  `]
})
export class IssDashboardComponent {
  private readonly issService = inject(IssTelemetryService);
  readonly state = this.issService.telemetry;
}
