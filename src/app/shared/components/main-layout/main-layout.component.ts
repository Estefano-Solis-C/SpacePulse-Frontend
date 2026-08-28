import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-header (toggleSidebar)="sidenav.toggle()"></app-header>
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="app-sidenav">
          <app-sidebar></app-sidebar>
        </mat-sidenav>
        <mat-sidenav-content class="app-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .sidenav-container {
      flex: 1;
      height: calc(100vh - 64px);
    }
    .app-sidenav {
      border: none;
    }
    .app-content {
      background-color: #f8fafc;
      overflow-y: auto;
    }
    .content-wrapper {
      min-height: 100%;
    }
  `]
})
export class MainLayoutComponent {}
