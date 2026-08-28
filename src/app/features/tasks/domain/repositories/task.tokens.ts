import { InjectionToken } from '@angular/core';
import { TaskRepository } from './task.repository';

export const TASK_REPOSITORY_TOKEN = new InjectionToken<TaskRepository>('TASK_REPOSITORY_TOKEN');
