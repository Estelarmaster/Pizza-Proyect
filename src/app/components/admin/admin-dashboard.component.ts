import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { PizzaService } from "../../services/pizza.service";
import { AuthService } from "../../services/auth.service";
import { OrderService } from "../../services/order.service";
import { Pizza } from "../../models/pizza.model";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <button
                (click)="goBack()"
                class="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Volver</span>
              </button>
              <h1 class="text-2xl font-bold text-gray-900">
                Panel de Administración
              </h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-600"
                >¡Hola, {{ authService.user()?.name }}!</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-8">
            <button
              *ngFor="let tab of tabs"
              (click)="activeTab.set(tab.id)"
              [class]="
                activeTab() === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
              class="border-b-2 py-4 px-1 font-medium text-sm transition-colors"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Pizzas Management -->
        <div *ngIf="activeTab() === 'pizzas'">
          <!-- Add New Pizza Button -->
          <div class="mb-6">
            <button
              (click)="showAddForm.set(!showAddForm())"
              class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <span *ngIf="!showAddForm()">+ Agregar Nueva Pizza</span>
              <span *ngIf="showAddForm()">Cancelar</span>
            </button>
          </div>

          <!-- Add/Edit Pizza Form -->
          <div
            *ngIf="showAddForm() || editingPizza()"
            class="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <h3 class="text-lg font-bold mb-4">
              {{ editingPizza() ? "Editar Pizza" : "Agregar Nueva Pizza" }}
            </h3>

            <form
              (ngSubmit)="savePizza()"
              #pizzaForm="ngForm"
              class="space-y-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Nombre</label
                  >
                  <input
                    type="text"
                    name="name"
                    [(ngModel)]="pizzaForm_name"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Precio (₹)</label
                  >
                  <input
                    type="number"
                    name="price"
                    [(ngModel)]="pizzaForm_price"
                    required
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Peso</label
                  >
                  <input
                    type="text"
                    name="weight"
                    [(ngModel)]="pizzaForm_weight"
                    required
                    placeholder="ej: 340g"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Categoría</label
                  >
                  <select
                    name="category"
                    [(ngModel)]="pizzaForm_category"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="vegetarian">Vegetariana</option>
                    <option value="classic">Clásica</option>
                    <option value="meat">Carnes</option>
                    <option value="breakfast">Desayuno</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Descripción</label
                >
                <textarea
                  name="description"
                  [(ngModel)]="pizzaForm_description"
                  required
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >URL de Imagen</label
                >
                <input
                  type="url"
                  name="image"
                  [(ngModel)]="pizzaForm_image"
                  required
                  placeholder="https://example.com/pizza.jpg"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Ingredientes (separados por coma)</label
                >
                <input
                  type="text"
                  name="ingredients"
                  [(ngModel)]="pizzaForm_ingredients"
                  required
                  placeholder="Tomate, Mozzarella, Albahaca"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div class="flex items-center space-x-4">
                <button
                  type="submit"
                  class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  {{ editingPizza() ? "Actualizar" : "Crear" }} Pizza
                </button>

                <button
                  type="button"
                  (click)="cancelEdit()"
                  class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <!-- Pizzas List -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pizza
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precio
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Categoría
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let pizza of pizzaService.getPizzas()()">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img
                        [src]="pizza.image"
                        [alt]="pizza.name"
                        class="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ pizza.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ pizza.weight }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{{ pizza.price }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [class]="getCategoryClass(pizza.category)"
                    >
                      {{ getCategoryLabel(pizza.category) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [class]="
                        pizza.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{ pizza.available ? "Disponible" : "No disponible" }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                  >
                    <button
                      (click)="editPizza(pizza)"
                      class="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      (click)="deletePizza(pizza.id)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Eliminar
                    </button>
                    <button
                      (click)="toggleAvailability(pizza)"
                      class="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {{ pizza.available ? "Desactivar" : "Activar" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Orders Management -->
        <div *ngIf="activeTab() === 'orders'">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">
                Órdenes Recientes
              </h3>
            </div>

            <div class="divide-y divide-gray-200">
              <div
                *ngFor="let order of orderService.getAllOrders()"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">#{{ order.id }}</p>
                    <p class="text-sm text-gray-500">
                      {{ order.createdAt | date: "short" }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ order.items.length }} items - ₹{{ order.total }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                      [class]="getOrderStatusClass(order.status)"
                    >
                      {{ orderService.getOrderStatusText(order.status) }}
                    </span>
                    <select
                      [value]="order.status"
                      (change)="updateOrderStatus(order.id, $event)"
                      class="text-sm border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="preparing">Preparando</option>
                      <option value="delivery">En camino</option>
                      <option value="delivered">Entregado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div *ngIf="activeTab() === 'stats'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Total de Pizzas
              </h3>
              <p class="text-3xl font-bold text-red-600">
                {{ pizzaService.getPizzas()().length }}
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Órdenes Totales
              </h3>
              <p class="text-3xl font-bold text-green-600">
                {{ orderService.getAllOrders().length }}
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Ingresos Totales
              </h3>
              <p class="text-3xl font-bold text-blue-600">
                ₹{{ getTotalRevenue() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent {
  activeTab = signal("pizzas");
  showAddForm = signal(false);
  editingPizza = signal<Pizza | null>(null);

  // Form fields
  pizzaForm_name = "";
  pizzaForm_price = 0;
  pizzaForm_weight = "";
  pizzaForm_category = "";
  pizzaForm_description = "";
  pizzaForm_image = "";
  pizzaForm_ingredients = "";

  tabs = [
    { id: "pizzas", label: "Gestión de Pizzas" },
    { id: "orders", label: "Órdenes" },
    { id: "stats", label: "Estadísticas" },
  ];

  constructor(
    public pizzaService: PizzaService,
    public authService: AuthService,
    public orderService: OrderService,
    private router: Router,
  ) {}

  goBack() {
    this.router.navigate(["/profile"]);
  }

  savePizza() {
    const pizzaData = {
      name: this.pizzaForm_name,
      price: this.pizzaForm_price,
      weight: this.pizzaForm_weight,
      category: this.pizzaForm_category as any,
      description: this.pizzaForm_description,
      image: this.pizzaForm_image,
      ingredients: this.pizzaForm_ingredients.split(",").map((i) => i.trim()),
      available: true,
    };

    if (this.editingPizza()) {
      this.pizzaService.updatePizza(this.editingPizza()!.id, pizzaData);
    } else {
      this.pizzaService.createPizza(pizzaData);
    }

    this.cancelEdit();
  }

  editPizza(pizza: Pizza) {
    this.editingPizza.set(pizza);
    this.showAddForm.set(true);

    this.pizzaForm_name = pizza.name;
    this.pizzaForm_price = pizza.price;
    this.pizzaForm_weight = pizza.weight;
    this.pizzaForm_category = pizza.category;
    this.pizzaForm_description = pizza.description;
    this.pizzaForm_image = pizza.image;
    this.pizzaForm_ingredients = pizza.ingredients.join(", ");
  }

  deletePizza(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar esta pizza?")) {
      this.pizzaService.deletePizza(id);
    }
  }

  toggleAvailability(pizza: Pizza) {
    this.pizzaService.updatePizza(pizza.id, { available: !pizza.available });
  }

  cancelEdit() {
    this.editingPizza.set(null);
    this.showAddForm.set(false);
    this.resetForm();
  }

  resetForm() {
    this.pizzaForm_name = "";
    this.pizzaForm_price = 0;
    this.pizzaForm_weight = "";
    this.pizzaForm_category = "";
    this.pizzaForm_description = "";
    this.pizzaForm_image = "";
    this.pizzaForm_ingredients = "";
  }

  getCategoryClass(category: string): string {
    const classes = {
      vegetarian: "bg-green-100 text-green-800",
      classic: "bg-blue-100 text-blue-800",
      meat: "bg-red-100 text-red-800",
      breakfast: "bg-yellow-100 text-yellow-800",
    };
    return (
      classes[category as keyof typeof classes] || "bg-gray-100 text-gray-800"
    );
  }

  getCategoryLabel(category: string): string {
    const labels = {
      vegetarian: "Vegetariana",
      classic: "Clásica",
      meat: "Carnes",
      breakfast: "Desayuno",
    };
    return labels[category as keyof typeof labels] || category;
  }

  getOrderStatusClass(status: string): string {
    const classes = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      delivery: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
    };
    return (
      classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800"
    );
  }

  updateOrderStatus(orderId: string, event: any) {
    const newStatus = event.target.value;
    this.orderService.updateOrderStatus(orderId, newStatus);
  }

  getTotalRevenue(): number {
    return this.orderService
      .getAllOrders()
      .reduce((total, order) => total + order.total, 0);
  }
}
