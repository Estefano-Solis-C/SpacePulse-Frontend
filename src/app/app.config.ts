import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

// Dependency Injection Tokens & Implementations
import { USER_REPOSITORY_TOKEN } from './features/iam/domain/repositories/user.tokens';
import { UserService } from './features/iam/services/user.service';
import { SPACE_REPOSITORY_TOKEN } from './features/spaces/domain/repositories/space.tokens';
import { SpaceService } from './features/spaces/services/space.service';
import { IOT_REPOSITORY_TOKEN } from './features/iot/domain/repositories/iot.tokens';
import { IoTService } from './features/iot/services/iot.service';
import { TASK_REPOSITORY_TOKEN } from './features/tasks/domain/repositories/task.tokens';
import { TaskService } from './features/tasks/services/task.service';
import { NOTIFICATION_REPOSITORY_TOKEN } from './features/notifications/domain/repositories/notification.tokens';
import { AppNotificationService } from './features/notifications/services/app-notification.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    // Repositories binding
    { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
    { provide: SPACE_REPOSITORY_TOKEN, useClass: SpaceService },
    { provide: IOT_REPOSITORY_TOKEN, useClass: IoTService },
    { provide: TASK_REPOSITORY_TOKEN, useClass: TaskService },
    { provide: NOTIFICATION_REPOSITORY_TOKEN, useClass: AppNotificationService }
  ]
};
