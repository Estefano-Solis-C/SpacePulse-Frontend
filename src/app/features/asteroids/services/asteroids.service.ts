import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_CONFIG } from '../../../core/config/environment.config';
import { NeoFeedResponseDto, AsteroidNeo, mapToAsteroidNeo, ApiResponseState } from '../../../core/models/space-telemetry.models';

@Injectable({ providedIn: 'root' })
export class AsteroidsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ENVIRONMENT_CONFIG);

  private readonly stateSignal = signal<ApiResponseState<AsteroidNeo[]>>({
    data: null,
    status: 'idle',
    error: null
  });

  readonly state = this.stateSignal.asReadonly();

  loadNeoRadar(): void {
    this.stateSignal.set({ data: null, status: 'loading', error: null });

    const today = new Date().toISOString().split('T')[0];

    this.http.get<NeoFeedResponseDto>(`${this.config.nasaNeoUrl}?start_date=${today}`).subscribe({
      next: (res) => {
        const allNeos: AsteroidNeo[] = [];
        if (res.near_earth_objects) {
          Object.values(res.near_earth_objects).forEach(dateList => {
            dateList.forEach(dto => allNeos.push(mapToAsteroidNeo(dto)));
          });
        }
        allNeos.sort((a, b) => a.missDistanceLunar - b.missDistanceLunar);
        this.stateSignal.set({ data: allNeos, status: 'success', error: null });
      },
      error: (err) => {
        this.stateSignal.set({
          data: null,
          status: 'error',
          error: err.message || 'Error al conectar con el radar de asteroides de la NASA'
        });
      }
    });
  }
}
