import { NotificationDto } from '../models/notification.dto';
import { NotificationModel } from '../models/notification.model';

export class NotificationAssembler {
  static toModel(dto: NotificationDto): NotificationModel {
    return {
      id: dto.id,
      spaceId: dto.spaceId,
      title: dto.title,
      message: dto.message,
      isRead: dto.isRead,
      createdAt: dto.createdAt
    };
  }

  static toModelList(dtos: NotificationDto[]): NotificationModel[] {
    return (dtos || []).map(dto => this.toModel(dto));
  }
}
