import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserModel, AuthSessionModel } from '../models/user.model';
import { LoginRequestDto, LoginResponseDto, RegisterUserDto, UserDto, AddPaymentMethodDto } from '../models/user.dto';
import { UserAssembler } from '../assemblers/user.assembler';

@Injectable({ providedIn: 'root' })
export class UserService implements UserRepository {
  private http = inject(HttpClient);
  private endpoint = `${environment.authApiUrl}/users`;

  login(dto: LoginRequestDto): Observable<AuthSessionModel> {
    return this.http.post<LoginResponseDto>(`${this.endpoint}/login`, dto).pipe(
      map(res => UserAssembler.fromLoginResponse(res))
    );
  }

  register(dto: RegisterUserDto): Observable<UserModel> {
    return this.http.post<UserDto>(`${this.endpoint}/register`, dto).pipe(
      map(res => UserAssembler.toModel(res))
    );
  }

  getById(userId: string): Observable<UserModel> {
    return this.http.get<UserDto>(`${this.endpoint}/${userId}`).pipe(
      map(res => UserAssembler.toModel(res))
    );
  }

  addPaymentMethod(userId: string, dto: AddPaymentMethodDto): Observable<UserModel> {
    return this.http.post<UserDto>(`${this.endpoint}/${userId}/payment-methods`, dto).pipe(
      map(res => UserAssembler.toModel(res))
    );
  }
}
