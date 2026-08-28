import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_CONFIG } from '../../../core/config/environment.config';
import { LaunchResponseDto, RocketLaunch, mapToRocketLaunch, ApiResponseState } from '../../../core/models/space-telemetry.models';

@Injectable({ providedIn: 'root' })
export class LaunchesService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ENVIRONMENT_CONFIG);

  private readonly stateSignal = signal<ApiResponseState<RocketLaunch[]>>({
    data: null,
    status: 'idle',
    error: null
  });

  readonly state = this.stateSignal.asReadonly();

  loadUpcomingLaunches(): void {
    this.stateSignal.set({ data: null, status: 'loading', error: null });

    this.http.get<LaunchResponseDto>(`${this.config.spaceDevsLaunchesUrl}/?limit=12`).subscribe({
      next: (res) => {
        const launches = (res.results || []).map(mapToRocketLaunch);
        this.stateSignal.set({ data: launches, status: 'success', error: null });
      },
      error: (err) => {
        this.stateSignal.set({
          data: null,
          status: 'error',
          error: err.message || 'Error al obtener próximos lanzamientos espaciales'
        });
      }
    });
  }
}
