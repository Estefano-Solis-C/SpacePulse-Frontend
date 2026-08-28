import { Observable } from 'rxjs';
import { UserModel, AuthSessionModel } from '../../models/user.model';
import { LoginRequestDto, RegisterUserDto, AddPaymentMethodDto } from '../../models/user.dto';

export interface UserRepository {
  login(dto: LoginRequestDto): Observable<AuthSessionModel>;
  register(dto: RegisterUserDto): Observable<UserModel>;
  getById(userId: string): Observable<UserModel>;
  addPaymentMethod(userId: string, dto: AddPaymentMethodDto): Observable<UserModel>;
}
