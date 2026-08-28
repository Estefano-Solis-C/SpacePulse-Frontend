import { UserDto, PaymentMethodDto, LoginResponseDto } from '../models/user.dto';
import { UserModel, PaymentMethodModel, UserRole, AuthSessionModel } from '../models/user.model';

export class UserAssembler {
  static toPaymentMethodModel(dto: PaymentMethodDto): PaymentMethodModel {
    const rawNumber = dto.number || '0000000000000000';
    const last4 = rawNumber.slice(-4);
    return {
      id: dto.id,
      userId: dto.userId,
      type: dto.type,
      maskedNumber: `•••• •••• •••• ${last4}`,
      expiry: dto.expiry
    };
  }

  static toModel(dto: UserDto): UserModel {
    return {
      id: dto.id,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      role: (dto.role as UserRole) || 'Homeowner',
      photo: dto.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      paymentMethods: (dto.paymentMethods || []).map(pm => this.toPaymentMethodModel(pm))
    };
  }

  static fromLoginResponse(dto: LoginResponseDto): AuthSessionModel {
    return {
      token: dto.token,
      user: {
        id: dto.id,
        fullName: dto.fullName,
        email: dto.email,
        phone: '',
        role: (dto.role as UserRole) || 'Homeowner',
        photo: dto.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        paymentMethods: []
      }
    };
  }

  static toModelList(dtos: UserDto[]): UserModel[] {
    return (dtos || []).map(dto => this.toModel(dto));
  }
}
