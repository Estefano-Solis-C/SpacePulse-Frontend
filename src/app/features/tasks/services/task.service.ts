import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TaskRepository } from '../domain/repositories/task.repository';
import { TaskModel } from '../models/task.model';
import { CreateTaskRequestDto, CreateTaskPlanDto, UpdateTaskProgressDto, UpdateTaskContentDto, WorkItemDto } from '../models/task.dto';
import { TaskAssembler } from '../assemblers/task.assembler';

@Injectable({ providedIn: 'root' })
export class TaskService implements TaskRepository {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/monitoring/tasks`;

  getById(id: number): Observable<TaskModel> {
    return this.http.get<WorkItemDto>(`${this.endpoint}/${id}`).pipe(
      map(dto => TaskAssembler.toModel(dto))
    );
  }

  getBySpaceId(spaceId: number): Observable<TaskModel[]> {
    return this.http.get<WorkItemDto[]>(`${this.endpoint}/space/${spaceId}`).pipe(
      map(dtos => TaskAssembler.toModelList(dtos))
    );
  }

  getMyTasks(): Observable<TaskModel[]> {
    return this.http.get<WorkItemDto[]>(`${this.endpoint}/my-tasks`).pipe(
      map(dtos => TaskAssembler.toModelList(dtos))
    );
  }

  createTaskRequest(dto: CreateTaskRequestDto): Observable<TaskModel> {
    return this.http.post<WorkItemDto>(`${this.endpoint}/request`, dto).pipe(
      map(res => TaskAssembler.toModel(res))
    );
  }

  createTaskPlan(dto: CreateTaskPlanDto): Observable<TaskModel> {
    return this.http.post<WorkItemDto>(`${this.endpoint}/plan`, dto).pipe(
      map(res => TaskAssembler.toModel(res))
    );
  }

  updateProgress(id: number, dto: UpdateTaskProgressDto): Observable<TaskModel> {
    return this.http.put<WorkItemDto>(`${this.endpoint}/${id}/progress`, dto).pipe(
      map(res => TaskAssembler.toModel(res))
    );
  }

  updateContent(id: number, dto: UpdateTaskContentDto): Observable<TaskModel> {
    return this.http.put<WorkItemDto>(`${this.endpoint}/${id}/content`, dto).pipe(
      map(res => TaskAssembler.toModel(res))
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
