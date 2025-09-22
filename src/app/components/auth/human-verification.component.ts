import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-human-verification",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mt-2 select-none">
      <div class="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-red-700">Verificación humana</p>
            <p class="text-xs text-orange-700">Escribe el texto de la imagen</p>
          </div>
          <div>
            <span
              class="px-2 py-1 rounded text-xs"
              [class]="isVerified() ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'"
            >{{ isVerified() ? 'Verificado' : 'Pendiente' }}</span>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-3">
          <canvas
            #captchaCanvas
            width="200"
            height="70"
            class="rounded-md border-2 border-orange-200 bg-white"
            aria-label="Imagen de verificación con letras distorsionadas"
          ></canvas>
          <button type="button" (click)="regenerate()" class="px-3 py-2 text-xs font-semibold bg-white border-2 border-orange-200 rounded-lg hover:border-red-500 text-red-700">Nueva imagen</button>
        </div>

        <div class="mt-3">
          <label class="block text-sm text-red-700 mb-1">Ingresa el texto mostrado</label>
          <div class="flex gap-2 items-center">
            <input
              type="text"
              [(ngModel)]="inputText"
              (input)="check()"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              class="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-red-500"
              aria-label="Campo para escribir el texto de la imagen"
            />
          </div>
          <p *ngIf="error()" class="text-xs text-red-600 mt-2">Texto incorrecto, vuelve a intentarlo</p>
          <p *ngIf="isVerified()" class="text-xs text-green-700 mt-2">Perfecto, puedes continuar</p>
        </div>
      </div>
    </div>
  `,
})
export class HumanVerificationComponent implements AfterViewInit {
  @Output() verifiedChange = new EventEmitter<boolean>();
  @ViewChild('captchaCanvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;

  private targetText = signal<string>("");
  isVerified = signal(false);
  error = signal(false);
  inputText = "";

  ngAfterViewInit(): void {
    this.regenerate();
  }

  regenerate(): void {
    this.targetText.set(this.generateText(6));
    this.inputText = "";
    this.error.set(false);
    this.setVerified(false);
    this.renderCaptcha();
  }

  check(): void {
    const normalizedInput = (this.inputText || "").trim().toUpperCase();
    const ok = normalizedInput.length > 0 && normalizedInput === this.targetText().toUpperCase();
    this.error.set(!ok && normalizedInput.length > 0);
    this.setVerified(ok);
  }

  private setVerified(v: boolean): void {
    if (this.isVerified() !== v) {
      this.isVerified.set(v);
      this.verifiedChange.emit(v);
    }
  }

  private generateText(length: number): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0, O, I, 1 para evitar confusiones
    let out = "";
    for (let i = 0; i < length; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  private renderCaptcha(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Fondo con ligero gradiente
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#fff7ed');
    gradient.addColorStop(1, '#ffedd5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Ruido de líneas de fondo
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, Math.random() * h);
      ctx.bezierCurveTo(
        Math.random() * w, Math.random() * h,
        Math.random() * w, Math.random() * h,
        Math.random() * w, Math.random() * h
      );
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.strokeStyle = `rgba(${150 + Math.floor(Math.random()*80)}, ${120 + Math.floor(Math.random()*80)}, ${80 + Math.floor(Math.random()*80)}, 0.35)`;
      ctx.stroke();
    }

    // Dibujo de caracteres con rotaciones y pequeñas traslaciones
    const text = this.targetText();
    const charCount = text.length;
    const charWidth = w / (charCount + 1);

    for (let i = 0; i < charCount; i++) {
      const ch = text[i];
      const fontSize = 28 + Math.floor(Math.random() * 8);
      const angle = (Math.random() * 40 - 20) * (Math.PI / 180); // -20° a 20°
      const x = charWidth * (i + 1);
      const y = h / 2 + (Math.random() * 10 - 5);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `bold ${fontSize}px 'Lobster', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const fill = `hsl(${Math.floor(Math.random()*30 + 10)}, 80%, 40%)`;
      ctx.fillStyle = fill;
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 2;
      ctx.strokeText(ch, 0, 0);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    }

    // Puntos de ruido superpuestos
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      ctx.fillStyle = `rgba(${100 + Math.floor(Math.random()*100)}, ${100 + Math.floor(Math.random()*100)}, ${100 + Math.floor(Math.random()*100)}, ${Math.random()*0.5})`;
      ctx.arc(rx, ry, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
