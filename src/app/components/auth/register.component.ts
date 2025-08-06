import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Pizza decoration at top -->
        <div class="relative mb-8">
          <div class="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div class="w-32 h-32 bg-gradient-to-br from-green-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V7h10v2z"/>
                </svg>
              </div>
            </div>
            <!-- Floating vegetables -->
            <div class="absolute -top-4 -left-8 w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
            <div class="absolute -top-2 -right-6 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <div class="absolute -bottom-2 left-8 w-5 h-5 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
          </div>
        </div>

        <!-- Register Form -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 mt-16">
          <h2 class="text-3xl font-bold text-red-700 text-center mb-8 font-serif">
            Regístrate
          </h2>

          <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="space-y-6">
            <div>
              <label class="block text-red-700 font-semibold mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                [(ngModel)]="name"
                required
                class="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="Tu nombre completo"
              />
            </div>

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
                minlength="6"
                class="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="block text-red-700 font-semibold mb-2">
                Confirmar Contraseña:
              </label>
              <input
                type="password"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
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
              <span *ngIf="!isLoading()">Registrarme</span>
              <span *ngIf="isLoading()" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              ¿Ya te registraste? 
              <a routerLink="/login" class="text-red-600 hover:text-red-700 font-semibold ml-1">
                Inicia Sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // Simulate API call delay
    setTimeout(() => {
      const success = this.authService.register(this.name, this.email, this.password);
      
      if (success) {
        this.router.navigate(['/menu']);
      } else {
        this.errorMessage.set('Este email ya está registrado');
      }
      
      this.isLoading.set(false);
    }, 1000);
  }
}
