import { Injectable } from "@angular/core";

declare global {
  interface Window {
    paypal?: any;
  }
}

@Injectable({ providedIn: 'root' })
export class PaypalService {
  private scriptLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  // Public client ID provided by the user (safe for frontend use)
  private readonly clientId = 'AfRMFQl6BxAY3n6V2DrC2ShW2U-aXPD8Vu-i3vFkmtnE__xljj9Z_Y9AVLc19-pfEaFiND4QWwuHq6M1';

  loadSdk(currency: string = 'COP'): Promise<void> {
    if (this.scriptLoaded) return Promise.resolve();
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=${currency}`;
      script.async = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });

    return this.loadingPromise;
  }
}
