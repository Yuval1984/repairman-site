import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SendMailService } from '../../services/send-mail.service';
import { smtpConfig } from '../../../mail-config';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);
  private get isBrowser() { return isPlatformBrowser(this.platformId); }
  // Bootstrap carousel is used; no custom carousel state is needed

  private fb = inject(FormBuilder);
  private sendMailService = inject(SendMailService);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });
  sending = false;
  sent = false;
  errorMsg = '';
  submitted = false;

  ngOnInit(): void {
    // Set page title and comprehensive meta tags for home page (Hebrew for SEO)
    this.title.setTitle('Repairmen.co.il - תיקון מוצרי חשמל וחשמלאי מוסמך בישראל');

    // Basic SEO meta tags
    this.meta.updateTag({
      name: 'description',
      content: 'שירותי תיקון מוצרי חשמל ביתיים וחשמלאי מוסמך בישראל. טכנאי מוצרי חשמל מקצועי לתיקון מכונות כביסה, מקררים, מדיחי כלים, תנורים ומיזוג אוויר. חשמלאי מוסמך לתיקוני חשמל והתקנות. חריש, פרדס חנה, השרון וזכרון יעקב.'
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'תיקון מוצרי חשמל, טכנאי מוצרי חשמל, תיקון מכונות כביסה, תיקון מקררים, תיקון מדיחי כלים, תיקון תנורים, תיקון מייבשי כביסה, תיקון מזגנים, חשמלאי מוסמך, חשמלאי, שירותי חשמל, תיקון חשמל, התקנת חשמל, חדרה, נתניה, חריש, פרדס חנה, השרון, זכרון יעקב, ישראל, טכנאי BEKO, טכנאי LG, טכנאי WHIRLPOOL, טכנאי SIEMENS'
    });
    this.meta.updateTag({ name: 'author', content: 'ג\'ואל - טכנאי מוצרי חשמל וחשמלאי מוסמך' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'language', content: 'he' });
    this.meta.updateTag({ name: 'revisit-after', content: '7 days' });
    this.meta.updateTag({ name: 'geo.region', content: 'IL' });
    this.meta.updateTag({ name: 'geo.placename', content: 'ישראל' });

    // Open Graph meta tags
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://repairmen.co.il/' });
    this.meta.updateTag({ property: 'og:title', content: 'Repairmen.co.il - תיקון מוצרי חשמל וחשמלאי מוסמך' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'שירותי תיקון מוצרי חשמל ביתיים וחשמלאי מוסמך בישראל. טכנאי מקצועי לתיקון מכונות כביסה, מקררים, מדיחי כלים ותנורים. חשמלאי מוסמך לתיקוני חשמל והתקנות. חריש, פרדס חנה, השרון וזכרון יעקב.'
    });
    this.meta.updateTag({ property: 'og:image', content: 'https://repairmen.co.il/assets/appliance%20technician/profile.png' });
    this.meta.updateTag({ property: 'og:locale', content: 'he_IL' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Repairmen.co.il' });

    // Twitter Card meta tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:url', content: 'https://repairmen.co.il/' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Repairmen.co.il - תיקון מוצרי חשמל וחשמלאי מוסמך' });
    this.meta.updateTag({
      name: 'twitter:description',
      content: 'שירותי תיקון מוצרי חשמל ביתיים וחשמלאי מוסמך בישראל. טכנאי מקצועי לתיקון מכונות כביסה, מקררים, מדיחי כלים ותנורים.'
    });
    this.meta.updateTag({ name: 'twitter:image', content: 'https://repairmen.co.il/assets/appliance%20technician/profile.png' });

    // Canonical URL
    this.meta.updateTag({ rel: 'canonical', href: 'https://repairmen.co.il/' });

    // Add JSON-LD structured data for SEO (LocalBusiness schema)
    if (this.isBrowser) {
      const id = 'ld-json-main-page';
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'ג\'ואל - טכנאי מוצרי חשמל וחשמלאי מוסמך',
        alternateName: 'Repairmen.co.il',
        description: 'שירותי תיקון מוצרי חשמל ביתיים וחשמלאי מוסמך בישראל. טכנאי מקצועי לתיקון מכונות כביסה, מקררים, מדיחי כלים, תנורים ומיזוג אוויר.',
        url: 'https://repairmen.co.il/',
        image: 'https://repairmen.co.il/assets/appliance%20technician/profile.png',
        telephone: '+972544818383',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'חריש',
          addressRegion: 'השרון',
          addressCountry: 'IL'
        },
        areaServed: [
          { '@type': 'City', name: 'חריש' },
          { '@type': 'City', name: 'פרדס חנה' },
          { '@type': 'City', name: 'חדרה' },
          { '@type': 'City', name: 'נתניה' },
          { '@type': 'City', name: 'זכרון יעקב' },
          { '@type': 'State', name: 'השרון' },
          { '@type': 'Country', name: 'ישראל' }
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'שירותי תיקון מוצרי חשמל',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'תיקון מכונות כביסה',
                description: 'תיקון כל סוגי מכונות הכביסה מכל החברות'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'תיקון מקררים',
                description: 'תיקון כל סוגי המקררים והמקפיאים מכל החברות'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'תיקון מדיחי כלים',
                description: 'תיקון מדיחי כלים מכל החברות'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'תיקון תנורים ומייבשי כביסה',
                description: 'תיקון תנורי אפייה ומייבשי כביסה מכל החברות'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'תיקון מזגנים',
                description: 'תיקון מזגנים עד 5 טון'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'שירותי חשמלאי מוסמך',
                description: 'תיקוני חשמל, התקנות ובדיקות חשמל'
              }
            }
          ]
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '28',
          bestRating: '5',
          worstRating: '1'
        },
        review: [
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'דניאל' },
            datePublished: '2024-10-15',
            reviewBody: 'הגיע במהירות, פתר תקלה מסובכת בצורה מקצועית והשאיר הכול נקי ומסודר.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'אורית' },
            datePublished: '2024-09-20',
            reviewBody: 'שירות מעולה! הסביר הכול בסבלנות ועשה עבודה ברמה גבוהה מאוד.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }
          }
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
            opens: '08:00',
            closes: '20:00'
          }
        ]
      };

      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData, null, 2);
      document.head.appendChild(script);
    }

    // Remove animation after it completes to allow smooth transitions
    // Animation duration is 1100ms + max delay ~180ms = ~1280ms, wait 1500ms to be safe
    if (this.isBrowser) {
      setTimeout(() => {
        const cards = document.querySelectorAll('.info-card');
        cards.forEach(card => {
          const element = card as HTMLElement;
          // Save only opacity before removing animation (transform returns to base state naturally)
          const computedStyle = window.getComputedStyle(element);
          const savedOpacity = computedStyle.opacity;
          // Remove animation but keep the opacity (transform will be handled by CSS transition)
          element.style.animation = 'none';
          if (savedOpacity && parseFloat(savedOpacity) > 0) {
            element.style.opacity = savedOpacity;
          }
        });

        // Remove will-change after animations complete for better performance
        setTimeout(() => {
          const introCard = document.querySelector('.intro-card') as HTMLElement;
          if (introCard) {
            introCard.style.willChange = 'auto';
          }

          const testimonialCards = document.querySelectorAll('.testimonial-card');
          testimonialCards.forEach(card => {
            const element = card as HTMLElement;
            element.style.willChange = 'auto';
          });
        }, 2000); // After all animations complete
      }, 1500);
    }
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

    const { name, phone, city, message } = this.contactForm.value;

    // Format email content
    const subject = `הודעה חדשה מ ${name}`;
    const html = `
      <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
        <h1 style="font-size: 22px; color: #222; margin: 0 0 8px;">התקבלה פנייה מהאתר</h1>
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
    this.sendMailService.sendEmail('Joelkr@gmail.com', subject, html, smtpConfig.from, text).subscribe({
      next: (res) => {
        this.sending = false;
        if (!res?.localOpen) {
          this.sent = true;
          this.submitted = false;
          this.contactForm.reset();
        }
      },
      error: (err) => {
        this.sending = false;
        this.errorMsg = err?.error?.message || 'שליחה נכשלה';
      },
    });
  }

  ngOnDestroy(): void {
    // Clean up JSON-LD script when component is destroyed
    if (this.isBrowser) {
      const script = document.getElementById('ld-json-main-page');
      if (script) {
        script.remove();
      }
    }
  }
}
