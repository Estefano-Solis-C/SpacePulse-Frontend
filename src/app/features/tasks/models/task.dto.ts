export interface CreateTaskRequestDto {
  spaceId: number;
  title: string;
  description: string;
  photoUrl?: string;
}

export interface CreateTaskPlanDto {
  spaceId: number;
  title: string;
  description: string;
  photoUrl?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  price?: number;
}

export interface UpdateTaskProgressDto {
  status?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  price?: number;
}

export interface UpdateTaskContentDto {
  title?: string;
  description?: string;
  photoUrl?: string;
}

export interface WorkItemDto {
  id: number;
  spaceId: number;
  createdByUserId: string;
  title: string;
  description: string;
  photoUrl?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  price: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}
