import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Pizza decoration at top -->
        <div class="relative mb-8">
          <div class="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div class="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <div class="w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center">
                <!-- Pizza Icon -->
                <svg class="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="8" cy="9" r="1"/>
                  <circle cx="16" cy="9" r="1"/>
                  <circle cx="9" cy="15" r="1"/>
                  <circle cx="15" cy="15" r="1"/>
                </svg>
              </div>
            </div>
            <!-- Floating ingredients -->
            <div class="absolute -top-4 -left-8 w-6 h-6 bg-red-500 rounded-full animate-bounce"></div>
            <div class="absolute -top-2 -right-6 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <div class="absolute -bottom-2 left-8 w-5 h-5 bg-yellow-500 rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
          </div>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 mt-16">
          <h2 class="text-3xl font-bold text-red-700 text-center mb-8 font-serif">
            Inicio de sesión
          </h2>

          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="space-y-6">
            <div>
              <label class="block text-red-700 font-semibold mb-2">
                Correo
              </label>
              <input
                type="email"
                name="email"
                [(ngModel)]="email"
                required
                class="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label class="block text-red-700 font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                [(ngModel)]="password"
                required
                class="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div *ngIf="errorMessage()" class="text-red-600 text-sm text-center">
              {{ errorMessage() }}
            </div>

            <button
              type="submit"
              [disabled]="isLoading()"
              class="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <span *ngIf="!isLoading()">Iniciar Sesión</span>
              <span *ngIf="isLoading()" class="flex items-center justify-center">
                <!-- Pizza spinning icon -->
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="9" cy="9" r="0.8"/>
                  <circle cx="15" cy="9" r="0.8"/>
                  <circle cx="10" cy="15" r="0.8"/>
                  <circle cx="14" cy="15" r="0.8"/>
                </svg>
                Iniciando...
              </span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              ¿No tienes cuenta? 
              <a routerLink="/register" class="text-red-600 hover:text-red-700 font-semibold ml-1">
                Regístrate
              </a>
            </p>
          </div>

          <!-- Demo credentials info -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-800 font-semibold mb-2">🍕 Demo Login (Admin):</p>
            <p class="text-xs text-blue-700 mb-1">📧 Email: james@example.com</p>
            <p class="text-xs text-blue-700 mb-2">🔑 Password: cualquier contraseña</p>
            <p class="text-xs text-blue-600 italic">Con este usuario puedes acceder al panel de administrador para agregar, editar y eliminar pizzas.</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = "";
  password = "";
  isLoading = signal(false);
  errorMessage = signal("");

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage.set("Por favor completa todos los campos");
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set("");

    // Simulate API call delay
    setTimeout(() => {
      const success = this.authService.login(this.email, this.password);

      if (success) {
        this.router.navigate(["/menu"]);
      } else {
        this.errorMessage.set("Credenciales incorrectas");
      }

      this.isLoading.set(false);
    }, 1000);
  }
}
