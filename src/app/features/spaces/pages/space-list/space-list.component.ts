import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { GetSpacesUseCase } from '../../application/use-cases/get-spaces.usecase';
import { SpaceModel, SpaceType } from '../../models/space.model';
import { AuthService } from '../../../iam/services/auth.service';

@Component({
  selector: 'app-space-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-titles">
          <h1>
            <mat-icon>apartment</mat-icon>
            {{ 'SPACES.CATALOG' | translate }}
          </h1>
          <p>Explore properties, check real-time IoT metrics and maintenance states</p>
        </div>
        <div class="header-actions">
          @if (authService.userRole() === 'Homeowner') {
            <button mat-flat-button color="primary" routerLink="/spaces/new">
              <mat-icon>add</mat-icon>
              {{ 'SPACES.CREATE_SPACE' | translate }}
            </button>
          }
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filter-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>{{ 'COMMON.SEARCH' | translate }}</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Filter by title, city or country..." />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="select-filter">
          <mat-label>{{ 'SPACES.TYPE' | translate }}</mat-label>
          <mat-select [(ngModel)]="selectedType" (selectionChange)="applyFilters()">
            <mat-option value="ALL">All Types</mat-option>
            <mat-option value="Apartment">Apartment</mat-option>
            <mat-option value="Office">Office</mat-option>
            <mat-option value="Warehouse">Warehouse</mat-option>
            <mat-option value="Room">Room</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="select-filter">
          <mat-label>{{ 'SPACES.STATUS' | translate }}</mat-label>
          <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
            <mat-option value="ALL">All Statuses</mat-option>
            <mat-option value="Published">Published</mat-option>
            <mat-option value="Accepted">Accepted / In Progress</mat-option>
            <mat-option value="Completed">Completed</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading spaces...</p>
        </div>
      } @else {
        <div class="card-grid">
          @for (space of filteredSpaces(); track space.id) {
            <mat-card class="space-card" [routerLink]="['/spaces', space.id]">
              <div class="card-img-wrap">
                <img [src]="space.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500'" alt="Space Image" />
                <span class="badge status-pill" [ngClass]="getStatusClass(space.status)">
                  {{ space.status }}
                </span>
                <span class="type-pill">{{ space.type }}</span>
              </div>

              <mat-card-content class="card-content">
                <h3 class="space-title">{{ space.title }}</h3>
                <p class="space-desc">{{ space.description }}</p>

                <div class="space-meta">
                  <div class="meta-item">
                    <mat-icon>location_on</mat-icon>
                    <span>{{ space.location.city }}, {{ space.location.country }}</span>
                  </div>
                  <div class="meta-item price-item">
                    <span class="price-val">\&#36;{{ space.pricePerMonth }}</span>
                    <span class="price-unit">/ month</span>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions class="card-actions">
                <button mat-stroked-button color="primary" [routerLink]="['/spaces', space.id]">
                  <mat-icon>visibility</mat-icon>
                  {{ 'COMMON.VIEW_DETAILS' | translate }}
                </button>
              </mat-card-actions>
            </mat-card>
          } @empty {
            <div class="empty-state">
              <mat-icon>apartment</mat-icon>
              <h3>No properties found</h3>
              <p>{{ 'SPACES.NO_SPACES' | translate }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .search-field {
      flex: 2;
      min-width: 250px;
    }
    .select-filter {
      flex: 1;
      min-width: 180px;
    }
    .space-card {
      border-radius: 16px;
      overflow: hidden;
      background: white;
      border: 1px solid #e2e8f0;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.1);
      }
    }
    .card-img-wrap {
      position: relative;
      height: 200px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .status-pill {
        position: absolute;
        top: 12px;
        left: 12px;
        backdrop-filter: blur(8px);
      }
      .type-pill {
        position: absolute;
        bottom: 12px;
        left: 12px;
        background: rgba(15, 23, 42, 0.85);
        color: white;
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
      }
    }
    .card-content {
      padding: 16px;
    }
    .space-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px 0;
      line-height: 1.3;
    }
    .space-desc {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .space-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      color: #64748b;
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #2563eb;
      }
    }
    .price-item {
      .price-val {
        font-size: 1.2rem;
        font-weight: 800;
        color: #0f172a;
      }
      .price-unit {
        font-size: 0.75rem;
        color: #94a3b8;
        margin-left: 2px;
      }
    }
    .card-actions {
      padding: 8px 16px 16px 16px;
      button {
        width: 100%;
        border-radius: 10px;
      }
    }
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: #94a3b8;
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
      }
    }
  `]
})
export class SpaceListComponent implements OnInit {
  authService = inject(AuthService);
  private getSpacesUseCase = inject(GetSpacesUseCase);

  allSpaces: SpaceModel[] = [];
  filteredSpaces = signal<SpaceModel[]>([]);
  isLoading = signal(true);

  searchTerm = '';
  selectedType = 'ALL';
  selectedStatus = 'ALL';

  ngOnInit(): void {
    this.loadSpaces();
  }

  loadSpaces(): void {
    this.isLoading.set(true);
    this.getSpacesUseCase.execute().subscribe({
      next: (spaces) => {
        this.allSpaces = spaces;
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  applyFilters(): void {
    let result = [...this.allSpaces];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(term) ||
        s.location.city.toLowerCase().includes(term) ||
        s.location.country.toLowerCase().includes(term)
      );
    }

    if (this.selectedType !== 'ALL') {
      result = result.filter(s => s.type === this.selectedType);
    }

    if (this.selectedStatus !== 'ALL') {
      result = result.filter(s => s.status === this.selectedStatus);
    }

    this.filteredSpaces.set(result);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Published':
      case 'Available':
        return 'badge-success';
      case 'Accepted':
        return 'badge-info';
      case 'Completed':
        return 'badge-purple';
      case 'Cancelled':
        return 'badge-danger';
      default:
        return 'badge-gray';
    }
  }
}
