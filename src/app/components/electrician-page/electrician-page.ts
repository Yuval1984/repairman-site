import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-electrician-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
  showDialog = signal(false);
  activeServiceDesc = signal<string>('');

  // Placeholder images - replace with actual work photos
  workImages = [
    { src: '/assets/electrician/work/electrician_work_2.jpg', alt: 'התקנת לוח חשמל מקצועי - חשמלאי מוסמך', caption: 'התקנת לוח חשמל מקצועית' },
    { src: '/assets/electrician/work/electrician_work_1.jpg', alt: 'עבודת חיבור תלת פאזי - חשמלאי מוסמך', caption: 'שדרוג חיבור תלת פאזי' },
    { src: '/assets/electrician/work/electrician_work_3.jpg', alt: 'התקנת גופי תאורה מודרניים - חשמלאי מוסמך', caption: 'התקנת גופי תאורה מודרניים' },
  ];

  // Testimonials quotes for marquee (duplicated in the template for seamless loop)
  quotes: string[] = [
    '"הגיע במהירות, פתר תקלה מסובכת בצורה מקצועית והשאיר הכול נקי ומסודר." — דניאל · תל אביב',
    '"שירות מעולה! הסביר הכול בסבלנות ועשה עבודה ברמה גבוהה מאוד." — אורית · חיפה',
    '"חשמלאי אמין ואדיב, מצא את התקלה מהר ותיקן בלי לנסות למכור שטויות." — גלעד · ראשון לציון',
    '"הגיע בשעה שנקבעה, עבד נקי ומדויק. בהחלט שומר את המספר לפעם הבאה!" — הילה · נתניה',
    '"תוך חצי שעה הכול חזר לעבוד! מקצוען אמיתי עם גישה שירותית נדירה." — רוני · הרצליה',
    '"פתר בעיה שהחשמלאי הקודם לא הצליח למצוא. מומלץ בחום!" — ליאור · פ"ת',
    '"החליף לוח חשמל בצורה מסודרת, המחיר הוגן והשירות מעולה." — מיטל · כפר סבא',
    '"בא בדיוק בזמן, עבד מהר והשאיר תחושת ביטחון. שירות 10/10." — אביב · גבעתיים',
    '"חשמלאי מדויק, אמין ונעים. כל התהליך היה פשוט מושלם." — יעל · חיפה',
    '"תיקן קצר בלילה תוך רבע שעה! זמינות מדהימה ואכפתיות אמיתית." — עידן · רחובות',
  ];

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    // Allow spaces and dashes during input, but validate final format in submit
    phone: ['', [Validators.required, Validators.pattern(/^0[\d\s-]{9,}$/)]],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  scrollToContact() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Dialog controls
  openDialog() {
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
  }

  // Services hover panel
  setServiceDescription(desc: string) {
    this.activeServiceDesc.set(desc);
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

  trackByIndex(index: number): number {
    return index;
  }

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    this.error.set(null);

    // Normalize phone number (remove spaces, dashes, etc.) for validation
    const phoneValue = this.contactForm.get('phone')?.value || '';
    const normalizedPhone = phoneValue.replace(/\s|-/g, '');

    // Validate phone format before sending
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      this.sending.set(false);
      this.error.set('מספר טלפון חייב להתחיל ב-0 ולהכיל בדיוק 10 ספרות');
      this.contactForm.get('phone')?.setErrors({ pattern: true });
      this.contactForm.get('phone')?.markAsTouched();
      setTimeout(() => this.error.set(null), 5000);
      return;
    }

    const formData = {
      ...this.contactForm.value,
      phone: normalizedPhone
    };

    this.http.post('/api/send-email', formData).subscribe({
      next: (response: any) => {
        this.sending.set(false);
        this.sent.set(true);
        this.contactForm.reset();
        setTimeout(() => this.sent.set(false), 5000);
      },
      error: (err) => {
        this.sending.set(false);
        // Show server error message if available, otherwise show default message
        const errorMessage = err.error?.message || 'הודעה לא נשלחה. נסה להתקשר או לשלח הודעה.';
        this.error.set(errorMessage);
        console.error('Email error:', err);
        setTimeout(() => this.error.set(null), 5000);
      }
    });
  }

  ngOnInit(): void {
    // Set page title and comprehensive meta tags (Hebrew for SEO)
    this.title.setTitle('ג׳ו טכנו - חשמלאי מוסמך | Repairmen.co.il | שירותי חשמל מקצועיים');

    // Basic SEO meta tags
    this.meta.updateTag({
      name: 'description',
      content: 'ג׳ו טכנו - חשמלאי מוסמך #975186. שירותי חשמל מקצועיים בחדרה, נתניה וכל ישראל. תיקון קצרים, התקנת תאורה, החלפת לוחות חשמל, בדיקות בטיחות. מענה מהיר, אחריות מלאה ומחירים הוגנים. התקשר: 054-481-8383'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'חשמלאי, חשמלאי מוסמך, חשמלאי מוסמך #975186, שירותי חשמל, חדרה, נתניה, ישראל, תיקון חשמל, התקנת חשמל, תיקון קצר, בדיקות חשמל, חשמלאי בחדרה, חשמלאי בנתניה, החלפת לוח חשמל, התקנת תאורה, איתור זליגות הארקה, ג׳ו טכנו'
    });
    this.meta.updateTag({ name: 'author', content: 'ג׳ו טכנו - חשמלאי מוסמך #975186' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'language', content: 'he' });
    this.meta.updateTag({ name: 'revisit-after', content: '7 days' });
    this.meta.updateTag({ name: 'geo.region', content: 'IL' });
    this.meta.updateTag({ name: 'geo.placename', content: 'ישראל' });

    // Open Graph meta tags
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://repairmen.co.il/electrician' });
    this.meta.updateTag({ property: 'og:title', content: 'ג׳ו טכנו - חשמלאי מוסמך | שירותי חשמל מקצועיים' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'שירותי חשמל מקצועיים בישראל. חשמלאי מוסמך #975186 עם מענה מהיר ואחריות מלאה. תיקון קצרים, התקנת תאורה, החלפת לוחות חשמל ובדיקות בטיחות. חדרה, נתניה וכל ישראל.'
    });
    this.meta.updateTag({ property: 'og:image', content: 'https://repairmen.co.il/assets/electrician.jpg' });
    this.meta.updateTag({ property: 'og:locale', content: 'he_IL' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Repairmen.co.il' });

    // Twitter Card meta tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:url', content: 'https://repairmen.co.il/electrician' });
    this.meta.updateTag({ name: 'twitter:title', content: 'ג׳ו טכנו - חשמלאי מוסמך | שירותי חשמל מקצועיים' });
    this.meta.updateTag({
      name: 'twitter:description',
      content: 'שירותי חשמל מקצועיים בישראל. חשמלאי מוסמך #975186 עם מענה מהיר ואחריות מלאה. תיקון קצרים, התקנת תאורה, החלפת לוחות חשמל.'
    });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://repairmen.co.il/assets/electrician.jpg' });

    // Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: 'https://repairmen.co.il/electrician' });

    // Add JSON-LD structured data for SEO
    if (!isPlatformBrowser(this.platformId)) return;

    const id = 'ld-json-electrician';
    if (document.getElementById(id)) return;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'Electrician',
      name: 'ג׳ו טכנו - חשמלאי מוסמך',
      alternateName: 'Joe Tecno - Licensed Electrician',
      identifier: '975186',
      url: 'https://repairmen.co.il/electrician',
      image: 'https://repairmen.co.il/assets/electrician.jpg',
      telephone: '+972544818383',
      priceRange: '$$',
      description: 'חשמלאי מוסמך #975186 המציע שירותי חשמל מקצועיים מהירים ואמינים לבתים ועסקים בישראל. תיקון קצרים, התקנת תאורה, החלפת לוחות חשמל ובדיקות בטיחות.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'חדרה',
        addressRegion: 'IL',
        addressCountry: 'IL'
      },
      areaServed: [
        { '@type': 'City', name: 'חדרה' },
        { '@type': 'City', name: 'נתניה' },
        { '@type': 'State', name: 'השרון' },
        { '@type': 'Country', name: 'ישראל' }
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'שירותי חשמל',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'תיקון קצרים ותקלות חשמל',
              description: 'תיקון מהיר של קצרים ותקלות חשמל ביתיות ועסקיות'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'התקנת תאורה',
              description: 'התקנת תאורה לבית ולגינה'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'החלפת שקעים ופחתים',
              description: 'החלפת שקעים, פחתים ולוחות חשמל'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'הכנת תשתית חשמל',
              description: 'הכנת תשתית חשמל לשיפוץ או בנייה חדשה'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'בדיקות בטיחות ואיתור זליגות',
              description: 'איתור ותיקון זליגות הארקה ובדיקות בטיחות חשמל'
            }
          }
        ]
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '24',
        bestRating: '5',
        worstRating: '1'
      },
      openingHoursSpecification: [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
        opens: '08:00',
        closes: '20:00'
      }]
    };

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    // Remove will-change after animations complete for better performance
    // Hero animation: 1800ms, Buttons: 1900ms delay + 600ms duration = 2500ms, Service animations: up to 1100ms delay + 800ms duration = 1900ms total
    setTimeout(() => {
      const hero = document.querySelector('.hero') as HTMLElement;
      if (hero) {
        hero.style.willChange = 'auto';
      }

      const heroCta = document.querySelector('.hero__cta') as HTMLElement;
      if (heroCta) {
        heroCta.style.willChange = 'auto';
      }

      const serviceButtons = document.querySelectorAll('.svc');
      serviceButtons.forEach(button => {
        const element = button as HTMLElement;
        element.style.willChange = 'auto';
      });
    }, 2600); // After all animations complete
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('ld-json-electrician')?.remove();
    }
  }
}
