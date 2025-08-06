import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { DeliveryAddress } from '../../models/pizza.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
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
          <h1 class="text-2xl font-bold">Checkout</h1>
          <div></div>
        </div>
      </div>

      <div class="p-4 space-y-6">
        <!-- Shipping Address Section -->
        <div>
          <h2 class="text-xl font-bold text-white mb-4">Dirección de Entrega</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Home Address -->
            <div class="relative">
              <button
                (click)="selectAddress(homeAddress)"
                [class]="selectedAddress() === homeAddress 
                  ? 'border-4 border-yellow-400 bg-orange-200' 
                  : 'border-2 border-orange-300 bg-white hover:bg-orange-50'"
                class="w-full p-6 rounded-xl transition-all duration-200 text-left"
              >
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xl font-bold text-amber-900">Home</h3>
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">
                  {{ homeAddress.address }}, {{ homeAddress.city }}, {{ homeAddress.country }}, {{ homeAddress.postalCode }}
                </p>
              </button>
            </div>

            <!-- Office Address -->
            <div class="relative">
              <button
                (click)="selectAddress(officeAddress)"
                [class]="selectedAddress() === officeAddress 
                  ? 'border-4 border-yellow-400 bg-orange-200' 
                  : 'border-2 border-orange-300 bg-white hover:bg-orange-50'"
                class="w-full p-6 rounded-xl transition-all duration-200 text-left"
              >
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xl font-bold text-amber-900">Office</h3>
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">
                  {{ officeAddress.address }}, {{ officeAddress.city }}, {{ officeAddress.country }}, {{ officeAddress.postalCode }}
                </p>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-xl p-6">
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-700">Subtotal</span>
              <span class="font-bold text-orange-600">₹{{ cartService.subtotal() }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-700">Impuestos</span>
              <span class="font-bold text-orange-600">₹{{ cartService.taxes() }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-700">Entrega</span>
              <span class="font-bold text-orange-600">
                {{ cartService.deliveryFee() === 0 ? 'Gratis' : '₹' + cartService.deliveryFee() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Payment Methods Section -->
        <div>
          <h2 class="text-xl font-bold text-white mb-4">Método de Pago</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Online Payment -->
            <button
              (click)="selectPaymentMethod('online')"
              [class]="selectedPaymentMethod() === 'online' 
                ? 'border-4 border-yellow-400 bg-orange-200' 
                : 'border-2 border-orange-300 bg-white hover:bg-orange-50'"
              class="p-6 rounded-xl transition-all duration-200"
            >
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <h3 class="font-bold text-gray-800">Pago Online</h3>
                  <p class="text-sm text-gray-600">Tarjeta, UPI, Billetera</p>
                </div>
              </div>
            </button>

            <!-- Cash Payment -->
            <button
              (click)="selectPaymentMethod('cash')"
              [class]="selectedPaymentMethod() === 'cash' 
                ? 'border-4 border-yellow-400 bg-orange-200' 
                : 'border-2 border-orange-300 bg-white hover:bg-orange-50'"
              class="p-6 rounded-xl transition-all duration-200"
            >
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <h3 class="font-bold text-gray-800">Efectivo</h3>
                  <p class="text-sm text-gray-600">Pago contra entrega</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Total and Order Button -->
        <div class="bg-cream-200 rounded-xl p-6">
          <div class="flex justify-between items-center mb-6">
            <span class="text-xl font-bold text-gray-800">Total</span>
            <span class="text-xl font-bold text-orange-600">₹{{ cartService.total() }}</span>
          </div>

          <button
            (click)="placeOrder()"
            [disabled]="!selectedAddress() || !selectedPaymentMethod() || isPlacingOrder()"
            class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-colors duration-200"
          >
            <span *ngIf="!isPlacingOrder()">Realizar Pedido</span>
            <span *ngIf="isPlacingOrder()" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  selectedAddress = signal<DeliveryAddress | null>(null);
  selectedPaymentMethod = signal<'cash' | 'online' | null>(null);
  isPlacingOrder = signal(false);

  homeAddress: DeliveryAddress = {
    type: 'home',
    address: 'Flat-1, Guindy',
    city: 'Chennai',
    country: 'India',
    postalCode: '600042'
  };

  officeAddress: DeliveryAddress = {
    type: 'office',
    address: 'Flat-1, Perungudi',
    city: 'Chennai',
    country: 'India',
    postalCode: '600042'
  };

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    // Pre-select home address
    this.selectedAddress.set(this.homeAddress);
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  selectAddress(address: DeliveryAddress) {
    this.selectedAddress.set(address);
  }

  selectPaymentMethod(method: 'cash' | 'online') {
    this.selectedPaymentMethod.set(method);
  }

  placeOrder() {
    const address = this.selectedAddress();
    const paymentMethod = this.selectedPaymentMethod();
    const user = this.authService.user();

    if (!address || !paymentMethod || !user) {
      return;
    }

    this.isPlacingOrder.set(true);

    // Simulate order processing delay
    setTimeout(() => {
      const order = this.orderService.createOrder(
        this.cartService.cartItems(),
        address,
        paymentMethod,
        user.id
      );

      // Clear cart after successful order
      this.cartService.clearCart();
      
      this.isPlacingOrder.set(false);
      
      // Navigate to order confirmation
      this.router.navigate(['/order-confirmation', order.id]);
    }, 2000);
  }
}
