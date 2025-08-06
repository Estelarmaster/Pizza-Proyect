import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { Order } from "../../models/pizza.model";

@Component({
  selector: "app-order-confirmation",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-black flex flex-col items-center justify-center p-6"
    >
      <div class="text-center max-w-md mx-auto">
        <!-- Success Animation -->
        <div class="mb-8">
          <div class="relative">
            <!-- Animated checkmark -->
            <div class="w-24 h-24 mx-auto mb-6 relative">
              <svg
                class="w-24 h-24 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                  class="animate-pulse"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4"
                  class="animate-bounce"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <h1 class="text-4xl font-bold text-white mb-4 leading-tight">
          Tu Pedido está Confirmado
        </h1>

        <!-- Order Details -->
        <div *ngIf="order()" class="bg-gray-900 rounded-2xl p-6 mb-8 text-left">
          <h2 class="text-lg font-bold text-white mb-4">Detalles del Pedido</h2>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">ID del Pedido:</span>
              <span class="text-white font-mono">#{{ order()!.id }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-400">Estado:</span>
              <span class="text-green-400 font-semibold">{{
                getStatusText()
              }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-400">Total:</span>
              <span class="text-white font-bold">₹{{ order()!.total }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-400">Método de Pago:</span>
              <span class="text-white">{{
                order()!.paymentMethod === "cash" ? "Efectivo" : "Online"
              }}</span>
            </div>

            <div class="border-t border-gray-700 pt-3 mt-3">
              <span class="text-gray-400 block mb-1"
                >Dirección de Entrega:</span
              >
              <span class="text-white text-sm">
                {{ order()!.address.address }}, {{ order()!.address.city }},
                {{ order()!.address.country }}
              </span>
            </div>
          </div>
        </div>

        <!-- Estimated Time -->
        <div class="bg-yellow-900 bg-opacity-50 rounded-xl p-4 mb-8">
          <p class="text-yellow-200 text-sm mb-1">
            Tiempo estimado de entrega:
          </p>
          <p class="text-yellow-100 font-bold text-xl">25-30 minutos</p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <button
            (click)="trackOrder()"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors duration-200"
          >
            Rastrear Pedido
          </button>

          <button
            (click)="goToMenu()"
            class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-colors duration-200"
          >
            Ordenar Más Pizzas
          </button>
        </div>

        <!-- Support Info -->
        <div class="mt-8 text-center">
          <p class="text-gray-400 text-sm mb-2">¿Necesitas ayuda?</p>
          <p class="text-gray-300 text-sm">
            Contáctanos: <span class="text-green-400">+91 12345 67890</span>
          </p>
        </div>
      </div>

      <!-- Background Animation -->
      <div class="fixed inset-0 -z-10 overflow-hidden">
        <div
          class="absolute top-20 left-20 w-32 h-32 bg-green-500 opacity-10 rounded-full animate-pulse"
        ></div>
        <div
          class="absolute bottom-32 right-32 w-24 h-24 bg-yellow-500 opacity-10 rounded-full animate-bounce"
        ></div>
        <div
          class="absolute top-1/2 left-1/4 w-16 h-16 bg-red-500 opacity-10 rounded-full animate-ping"
        ></div>
      </div>
    </div>
  `,
})
export class OrderConfirmationComponent implements OnInit {
  order = signal<Order | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get("id");
    if (orderId) {
      const order = this.orderService.getOrderById(orderId);
      this.order.set(order || null);
    }
  }

  getStatusText(): string {
    const currentOrder = this.order();
    if (currentOrder) {
      return this.orderService.getOrderStatusText(currentOrder.status);
    }
    return "";
  }

  trackOrder() {
    this.router.navigate(["/orders"]);
  }

  goToMenu() {
    this.router.navigate(["/menu"]);
  }
}
