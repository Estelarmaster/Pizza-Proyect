import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PizzaService } from '../../services/pizza.service';
import { CartService } from '../../services/cart.service';
import { Pizza } from '../../models/pizza.model';

@Component({
  selector: 'app-pizza-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-amber-900">
      <!-- Header with back button -->
      <div class="bg-amber-900 text-white p-4">
        <button 
          (click)="goBack()"
          class="flex items-center space-x-2 text-orange-300 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Cart icon with count -->
        <div class="absolute top-4 right-4">
          <div class="relative">
            <svg class="w-8 h-8 text-cream-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19v2m6-2v2"/>
            </svg>
            <div *ngIf="cartService.itemCount() > 0" 
                 class="absolute -top-2 -right-2 bg-cream-200 text-amber-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {{ cartService.itemCount() }}
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="pizza()" class="relative">
        <!-- Pizza Image -->
        <div class="relative h-80 flex items-center justify-center">
          <img 
            [src]="pizza()!.image" 
            [alt]="pizza()!.name"
            class="w-60 h-60 rounded-full object-cover border-4 border-orange-400 shadow-2xl"
          />
          
          <!-- Size Selection -->
          <div class="absolute top-4 left-4 bg-cream-100 rounded-lg p-2">
            <div class="flex space-x-2">
              <button
                *ngFor="let size of sizes"
                (click)="selectedSize.set(size.value)"
                [class]="selectedSize() === size.value 
                  ? 'bg-amber-900 text-white' 
                  : 'bg-white text-amber-900 hover:bg-amber-100'"
                class="w-12 h-12 rounded-lg font-bold text-lg transition-colors duration-200 border border-amber-900"
              >
                {{ size.label }}
              </button>
            </div>
          </div>

          <!-- Heart/Favorite Button -->
          <div class="absolute top-4 right-4 bg-cream-100 rounded-full p-3">
            <button class="text-gray-600 hover:text-red-500 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>

          <!-- Connecting Lines (decorative) -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 320">
            <path d="M50 50 Q150 100 250 80" stroke="white" stroke-width="2" fill="none" opacity="0.3" stroke-dasharray="4 4"/>
            <path d="M80 280 Q200 240 320 260" stroke="white" stroke-width="2" fill="none" opacity="0.3" stroke-dasharray="4 4"/>
          </svg>
        </div>

        <!-- Pizza Info -->
        <div class="bg-white rounded-t-3xl mt-4 min-h-96">
          <div class="p-6">
            <h1 class="text-3xl font-bold text-amber-900 mb-2">{{ pizza()!.name }}</h1>
            <p class="text-gray-600 mb-6">{{ pizza()!.description }}</p>

            <!-- Ingredients Section -->
            <div class="mb-8">
              <h2 class="text-xl font-bold text-amber-900 mb-4">Ingredientes</h2>
              <div class="grid grid-cols-3 gap-4">
                <div *ngFor="let ingredient of pizza()!.ingredients" 
                     class="bg-gray-100 rounded-lg p-3 text-center">
                  <div class="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                  <p class="text-sm font-medium text-gray-700">{{ ingredient }}</p>
                </div>
              </div>
            </div>

            <!-- Bottom Section with Price and Add Button -->
            <div class="bg-red-600 rounded-2xl p-4 text-white">
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold">₹{{ pizza()!.price }}</span>
                
                <!-- Quantity Selector -->
                <div class="flex items-center bg-cream-200 rounded-full">
                  <button
                    (click)="decreaseQuantity()"
                    class="w-9 h-9 rounded-full bg-white text-amber-900 font-bold text-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span class="px-4 text-amber-900 font-bold text-lg">{{ quantity() }}</span>
                  <button
                    (click)="increaseQuantity()"
                    class="w-9 h-9 rounded-full bg-white text-amber-900 font-bold text-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                (click)="addToCart()"
                class="w-full bg-white text-red-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="!pizza()" class="flex items-center justify-center h-96">
        <div class="text-center text-white">
          <svg class="animate-spin h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Cargando pizza...</p>
        </div>
      </div>

      <!-- Success notification -->
      <div *ngIf="showAddedNotification()" 
           class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>¡Pizza agregada al carrito!</span>
        </div>
      </div>
    </div>
  `
})
export class PizzaDetailComponent implements OnInit {
  pizza = signal<Pizza | null>(null);
  selectedSize = signal<'S' | 'M' | 'L'>('M');
  quantity = signal(1);
  showAddedNotification = signal(false);

  sizes = [
    { value: 'S' as const, label: 'S' },
    { value: 'M' as const, label: 'M' },
    { value: 'L' as const, label: 'L' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pizzaService: PizzaService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const pizza = this.pizzaService.getPizzaById(id);
      this.pizza.set(pizza || null);
    }
  }

  goBack() {
    this.router.navigate(['/menu']);
  }

  increaseQuantity() {
    this.quantity.update(q => q + 1);
  }

  decreaseQuantity() {
    this.quantity.update(q => q > 1 ? q - 1 : 1);
  }

  addToCart() {
    const currentPizza = this.pizza();
    if (currentPizza) {
      this.cartService.addToCart(currentPizza, this.selectedSize(), this.quantity());
      this.showAddedNotification.set(true);
      
      setTimeout(() => {
        this.showAddedNotification.set(false);
      }, 2000);
    }
  }
}
