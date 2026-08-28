import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationModel } from '../../models/notification.model';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NOTIFICATION_REPOSITORY_TOKEN } from '../../domain/repositories/notification.tokens';

@Injectable({ providedIn: 'root' })
export class GetNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_TOKEN) private notificationRepository: NotificationRepository
  ) {}

  execute(): Observable<NotificationModel[]> {
    return this.notificationRepository.getUserNotifications();
  }
}
