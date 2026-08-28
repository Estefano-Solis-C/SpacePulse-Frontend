export type UserRole = 'Homeowner' | 'Remodeler';

export interface PaymentMethodModel {
  id: number;
  userId: string;
  type: string;
  maskedNumber: string;
  expiry: string;
}

export interface UserModel {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  photo: string;
  paymentMethods: PaymentMethodModel[];
}

export interface AuthSessionModel {
  token: string;
  user: UserModel;
}
