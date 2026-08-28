import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { defaultRedirectGuard } from './core/guards/default-redirect.guard';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  // Public IAM routes
  {
    path: 'iam/login',
    loadComponent: () => import('./features/iam/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'iam/register',
    loadComponent: () => import('./features/iam/pages/register/register.component').then(m => m.RegisterComponent)
  },

  // Authenticated SPA shell with MainLayout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'iam/dashboard'
      },
      {
        path: 'iam/dashboard',
        loadComponent: () => import('./features/iam/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'iam/profile',
        loadComponent: () => import('./features/iam/pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'spaces',
        loadComponent: () => import('./features/spaces/pages/space-list/space-list.component').then(m => m.SpaceListComponent)
      },
      {
        path: 'spaces/new',
        loadComponent: () => import('./features/spaces/pages/space-form/space-form.component').then(m => m.SpaceFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['Homeowner'] }
      },
      {
        path: 'spaces/:id/edit',
        loadComponent: () => import('./features/spaces/pages/space-form/space-form.component').then(m => m.SpaceFormComponent),
        canActivate: [roleGuard],
        data: { roles: ['Homeowner'] }
      },
      {
        path: 'spaces/:id',
        loadComponent: () => import('./features/spaces/pages/space-detail/space-detail.component').then(m => m.SpaceDetailComponent)
      },
      {
        path: 'iot',
        loadComponent: () => import('./features/iot/pages/device-list/device-list.component').then(m => m.DeviceListComponent)
      },
      {
        path: 'iot/tracking',
        loadComponent: () => import('./features/iot/pages/tracking/tracking.component').then(m => m.TrackingComponent)
      },
      {
        path: 'iot/dashboard',
        loadComponent: () => import('./features/iot/pages/monitoring-dashboard/monitoring-dashboard.component').then(m => m.MonitoringDashboardComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/pages/task-board/task-board.component').then(m => m.TaskBoardComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/pages/notification-list/notification-list.component').then(m => m.NotificationListComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    canActivate: [defaultRedirectGuard],
    children: []
  }
];
