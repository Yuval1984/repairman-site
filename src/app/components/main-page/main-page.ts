import { Component, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage implements OnInit {
  private router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }
  // Bootstrap carousel is used; no custom carousel state is needed

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });
  sending = false;
  sent = false;
  errorMsg = '';
  submitted = false;

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

    // Start autoplay and pause when tab hidden
    // No JS needed for Bootstrap carousel here
  }

  navigateToElectricianPage() {
    this.router.navigate(['/electrician']);
  }

  scrollTo(id: string) {
    if (!this.isBrowser) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // no custom carousel functions required

  submitContact() {
    this.errorMsg = '';
    this.sent = false;
    this.submitted = true;
    if (this.contactForm.invalid) {
      // Keep fields pristine visually; we only surface errors via submitted flag
      return;
    }
    this.sending = true;
    this.http.post('/api/send-email', this.contactForm.value).subscribe({
      next: () => {
        this.sending = false;
        this.sent = true;
        this.submitted = false;
        this.contactForm.reset();
      },
      error: (err) => {
        this.sending = false;
        this.errorMsg = err?.error?.message || 'שליחה נכשלה';
      },
    });
  }
}
