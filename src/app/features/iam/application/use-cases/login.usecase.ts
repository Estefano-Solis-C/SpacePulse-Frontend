import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequestDto } from '../../models/user.dto';
import { AuthSessionModel } from '../../models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.tokens';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: UserRepository
  ) {}

  execute(credentials: LoginRequestDto): Observable<AuthSessionModel> {
    return this.userRepository.login(credentials);
  }
}
