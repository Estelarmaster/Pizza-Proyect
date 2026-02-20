import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CurrencyService {
  private readonly key = "copToUsdRate";
  private readonly defaultRate = 0.00025; // 1 COP = 0.00025 USD (aprox)

  getCopToUsdRate(): number {
    const raw = localStorage.getItem(this.key);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : this.defaultRate;
  }

  setCopToUsdRate(rate: number): void {
    if (!Number.isFinite(rate) || rate <= 0) return;
    localStorage.setItem(this.key, String(rate));
  }

  convertCopToUsd(copAmount: number): number {
    const rate = this.getCopToUsdRate();
    const usd = copAmount * rate;
    return Math.max(0.01, parseFloat(usd.toFixed(2)));
  }
}
