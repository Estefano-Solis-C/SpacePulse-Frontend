import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.tokens';

@Injectable({ providedIn: 'root' })
export class GetUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: UserRepository
  ) {}

  execute(userId: string): Observable<UserModel> {
    return this.userRepository.getById(userId);
  }
}
