import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpaceModel } from '../../models/space.model';
import { SpaceRepository } from '../../domain/repositories/space.repository';
import { SPACE_REPOSITORY_TOKEN } from '../../domain/repositories/space.tokens';

@Injectable({ providedIn: 'root' })
export class GetSpacesByUserUseCase {
  constructor(
    @Inject(SPACE_REPOSITORY_TOKEN) private spaceRepository: SpaceRepository
  ) {}

  execute(userId?: string): Observable<SpaceModel[]> {
    if (userId) {
      return this.spaceRepository.getByUserId(userId);
    }
    return this.spaceRepository.getMySpaces();
  }
}
