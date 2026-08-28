import { InjectionToken } from '@angular/core';
import { IoTRepository } from './iot.repository';

export const IOT_REPOSITORY_TOKEN = new InjectionToken<IoTRepository>('IOT_REPOSITORY_TOKEN');
