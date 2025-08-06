import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <!-- Splash Screen / Loading -->
      <div
        *ngIf="isLoading()"
        class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 to-orange-300"
      >
        <div class="text-center space-y-8">
          <!-- Pizza Graphics -->
          <div class="relative">
            <div
              class="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-orange-400 opacity-70 animate-pulse"
            ></div>
            <div class="relative z-10 bg-white rounded-full p-8 shadow-2xl">
              <svg
                class="w-32 h-32 text-orange-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
            </div>
            <div
              class="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-red-400 opacity-60 animate-bounce"
            ></div>
          </div>

          <!-- Mozzarella Title -->
          <h1 class="text-6xl font-bold text-red-700 font-serif italic">
            Mozzarella
          </h1>

          <!-- Pizza Slices -->
          <div class="flex justify-center space-x-4">
            <div
              class="w-8 h-8 bg-yellow-400 rounded-full transform rotate-45"
            ></div>
            <div class="w-6 h-6 bg-red-400 rounded-full"></div>
            <div
              class="w-8 h-8 bg-green-400 rounded-full transform rotate-12"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="!isLoading()" class="min-h-screen">
        <!-- Hero Section -->
        <section
          class="relative h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-500 to-pink-500"
        >
          <div class="absolute inset-0 bg-black opacity-30"></div>

          <!-- Pizza Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div
              class="absolute top-20 left-20 w-32 h-32 rounded-full border-4 border-white"
            ></div>
            <div
              class="absolute bottom-32 right-32 w-24 h-24 rounded-full border-2 border-white"
            ></div>
            <div
              class="absolute top-1/2 left-1/4 w-16 h-16 rounded-full border-2 border-white"
            ></div>
          </div>

          <div
            class="relative z-10 text-center text-white max-w-4xl mx-auto px-6"
          >
            <h1 class="text-5xl md:text-7xl font-bold mb-6 font-serif">
              ¡Bienvenido a<br />
              <span class="text-yellow-300">Mozzarella</span>
            </h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90">
              Las mejores pizzas artesanales de la ciudad, preparadas con
              ingredientes frescos y mucho amor
            </p>

            <div
              class="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center"
            >
              <button
                *ngIf="!authService.isAuthenticated()"
                routerLink="/login"
                class="block w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Iniciar Sesión
              </button>

              <button
                routerLink="/menu"
                class="block w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-brown-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Ver Menú
              </button>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="py-20 bg-white">
          <div class="max-w-6xl mx-auto px-6">
            <h2 class="text-4xl font-bold text-center mb-16 text-gray-800">
              ¿Por qué elegir Mozzarella?
            </h2>

            <div class="grid md:grid-cols-3 gap-12">
              <div class="text-center">
                <div
                  class="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    class="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-4">Entrega Rápida</h3>
                <p class="text-gray-600">
                  Entregamos tu pizza caliente en menos de 30 minutos
                </p>
              </div>

              <div class="text-center">
                <div
                  class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    class="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-4">Ingredientes Frescos</h3>
                <p class="text-gray-600">
                  Solo usamos los ingredientes más frescos y de la mejor calidad
                </p>
              </div>

              <div class="text-center">
                <div
                  class="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    class="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-bold mb-4">Hecho con Amor</h3>
                <p class="text-gray-600">
                  Cada pizza es preparada con cariño por nuestros chefs expertos
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 bg-gradient-to-r from-red-600 to-orange-600">
          <div class="max-w-4xl mx-auto text-center px-6">
            <h2 class="text-4xl font-bold text-white mb-6">
              ¿Listo para ordenar?
            </h2>
            <p class="text-xl text-white opacity-90 mb-8">
              Descubre nuestro delicioso menú y haz tu pedido en minutos
            </p>
            <button
              routerLink="/menu"
              class="bg-white text-red-600 font-bold py-4 px-12 rounded-full text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              Explorar Menú
            </button>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  isLoading = signal(true);

  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Show splash screen for 3 seconds
    setTimeout(() => {
      this.isLoading.set(false);
    }, 3000);

    this.authService.checkAuthStatus();
  }
}
