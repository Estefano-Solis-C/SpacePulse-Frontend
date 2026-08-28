import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_CONFIG } from '../../../core/config/environment.config';
import { ApodDto, ApodItem, mapToApodItem, ApiResponseState } from '../../../core/models/space-telemetry.models';

@Injectable({ providedIn: 'root' })
export class ApodService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ENVIRONMENT_CONFIG);

  private readonly stateSignal = signal<ApiResponseState<ApodItem>>({
    data: null,
    status: 'idle',
    error: null
  });

  readonly state = this.stateSignal.asReadonly();

  loadApod(date?: string): void {
    const cacheKey = `spacepulse_apod_${date || 'today'}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const item: ApodItem = JSON.parse(cached);
        this.stateSignal.set({ data: item, status: 'success', error: null });
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    this.stateSignal.set({ data: null, status: 'loading', error: null });

    const params: Record<string, string> = { hd: 'true' };
    if (date) params['date'] = date;

    this.http.get<ApodDto>(this.config.nasaApodUrl, { params }).subscribe({
      next: (dto) => {
        const item = mapToApodItem(dto);
        localStorage.setItem(cacheKey, JSON.stringify(item));
        this.stateSignal.set({ data: item, status: 'success', error: null });
      },
      error: (err) => {
        this.stateSignal.set({
          data: null,
          status: 'error',
          error: err.message || 'Error al obtener la imagen astronómica del día'
        });
      }
    });
  }
}
