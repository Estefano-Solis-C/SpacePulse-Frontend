import { Observable } from 'rxjs';
import { SpaceModel } from '../../models/space.model';
import { CreateSpaceDto, UpdateSpaceDto } from '../../models/space.dto';

export interface SpaceRepository {
  getAll(): Observable<SpaceModel[]>;
  getById(id: string): Observable<SpaceModel>;
  getByUserId(userId: string): Observable<SpaceModel[]>;
  getMySpaces(): Observable<SpaceModel[]>;
  create(dto: CreateSpaceDto): Observable<SpaceModel>;
  update(id: string, dto: UpdateSpaceDto): Observable<SpaceModel>;
  delete(id: string): Observable<void>;
  accept(id: string): Observable<SpaceModel>;
  cancel(id: string): Observable<SpaceModel>;
  complete(id: string): Observable<SpaceModel>;
}
