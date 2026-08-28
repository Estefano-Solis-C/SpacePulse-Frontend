import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { spaceApiInterceptor } from './space-api.interceptor';
import { ENVIRONMENT_CONFIG } from '../config/environment.config';

describe('SpaceApiInterceptor Tests', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([spaceApiInterceptor])),
        provideHttpClientTesting(),
        {
          provide: ENVIRONMENT_CONFIG,
          useValue: {
            nasaApiKey: 'TEST_KEY_123',
            issApiUrl: 'https://api.wheretheiss.at/v1/satellites/25544',
            nasaApodUrl: 'https://api.nasa.gov/planetary/apod',
            nasaMarsUrl: 'https://api.nasa.gov/mars-photos/api/v1/rovers',
            spaceDevsLaunchesUrl: 'https://lldev.thespacedevs.com/2.2.0/launch/upcoming',
            nasaNeoUrl: 'https://api.nasa.gov/neo/rest/v1/feed'
          }
        }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Inyecta automáticamente la API key de NASA en URLs de api.nasa.gov', () => {
    http.get('https://api.nasa.gov/planetary/apod').subscribe();

    const req = httpMock.expectOne(r => r.url.includes('api.nasa.gov'));
    expect(req.request.params.get('api_key')).toBe('TEST_KEY_123');
    req.flush({});
  });

  it('No inyecta API key en endpoints no pertenecientes a NASA', () => {
    http.get('https://api.wheretheiss.at/v1/satellites/25544').subscribe();

    const req = httpMock.expectOne('https://api.wheretheiss.at/v1/satellites/25544');
    expect(req.request.params.has('api_key')).toBeFalse();
    req.flush({});
  });
});
