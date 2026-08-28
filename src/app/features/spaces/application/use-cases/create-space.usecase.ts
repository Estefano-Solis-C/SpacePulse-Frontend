import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSpaceDto } from '../../models/space.dto';
import { SpaceModel } from '../../models/space.model';
import { SpaceRepository } from '../../domain/repositories/space.repository';
import { SPACE_REPOSITORY_TOKEN } from '../../domain/repositories/space.tokens';

@Injectable({ providedIn: 'root' })
export class CreateSpaceUseCase {
  constructor(
    @Inject(SPACE_REPOSITORY_TOKEN) private spaceRepository: SpaceRepository
  ) {}

  execute(dto: CreateSpaceDto): Observable<SpaceModel> {
    return this.spaceRepository.create(dto);
  }
}
