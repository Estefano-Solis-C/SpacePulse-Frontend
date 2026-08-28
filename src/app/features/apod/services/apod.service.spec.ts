import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApodService } from './apod.service';
import { ENVIRONMENT_CONFIG } from '../../../core/config/environment.config';
import { ApodDto } from '../../../core/models/space-telemetry.models';

describe('ApodService Contract & Cache Tests', () => {
  let service: ApodService;
  let httpMock: HttpTestingController;

  const mockApod: ApodDto = {
    date: '2026-08-28',
    title: 'Cosmic Nebula Wonder',
    explanation: 'A deep space vista captured by orbital observatory.',
    hdurl: 'https://images.nasa.gov/hd.jpg',
    media_type: 'image',
    service_version: 'v1',
    url: 'https://images.nasa.gov/preview.jpg',
    copyright: 'NASA/ESA'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ApodService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ENVIRONMENT_CONFIG,
          useValue: {
            nasaApiKey: 'DEMO_KEY',
            nasaApodUrl: 'https://api.nasa.gov/planetary/apod'
          }
        }
      ]
    });

    service = TestBed.inject(ApodService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('Carga y mapea correctamente los datos de APOD', () => {
    service.loadApod('2026-08-28');
    expect(service.state().status).toBe('loading');

    const req = httpMock.expectOne(r => r.url.includes('api.nasa.gov/planetary/apod'));
    req.flush(mockApod);

    const state = service.state();
    expect(state.status).toBe('success');
    expect(state.data?.title).toBe('Cosmic Nebula Wonder');
    expect(state.data?.hdUrl).toBe('https://images.nasa.gov/hd.jpg');
  });

  it('Usa caché local cuando está disponible sin realizar peticiones HTTP', () => {
    localStorage.setItem('spacepulse_apod_2026-08-28', JSON.stringify({
      date: '2026-08-28',
      title: 'Cached Nebula',
      explanation: 'Cached explanation',
      url: 'https://cached.jpg',
      hdUrl: 'https://cached.jpg',
      mediaType: 'image'
    }));

    service.loadApod('2026-08-28');
    httpMock.expectNone(r => r.url.includes('api.nasa.gov/planetary/apod'));

    expect(service.state().status).toBe('success');
    expect(service.state().data?.title).toBe('Cached Nebula');
  });
});
