import { Injectable } from "@angular/core";

declare global {
  interface Window {
    paypal?: any;
  }
}

@Injectable({ providedIn: "root" })
export class PaypalService {
  private scriptLoaded = false;
  private loadingPromise: Promise<void> | null = null;
  private currentCurrency: string | null = null;

  // Public client ID provided by the user (safe for frontend use)
  private readonly clientId =
    "AfRMFQl6BxAY3n6V2DrC2ShW2U-aXPD8Vu-i3vFkmtnE__xljj9Z_Y9AVLc19-pfEaFiND4QWwuHq6M1";

  loadSdk(currency: string = "USD"): Promise<void> {
    // If already loaded with same currency, reuse
    if (this.scriptLoaded && this.currentCurrency === currency)
      return Promise.resolve();
    // If loaded but currency differs, remove existing SDK and reload
    if (this.scriptLoaded && this.currentCurrency !== currency) {
      const existing = document.querySelector(
        'script[src*="paypal.com/sdk/js"]',
      ) as HTMLScriptElement | null;
      if (existing) existing.remove();
      // @ts-ignore
      delete (window as any).paypal;
      this.scriptLoaded = false;
    }
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=${currency}`;
      script.async = true;
      script.onload = () => {
        this.scriptLoaded = true;
        this.currentCurrency = currency;
        resolve();
      };
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });

    return this.loadingPromise;
  }
}
