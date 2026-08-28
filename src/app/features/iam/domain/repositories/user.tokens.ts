import { InjectionToken } from '@angular/core';
import { UserRepository } from './user.repository';

export const USER_REPOSITORY_TOKEN = new InjectionToken<UserRepository>('USER_REPOSITORY_TOKEN');
