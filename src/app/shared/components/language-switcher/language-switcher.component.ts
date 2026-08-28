import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  template: `
    <button mat-button [matMenuTriggerFor]="langMenu" class="lang-btn">
      <div class="lang-content">
        <mat-icon class="lang-icon">translate</mat-icon>
        <span class="lang-code">{{ currentLang().toUpperCase() }}</span>
        <mat-icon class="arrow-icon">expand_more</mat-icon>
      </div>
    </button>
    <mat-menu #langMenu="matMenu" class="lang-dropdown">
      <button mat-menu-item (click)="setLanguage('en')" [class.active-item]="currentLang() === 'en'">
        <span class="flag">🇺🇸</span>
        <span class="lang-label">English (EN)</span>
      </button>
      <button mat-menu-item (click)="setLanguage('es')" [class.active-item]="currentLang() === 'es'">
        <span class="flag">🇵🇪</span>
        <span class="lang-label">Español (ES)</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
    }
    .lang-btn {
      height: 40px;
      padding: 0 10px !important;
      border-radius: 10px;
      color: #475569;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;

      &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
        color: #0f172a;
      }

      ::ng-deep .mdc-button__label {
        display: flex;
        align-items: center;
      }
    }
    .lang-content {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .lang-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lang-code {
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: #1e293b;
    }
    .arrow-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .active-item {
      background: #eff6ff;
      color: #2563eb;
      font-weight: 600;
    }
    .flag {
      margin-right: 8px;
      font-size: 16px;
    }
  `]
})
export class LanguageSwitcherComponent {
  private translate = inject(TranslateService);

  currentLang() {
    return this.translate.currentLang || 'en';
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('spacepulse_lang', lang);
  }
}
