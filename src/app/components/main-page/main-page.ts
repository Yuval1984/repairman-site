import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage implements OnInit {
  private router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);

  ngOnInit(): void {
    // Set page title and meta tags for home page (Hebrew for SEO)
    this.title.setTitle('דף הבית - Repairman.co.il | שירותי חשמלאי מקצועי בישראל');
    this.meta.updateTag({
      name: 'description',
      content: 'שירותי חשמלאי מקצועי בישראל. חשמלאי מוסמך המציע תיקונים, התקנות ובדיקות חשמל מהירות ואמינות בחדרה, נתניה והסביבה.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'חשמלאי ישראל, שירותי חשמל, תיקוני בית, חשמלאי מוסמך, חדרה, נתניה'
    });
    this.meta.updateTag({ property: 'og:title', content: 'Repairman.co.il - שירותי חשמלאי מקצועי' });
    this.meta.updateTag({ property: 'og:description', content: 'שירותי חשמלאי מקצועי בישראל. מהיר, אמין ומוסמך.' });
    this.meta.updateTag({ property: 'og:url', content: 'https://repairman.co.il/' });
  }

  navigateToElectricianPage() {
    this.router.navigate(['/electrician']);
  }
}
