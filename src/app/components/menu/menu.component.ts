import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PizzaService } from '../../services/pizza.service';
import { CartService } from '../../services/cart.service';
import { Pizza } from '../../models/pizza.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <!-- Header Section -->
      <div class="bg-amber-900 text-white">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <!-- Search Bar -->
          <div class="max-w-md mx-auto mb-6">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                placeholder="Buscar..."
                class="w-full pl-10 pr-4 py-3 bg-gray-700 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Category Filters -->
          <div class="flex flex-wrap justify-center gap-3">
            <button
              *ngFor="let category of categories"
              (click)="setActiveCategory(category.value)"
              [class]="activeCategory() === category.value 
                ? 'bg-yellow-300 text-gray-800' 
                : 'bg-gray-700 text-white hover:bg-gray-600'"
              class="px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              {{ category.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pizza Grid -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div *ngIf="filteredPizzas().length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0120 12a8 8 0 00-8-8 8 8 0 00-8 8c0 2.047.777 3.91 2.05 5.334z"/>
          </svg>
          <p class="text-gray-600 text-lg">No se encontraron pizzas</p>
          <p class="text-gray-400">Intenta con otro término de búsqueda</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let pizza of filteredPizzas()" 
               class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            
            <!-- Pizza Image -->
            <div class="relative">
              <img 
                [src]="pizza.image" 
                [alt]="pizza.name"
                class="w-full h-48 object-cover"
              />
              <!-- Add to cart button overlay -->
              <button
                (click)="addToCart(pizza)"
                class="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19v2m6-2v2"/>
                </svg>
              </button>
            </div>

            <!-- Pizza Info -->
            <div class="p-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-4">
                <h3 class="text-white font-bold text-lg mb-2">{{ pizza.name }}</h3>
                <p class="text-gray-300 text-sm mb-2">{{ pizza.weight }}</p>
                <p class="text-yellow-400 font-bold text-lg">₹{{ pizza.price }}</p>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  (click)="addToCart(pizza)"
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Agregar
                </button>
                <a
                  [routerLink]="['/pizza', pizza.id]"
                  class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-semibold py-2 px-4 rounded-lg text-center transition-colors duration-200"
                >
                  Ver Detalles
                </a>
              </div>
            </div>
          </div>
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
export class MenuComponent implements OnInit {
  searchQuery = '';
  activeCategory = signal('all');
  showAddedNotification = signal(false);

  categories = [
    { value: 'all', label: 'Todas' },
    { value: 'vegetarian', label: 'Vegetariana' },
    { value: 'classic', label: 'Clásica' },
    { value: 'meat', label: 'Carnes' },
    { value: 'breakfast', label: 'Desayuno' }
  ];

  filteredPizzas = computed(() => {
    let pizzas = this.pizzaService.getPizzas()();
    
    // Filter by category
    if (this.activeCategory() !== 'all') {
      pizzas = pizzas.filter(pizza => pizza.category === this.activeCategory());
    }
    
    // Filter by search query
    if (this.searchQuery.trim()) {
      pizzas = this.pizzaService.searchPizzas(this.searchQuery);
    }
    
    return pizzas;
  });

  constructor(
    public pizzaService: PizzaService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Any initialization logic
  }

  setActiveCategory(category: string) {
    this.activeCategory.set(category);
  }

  onSearch() {
    // Search is handled by the computed signal
  }

  addToCart(pizza: Pizza) {
    this.cartService.addToCart(pizza);
    this.showAddedNotification.set(true);
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      this.showAddedNotification.set(false);
    }, 2000);
  }
}
