export interface NotificationModel {
  id: number;
  spaceId?: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
