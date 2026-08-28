import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImgBBUploadService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = '6d207e02198a847aa98d0a2a901485a5';
  private readonly uploadUrl = 'https://api.imgbb.com/1/upload';

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ data: { url: string } }>(
      `${this.uploadUrl}?key=${this.apiKey}`,
      formData
    ).pipe(
      map(res => res.data.url)
    );
  }
}
