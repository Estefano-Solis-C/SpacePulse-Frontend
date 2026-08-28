import { Observable } from 'rxjs';
import { TaskModel } from '../../models/task.model';
import { CreateTaskRequestDto, CreateTaskPlanDto, UpdateTaskProgressDto, UpdateTaskContentDto } from '../../models/task.dto';

export interface TaskRepository {
  getById(id: number): Observable<TaskModel>;
  getBySpaceId(spaceId: number): Observable<TaskModel[]>;
  getMyTasks(): Observable<TaskModel[]>;
  createTaskRequest(dto: CreateTaskRequestDto): Observable<TaskModel>;
  createTaskPlan(dto: CreateTaskPlanDto): Observable<TaskModel>;
  updateProgress(id: number, dto: UpdateTaskProgressDto): Observable<TaskModel>;
  updateContent(id: number, dto: UpdateTaskContentDto): Observable<TaskModel>;
  deleteTask(id: number): Observable<void>;
}
