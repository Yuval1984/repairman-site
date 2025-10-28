import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-electrician-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './electrician-page.html',
  styleUrl: './electrician-page.scss'
})
export class ElectricianPage implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private meta = inject(Meta);
  private title = inject(Title);
  private http = inject(HttpClient);

  year = new Date().getFullYear();
  sending = signal(false);
  sent = signal(false);
  error = signal<string | null>(null);
  currentSlide = 0;

  // Placeholder images - replace with actual work photos
  workImages = [
    { src: '/assets/electrician/work/project-1.jpg', alt: 'Electrical panel installation', caption: 'Professional Electrical Panel Installation' },
    { src: '/assets/electrician/work/project-2.jpg', alt: 'Three-phase connection work', caption: 'Three-Phase Connection Upgrade' },
    { src: '/assets/electrician/work/project-3.jpg', alt: 'Lighting installation', caption: 'Modern Lighting Fixtures Installation' },
    { src: '/assets/electrician/work/project-4.jpg', alt: 'Outlet installation', caption: 'Electrical Outlets & Switches' },
    { src: '/assets/electrician/work/project-5.jpg', alt: 'Electrical testing', caption: 'Electrical Testing & Certification' },
    { src: '/assets/electrician/work/project-6.jpg', alt: 'Water heater repair', caption: 'Water Heater Elements Replacement' }
  ];

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{6,}$/)]],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  scrollToContact() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Carousel navigation methods
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.workImages.length;
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.workImages.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Keyboard navigation for carousel
  onCarouselKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.previousSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    this.error.set(null);

    const formData = this.contactForm.value;

    this.http.post('/api/send-email', formData).subscribe({
      next: (response: any) => {
        this.sending.set(false);
        this.sent.set(true);
        this.contactForm.reset();
        setTimeout(() => this.sent.set(false), 5000);
      },
      error: (err) => {
        this.sending.set(false);
        this.error.set('הודעה לא נשלחה. נסה להתקשר או לשלח הדעה.');
        console.error('Email error:', err);
        setTimeout(() => this.error.set(null), 5000);
      }
    });
  }

  ngOnInit(): void {
    // Set page title and meta tags (Hebrew for SEO)
    this.title.setTitle('ג׳ו טכנו - חשמלאי מוסמך | שירותי חשמל מקצועיים');
    this.meta.updateTag({
      name: 'description',
      content: 'ג׳ו טכנו - חשמלאי מוסמך #975186. שירותי חשמל מקצועיים בחדרה, נתניה וכל ישראל. מענה מהיר, אחריות מלאה ומחירים הוגנים. התקשר: 054-481-8383'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'חשמלאי, חשמלאי מוסמך, שירותי חשמל, חדרה, נתניה, ישראל, תיקון חשמל, התקנת חשמל, ג׳ו טכנו, תיקון קצר, בדיקות חשמל, חשמלאי בחדרה, חשמלאי בנתניה'
    });
    this.meta.updateTag({ property: 'og:title', content: " טכנו גו' - חשמלאי מוסמך | שירותי חשמל מקצועיים" });
    this.meta.updateTag({ property: 'og:description', content: 'שירותי חשמל מקצועיים בישראל. חשמלאי מוסמך עם מענה מהיר ואחריות מלאה.' });
    this.meta.updateTag({ property: 'og:url', content: 'https://repairman.co.il/electrician' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: 'https://repairman.co.il/assets/electrician.jpg' });

    // Add JSON-LD structured data for SEO
    if (!isPlatformBrowser(this.platformId)) return;

    const id = 'ld-json-electrician';
    if (document.getElementById(id)) return;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'Electrician',
      name: 'Joe Tecno – Licensed Electrician',
      url: 'https://repairman.co.il/electrician',
      image: 'https://repairman.co.il/assets/electrician.jpg',
      telephone: '+972544818383',
      priceRange: '$$',
      description: 'Licensed electrician offering fast and reliable electrical services for homes and businesses in Israel.',
      address: { '@type': 'PostalAddress', addressLocality: 'Hadera', addressRegion: 'IL', addressCountry: 'IL' },
      areaServed: ['Hadera', 'Netanya', 'Israel'],
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
        opens: '08:00', closes: '20:00'
      }]
    };

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('ld-json-electrician')?.remove();
    }
  }
}
