import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_CONFIG } from '../../../core/config/environment.config';
import { MarsRoverResponseDto, MarsPhoto, mapToMarsPhoto, ApiResponseState } from '../../../core/models/space-telemetry.models';

@Injectable({ providedIn: 'root' })
export class MarsRoverService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ENVIRONMENT_CONFIG);

  private readonly stateSignal = signal<ApiResponseState<MarsPhoto[]>>({
    data: null,
    status: 'idle',
    error: null
  });

  readonly state = this.stateSignal.asReadonly();

  loadRoverPhotos(rover = 'curiosity', sol = 1000, camera?: string): void {
    this.stateSignal.set({ data: null, status: 'loading', error: null });

    const params: Record<string, string> = { sol: sol.toString() };
    if (camera && camera !== 'ALL') {
      params['camera'] = camera.toLowerCase();
    }

    const url = `${this.config.nasaMarsUrl}/${rover.toLowerCase()}/photos`;

    this.http.get<MarsRoverResponseDto>(url, { params }).subscribe({
      next: (res) => {
        const photos = (res.photos || []).map(mapToMarsPhoto);
        this.stateSignal.set({ data: photos, status: 'success', error: null });
      },
      error: (err) => {
        this.stateSignal.set({
          data: null,
          status: 'error',
          error: err.message || `Error al obtener fotos del rover ${rover}`
        });
      }
    });
  }
}
