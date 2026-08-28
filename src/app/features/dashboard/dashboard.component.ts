import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Space, IotDevice, FacilityTask } from '../../core/models/spacepulse.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-spacepulse-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-layout">
      <!-- Top Navigation & Summary -->
      <header class="dashboard-header">
        <div>
          <h1 class="brand-title">SPACE<span>PULSE</span></h1>
          <p class="subtitle">FACILITY & IOT TELEMETRY CONTROL CENTER</p>
        </div>
        <div class="kpi-group">
          <div class="kpi-pill">
            <span class="dot online"></span>
            <span>DISPOSITIVOS ONLINE: {{ onlineDevicesCount() }}</span>
          </div>
          <div class="kpi-pill alert">
            <span class="dot warning"></span>
            <span>TAREAS ACTIVAS: {{ activeTasksCount() }}</span>
          </div>
        </div>
      </header>

      <!-- Main Responsive Grid -->
      <main class="dashboard-grid">
        <!-- Spaces Section -->
        <section class="panel spaces-panel">
          <div class="panel-header">
            <h2>ESPACIOS GESTIONADOS</h2>
            <button class="btn-primary" routerLink="/spaces/new">+ Nuevo Espacio</button>
          </div>
          <div class="spaces-cards-grid">
            @for (space of spaces(); track space.id) {
              <article class="glass-card space-card">
                <img [src]="space.imageUrl || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'" [alt]="space.name" class="space-thumb" />
                <div class="space-content">
                  <h3>{{ space.name }}</h3>
                  <p class="location-tag">📍 {{ space.location }}</p>
                  <div class="space-meta">
                    <span>Capacidad: {{ space.capacity || 10 }} pers.</span>
                    <span class="status-chip">{{ space.activeDevicesCount || 1 }} Sensores IoT</span>
                  </div>
                </div>
              </article>
            } @empty {
              <div class="empty-state">No hay espacios configurados en este edificio.</div>
            }
          </div>
        </section>

        <!-- Tasks & Maintenance Feed Section -->
        <aside class="panel tasks-panel">
          <div class="panel-header">
            <h2>ORDENES DE TRABAJO</h2>
          </div>
          <div class="tasks-list">
            @for (task of tasks(); track task.id) {
              <div class="glass-card task-card" [class]="'priority-' + task.priority.toLowerCase()">
                <div class="task-head">
                  <span class="task-priority">{{ task.priority }}</span>
                  <span class="task-status">{{ task.status }}</span>
                </div>
                <h4 class="task-title">{{ task.title }}</h4>
                <p class="task-desc">{{ task.description }}</p>
              </div>
            } @empty {
              <div class="empty-state">No hay tareas pendientes en la cola.</div>
            }
          </div>
        </aside>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: radial-gradient(circle at 50% 10%, #0f172a 0%, #030712 100%);
      color: #f8fafc;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .dashboard-layout {
      max-width: 1600px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .brand-title {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      margin: 0;
      span { color: #00f5ff; text-shadow: 0 0 16px rgba(0, 245, 255, 0.5); }
    }
    .subtitle { font-size: 0.75rem; color: #94a3b8; letter-spacing: 0.08em; margin-top: 0.25rem; }
    .kpi-group { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .kpi-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.online { background: #10b981; box-shadow: 0 0 8px #10b981; }
    .dot.warning { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
    
    /* Responsive Grid Layout */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 2fr 1fr;
      }
    }
    .panel {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 1.5rem;
      backdrop-filter: blur(16px);
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      h2 { font-size: 1rem; font-weight: 700; letter-spacing: 0.05em; color: #cbd5e1; }
    }
    .btn-primary {
      background: #00f5ff;
      color: #030712;
      font-weight: 700;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: opacity 0.2s;
      &:hover { opacity: 0.9; }
    }
    .spaces-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    @media (min-width: 640px) {
      .spaces-cards-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .glass-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      overflow: hidden;
      transition: transform 0.2s ease, border-color 0.2s ease;
      &:hover { transform: translateY(-3px); border-color: rgba(0, 245, 255, 0.4); }
    }
    .space-thumb { width: 100%; height: 140px; object-fit: cover; }
    .space-content { padding: 1rem; }
    .space-content h3 { font-size: 1.1rem; margin: 0 0 0.25rem 0; color: #fff; }
    .location-tag { font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.75rem; }
    .space-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: #cbd5e1; }
    .status-chip { color: #00f5ff; font-weight: 600; }
    
    .tasks-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .task-card {
      padding: 1rem;
      border-left: 4px solid #94a3b8;
      &.priority-critical { border-left-color: #ef4444; }
      &.priority-high { border-left-color: #f97316; }
      &.priority-medium { border-left-color: #f59e0b; }
      &.priority-low { border-left-color: #10b981; }
    }
    .task-head { display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 700; margin-bottom: 0.5rem; }
    .task-title { margin: 0 0 0.25rem 0; font-size: 0.95rem; color: #fff; }
    .task-desc { font-size: 0.8rem; color: #94a3b8; margin: 0; }
    .empty-state { padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.9rem; }
  `]
})
export class SpacePulseDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly spaces = signal<Space[]>([]);
  readonly tasks = signal<FacilityTask[]>([]);
  readonly devices = signal<IotDevice[]>([]);

  readonly onlineDevicesCount = computed(() =>
    this.devices().filter(d => d.status === 'ONLINE').length
  );

  readonly activeTasksCount = computed(() =>
    this.tasks().filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length
  );

  ngOnInit(): void {
    // Carga inicial de datos desde los endpoints reales
    this.http.get<Space[]>(`${environment.apiUrl}/spaces`)
      .subscribe({ next: data => this.spaces.set(data || []), error: () => this.spaces.set([]) });

    this.http.get<FacilityTask[]>(`${environment.apiUrl}/tasks`)
      .subscribe({ next: data => this.tasks.set(data || []), error: () => this.tasks.set([]) });

    this.http.get<IotDevice[]>(`${environment.apiUrl}/iot-devices`)
      .subscribe({ next: data => this.devices.set(data || []), error: () => this.devices.set([]) });
  }

  openCreateSpaceModal(): void {
    // Modal de creacion de espacio
  }
}
