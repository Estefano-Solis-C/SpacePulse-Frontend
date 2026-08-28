import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserModel, UserRole, AuthSessionModel } from '../models/user.model';
import { LoginRequestDto, RegisterUserDto } from '../models/user.dto';
import { LoginUseCase } from '../application/use-cases/login.usecase';
import { RegisterUseCase } from '../application/use-cases/register.usecase';
import { GetUserProfileUseCase } from '../application/use-cases/get-user-profile.usecase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private loginUseCase = inject(LoginUseCase);
  private registerUseCase = inject(RegisterUseCase);
  private profileUseCase = inject(GetUserProfileUseCase);

  private readonly TOKEN_KEY = 'spacepulse_jwt_token';
  private readonly USER_KEY = 'spacepulse_user';

  currentUser = signal<UserModel | null>(this.loadUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed<UserRole | null>(() => this.currentUser()?.role || null);
  userId = computed<string | null>(() => this.currentUser()?.id || null);

  private loadUserFromStorage(): UserModel | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  login(credentials: LoginRequestDto): Observable<AuthSessionModel> {
    return this.loginUseCase.execute(credentials).pipe(
      tap(session => {
        localStorage.setItem(this.TOKEN_KEY, session.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(session.user));
        this.currentUser.set(session.user);
      })
    );
  }

  register(userData: RegisterUserDto): Observable<UserModel> {
    return this.registerUseCase.execute(userData);
  }

  refreshProfile(): void {
    const id = this.userId();
    if (!id) return;

    this.profileUseCase.execute(id).subscribe({
      next: (user) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      }
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/iam/login']);
  }
}
