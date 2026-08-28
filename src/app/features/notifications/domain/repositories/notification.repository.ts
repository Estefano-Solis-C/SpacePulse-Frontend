import { Observable } from 'rxjs';
import { NotificationModel } from '../../models/notification.model';

export interface NotificationRepository {
  getUserNotifications(): Observable<NotificationModel[]>;
  markAsRead(id: number): Observable<void>;
}
