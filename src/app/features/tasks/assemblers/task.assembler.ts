import { WorkItemDto } from '../models/task.dto';
import { TaskModel, TaskStatus } from '../models/task.model';

export class TaskAssembler {
  static toModel(dto: WorkItemDto): TaskModel {
    return {
      id: dto.id,
      spaceId: dto.spaceId,
      createdByUserId: dto.createdByUserId,
      title: dto.title,
      description: dto.description,
      photoUrl: dto.photoUrl,
      plannedStartDate: dto.plannedStartDate,
      plannedEndDate: dto.plannedEndDate,
      price: dto.price || 0,
      status: (dto.status as TaskStatus) || 'PENDING',
      createdAt: dto.createdAt,
      completedAt: dto.completedAt
    };
  }

  static toModelList(dtos: WorkItemDto[]): TaskModel[] {
    return (dtos || []).map(dto => this.toModel(dto));
  }
}
