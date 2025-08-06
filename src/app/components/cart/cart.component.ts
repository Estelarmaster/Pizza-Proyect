import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-amber-900">
      <!-- Header -->
      <div class="bg-amber-900 text-white p-4">
        <div class="flex items-center justify-between">
          <button 
            (click)="goBack()"
            class="flex items-center space-x-2 text-orange-300 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-2xl font-bold">Carrito</h1>
          <div></div>
        </div>
      </div>

      <!-- Cart Items -->
      <div class="p-4 space-y-4">
        <div *ngIf="cartService.cartItems().length === 0" class="text-center py-16">
          <svg class="w-24 h-24 text-orange-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19v2m6-2v2"/>
          </svg>
          <p class="text-white text-xl mb-4">Tu carrito está vacío</p>
          <a routerLink="/menu" 
             class="bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-bold py-3 px-6 rounded-lg transition-colors">
            Explorar Menú
          </a>
        </div>

        <!-- Cart Item Cards -->
        <div *ngFor="let item of cartService.cartItems(); let i = index" 
             class="bg-white rounded-xl p-4 shadow-lg">
          <div class="flex items-center space-x-4">
            <!-- Selection Circle -->
            <div class="w-5 h-5 border-2 border-red-600 rounded-full flex items-center justify-center">
              <div class="w-3 h-3 bg-red-600 rounded-full"></div>
            </div>

            <!-- Pizza Image -->
            <img 
              [src]="item.pizza.image" 
              [alt]="item.pizza.name"
              class="w-20 h-20 rounded-full object-cover border-2 border-orange-200"
            />

            <!-- Pizza Info -->
            <div class="flex-1">
              <h3 class="font-bold text-lg text-gray-800">{{ item.pizza.name }}</h3>
              <p class="text-red-600 font-bold">₹{{ item.pizza.price }}</p>
              <p class="text-sm text-gray-600">Tamaño: {{ item.size }}</p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center space-x-2">
              <button
                (click)="decreaseQuantity(i)"
                class="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center font-bold text-gray-800 hover:bg-orange-300 transition-colors"
              >
                -
              </button>
              <span class="font-bold text-lg w-8 text-center">{{ item.quantity }}</span>
              <button
                (click)="increaseQuantity(i)"
                class="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center font-bold text-gray-800 hover:bg-orange-300 transition-colors"
              >
                +
              </button>
            </div>

            <!-- Delete Button -->
            <button
              (click)="removeItem(i)"
              class="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
            >
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div *ngIf="cartService.cartItems().length > 0" class="mt-8">
        <div class="bg-white rounded-t-3xl p-6 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Subtotal</span>
            <span class="font-bold text-red-600">₹{{ cartService.subtotal() }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Impuestos</span>
            <span class="font-bold text-red-600">₹{{ cartService.taxes() }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Entrega</span>
            <span class="font-bold text-red-600">
              {{ cartService.deliveryFee() === 0 ? 'Gratis' : '₹' + cartService.deliveryFee() }}
            </span>
          </div>
          
          <div class="border-t pt-4">
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-gray-800">Total</span>
              <span class="text-xl font-bold text-red-600">₹{{ cartService.total() }}</span>
            </div>
          </div>

          <button
            (click)="proceedToCheckout()"
            [disabled]="!authService.isAuthenticated()"
            class="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors duration-200 mt-6"
          >
            <span *ngIf="authService.isAuthenticated()">Proceder al Pago</span>
            <span *ngIf="!authService.isAuthenticated()">Inicia Sesión para Continuar</span>
          </button>

          <div *ngIf="!authService.isAuthenticated()" class="text-center mt-4">
            <a routerLink="/login" class="text-red-600 hover:text-red-700 font-semibold">
              Inicia sesión aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent {
  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  goBack() {
    this.router.navigate(['/menu']);
  }

  increaseQuantity(index: number) {
    const item = this.cartService.cartItems()[index];
    this.cartService.updateQuantity(index, item.quantity + 1);
  }

  decreaseQuantity(index: number) {
    const item = this.cartService.cartItems()[index];
    this.cartService.updateQuantity(index, item.quantity - 1);
  }

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }

  proceedToCheckout() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
