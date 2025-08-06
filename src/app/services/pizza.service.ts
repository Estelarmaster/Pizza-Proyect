import { Injectable, signal } from '@angular/core';
import { Pizza } from '../models/pizza.model';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private pizzas = signal<Pizza[]>([
    {
      id: '1',
      name: 'Margarita',
      description: 'Clásica pizza italiana con tomate, mozzarella y albahaca fresca',
      price: 500,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop',
      weight: '540g',
      ingredients: ['Tomate', 'Mozzarella', 'Albahaca', 'Aceite de oliva'],
      category: 'classic',
      available: true
    },
    {
      id: '2',
      name: 'Fiesta Picante',
      description: 'Pizza picante con pepperoni, jalapeños y salsa especial',
      price: 200,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      weight: '440g',
      ingredients: ['Pepperoni', 'Jalapeños', 'Mozzarella', 'Salsa picante'],
      category: 'meat',
      available: true
    },
    {
      id: '3',
      name: 'BBQ',
      description: 'Deliciosa pizza BBQ con pollo, cebolla y salsa barbacoa',
      price: 500,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
      weight: '340g',
      ingredients: ['Pollo BBQ', 'Cebolla', 'Mozzarella', 'Salsa BBQ'],
      category: 'meat',
      available: true
    },
    {
      id: '4',
      name: 'Delicia de Queso',
      description: 'Mezcla perfecta de 4 quesos premium',
      price: 400,
      image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=400&h=400&fit=crop',
      weight: '540g',
      ingredients: ['Mozzarella', 'Parmesano', 'Gorgonzola', 'Ricotta'],
      category: 'classic',
      available: true
    },
    {
      id: '5',
      name: 'Pedazo de Cielo',
      description: 'Pizza vegetariana con verduras frescas de temporada',
      price: 100,
      image: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400&h=400&fit=crop',
      weight: '500g',
      ingredients: ['Tomates cherry', 'Espinaca', 'Pimientos', 'Aceitunas'],
      category: 'vegetarian',
      available: true
    },
    {
      id: '6',
      name: 'Maravilla',
      description: 'Pizza especial con ingredientes únicos',
      price: 500,
      image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=400&fit=crop',
      weight: '250g',
      ingredients: ['Prosciutto', 'Rúcula', 'Tomates secos', 'Mozzarella'],
      category: 'meat',
      available: true
    }
  ]);

  getPizzas() {
    return this.pizzas.asReadonly();
  }

  getPizzaById(id: string): Pizza | undefined {
    return this.pizzas().find(pizza => pizza.id === id);
  }

  getPizzasByCategory(category: string): Pizza[] {
    if (category === 'all') {
      return this.pizzas();
    }
    return this.pizzas().filter(pizza => pizza.category === category);
  }

  createPizza(pizza: Omit<Pizza, 'id'>): void {
    const newPizza: Pizza = {
      ...pizza,
      id: Date.now().toString()
    };
    this.pizzas.update(pizzas => [...pizzas, newPizza]);
  }

  updatePizza(id: string, updates: Partial<Pizza>): void {
    this.pizzas.update(pizzas => 
      pizzas.map(pizza => 
        pizza.id === id ? { ...pizza, ...updates } : pizza
      )
    );
  }

  deletePizza(id: string): void {
    this.pizzas.update(pizzas => pizzas.filter(pizza => pizza.id !== id));
  }

  searchPizzas(query: string): Pizza[] {
    const searchTerm = query.toLowerCase();
    return this.pizzas().filter(pizza => 
      pizza.name.toLowerCase().includes(searchTerm) ||
      pizza.description.toLowerCase().includes(searchTerm) ||
      pizza.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
    );
  }
}
