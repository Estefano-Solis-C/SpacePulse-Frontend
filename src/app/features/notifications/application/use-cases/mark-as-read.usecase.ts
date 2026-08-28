import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NOTIFICATION_REPOSITORY_TOKEN } from '../../domain/repositories/notification.tokens';

@Injectable({ providedIn: 'root' })
export class MarkAsReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_TOKEN) private notificationRepository: NotificationRepository
  ) {}

  execute(id: number): Observable<void> {
    return this.notificationRepository.markAsRead(id);
  }
}
