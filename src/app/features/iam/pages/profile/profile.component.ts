import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { AddPaymentMethodUseCase } from '../../application/use-cases/add-payment-method.usecase';
import { ToastService } from '../../../../shared/infrastructure/notification/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    TranslateModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <h1>
            <mat-icon>person</mat-icon>
            {{ 'PROFILE.TITLE' | translate }}
          </h1>
          <p>Manage your personal credentials, contact info, and payment methods</p>
        </div>
      </div>

      <div class="profile-grid">
        <mat-card class="profile-card">
          <mat-card-header>
            <div class="avatar-large">
              <img [src]="authService.currentUser()?.photo" alt="Avatar" (error)="onImgError($event)" />
            </div>
            <div class="user-main-info">
              <h2>{{ authService.currentUser()?.fullName }}</h2>
              <span class="badge" [ngClass]="authService.userRole() === 'Homeowner' ? 'badge-success' : 'badge-purple'">
                {{ authService.userRole() }}
              </span>
            </div>
          </mat-card-header>

          <mat-divider></mat-divider>

          <mat-card-content class="info-details">
            <div class="info-item">
              <mat-icon>email</mat-icon>
              <div>
                <label>Email Address</label>
                <span>{{ authService.currentUser()?.email }}</span>
              </div>
            </div>

            <div class="info-item">
              <mat-icon>phone</mat-icon>
              <div>
                <label>Phone Number</label>
                <span>{{ authService.currentUser()?.phone || 'Not provided' }}</span>
              </div>
            </div>

            <div class="info-item">
              <mat-icon>fingerprint</mat-icon>
              <div>
                <label>User ID</label>
                <span class="mono">{{ authService.currentUser()?.id }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="payment-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>credit_card</mat-icon>
              {{ 'PROFILE.PAYMENT_METHODS' | translate }}
            </mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <div class="cards-list">
              @for (pm of authService.currentUser()?.paymentMethods; track pm.id) {
                <div class="credit-card-item">
                  <div class="card-chip"></div>
                  <div class="card-type">{{ pm.type }}</div>
                  <div class="card-num">{{ pm.maskedNumber }}</div>
                  <div class="card-meta">
                    <span>EXP: {{ pm.expiry }}</span>
                  </div>
                </div>
              } @empty {
                <div class="empty-cards">
                  <mat-icon>credit_card_off</mat-icon>
                  <p>No payment methods on file yet.</p>
                </div>
              }
            </div>

            <mat-divider class="my-4"></mat-divider>

            <h3>{{ 'PROFILE.ADD_CARD' | translate }}</h3>
            <form [formGroup]="cardForm" (ngSubmit)="onAddCard()" class="card-form">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'PROFILE.CARD_TYPE' | translate }}</mat-label>
                <mat-select formControlName="type">
                  <mat-option value="Visa">Visa</mat-option>
                  <mat-option value="MasterCard">MasterCard</mat-option>
                  <mat-option value="Amex">American Express</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'PROFILE.CARD_NUMBER' | translate }}</mat-label>
                <input matInput formControlName="number" placeholder="4532 8900 1234 5678" maxlength="16" />
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.EXPIRY' | translate }}</mat-label>
                  <input matInput formControlName="expiry" placeholder="12/28" maxlength="5" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.CVV' | translate }}</mat-label>
                  <input matInput formControlName="cvv" placeholder="123" maxlength="4" />
                </mat-form-field>
              </div>

              <button mat-flat-button color="primary" type="submit" [disabled]="cardForm.invalid || isAddingCard">
                <mat-icon>add</mat-icon>
                {{ 'PROFILE.SAVE_CARD' | translate }}
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }
    .profile-card, .payment-card {
      border-radius: 16px;
      padding: 24px;
      background: white;
      border: 1px solid #e2e8f0;
    }
    .avatar-large {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 16px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .user-main-info {
      h2 {
        margin: 0 0 6px 0;
        font-size: 1.4rem;
        font-weight: 700;
      }
    }
    .info-details {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      mat-icon {
        color: #2563eb;
      }
      div {
        display: flex;
        flex-direction: column;
        label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }
        span {
          font-size: 0.95rem;
          font-weight: 500;
          color: #0f172a;
        }
      }
    }
    .mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem !important;
    }
    .cards-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0;
    }
    .credit-card-item {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: white;
      padding: 20px;
      border-radius: 14px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      position: relative;
      .card-chip {
        width: 32px;
        height: 24px;
        background: #e2b340;
        border-radius: 4px;
        margin-bottom: 12px;
      }
      .card-type {
        position: absolute;
        top: 20px;
        right: 20px;
        font-weight: 800;
        letter-spacing: 0.05em;
      }
      .card-num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.15rem;
        letter-spacing: 0.1em;
        margin-bottom: 12px;
      }
      .card-meta {
        font-size: 0.8rem;
        color: #94a3b8;
      }
    }
    .empty-cards {
      text-align: center;
      padding: 30px;
      color: #94a3b8;
      mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }
    }
    .card-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }
    .form-row {
      display: flex;
      gap: 12px;
      mat-form-field {
        flex: 1;
      }
    }
    .my-4 {
      margin: 24px 0;
    }
  `]
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private addPaymentMethodUseCase = inject(AddPaymentMethodUseCase);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  isAddingCard = false;

  cardForm: FormGroup = this.fb.group({
    type: ['Visa', Validators.required],
    number: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
    expiry: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])/([0-9]{2})$')]],
    cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
  });

  ngOnInit(): void {
    this.authService.refreshProfile();
  }

  onImgError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  }

  onAddCard() {
    if (this.cardForm.invalid) return;

    const userId = this.authService.userId();
    if (!userId) return;

    this.isAddingCard = true;
    this.addPaymentMethodUseCase.execute(userId, this.cardForm.value).subscribe({
      next: (user) => {
        this.isAddingCard = false;
        this.authService.currentUser.set(user);
        this.cardForm.reset({ type: 'Visa' });
        this.toast.success('Payment method added successfully!');
      },
      error: (err) => {
        this.isAddingCard = false;
        this.toast.error(err.error?.message || 'Failed to add payment method.');
      }
    });
  }
}
