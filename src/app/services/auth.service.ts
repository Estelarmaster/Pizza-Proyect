import { Injectable, signal } from "@angular/core";
import { User, DeliveryAddress } from "../models/pizza.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private users = signal<User[]>([
    {
      id: "1",
      name: "James",
      email: "james@example.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      isAdmin: true,
      addresses: [
        {
          type: "home",
          address: "Flat-1, Guindy",
          city: "Chennai",
          country: "India",
          postalCode: "600042",
        },
        {
          type: "office",
          address: "Flat-1, Perungudi",
          city: "Chennai",
          country: "India",
          postalCode: "600042",
        },
      ],
    },
  ]);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = signal(false);
  readonly isAdmin = signal(false);

  login(email: string, password: string): boolean {
    const user = this.users().find((u) => u.email === email);
    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      this.isAdmin.set(user.isAdmin);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const existingUser = this.users().find((u) => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      isAdmin: false,
      addresses: [],
    };

    this.users.update((users) => [...users, newUser]);
    this.currentUser.set(newUser);
    this.isAuthenticated.set(true);
    this.isAdmin.set(false);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.isAdmin.set(false);
    localStorage.removeItem("currentUser");
  }

  checkAuthStatus(): void {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      this.isAdmin.set(user.isAdmin);
    }
  }

  addAddress(address: DeliveryAddress): void {
    const user = this.currentUser();
    if (user) {
      const updatedUser = {
        ...user,
        addresses: [...user.addresses, address],
      };
      this.currentUser.set(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  }

  updateProfile(updates: Partial<User>): void {
    const user = this.currentUser();
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.currentUser.set(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  }
}
