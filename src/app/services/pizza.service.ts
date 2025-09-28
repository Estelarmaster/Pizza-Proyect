import { Injectable, signal } from "@angular/core";
import { Pizza } from "../models/pizza.model";
import { SupabaseService } from "./supabase.service";

const FALLBACK_PIZZAS: Pizza[] = [
  {
    id: "1",
    name: "Margarita",
    description:
      "Clásica pizza italiana con tomate, mozzarella y albahaca fresca",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop",
    weight: "540g",
    ingredients: ["Tomate", "Mozzarella", "Albahaca", "Aceite de oliva"],
    category: "classic",
    available: true,
  },
  {
    id: "2",
    name: "Fiesta Picante",
    description: "Pizza picante con pepperoni, jalapeños y salsa especial",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop",
    weight: "440g",
    ingredients: ["Pepperoni", "Jalapeños", "Mozzarella", "Salsa picante"],
    category: "meat",
    available: true,
  },
  {
    id: "3",
    name: "BBQ",
    description: "Deliciosa pizza BBQ con pollo, cebolla y salsa barbacoa",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    weight: "340g",
    ingredients: ["Pollo BBQ", "Cebolla", "Mozzarella", "Salsa BBQ"],
    category: "meat",
    available: true,
  },
  {
    id: "4",
    name: "Delicia de Queso",
    description: "Mezcla perfecta de 4 quesos premium",
    price: 400,
    image:
      "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400&h=400&fit=crop",
    weight: "540g",
    ingredients: ["Mozzarella", "Parmesano", "Gorgonzola", "Ricotta"],
    category: "classic",
    available: true,
  },
  {
    id: "5",
    name: "Pedazo de Cielo",
    description: "Pizza vegetariana con verduras frescas de temporada",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400&h=400&fit=crop",
    weight: "500g",
    ingredients: ["Tomates cherry", "Espinaca", "Pimientos", "Aceitunas"],
    category: "vegetarian",
    available: true,
  },
  {
    id: "6",
    name: "Maravilla",
    description: "Pizza especial con ingredientes únicos",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=400&fit=crop",
    weight: "250g",
    ingredients: ["Prosciutto", "Rúcula", "Tomates secos", "Mozzarella"],
    category: "meat",
    available: true,
  },
];

@Injectable({ providedIn: "root" })
export class PizzaService {
  private pizzas = signal<Pizza[]>([]);

  constructor(private supabase: SupabaseService) {
    if (this.supabase.isEnabled()) {
      this.loadFromSupabase();
    } else {
      this.pizzas.set(FALLBACK_PIZZAS);
    }
  }

  getPizzas() {
    return this.pizzas.asReadonly();
  }

  private mapRowToPizza(row: any): Pizza {
    return {
      id: String(row.id),
      name: row.name,
      description: row.description ?? "",
      price: Number(row.price),
      image: row.image ?? "",
      weight: row.weight ?? "",
      ingredients: Array.isArray(row.ingredients)
        ? row.ingredients
        : typeof row.ingredients === "string" && row.ingredients
          ? row.ingredients.split(",").map((s: string) => s.trim())
          : [],
      category: row.category as Pizza["category"],
      available: Boolean(row.available),
    };
  }

  private async loadFromSupabase() {
    try {
      const { data, error } = await this.supabase
        .getClient()
        .from("pizzas")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      const mapped = (data ?? []).map((r: any) => this.mapRowToPizza(r));
      this.pizzas.set(mapped);
    } catch (e) {
      this.pizzas.set(FALLBACK_PIZZAS);
    }
  }

  getPizzaById(id: string): Pizza | undefined {
    return this.pizzas().find((pizza) => pizza.id === id);
  }

  getPizzasByCategory(category: string): Pizza[] {
    if (category === "all") return this.pizzas();
    return this.pizzas().filter((pizza) => pizza.category === category);
  }

  async createPizza(pizza: Omit<Pizza, "id">): Promise<void> {
    if (this.supabase.isEnabled()) {
      const { data, error } = await this.supabase
        .getClient()
        .from("pizzas")
        .insert([{ ...pizza }])
        .select()
        .single();
      if (!error && data) {
        this.pizzas.update((p) => [...p, this.mapRowToPizza(data)]);
      }
      return;
    }
    const newPizza: Pizza = { ...pizza, id: Date.now().toString() };
    this.pizzas.update((pizzas) => [...pizzas, newPizza]);
  }

  async updatePizza(id: string, updates: Partial<Pizza>): Promise<void> {
    if (this.supabase.isEnabled()) {
      const { data, error } = await this.supabase
        .getClient()
        .from("pizzas")
        .update({ ...updates })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        const updated = this.mapRowToPizza(data);
        this.pizzas.update((p) =>
          p.map((x) => (x.id === id ? { ...x, ...updated } : x)),
        );
      }
      return;
    }
    this.pizzas.update((p) =>
      p.map((x) => (x.id === id ? { ...x, ...updates } : x)),
    );
  }

  async deletePizza(id: string): Promise<void> {
    if (this.supabase.isEnabled()) {
      const { error } = await this.supabase
        .getClient()
        .from("pizzas")
        .delete()
        .eq("id", id);
      if (!error) {
        this.pizzas.update((p) => p.filter((x) => x.id !== id));
      }
      return;
    }
    this.pizzas.update((p) => p.filter((pizza) => pizza.id !== id));
  }

  searchPizzas(query: string): Pizza[] {
    const searchTerm = query.toLowerCase();
    return this.pizzas().filter(
      (pizza) =>
        pizza.name.toLowerCase().includes(searchTerm) ||
        pizza.description.toLowerCase().includes(searchTerm) ||
        pizza.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchTerm),
        ),
    );
  }
}
