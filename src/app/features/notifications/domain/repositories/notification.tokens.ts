import { InjectionToken } from '@angular/core';
import { NotificationRepository } from './notification.repository';

export const NOTIFICATION_REPOSITORY_TOKEN = new InjectionToken<NotificationRepository>('NOTIFICATION_REPOSITORY_TOKEN');
