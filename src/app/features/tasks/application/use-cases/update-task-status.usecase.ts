import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateTaskProgressDto } from '../../models/task.dto';
import { TaskModel } from '../../models/task.model';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TASK_REPOSITORY_TOKEN } from '../../domain/repositories/task.tokens';

@Injectable({ providedIn: 'root' })
export class UpdateTaskStatusUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: TaskRepository
  ) {}

  execute(id: number, dto: UpdateTaskProgressDto): Observable<TaskModel> {
    return this.taskRepository.updateProgress(id, dto);
  }
}
