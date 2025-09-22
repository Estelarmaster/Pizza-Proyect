import { Component, EventEmitter, Output, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-human-verification",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mt-2">
      <div class="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-red-700">Verificación humana</p>
            <p class="text-xs text-orange-700">Resuelve el pequeño desafío para continuar</p>
          </div>
          <div>
            <span
              class="px-2 py-1 rounded text-xs"
              [class]="isVerified() ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'"
            >{{ isVerified() ? 'Verificado' : 'Pendiente' }}</span>
          </div>
        </div>

        <div class="mt-3">
          <label class="block text-sm text-red-700 mb-1">¿Cuánto es {{ a() }} + {{ b() }}?</label>
          <div class="flex gap-2 items-center">
            <input
              type="number"
              [(ngModel)]="answer"
              (input)="check()"
              class="w-32 px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-red-500"
              aria-label="Resultado de la suma"
            />
            <button type="button" (click)="regenerate()" class="px-3 py-2 text-xs font-semibold bg-white border-2 border-orange-200 rounded-lg hover:border-red-500 text-red-700">Nuevo desafío</button>
          </div>
          <p *ngIf="error()" class="text-xs text-red-600 mt-2">Respuesta incorrecta, inténtalo de nuevo</p>
          <p *ngIf="isVerified()" class="text-xs text-green-700 mt-2">Perfecto, puedes continuar</p>
        </div>
      </div>
    </div>
  `,
})
export class HumanVerificationComponent {
  @Output() verifiedChange = new EventEmitter<boolean>();

  private _a = signal<number>(0);
  private _b = signal<number>(0);
  a = this._a.asReadonly();
  b = this._b.asReadonly();

  isVerified = signal(false);
  error = signal(false);
  answer: string | number = "";

  constructor() {
    this.regenerate();
  }

  regenerate(): void {
    // números entre 1 y 9 para evitar respuestas negativas o complicadas
    this._a.set(Math.floor(Math.random() * 9) + 1);
    this._b.set(Math.floor(Math.random() * 9) + 1);
    this.answer = "";
    this.error.set(false);
    this.setVerified(false);
  }

  check(): void {
    const parsed = typeof this.answer === 'string' ? parseInt(this.answer, 10) : this.answer;
    if (Number.isFinite(parsed)) {
      const ok = parsed === this._a() + this._b();
      this.error.set(!ok && this.answer !== "");
      this.setVerified(!!ok);
    } else {
      this.error.set(false);
      this.setVerified(false);
    }
  }

  private setVerified(v: boolean): void {
    if (this.isVerified() !== v) {
      this.isVerified.set(v);
      this.verifiedChange.emit(v);
    }
  }
}
