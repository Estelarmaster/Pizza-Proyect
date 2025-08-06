import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { OrderService } from "../../services/order.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black">
      <!-- Header -->
      <div class="bg-black text-white p-4">
        <button
          (click)="goBack()"
          class="flex items-center space-x-2 text-orange-300 hover:text-white transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Profile Section -->
      <div class="px-6 py-8">
        <!-- User Avatar and Name -->
        <div class="text-center mb-8">
          <div class="relative inline-block">
            <img
              *ngIf="authService.user()?.avatar; else defaultAvatar"
              [src]="authService.user()?.avatar"
              [alt]="authService.user()?.name"
              class="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-xl"
            />
            <ng-template #defaultAvatar>
              <div
                class="w-32 h-32 bg-orange-600 rounded-full flex items-center justify-center border-4 border-orange-400 shadow-xl"
              >
                <span class="text-4xl font-bold text-white">{{
                  authService.user()?.name?.charAt(0)
                }}</span>
              </div>
            </ng-template>
          </div>
          <h1 class="text-3xl font-bold text-white mt-4">
            {{ authService.user()?.name }}
          </h1>
          <p class="text-gray-400 mt-2">{{ authService.user()?.email }}</p>
        </div>

        <!-- Account and Settings Title -->
        <h2 class="text-2xl font-bold text-white text-center mb-8">
          Cuenta y Configuración
        </h2>

        <!-- Menu Options -->
        <div class="space-y-4 max-w-md mx-auto">
          <!-- My Profile -->
          <button
            class="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span class="font-bold text-gray-800">Mi Perfil</span>
            <svg
              class="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Track Order -->
          <a
            routerLink="/orders"
            class="block w-full bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span class="font-bold text-gray-800">Rastrear Pedidos</span>
            <svg
              class="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>

          <!-- Terms & Conditions -->
          <button
            class="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span class="font-bold text-gray-800">Términos y Condiciones</span>
            <svg
              class="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Privacy -->
          <button
            class="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span class="font-bold text-gray-800">Privacidad</span>
            <svg
              class="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Rate Us -->
          <button
            class="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span class="font-bold text-gray-800">Califícanos</span>
            <svg
              class="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Admin Dashboard (if admin) -->
          <a
            *ngIf="authService.isAdmin()"
            routerLink="/admin"
            class="block w-full bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between hover:bg-blue-700 transition-colors"
          >
            <span class="font-bold">Panel de Administración</span>
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        <!-- Sign Out Button -->
        <div class="text-center mt-12">
          <button
            (click)="signOut()"
            class="inline-flex items-center space-x-2 text-red-500 hover:text-red-400 font-bold transition-colors"
          >
            <span>Cerrar Sesión</span>
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private router: Router,
  ) {}

  goBack() {
    this.router.navigate(["/"]);
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
