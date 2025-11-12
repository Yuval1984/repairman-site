/**
 * Google Ads conversion tracking helper
 */

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

/**
 * Track a Google Ads conversion event
 * @param sendTo - Conversion label in format 'AW-813059440/YOUR_LABEL'
 * 
 * @example
 * trackConversion('AW-813059440/phone_click');
 * trackConversion('AW-813059440/form_submit');
 */
export function trackConversion(sendTo: string) {
  gtagSafe('event', 'conversion', { send_to: sendTo });
}

