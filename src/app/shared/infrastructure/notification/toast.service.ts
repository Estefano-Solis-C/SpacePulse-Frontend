import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);

  success(message: string, duration = 3500) {
    this.snackBar.open(message, 'OK', {
      duration,
      panelClass: ['toast-success'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  error(message: string, duration = 5000) {
    this.snackBar.open(message, 'Dismiss', {
      duration,
      panelClass: ['toast-error'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  warning(message: string, duration = 4000) {
    this.snackBar.open(message, 'OK', {
      duration,
      panelClass: ['toast-warning'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  info(message: string, duration = 3000) {
    this.snackBar.open(message, 'OK', {
      duration,
      panelClass: ['toast-info'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
}
