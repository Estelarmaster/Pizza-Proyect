import { Injectable, signal } from "@angular/core";
import { Order, CartItem, DeliveryAddress } from "../models/pizza.model";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private orders = signal<Order[]>([]);

  readonly userOrders = this.orders.asReadonly();

  createOrder(
    items: CartItem[],
    address: DeliveryAddress,
    paymentMethod: "cash" | "online",
    userId: string,
  ): Order {
    const subtotal = items.reduce(
      (total, item) => total + item.pizza.price * item.quantity,
      0,
    );
    const taxes = Math.round(subtotal * 0.024);
    const deliveryFee = subtotal > 1000 ? 0 : 0;
    const total = subtotal + taxes + deliveryFee;

    const newOrder: Order = {
      id: Date.now().toString(),
      items,
      subtotal,
      taxes,
      deliveryFee,
      total,
      address,
      paymentMethod,
      status: "pending",
      createdAt: new Date(),
      userId,
    };

    this.orders.update((orders) => [...orders, newOrder]);

    // Simulate order processing
    setTimeout(() => {
      this.updateOrderStatus(newOrder.id, "confirmed");
    }, 2000);

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order["status"]): void {
    this.orders.update((orders) =>
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.orders().filter((order) => order.userId === userId);
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders().find((order) => order.id === orderId);
  }

  getAllOrders(): Order[] {
    return this.orders();
  }

  getOrderStatusText(status: Order["status"]): string {
    const statusMap = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      preparing: "Preparando",
      delivery: "En camino",
      delivered: "Entregado",
    };
    return statusMap[status];
  }
}
