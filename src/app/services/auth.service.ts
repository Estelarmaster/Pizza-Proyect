import { Injectable, signal } from "@angular/core";
import { User, DeliveryAddress } from "../models/pizza.model";
import { SupabaseService } from "./supabase.service";
import * as bcrypt from "bcryptjs";

@Injectable({ providedIn: "root" })
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

  constructor(private supabase: SupabaseService) {}

  private mapRowToUser(row: any): User {
    const rawAddresses = row.addresses;
    const addresses: DeliveryAddress[] = Array.isArray(rawAddresses)
      ? rawAddresses
      : typeof rawAddresses === "string" && rawAddresses
        ? (() => {
            try {
              const parsed = JSON.parse(rawAddresses);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })()
        : [];
    return {
      id: String(row.id),
      name: row.name ?? "",
      email: row.email,
      avatar: row.avatar ?? undefined,
      addresses,
      isAdmin: Boolean(row.isAdmin ?? row.is_admin ?? false),
    };
  }

  async login(email: string, _password: string): Promise<boolean> {
    const normEmail = email.trim().toLowerCase();
    if (this.supabase.isEnabled()) {
      const { data, error } = await this.supabase
        .getClient()
        .from("users")
        .select("*")
        .eq("email", normEmail)
        .limit(1)
        .maybeSingle();
      if (error || !data) {
        return false;
      }
      const hash: string = (data as any).password_hash || "";
      const ok = !!hash && bcrypt.compareSync(_password, hash);
      if (!ok) {
        return false;
      }
      const user = this.mapRowToUser(data);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      this.isAdmin.set(user.isAdmin);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }

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

  async register(
    name: string,
    email: string,
    _password: string,
  ): Promise<boolean> {
    const normEmail = email.trim().toLowerCase();
    if (this.supabase.isEnabled()) {
      const { data: existing } = await this.supabase
        .getClient()
        .from("users")
        .select("id")
        .eq("email", normEmail)
        .limit(1)
        .maybeSingle();
      if (existing) {
        return false;
      }
      const newUser: Omit<User, "id"> = {
        name,
        email,
        isAdmin: false,
        addresses: [],
      };
      const password_hash = bcrypt.hashSync(_password, 10);
      const { data, error } = await this.supabase
        .getClient()
        .from("users")
        .insert([
          {
            name: newUser.name,
            email: normEmail,
            isAdmin: newUser.isAdmin,
            addresses: newUser.addresses,
            password_hash,
          },
        ])
        .select()
        .single();
      if (error || !data) return false;
      const user = this.mapRowToUser(data);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      this.isAdmin.set(false);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }

    const existingUser = this.users().find((u) => u.email === email);
    if (existingUser) return false;

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

  async addAddress(address: DeliveryAddress): Promise<void> {
    const user = this.currentUser();
    if (user) {
      const updatedUser: User = {
        ...user,
        addresses: [...user.addresses, address],
      };
      this.currentUser.set(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      if (this.supabase.isEnabled()) {
        await this.supabase
          .getClient()
          .from("users")
          .update({ addresses: updatedUser.addresses })
          .eq("id", user.id);
      }
    }
  }

  async updateProfile(updates: Partial<User>): Promise<void> {
    const user = this.currentUser();
    if (user) {
      const updatedUser: User = { ...user, ...updates };
      this.currentUser.set(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      if (this.supabase.isEnabled()) {
        const payload: any = { ...updates };
        await this.supabase
          .getClient()
          .from("users")
          .update(payload)
          .eq("id", user.id);
      }
    }
  }
}
