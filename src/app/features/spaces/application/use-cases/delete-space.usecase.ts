import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpaceRepository } from '../../domain/repositories/space.repository';
import { SPACE_REPOSITORY_TOKEN } from '../../domain/repositories/space.tokens';

@Injectable({ providedIn: 'root' })
export class DeleteSpaceUseCase {
  constructor(
    @Inject(SPACE_REPOSITORY_TOKEN) private spaceRepository: SpaceRepository
  ) {}

  execute(id: string): Observable<void> {
    return this.spaceRepository.delete(id);
  }
}
