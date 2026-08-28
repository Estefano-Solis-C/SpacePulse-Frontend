import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SpacePulse';
  private translate = inject(TranslateService);

  ngOnInit(): void {
    const savedLang = localStorage.getItem('spacepulse_lang') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }
}
