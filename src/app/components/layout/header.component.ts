import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-amber-900 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-4">
            <!-- Menu button for mobile -->
            <button
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              class="md:hidden p-2 rounded-md hover:bg-amber-800"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <a routerLink="/" class="flex items-center space-x-2">
              <svg
                class="w-8 h-8 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
              <span class="text-xl font-bold font-serif">Mozzarella</span>
            </a>
          </div>

          <!-- Location (only on larger screens) -->
          <div class="hidden md:flex items-center space-x-2 text-cream-200">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="text-sm">Ubicación</span>
          </div>

          <!-- Right side navigation -->
          <div class="flex items-center space-x-4">
            <!-- Cart -->
            <a
              routerLink="/cart"
              class="relative p-2 hover:bg-amber-800 rounded-md"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19v2m6-2v2"
                />
              </svg>
              <span
                *ngIf="cartService.itemCount() > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartService.itemCount() }}
              </span>
            </a>

            <!-- User menu -->
            <div class="relative" *ngIf="authService.isAuthenticated()">
              <button
                (click)="userMenuOpen.set(!userMenuOpen())"
                class="flex items-center space-x-2 p-2 hover:bg-amber-800 rounded-md"
              >
                <img
                  *ngIf="authService.user()?.avatar; else defaultAvatar"
                  [src]="authService.user()?.avatar"
                  [alt]="authService.user()?.name"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <ng-template #defaultAvatar>
                  <div
                    class="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center"
                  >
                    <span class="text-sm font-semibold">{{
                      authService.user()?.name?.charAt(0)
                    }}</span>
                  </div>
                </ng-template>
              </button>

              <!-- User dropdown -->
              <div
                *ngIf="userMenuOpen()"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <a
                  routerLink="/profile"
                  (click)="userMenuOpen.set(false)"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </a>
                <a
                  routerLink="/orders"
                  (click)="userMenuOpen.set(false)"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mis Órdenes
                </a>
                <div
                  *ngIf="authService.isAdmin()"
                  class="border-t border-gray-100"
                >
                  <a
                    routerLink="/admin"
                    (click)="userMenuOpen.set(false)"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard Admin
                  </a>
                </div>
                <div class="border-t border-gray-100">
                  <button
                    (click)="logout()"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>

            <!-- Login button for guests -->
            <a
              *ngIf="!authService.isAuthenticated()"
              routerLink="/login"
              class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Iniciar Sesión
            </a>
          </div>
        </div>

        <!-- Mobile menu -->
        <div
          *ngIf="mobileMenuOpen()"
          class="md:hidden border-t border-amber-800 pt-4 pb-4"
        >
          <div class="space-y-2">
            <a
              routerLink="/menu"
              routerLinkActive="bg-amber-800"
              (click)="mobileMenuOpen.set(false)"
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
            >
              Menú
            </a>
            <a
              routerLink="/cart"
              routerLinkActive="bg-amber-800"
              (click)="mobileMenuOpen.set(false)"
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
            >
              Carrito ({{ cartService.itemCount() }})
            </a>
            <div *ngIf="authService.isAuthenticated(); else mobileLogin">
              <a
                routerLink="/profile"
                routerLinkActive="bg-amber-800"
                (click)="mobileMenuOpen.set(false)"
                class="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
              >
                Mi Perfil
              </a>
              <a
                routerLink="/orders"
                routerLinkActive="bg-amber-800"
                (click)="mobileMenuOpen.set(false)"
                class="block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800"
              >
                Mis Órdenes
              </a>
              <button
                (click)="logout()"
                class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-amber-800"
              >
                Cerrar Sesión
              </button>
            </div>
            <ng-template #mobileLogin>
              <a
                routerLink="/login"
                (click)="mobileMenuOpen.set(false)"
                class="block px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
              >
                Iniciar Sesión
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  constructor(
    public authService: AuthService,
    public cartService: CartService,
  ) {}

  logout() {
    this.authService.logout();
    this.userMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
  }
}
