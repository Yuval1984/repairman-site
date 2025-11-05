import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { SendMailService } from '../../services/send-mail.service';
import { VisitorsService, StartPayload } from '../../services/visitors.service';
import { JsonLdService } from '../../services/json-ld.service';
import { smtpConfig } from '../../../mail-config';

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
  private sendMailService = inject(SendMailService);
  private visitorsService = inject(VisitorsService);
  private jsonLdService = inject(JsonLdService);

  year = new Date().getFullYear();
  sendingBottom = signal(false);
  sentBottom = signal(false);
  errorBottom = signal<string | null>(null);
  currentSlide = 0;
  activeServiceDesc = signal<string>('');
  totalVisits: number | null = null;
  private heartbeatTimer: any;
  private visitorSessionId: string | null = null;
  private carouselInterval: any;

  // Placeholder images - replace with actual work photos
  workImages = [
    { src: '/assets/electrician/work/electrician_work_2.jpg', alt: 'התקנת לוח חשמל מקצועי - חשמלאי מוסמך', caption: 'התקנת לוח חשמל מקצועית' },
    { src: '/assets/electrician/work/electrician_work_1.jpg', alt: 'עבודת חיבור תלת פאזי - חשמלאי מוסמך', caption: 'שדרוג חיבור תלת פאזי' },
    { src: '/assets/electrician/work/electrician_work_3.jpg', alt: 'התקנת גופי תאורה מודרניים - חשמלאי מוסמך', caption: 'התקנת גופי תאורה מודרניים' },
  ];

  // Testimonials quotes for marquee (duplicated in the template for seamless loop)
  quotes: string[] = [
    '"הגיע במהירות, פתר תקלה מסובכת בצורה מקצועית והשאיר הכול נקי ומסודר." - דניאל . חרב לאת  ',
    '"שירות מעולה! הסביר הכול בסבלנות ועשה עבודה ברמה גבוהה מאוד." - אורית · בית ינאי',
    '"חשמלאי אמין ואדיב, מצא את התקלה מהר ותיקן בלי לנסות למכור שטויות." - גלעד · פרדס חנה',
    '"הגיע בשעה שנקבעה, עבד נקי ומדויק. בהחלט שומרת את המספר לפעם הבאה!" - הילה · חריש',
    '"תוך חצי שעה הכול חזר לעבוד! מקצוען אמיתי עם גישה שירותית נדירה." - רוני · זכרון יעקב',
    '"פתר בעיה שהחשמלאי הקודם לא הצליח למצוא. מומלץ בחום!" - ליאור · חדרה',
    '"החליף לוח חשמל בצורה מסודרת, המחיר הוגן והשירות מעולה." - מיטל · גן שמואל',
    '"בא בדיוק בזמן, עבד מהר והשאיר רושם מעולה. שירות 10/10." - איילה · עין שמר',
    '"חשמלאי מדויק, אמין ונעים. כל התהליך היה פשוט מושלם." - יעל · גבעת חיים',
    '"תיקן קצר בלילה תוך רבע שעה! זמינות מדהימה ואכפתיות אמיתית." - עידן · להבות חביבה',
  ];

  // Bottom contact form
  contactFormBottom = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    // Allow spaces and dashes during input, but validate final format in submit
    phone: ['', [Validators.required, Validators.pattern(/^0[\d\s-]{9,}$/)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  scrollToContact() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Dialog controls
  openDialog() {
    // This method is no longer needed as the top form is removed
  }

  closeDialog() {
    // This method is no longer needed as the top form is removed
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

  // Flip quote card to next one
  nextQuoteCard() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const quotesCarouselEl = document.querySelector('#quotesCarousel') as HTMLElement;
    if (!quotesCarouselEl) return;

    const carousel = (window as any).bootstrap?.Carousel?.getInstance(quotesCarouselEl);
    if (carousel) {
      // Add flip-out animation to current active item
      const activeItem = quotesCarouselEl.querySelector('.carousel-item.active') as HTMLElement;
      if (activeItem) {
        activeItem.classList.add('flipping', 'flipping-out');
        // Move to next slide after half of the animation (when card is at 90deg)
        setTimeout(() => {
          carousel.next();
          // Add flip-in animation to new active item
          setTimeout(() => {
            activeItem.classList.remove('flipping', 'flipping-out');
            const newActiveItem = quotesCarouselEl.querySelector('.carousel-item.active') as HTMLElement;
            if (newActiveItem && newActiveItem !== activeItem) {
              newActiveItem.classList.add('flipping', 'flipping-in');
              setTimeout(() => {
                newActiveItem.classList.remove('flipping', 'flipping-in');
              }, 600);
            }
          }, 50);
        }, 300);
      } else {
        // If no active item found, just move to next
        carousel.next();
      }
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  submitBottom() {
    if (this.contactFormBottom.invalid) {
      this.contactFormBottom.markAllAsTouched();
      return;
    }

    this.sendingBottom.set(true);
    this.errorBottom.set(null);

    // Normalize phone number (remove spaces, dashes, etc.) for validation
    const phoneValue = this.contactFormBottom.get('phone')?.value || '';
    const normalizedPhone = phoneValue.replace(/\s|-/g, '');

    // Validate phone format before sending
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      this.sendingBottom.set(false);
      this.errorBottom.set('מספר טלפון חייב להתחיל ב-0 ולהכיל בדיוק 10 ספרות');
      this.contactFormBottom.get('phone')?.setErrors({ pattern: true });
      this.contactFormBottom.get('phone')?.markAsTouched();
      setTimeout(() => this.errorBottom.set(null), 5000);
      return;
    }

    const { name, phone, city, message } = this.contactFormBottom.value as { name: string; phone: string; city: string; message: string };

    // Format email content
    const subject = `הודעה חדשה מ ${name} - חשמלאי`;
    const html = `
      <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
        <h1 style="font-size: 22px; color: #222; margin: 0 0 8px;">התקבלה פנייה מהאתר - חשמלאי</h1>
        <style>
          @media only screen and (max-width: 600px) {
            .meta-row td { display: block !important; width: 100% !important; box-sizing: border-box; }
          }
        </style>
        <table role="presentation" width="100%" style="border-collapse: collapse;">
          <tr class="meta-row">
            <td style="padding: 8px 0; white-space: nowrap;"><strong>שם:</strong> ${name}</td>
            <td style="padding: 8px 0; white-space: nowrap;"><strong>טלפון:</strong> <a href="tel:${phone}" style="color: #25d366; text-decoration: none; font-weight: bold;">${phone}</a></td>
            <td style="padding: 8px 0; white-space: nowrap;"><strong>עיר:</strong> ${city}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding-top: 12px;">
              <strong>הודעה:</strong><br />
              ${(message || '').replace(/\n/g, '<br />')}
            </td>
          </tr>
        </table>
      </div>
    `;
    const headerLine = `שם: ${name} | טלפון: ${phone} | עיר: ${city}`;
    const text = `${headerLine}\r\n\r\nהודעה:\r\n${message}`;

    // Send email using new payload shape (to, subject, html, from, text)
    this.sendMailService.sendEmail(true, 'Joelkr@gmail.com', subject, html, smtpConfig.from, text).subscribe({
      next: (response: any) => {
        this.sendingBottom.set(false);
        if (!response?.localOpen) {
          this.sentBottom.set(true);
          this.contactFormBottom.reset();
          setTimeout(() => this.sentBottom.set(false), 5000);
        }
      },
      error: (err) => {
        this.sendingBottom.set(false);
        // Show server error message if available, otherwise show default message
        const errorMessage = err.error?.message || 'הודעה לא נשלחה. נסה להתקשר או לשלח הודעה.';
        this.errorBottom.set(errorMessage);
        console.error('Email error:', err);
        setTimeout(() => this.errorBottom.set(null), 5000);
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

    // Add JSON-LD structured data for SEO using the service
    if (!isPlatformBrowser(this.platformId)) return;

    // start visitor metrics for electrician app
    this.initVisitorMetrics();

    // Inject electrician page schema
    const schema = this.jsonLdService.getElectricianPageSchema();
    this.jsonLdService.injectSchema('ld-json-electrician', schema);

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

    // Initialize automatic carousel rotation
    this.initCarouselAutoRotation();
  }

  private initCarouselAutoRotation() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Wait for Bootstrap to be available and DOM to be ready
    setTimeout(() => {
      const workCarouselEl = document.querySelector('#workCarousel') as HTMLElement;
      const quotesCarouselEl = document.querySelector('#quotesCarousel') as HTMLElement;

      if (!(window as any).bootstrap?.Carousel) return;

      // Initialize or get existing carousel instance for work carousel
      if (workCarouselEl) {
        let workCarousel = (window as any).bootstrap.Carousel.getInstance(workCarouselEl);
        if (!workCarousel) {
          workCarousel = new (window as any).bootstrap.Carousel(workCarouselEl, {
            interval: 5000, // 5 seconds
            ride: 'carousel',
            wrap: true
          });
        } else {
          // Update interval if carousel already exists
          workCarousel._config.interval = 5000;
          workCarousel._setInterval();
        }
        // Store reference to prevent garbage collection
        (workCarouselEl as any)._carousel = workCarousel;
      }

      // Initialize or get existing carousel instance for quotes carousel
      if (quotesCarouselEl) {
        let quotesCarousel = (window as any).bootstrap.Carousel.getInstance(quotesCarouselEl);
        if (!quotesCarousel) {
          quotesCarousel = new (window as any).bootstrap.Carousel(quotesCarouselEl, {
            interval: 5000, // 5 seconds
            ride: 'carousel',
            wrap: true
          });
        } else {
          // Update interval if carousel already exists
          quotesCarousel._config.interval = 5000;
          quotesCarousel._setInterval();
        }
        // Store reference to prevent garbage collection
        (quotesCarouselEl as any)._carousel = quotesCarousel;
      }
    }, 500); // Wait for DOM to be ready
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
        this.carouselInterval = null;
      }
      // Dispose carousel instances
      const workCarouselEl = document.querySelector('#workCarousel') as any;
      const quotesCarouselEl = document.querySelector('#quotesCarousel') as any;
      if (workCarouselEl?._carousel) {
        workCarouselEl._carousel.dispose();
      }
      if (quotesCarouselEl?._carousel) {
        quotesCarouselEl._carousel.dispose();
      }
      // Remove schema when component is destroyed
      this.jsonLdService.removeSchema('ld-json-electrician');
      this.endVisitorSession();
    }
  }

  private initVisitorMetrics() {
    const buildPayload = (): Promise<StartPayload> => {
      return new Promise((resolve) => {
        const device = {
          userAgent: navigator.userAgent,
          platform: (navigator as any).platform || '',
          language: navigator.language || 'he-IL',
          screen: { width: window.screen.width, height: window.screen.height },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jerusalem',
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                location: { lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy, source: 'gps' },
                device,
              });
            },
            () => resolve({ location: { source: 'approx' }, device }),
            { enableHighAccuracy: false, timeout: 3000, maximumAge: 600000 }
          );
        } else {
          resolve({ location: { source: 'none' }, device });
        }
      });
    };

    buildPayload().then((payload) => {
      this.visitorsService.startSession(payload, 'electrician').subscribe({
        next: (resp) => {
          this.visitorSessionId = resp?.sessionId || null;
          this.visitorsService.getStats('electrician').subscribe({ next: (v) => (this.totalVisits = v) });
          if (this.visitorSessionId) {
            this.heartbeatTimer = window.setInterval(() => {
              if (this.visitorSessionId) {
                this.visitorsService.heartbeat(this.visitorSessionId!, 'electrician').subscribe({ next: () => {} });
              }
            }, 30000);
            window.addEventListener('beforeunload', this.endVisitorSession);
          }
        },
      });
    });
  }

  private endVisitorSession = () => {
    if (this.visitorSessionId) {
      const id = this.visitorSessionId;
      this.visitorSessionId = null;
      this.visitorsService.end(id, 'electrician').subscribe({ next: () => {} });
      window.removeEventListener('beforeunload', this.endVisitorSession);
    }
  };
}
