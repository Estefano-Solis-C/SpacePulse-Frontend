import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddPaymentMethodDto } from '../../models/user.dto';
import { UserModel } from '../../models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.tokens';

@Injectable({ providedIn: 'root' })
export class AddPaymentMethodUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: UserRepository
  ) {}

  execute(userId: string, paymentData: AddPaymentMethodDto): Observable<UserModel> {
    return this.userRepository.addPaymentMethod(userId, paymentData);
  }
}
