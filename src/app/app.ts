import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter, Subscription } from 'rxjs';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

function gtagSafe(...args: any[]) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (window.gtag) window.gtag(...args);
  else window.dataLayer.push(args);
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private sub?: Subscription;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Initial page view
      gtagSafe('config', 'AW-813059440', { page_path: this.router.url || '/' });
      gtagSafe('config', 'G-TXWNXERZGF', { page_path: this.router.url || '/' });
      // Route change tracking (SPA)
      this.sub = this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((e: any) => {
          gtagSafe('config', 'AW-813059440', { page_path: e.urlAfterRedirects });
          gtagSafe('config', 'G-TXWNXERZGF', { page_path: e.urlAfterRedirects });
        });
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
