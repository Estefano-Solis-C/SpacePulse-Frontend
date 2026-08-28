import { InjectionToken } from '@angular/core';

export interface EnvironmentConfig {
  nasaApiKey: string;
  issApiUrl: string;
  nasaApodUrl: string;
  nasaMarsUrl: string;
  spaceDevsLaunchesUrl: string;
  nasaNeoUrl: string;
}

export const ENVIRONMENT_CONFIG = new InjectionToken<EnvironmentConfig>('ENVIRONMENT_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    nasaApiKey: 'DEMO_KEY',
    issApiUrl: 'https://api.wheretheiss.at/v1/satellites/25544',
    nasaApodUrl: 'https://api.nasa.gov/planetary/apod',
    nasaMarsUrl: 'https://api.nasa.gov/mars-photos/api/v1/rovers',
    spaceDevsLaunchesUrl: 'https://lldev.thespacedevs.com/2.2.0/launch/upcoming',
    nasaNeoUrl: 'https://api.nasa.gov/neo/rest/v1/feed'
  })
});
