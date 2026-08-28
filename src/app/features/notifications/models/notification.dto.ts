export interface NotificationDto {
  id: number;
  spaceId?: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
