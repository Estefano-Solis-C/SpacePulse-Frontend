import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTaskRequestDto, CreateTaskPlanDto } from '../../models/task.dto';
import { TaskModel } from '../../models/task.model';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TASK_REPOSITORY_TOKEN } from '../../domain/repositories/task.tokens';

@Injectable({ providedIn: 'root' })
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: TaskRepository
  ) {}

  createRequest(dto: CreateTaskRequestDto): Observable<TaskModel> {
    return this.taskRepository.createTaskRequest(dto);
  }

  createPlan(dto: CreateTaskPlanDto): Observable<TaskModel> {
    return this.taskRepository.createTaskPlan(dto);
  }
}
