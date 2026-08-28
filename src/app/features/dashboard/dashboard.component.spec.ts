import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SpacePulseDashboardComponent } from './dashboard.component';
import { environment } from '../../../environments/environment';

describe('SpacePulseDashboardComponent Invariant Tests', () => {
  let component: SpacePulseDashboardComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpacePulseDashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(SpacePulseDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize and compute online devices and active tasks signals', () => {
    component.ngOnInit();

    const spacesReq = httpMock.expectOne(`${environment.apiUrl}/spaces`);
    expect(spacesReq.request.method).toBe('GET');
    spacesReq.flush([]);

    const tasksReq = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(tasksReq.request.method).toBe('GET');
    tasksReq.flush([
      { id: '1', title: 'Task 1', description: 'Desc', priority: 'HIGH', status: 'PENDING', spaceId: 'sp1', createdAt: new Date() },
      { id: '2', title: 'Task 2', description: 'Desc', priority: 'LOW', status: 'COMPLETED', spaceId: 'sp1', createdAt: new Date() }
    ]);

    const devicesReq = httpMock.expectOne(`${environment.apiUrl}/iot-devices`);
    expect(devicesReq.request.method).toBe('GET');
    devicesReq.flush([
      { id: '1', name: 'Sensor 1', deviceType: 'TEMPERATURE', serialNumber: 'SN1', spaceId: 'sp1', status: 'ONLINE', lastHeartbeat: new Date() },
      { id: '2', name: 'Sensor 2', deviceType: 'HUMIDITY', serialNumber: 'SN2', spaceId: 'sp1', status: 'OFFLINE', lastHeartbeat: new Date() }
    ]);

    expect(component.onlineDevicesCount()).toBe(1);
    expect(component.activeTasksCount()).toBe(1);
  });
});
