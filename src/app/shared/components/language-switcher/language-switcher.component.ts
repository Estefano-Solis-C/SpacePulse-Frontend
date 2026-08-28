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
      <mat-icon>translate</mat-icon>
      <span>{{ currentLang().toUpperCase() }}</span>
      <mat-icon class="arrow-icon">arrow_drop_down</mat-icon>
    </button>
    <mat-menu #langMenu="matMenu" class="lang-dropdown">
      <button mat-menu-item (click)="setLanguage('en')">
        <span [class.active-lang]="currentLang() === 'en'">🇺🇸 English (EN)</span>
      </button>
      <button mat-menu-item (click)="setLanguage('es')">
        <span [class.active-lang]="currentLang() === 'es'">🇵🇪 Español (ES)</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .lang-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: #334155;
      border-radius: 8px;
    }
    .arrow-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .active-lang {
      font-weight: 700;
      color: #2563eb;
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
