import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterUserDto } from '../../models/user.dto';
import { UserModel } from '../../models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.tokens';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: UserRepository
  ) {}

  execute(userData: RegisterUserDto): Observable<UserModel> {
    return this.userRepository.register(userData);
  }
}
