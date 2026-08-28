import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CreateSpaceUseCase } from '../../application/use-cases/create-space.usecase';
import { UpdateSpaceUseCase } from '../../application/use-cases/update-space.usecase';
import { GetSpaceByIdUseCase } from '../../application/use-cases/get-space-by-id.usecase';
import { ToastService } from '../../../../shared/infrastructure/notification/toast.service';

@Component({
  selector: 'app-space-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <button mat-button routerLink="/spaces" class="back-btn">
            <mat-icon>arrow_back</mat-icon>
            {{ 'COMMON.BACK' | translate }}
          </button>
          <h1>{{ isEditMode ? ('SPACES.EDIT_SPACE' | translate) : ('SPACES.CREATE_SPACE' | translate) }}</h1>
          <p>Provide specifications, pricing, location and images</p>
        </div>
      </div>

      <mat-card class="form-card">
        <form [formGroup]="spaceForm" (ngSubmit)="onSubmit()" class="space-form">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'SPACES.TITLE_LABEL' | translate }}</mat-label>
            <input matInput formControlName="title" placeholder="Miraflores Modern Smart Office" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'SPACES.DESC_LABEL' | translate }}</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Smart space equipped with environmental IoT sensors..."></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'SPACES.TYPE' | translate }}</mat-label>
              <mat-select formControlName="type">
                <mat-option value="Apartment">Apartment</mat-option>
                <mat-option value="Office">Office</mat-option>
                <mat-option value="Warehouse">Warehouse</mat-option>
                <mat-option value="Room">Room</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'SPACES.PRICE_PER_MONTH' | translate }} ($)</mat-label>
              <input matInput type="number" formControlName="pricePerMonth" placeholder="1500" />
            </mat-form-field>
          </div>

          <h3>Location Details</h3>
          <div formGroupName="location" class="location-group">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'SPACES.ADDRESS' | translate }}</mat-label>
              <input matInput formControlName="address" placeholder="Av. Larco 400" />
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>{{ 'SPACES.CITY' | translate }}</mat-label>
                <input matInput formControlName="city" placeholder="Lima" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ 'SPACES.COUNTRY' | translate }}</mat-label>
                <input matInput formControlName="country" placeholder="Peru" />
              </mat-form-field>
            </div>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'SPACES.IMAGES' | translate }}</mat-label>
            <input matInput formControlName="imagesString" placeholder="https://image1.jpg, https://image2.jpg" />
          </mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/spaces">{{ 'COMMON.CANCEL' | translate }}</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="spaceForm.invalid || isSubmitting">
              <mat-icon>save</mat-icon>
              {{ 'COMMON.SAVE' | translate }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-card {
      border-radius: 16px;
      padding: 32px;
      background: white;
      border: 1px solid #e2e8f0;
      max-width: 800px;
    }
    .space-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      mat-form-field {
        flex: 1;
      }
    }
    .location-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }
  `]
})
export class SpaceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private createSpaceUseCase = inject(CreateSpaceUseCase);
  private updateSpaceUseCase = inject(UpdateSpaceUseCase);
  private getSpaceByIdUseCase = inject(GetSpaceByIdUseCase);
  private toast = inject(ToastService);

  isEditMode = false;
  spaceId: string | null = null;
  isSubmitting = false;

  spaceForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    type: ['Apartment', [Validators.required]],
    pricePerMonth: [1200, [Validators.required, Validators.min(1)]],
    location: this.fb.group({
      address: ['Av. Larco 400', Validators.required],
      city: ['Lima', Validators.required],
      country: ['Peru', Validators.required],
      latitude: [-12.122],
      longitude: [-77.028]
    }),
    imagesString: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']
  });

  ngOnInit(): void {
    this.spaceId = this.route.snapshot.paramMap.get('id');
    if (this.spaceId) {
      this.isEditMode = true;
      this.getSpaceByIdUseCase.execute(this.spaceId).subscribe({
        next: (space) => {
          this.spaceForm.patchValue({
            title: space.title,
            description: space.description,
            type: space.type,
            pricePerMonth: space.pricePerMonth,
            location: space.location,
            imagesString: (space.images || []).join(', ')
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.spaceForm.invalid) return;

    const val = this.spaceForm.value;
    const images = (val.imagesString || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const payload = {
      title: val.title,
      description: val.description,
      type: val.type,
      pricePerMonth: val.pricePerMonth,
      location: val.location,
      images
    };

    this.isSubmitting = true;
    if (this.isEditMode && this.spaceId) {
      this.updateSpaceUseCase.execute(this.spaceId, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toast.success('Space updated successfully!');
          this.router.navigate(['/spaces', this.spaceId]);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error(err.error?.error || 'Failed to update space.');
        }
      });
    } else {
      this.createSpaceUseCase.execute(payload).subscribe({
        next: (created) => {
          this.isSubmitting = false;
          this.toast.success('Space published successfully!');
          this.router.navigate(['/spaces', created.id]);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error(err.error?.error || 'Failed to create space.');
        }
      });
    }
  }
}
