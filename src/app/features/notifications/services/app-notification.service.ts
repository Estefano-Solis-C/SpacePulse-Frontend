import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NotificationRepository } from '../domain/repositories/notification.repository';
import { NotificationModel } from '../models/notification.model';
import { NotificationDto } from '../models/notification.dto';
import { NotificationAssembler } from '../assemblers/notification.assembler';

@Injectable({ providedIn: 'root' })
export class AppNotificationService implements NotificationRepository {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/monitoring/notifications`;

  notifications = signal<NotificationModel[]>([]);
  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  getUserNotifications(): Observable<NotificationModel[]> {
    return this.http.get<NotificationDto[]>(`${this.endpoint}/user`).pipe(
      map(dtos => NotificationAssembler.toModelList(dtos)),
      tap(models => this.notifications.set(models))
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${id}/read`, {}).pipe(
      tap(() => {
        const updated = this.notifications().map(n => n.id === id ? { ...n, isRead: true } : n);
        this.notifications.set(updated);
      })
    );
  }
}
