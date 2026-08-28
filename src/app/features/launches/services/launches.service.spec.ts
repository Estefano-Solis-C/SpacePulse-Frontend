import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LaunchesService } from './launches.service';
import { ENVIRONMENT_CONFIG } from '../../../core/config/environment.config';
import { LaunchResponseDto } from '../../../core/models/space-telemetry.models';

describe('LaunchesService Contract & Parsing Tests', () => {
  let service: LaunchesService;
  let httpMock: HttpTestingController;

  const mockResponse: LaunchResponseDto = {
    count: 1,
    results: [
      {
        id: 'launch-uuid-001',
        name: 'Falcon 9 Block 5 | Starlink Group 7-10',
        status: {
          id: 1,
          name: 'Go for Launch',
          abbrev: 'Go',
          description: 'Official launch countdown is proceeding normally.'
        },
        net: '2026-09-01T12:00:00Z',
        window_end: '2026-09-01T14:00:00Z',
        window_start: '2026-09-01T12:00:00Z',
        rocket: {
          configuration: {
            name: 'Falcon 9'
          }
        },
        mission: {
          name: 'Starlink Constellation Deployment',
          description: 'Deployment of internet satellites.',
          type: 'Communications'
        },
        pad: {
          name: 'Space Launch Complex 40',
          location: {
            name: 'Cape Canaveral SFS, FL, USA'
          }
        },
        image: 'https://images.spacedevs.com/falcon9.jpg'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LaunchesService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ENVIRONMENT_CONFIG,
          useValue: {
            spaceDevsLaunchesUrl: 'https://lldev.thespacedevs.com/2.2.0/launch/upcoming'
          }
        }
      ]
    });

    service = TestBed.inject(LaunchesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Carga y parsea la lista de próximos lanzamientos de cohetes', () => {
    service.loadUpcomingLaunches();
    expect(service.state().status).toBe('loading');

    const req = httpMock.expectOne(r => r.url.includes('launch/upcoming'));
    req.flush(mockResponse);

    const state = service.state();
    expect(state.status).toBe('success');
    expect(state.data?.length).toBe(1);
    expect(state.data?.[0].rocketName).toBe('Falcon 9');
    expect(state.data?.[0].statusAbbrev).toBe('Go');
    expect(state.data?.[0].padName).toBe('Space Launch Complex 40');
  });
});
