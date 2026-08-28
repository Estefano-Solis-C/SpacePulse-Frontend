import { InjectionToken } from '@angular/core';
import { SpaceRepository } from './space.repository';

export const SPACE_REPOSITORY_TOKEN = new InjectionToken<SpaceRepository>('SPACE_REPOSITORY_TOKEN');
