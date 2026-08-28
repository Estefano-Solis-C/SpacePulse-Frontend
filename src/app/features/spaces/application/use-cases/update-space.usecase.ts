import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateSpaceDto } from '../../models/space.dto';
import { SpaceModel } from '../../models/space.model';
import { SpaceRepository } from '../../domain/repositories/space.repository';
import { SPACE_REPOSITORY_TOKEN } from '../../domain/repositories/space.tokens';

@Injectable({ providedIn: 'root' })
export class UpdateSpaceUseCase {
  constructor(
    @Inject(SPACE_REPOSITORY_TOKEN) private spaceRepository: SpaceRepository
  ) {}

  execute(id: string, dto: UpdateSpaceDto): Observable<SpaceModel> {
    return this.spaceRepository.update(id, dto);
  }
}
