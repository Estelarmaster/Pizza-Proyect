import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { OrderService } from "../../services/order.service";

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
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
              <h1 class="text-2xl font-bold text-gray-900">Mis Órdenes</h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div *ngIf="userOrders().length === 0" class="text-center py-16">
          <svg
            class="w-24 h-24 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p class="text-gray-600 text-xl mb-4">No tienes órdenes aún</p>
          <button
            (click)="goToMenu()"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Hacer tu primera orden
          </button>
        </div>

        <!-- Orders List -->
        <div class="space-y-6">
          <div
            *ngFor="let order of userOrders()"
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <!-- Order Header -->
            <div class="bg-red-50 px-6 py-4 border-b">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Orden #{{ order.id }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ order.createdAt | date: "medium" }}
                  </p>
                </div>
                <div class="text-right">
                  <span
                    class="px-3 py-1 text-sm font-semibold rounded-full"
                    [class]="getStatusClass(order.status)"
                  >
                    {{ orderService.getOrderStatusText(order.status) }}
                  </span>
                  <p class="text-lg font-bold text-gray-900 mt-1">
                    ₹{{ order.total }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="p-6">
              <h4 class="font-semibold text-gray-900 mb-4">
                Artículos Ordenados:
              </h4>
              <div class="space-y-3">
                <div
                  *ngFor="let item of order.items"
                  class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    [src]="item.pizza.image"
                    [alt]="item.pizza.name"
                    class="w-16 h-16 rounded-lg object-cover"
                  />
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">
                      {{ item.pizza.name }}
                    </h5>
                    <p class="text-sm text-gray-600">
                      Tamaño: {{ item.size }} | Cantidad: {{ item.quantity }}
                    </p>
                    <p class="text-sm font-semibold text-red-600">
                      ₹{{ item.pizza.price * item.quantity }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Details -->
            <div class="bg-gray-50 px-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 class="font-semibold text-gray-900 mb-2">
                    Dirección de Entrega:
                  </h5>
                  <p class="text-sm text-gray-600">
                    {{ order.address.address }}, {{ order.address.city }},
                    {{ order.address.country }}
                  </p>
                </div>
                <div>
                  <h5 class="font-semibold text-gray-900 mb-2">
                    Método de Pago:
                  </h5>
                  <p class="text-sm text-gray-600">
                    {{
                      order.paymentMethod === "cash"
                        ? "Efectivo"
                        : "Pago Online"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="px-6 py-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  {{ getEstimatedTime(order.status) }}
                </div>
                <div class="space-x-4">
                  <button
                    *ngIf="order.status === 'delivered'"
                    class="text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Reordenar
                  </button>
                  <button
                    *ngIf="order.status !== 'delivered'"
                    class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Rastrear en Vivo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrdersComponent {
  userOrders = computed(() => {
    const user = this.authService.user();
    if (user) {
      return this.orderService.getOrdersByUserId(user.id);
    }
    return [];
  });

  constructor(
    public authService: AuthService,
    public orderService: OrderService,
    private router: Router,
  ) {}

  goBack() {
    this.router.navigate(["/profile"]);
  }

  goToMenu() {
    this.router.navigate(["/menu"]);
  }

  getStatusClass(status: string): string {
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

  getEstimatedTime(status: string): string {
    const times = {
      pending: "Confirmando pedido...",
      confirmed: "Preparando - 15-20 mins",
      preparing: "En preparación - 10-15 mins",
      delivery: "En camino - 5-10 mins",
      delivered: "Entregado",
    };
    return times[status as keyof typeof times] || "";
  }
}
