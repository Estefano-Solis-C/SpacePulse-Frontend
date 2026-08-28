export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TaskModel {
  id: number;
  spaceId: number;
  createdByUserId: string;
  title: string;
  description: string;
  photoUrl?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  price: number;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}
