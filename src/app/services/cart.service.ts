import { Injectable, signal, computed } from "@angular/core";
import { CartItem, Pizza } from "../models/pizza.model";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly itemCount = computed(() =>
    this.items().reduce((count, item) => count + item.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.items().reduce(
      (total, item) => total + item.pizza.price * item.quantity,
      0,
    ),
  );
  readonly taxes = computed(() => Math.round(this.subtotal() * 0.024)); // 2.4% tax
  readonly deliveryFee = computed(() => (this.subtotal() > 1000 ? 0 : 0)); // Free delivery over 1000
  readonly total = computed(
    () => this.subtotal() + this.taxes() + this.deliveryFee(),
  );

  addToCart(
    pizza: Pizza,
    size: "S" | "M" | "L" = "M",
    quantity: number = 1,
  ): void {
    const existingItemIndex = this.items().findIndex(
      (item) => item.pizza.id === pizza.id && item.size === size,
    );

    if (existingItemIndex >= 0) {
      this.updateQuantity(
        existingItemIndex,
        this.items()[existingItemIndex].quantity + quantity,
      );
    } else {
      const newItem: CartItem = { pizza, size, quantity };
      this.items.update((items) => [...items, newItem]);
    }
  }

  removeFromCart(index: number): void {
    this.items.update((items) => items.filter((_, i) => i !== index));
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(index);
      return;
    }

    this.items.update((items) =>
      items.map((item, i) => (i === index ? { ...item, quantity } : item)),
    );
  }

  clearCart(): void {
    this.items.set([]);
  }

  getCartItemByPizzaId(pizzaId: string): CartItem | undefined {
    return this.items().find((item) => item.pizza.id === pizzaId);
  }
}
