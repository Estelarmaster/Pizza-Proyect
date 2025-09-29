import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { readSupabaseConfig } from "./config.service";

@Injectable({ providedIn: "root" })
export class SupabaseService {
  private client?: SupabaseClient;

  constructor() {
    const cfg = readSupabaseConfig();
    if (cfg) {
      this.client = createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
    }
  }

  isEnabled(): boolean {
    return !!this.client;
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error(
        "Supabase no está configurado (faltan SUPABASE_URL o SUPABASE_ANON_KEY)",
      );
    }
    return this.client;
  }
}
