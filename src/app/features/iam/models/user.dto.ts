export interface PaymentMethodDto {
  id: number;
  userId: string;
  type: string;
  number: string;
  expiry: string;
  cvv: string;
}

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  photo?: string;
  paymentMethods?: PaymentMethodDto[];
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  id: string;
  fullName: string;
  email: string;
  role: string;
  photo?: string;
}

export interface RegisterUserDto {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  photo?: string;
}

export interface AddPaymentMethodDto {
  type: string;
  number: string;
  expiry: string;
  cvv: string;
}
