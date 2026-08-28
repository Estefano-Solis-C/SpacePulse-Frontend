import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../../models/task.model';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TASK_REPOSITORY_TOKEN } from '../../domain/repositories/task.tokens';

@Injectable({ providedIn: 'root' })
export class GetTasksBySpaceUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: TaskRepository
  ) {}

  execute(spaceId: number): Observable<TaskModel[]> {
    return this.taskRepository.getBySpaceId(spaceId);
  }
}
