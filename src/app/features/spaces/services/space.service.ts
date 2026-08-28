import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SpaceRepository } from '../domain/repositories/space.repository';
import { SpaceModel } from '../models/space.model';
import { CreateSpaceDto, UpdateSpaceDto, SpaceDto } from '../models/space.dto';
import { SpaceAssembler } from '../assemblers/space.assembler';

@Injectable({ providedIn: 'root' })
export class SpaceService implements SpaceRepository {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/space`;

  getAll(): Observable<SpaceModel[]> {
    return this.http.get<SpaceDto[]>(this.endpoint).pipe(
      map(dtos => SpaceAssembler.toModelList(dtos))
    );
  }

  getById(id: string): Observable<SpaceModel> {
    return this.http.get<SpaceDto>(`${this.endpoint}/${id}`).pipe(
      map(dto => SpaceAssembler.toModel(dto))
    );
  }

  getByUserId(userId: string): Observable<SpaceModel[]> {
    return this.http.get<SpaceDto[]>(`${this.endpoint}/user/${userId}`).pipe(
      map(dtos => SpaceAssembler.toModelList(dtos))
    );
  }

  getMySpaces(): Observable<SpaceModel[]> {
    return this.http.get<SpaceDto[]>(`${this.endpoint}/my-spaces`).pipe(
      map(dtos => SpaceAssembler.toModelList(dtos))
    );
  }

  create(dto: CreateSpaceDto): Observable<SpaceModel> {
    return this.http.post<SpaceDto>(this.endpoint, dto).pipe(
      map(res => SpaceAssembler.toModel(res))
    );
  }

  update(id: string, dto: UpdateSpaceDto): Observable<SpaceModel> {
    return this.http.put<SpaceDto>(`${this.endpoint}/${id}`, dto).pipe(
      map(res => SpaceAssembler.toModel(res))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  accept(id: string): Observable<SpaceModel> {
    return this.http.post<{ message: string, data: SpaceDto }>(`${this.endpoint}/${id}/accept`, {}).pipe(
      map(res => SpaceAssembler.toModel(res.data || (res as unknown as SpaceDto)))
    );
  }

  cancel(id: string): Observable<SpaceModel> {
    return this.http.put<{ message: string, data: SpaceDto }>(`${this.endpoint}/${id}/cancel`, {}).pipe(
      map(res => SpaceAssembler.toModel(res.data || (res as unknown as SpaceDto)))
    );
  }

  complete(id: string): Observable<SpaceModel> {
    return this.http.put<{ message: string, data: SpaceDto }>(`${this.endpoint}/${id}/complete`, {}).pipe(
      map(res => SpaceAssembler.toModel(res.data || (res as unknown as SpaceDto)))
    );
  }
}
