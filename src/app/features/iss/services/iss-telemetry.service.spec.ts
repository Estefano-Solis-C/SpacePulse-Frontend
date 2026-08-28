import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IssTelemetryService } from './iss-telemetry.service';
import { IssTelemetryDto } from '../../../core/models/space-telemetry.models';

describe('SpacePulse ISS Telemetry Contract & Signal Invariant Tests', () => {
  let service: IssTelemetryService;
  let httpMock: HttpTestingController;

  const mockDto: IssTelemetryDto = {
    name: 'iss',
    id: 25544,
    latitude: 51.5074,
    longitude: -0.1278,
    altitude: 418.234,
    velocity: 27600.12,
    visibility: 'daylight',
    footprint: 4500,
    timestamp: 1700000000,
    daynum: 2459000,
    solar_lat: 0,
    solar_lon: 0,
    units: 'kilometers'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IssTelemetryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Invariable de Mapeo: Transforma el payload HTTP al modelo inmutable con tipos exactos', fakeAsync(() => {
    const service = TestBed.inject(IssTelemetryService);
    expect(service.telemetry().status).toBe('loading');
    tick();

    const req = httpMock.expectOne('https://api.wheretheiss.at/v1/satellites/25544');
    expect(req.request.method).toBe('GET');

    req.flush(mockDto);
    tick();

    const state = service.telemetry();
    expect(state.status).toBe('success');
    expect(state.data?.latitude).toBe(51.5074);
    expect(state.data?.longitude).toBe(-0.1278);
    expect(state.data?.altitudeKm).toBe(418.23);
    expect(state.data?.velocityKmh).toBe(27600.12);
    expect(state.data?.visibility).toBe('daylight');

    discardPeriodicTasks();
  }));

  it('Invariable de Tolerancia a Fallos: Captura 500 sin romper el Signal de estado', fakeAsync(() => {
    const service = TestBed.inject(IssTelemetryService);
    tick();

    const req = httpMock.expectOne('https://api.wheretheiss.at/v1/satellites/25544');
    req.flush('Telemetry Link Down', { status: 500, statusText: 'Internal Server Error' });
    tick();

    const state = service.telemetry();
    expect(state.status).toBe('error');
    expect(state.data).toBeNull();
    expect(state.error).toBeTruthy();

    discardPeriodicTasks();
  }));
});
