export interface User {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: 'ADMIN' | 'MANAGER' | 'CLIENT' | 'Homeowner' | 'Remodeler';
  readonly avatarUrl?: string;
  readonly token?: string;
}

export interface Space {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly capacity: number;
  readonly location: string;
  readonly imageUrl: string;
  readonly activeDevicesCount: number;
  readonly createdAt: Date;
}

export interface IotDevice {
  readonly id: string;
  readonly name: string;
  readonly deviceType: 'TEMPERATURE' | 'HUMIDITY' | 'ENERGY' | 'OCCUPANCY' | 'AIR_QUALITY' | 'VOLTAGE' | 'LOAD' | 'OTHER' | 'OTHERS';
  readonly serialNumber: string;
  readonly spaceId: string;
  readonly status: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'CRITICAL';
  readonly lastHeartbeat: Date;
}

export interface TelemetryRecord {
  readonly id: string;
  readonly deviceId: string;
  readonly metricType: string;
  readonly value: number;
  readonly unit: string;
  readonly timestamp: Date;
}

export interface FacilityTask {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readonly status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  readonly spaceId: string;
  readonly spaceName?: string;
  readonly assignedTo?: string;
  readonly createdAt: Date;
}

export interface AppNotification {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly type: 'INFO' | 'WARNING' | 'ALERT' | 'TASK';
  readonly isRead: boolean;
  readonly relatedDeviceId?: string;
  readonly timestamp: Date;
}

export interface PaymentMethod {
  readonly id: string;
  readonly cardHolder: string;
  readonly lastFourDigits: string;
  readonly brand: 'VISA' | 'MASTERCARD' | 'AMEX';
  readonly expirationMonth: number;
  readonly expirationYear: number;
  readonly isDefault: boolean;
}
