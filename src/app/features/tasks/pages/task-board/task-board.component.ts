import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { TaskService } from '../../services/task.service';
import { TaskModel } from '../../models/task.model';
import { AuthService } from '../../../iam/services/auth.service';
import { GetSpacesUseCase } from '../../../spaces/application/use-cases/get-spaces.usecase';
import { SpaceModel } from '../../../spaces/models/space.model';
import { ToastService } from '../../../../shared/infrastructure/notification/toast.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <h1>
            <mat-icon>assignment</mat-icon>
            {{ 'TASKS.TITLE' | translate }}
          </h1>
          <p>Maintenance tasks, work planning, and execution board</p>
        </div>

        <div class="header-actions">
          <button mat-flat-button color="primary" (click)="showForm = !showForm">
            <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon>
            {{ authService.userRole() === 'Homeowner' ? ('TASKS.CREATE_REQUEST' | translate) : ('TASKS.CREATE_PLAN' | translate) }}
          </button>
        </div>
      </div>

      <!-- Creation Form Box -->
      @if (showForm) {
        <mat-card class="form-card mb-4">
          <mat-card-header>
            <mat-card-title>
              {{ authService.userRole() === 'Homeowner' ? 'Submit Maintenance Request' : 'Create Task Work Plan' }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="taskForm" (ngSubmit)="onSubmitTask()" class="task-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Target Property</mat-label>
                  <mat-select formControlName="spaceId">
                    @for (s of spaces(); track s.id) {
                      <mat-option [value]="s.id">{{ s.title }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'TASKS.TASK_TITLE' | translate }}</mat-label>
                  <input matInput formControlName="title" placeholder="Fix HVAC Filter" />
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'TASKS.TASK_DESC' | translate }}</mat-label>
                <textarea matInput formControlName="description" rows="2" placeholder="Describe the issue or scope of work..."></textarea>
              </mat-form-field>

              @if (authService.userRole() === 'Remodeler') {
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>{{ 'TASKS.PRICE' | translate }}</mat-label>
                    <input matInput type="number" formControlName="price" placeholder="250" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>{{ 'TASKS.START_DATE' | translate }}</mat-label>
                    <input matInput type="date" formControlName="plannedStartDate" />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>{{ 'TASKS.END_DATE' | translate }}</mat-label>
                    <input matInput type="date" formControlName="plannedEndDate" />
                  </mat-form-field>
                </div>
              }

              <div class="form-actions">
                <button mat-flat-button color="primary" type="submit" [disabled]="taskForm.invalid || isSubmitting">
                  <mat-icon>save</mat-icon>
                  Save Task
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      <!-- Kanban Column Board -->
      <div class="kanban-board">
        <!-- PENDING COLUMN -->
        <div class="kanban-col">
          <div class="col-header pending-col">
            <span class="col-title">Pending Requests</span>
            <span class="count-badge">{{ pendingTasks().length }}</span>
          </div>

          <div class="col-content">
            @for (t of pendingTasks(); track t.id) {
              <mat-card class="task-card">
                <div class="task-top">
                  <h4>{{ t.title }}</h4>
                  @if (authService.userRole() === 'Remodeler') {
                    <button mat-icon-button color="primary" (click)="updateStatus(t.id, 'IN_PROGRESS')">
                      <mat-icon>play_arrow</mat-icon>
                    </button>
                  }
                </div>
                <p class="task-desc">{{ t.description }}</p>
                <div class="task-footer">
                  <span class="task-date">{{ t.createdAt | date:'shortDate' }}</span>
                  <span class="badge badge-warning">Pending</span>
                </div>
              </mat-card>
            } @empty {
              <div class="empty-col">No pending items</div>
            }
          </div>
        </div>

        <!-- IN PROGRESS COLUMN -->
        <div class="kanban-col">
          <div class="col-header in-progress-col">
            <span class="col-title">In Progress</span>
            <span class="count-badge">{{ inProgressTasks().length }}</span>
          </div>

          <div class="col-content">
            @for (t of inProgressTasks(); track t.id) {
              <mat-card class="task-card">
                <div class="task-top">
                  <h4>{{ t.title }}</h4>
                  @if (authService.userRole() === 'Remodeler') {
                    <button mat-icon-button color="primary" (click)="updateStatus(t.id, 'COMPLETED')">
                      <mat-icon>check</mat-icon>
                    </button>
                  }
                </div>
                <p class="task-desc">{{ t.description }}</p>
                <div class="task-footer">
                  <span class="task-date">Cost: \&#36;{{ t.price }}</span>
                  <span class="badge badge-info">In Progress</span>
                </div>
              </mat-card>
            } @empty {
              <div class="empty-col">No tasks in progress</div>
            }
          </div>
        </div>

        <!-- COMPLETED COLUMN -->
        <div class="kanban-col">
          <div class="col-header completed-col">
            <span class="col-title">Completed</span>
            <span class="count-badge">{{ completedTasks().length }}</span>
          </div>

          <div class="col-content">
            @for (t of completedTasks(); track t.id) {
              <mat-card class="task-card">
                <div class="task-top">
                  <h4>{{ t.title }}</h4>
                  <mat-icon class="text-success">verified</mat-icon>
                </div>
                <p class="task-desc">{{ t.description }}</p>
                <div class="task-footer">
                  <span class="task-date">{{ t.completedAt ? (t.completedAt | date:'shortDate') : 'Done' }}</span>
                  <span class="badge badge-success">Completed</span>
                </div>
              </mat-card>
            } @empty {
              <div class="empty-col">No completed items</div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-4 { margin-bottom: 24px; }
    .form-card {
      border-radius: 16px;
      padding: 24px;
      background: white;
      border: 1px solid #e2e8f0;
    }
    .task-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      mat-form-field { flex: 1; }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    .kanban-board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    @media (max-width: 900px) {
      .kanban-board { grid-template-columns: 1fr; }
    }
    .kanban-col {
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      min-height: 500px;
    }
    .col-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;

      .col-title {
        font-weight: 800;
        font-size: 0.95rem;
        color: #0f172a;
      }
      .count-badge {
        background: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.8rem;
      }

      &.pending-col { border-top: 4px solid #f59e0b; }
      &.in-progress-col { border-top: 4px solid #3b82f6; }
      &.completed-col { border-top: 4px solid #10b981; }
    }
    .col-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }
    .task-card {
      border-radius: 12px;
      padding: 16px;
      background: white;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);

      .task-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        h4 {
          margin: 0;
          font-weight: 700;
          font-size: 0.95rem;
          color: #0f172a;
        }
      }
      .task-desc {
        font-size: 0.85rem;
        color: #64748b;
        margin: 0 0 12px 0;
      }
      .task-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .task-date {
          font-size: 0.75rem;
          color: #94a3b8;
        }
      }
    }
    .empty-col {
      text-align: center;
      padding: 40px 10px;
      color: #94a3b8;
      font-size: 0.85rem;
      font-style: italic;
    }
    .text-success { color: #16a34a; }
  `]
})
export class TaskBoardComponent implements OnInit {
  authService = inject(AuthService);
  private taskService = inject(TaskService);
  private spacesUseCase = inject(GetSpacesUseCase);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  tasks = signal<TaskModel[]>([]);
  spaces = signal<SpaceModel[]>([]);
  showForm = false;
  isSubmitting = false;

  pendingTasks = signal<TaskModel[]>([]);
  inProgressTasks = signal<TaskModel[]>([]);
  completedTasks = signal<TaskModel[]>([]);

  taskForm: FormGroup = this.fb.group({
    spaceId: [null, Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [150],
    plannedStartDate: [''],
    plannedEndDate: ['']
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.spacesUseCase.execute().subscribe({
      next: (spaces) => {
        this.spaces.set(spaces);
        if (spaces.length > 0) {
          this.taskForm.patchValue({ spaceId: Number(spaces[0].id) });
        }
      }
    });

    const spaceId = this.route.snapshot.queryParams['spaceId'];
    if (spaceId) {
      this.taskService.getBySpaceId(Number(spaceId)).subscribe({
        next: (tasks) => this.categorize(tasks)
      });
    } else {
      this.taskService.getMyTasks().subscribe({
        next: (tasks) => this.categorize(tasks)
      });
    }
  }

  categorize(tasks: TaskModel[]): void {
    this.tasks.set(tasks);
    this.pendingTasks.set(tasks.filter(t => t.status === 'PENDING'));
    this.inProgressTasks.set(tasks.filter(t => t.status === 'IN_PROGRESS'));
    this.completedTasks.set(tasks.filter(t => t.status === 'COMPLETED'));
  }

  onSubmitTask(): void {
    if (this.taskForm.invalid) return;

    this.isSubmitting = true;
    const isHomeowner = this.authService.userRole() === 'Homeowner';

    const req$ = isHomeowner
      ? this.taskService.createTaskRequest({
          spaceId: this.taskForm.value.spaceId,
          title: this.taskForm.value.title,
          description: this.taskForm.value.description
        })
      : this.taskService.createTaskPlan(this.taskForm.value);

    req$.subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.toast.success('Task created successfully!');
        this.showForm = false;
        this.categorize([...this.tasks(), created]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.error?.error || 'Failed to create task.');
      }
    });
  }

  updateStatus(taskId: number, newStatus: string): void {
    this.taskService.updateProgress(taskId, { status: newStatus }).subscribe({
      next: (updated) => {
        this.toast.success(`Task status updated to ${newStatus}`);
        const list = this.tasks().map(t => t.id === taskId ? updated : t);
        this.categorize(list);
      },
      error: (err) => this.toast.error(err.error?.error || 'Failed to update task status.')
    });
  }
}
