import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IotTelemetryService } from './iot-telemetry.service';
import { TelemetryRecord } from '../../../core/models/spacepulse.models';
import { environment } from '../../../../environments/environment';

describe('IotTelemetryService Real-Time Stream Invariant Tests', () => {
  let service: IotTelemetryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IotTelemetryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(IotTelemetryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Parity Invariant: Procesa el registro de telemetria de sensor IoT con tipos numericos exactos', fakeAsync(() => {
    const mockTelemetry: TelemetryRecord = {
      id: 'tel-101',
      deviceId: 'dev-99',
      metricType: 'TEMPERATURE',
      value: 23.4,
      unit: '°C',
      timestamp: new Date()
    };

    let receivedRecord: TelemetryRecord | null = null;
    const sub = service.getLiveTelemetryStream('dev-99').subscribe(record => {
      receivedRecord = record;
    });

    tick();

    const req = httpMock.expectOne(`${environment.apiUrl}/iot-devices/dev-99/telemetry/latest`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTelemetry);

    expect(receivedRecord).toBeTruthy();
    expect(receivedRecord!.value).toBe(23.4);
    expect(receivedRecord!.unit).toBe('°C');
    expect(receivedRecord!.metricType).toBe('TEMPERATURE');

    sub.unsubscribe();
  }));
});
