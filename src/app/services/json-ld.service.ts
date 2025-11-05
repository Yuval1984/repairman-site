import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface JsonLdSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class JsonLdService {
  private platformId = inject(PLATFORM_ID);

  /**
   * Inject JSON-LD schema into the page head
   * @param id Unique identifier for the script tag (to prevent duplicates)
   * @param schema The JSON-LD schema object
   */
  injectSchema(id: string, schema: JsonLdSchema): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove existing schema with the same ID if it exists
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new schema
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  /**
   * Remove schema from the page head
   * @param id The script tag identifier
   */
  removeSchema(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const script = document.getElementById(id);
    if (script) {
      script.remove();
    }
  }

  /**
   * Get the main page schema (Appliance Repair Service business)
   */
  getMainPageSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'טכנו ג׳ו - טכנאי מוצרי חשמל ביתיים',
      alternateName: 'Repairmen.co.il',
      image: 'https://repairmen.co.il/assets/appliance%20technician/profile.png',
      url: 'https://repairmen.co.il',
      telephone: '+972544818383',
      priceRange: '₪₪',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'דרך ארץ 12',
        addressLocality: 'חריש',
        addressRegion: 'מחוז חיפה',
        postalCode: '3877700',
        addressCountry: 'IL'
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
          opens: '08:00',
          closes: '20:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '08:00',
          closes: '15:00'
        }
      ],
      description: 'שירותי תיקון מוצרי חשמל ביתיים מקצועי בישראל. טכנאי מוצרי חשמל מקצועי לתיקון מכונות כביסה, מקררים, מדיחי כלים, תנורים, מייבשי כביסה, מזגנים ומיקרוגלים. חריש, פרדס חנה, השרון וזכרון יעקב.',
      areaServed: [
        { '@type': 'City', name: 'חריש' },
        { '@type': 'City', name: 'פרדס חנה' },
        { '@type': 'City', name: 'חדרה' },
        { '@type': 'City', name: 'זכרון יעקב' },
        { '@type': 'State', name: 'השרון' },
        { '@type': 'Country', name: 'ישראל' }
      ],
      sameAs: [
        'https://www.facebook.com/p/%D7%98%D7%9B%D7%A0%D7%95-%D7%92%D7%95-%D7%98%D7%9B%D7%A0%D7%90%D7%99-%D7%9E%D7%95%D7%A6%D7%A8%D7%99-%D7%97%D7%A9%D7%9E%D7%9C-100032396300937/?locale=he_IL',
        'https://easy.co.il/page/21595092',
        'https://www.b144.co.il/b144_sip/4A1404134470655D4C10001B457866554A/'
      ],
      founder: {
        '@type': 'Person',
        name: 'ג\'ואל',
        jobTitle: 'טכנאי מוצרי חשמל ביתיים וחשמלאי מוסמך',
        telephone: '+972544818383'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'שירותי תיקון מוצרי חשמל ביתיים',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'תיקון מכונות כביסה',
              description: 'תיקון כל סוגי מכונות הכביסה מכל החברות: LG, BEKO, WHIRLPOOL, SIEMENS, BOSCH, SAMSUNG, AEG'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'תיקון מייבשי כביסה',
              description: 'תיקון מייבשי כביסה מכל החברות'
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
              name: 'תיקון תנורי אפייה וכיריים',
              description: 'תיקון תנורי אפייה וכיריים מכל החברות'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'תיקון מקררים ומקפיאים',
              description: 'תיקון כל סוגי המקררים והמקפיאים מכל החברות (כולל מסחרי). מומחה לחברות: BEKO, BLUMBERG, LG, TADIRAN, AMCOR, AMANA, SAMSUNG. שירותים: מילוי גז, וואקום גז, תיקון דליפות, החלפת מדחסים, מאווררים, גופי חימום, תרמוסטטים, פילטרים, אייס מייקרים, כרטיסי בקרה וחיישנים'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'תיקון מזגנים',
              description: 'תיקון מזגנים כולל אינוורטר ותלת פאזי (עד 5 טון)'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'תיקון מיקרוגלים ותנורי אפייה',
              description: 'תיקון מיקרוגלים ותנורי אפייה מכל החברות'
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
      }
    };
  }

  /**
   * Get the electrician page schema (Electrician business with detailed services)
   */
  getElectricianPageSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Electrician',
      name: 'טכנו ג׳ו - חשמלאי מוסמך',
      alternateName: 'Joe Tecno - Licensed Electrician',
      identifier: '975186',
      url: 'https://repairmen.co.il/electrician',
      image: 'https://repairmen.co.il/assets/electrician.jpg',
      telephone: '+972544818383',
      priceRange: '₪₪',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'דרך ארץ 12',
        addressLocality: 'חריש',
        addressRegion: 'מחוז חיפה',
        postalCode: '3877700',
        addressCountry: 'IL'
      },
      areaServed: [
        { '@type': 'City', name: 'חריש' },
        { '@type': 'City', name: 'חדרה' },
        { '@type': 'City', name: 'פרדס חנה' },
        { '@type': 'City', name: 'זכרון יעקב' },
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
              name: 'התקנת תאורה לבית ולגינה',
              description: 'התקנת גופי תאורה פנימית וחיצונית, תאורת גינה, ספוטים ותאורת חירום'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'החלפת שקעים ומפסקים',
              description: 'החלפת שקעים, מפסקים, נקודות חשמל ותאורה בצורה מקצועית ובטוחה'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'שדרוג והחלפת לוח חשמל',
              description: 'שדרוג והחלפת לוח חשמל ראשי או משני, כולל מפסקים אוטומטיים ופחתים'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'התקנת חיבור תלת־פאזי והגדלת כוח',
              description: 'התקנת חיבור תלת־פאזי לכיריים, תנורים ומכשירים כבדים, והגדלת כוח חשמלי'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'החלפת גוף חימום לדוד (פלאנג\')',
              description: 'החלפת גוף חימום לדוד פלאנג\', כולל בדיקה ותיקון תקלות נוספות'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'הוספת או הזזת נקודות חשמל',
              description: 'הוספת נקודות חשמל חדשות או הזזת נקודות קיימות לשיפוץ או שינוי במבנה'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'התקנת שעון שבת לדוד או מזגן',
              description: 'התקנת שעון שבת לדוד, מזגן, או מכשירים אחרים, כולל תכנות ושמירה על כשרות'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'התקנת רכיבים חכמים לבית חכם',
              description: 'התקנת רכיבים חכמים לבית חכם: תרמוסטטים, מפסקים חכמים, מערכות בקרה ואוטומציה'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'איתור ותיקון תקלות חשמל',
              description: 'איתור ותיקון תקלות חשמל: זיהוי בעיות, אבחון מקצועי ותיקון מהיר ובטוח'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'טיפול בקצרים, עומסים וזליגות חשמל',
              description: 'טיפול בקצרים חשמליים, עומסים יתרים וזליגות חשמל בצורה מקצועית ובטוחה'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'בדיקות חשמל והארקה מקצועיות',
              description: 'ביצוע בדיקות חשמל והארקה מקצועיות, כולל אישורים ותעודות תקינות'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'חשמלאי שירות למוצרי חשמל ביתיים',
              description: 'שירות מקצועי למוצרי חשמל ביתיים: תיקון, תחזוקה וחיבור מכשירים חשמליים'
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
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
          opens: '08:00',
          closes: '20:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '08:00',
          closes: '15:00'
        }
      ],
      description: 'חשמלאי מוסמך #975186 המציע שירותי חשמל מקצועיים מהירים ואמינים לבתים ועסקים בישראל. תיקון קצרים, התקנת תאורה, החלפת לוחות חשמל ובדיקות בטיחות.',
      founder: {
        '@type': 'Person',
        name: 'ג\'ואל',
        jobTitle: 'חשמלאי מוסמך',
        telephone: '+972544818383'
      },
      sameAs: [
        'https://www.facebook.com/p/%D7%98%D7%9B%D7%A0%D7%95-%D7%92%D7%95-%D7%98%D7%9B%D7%A0%D7%90%D7%99-%D7%9E%D7%95%D7%A6%D7%A8%D7%99-%D7%97%D7%A9%D7%9E%D7%9C-100032396300937/?locale=he_IL',
        'https://easy.co.il/page/21595092',
        'https://www.b144.co.il/b144_sip/4A1404134470655D4C10001B457866554A/'
      ]
    };
  }
}

