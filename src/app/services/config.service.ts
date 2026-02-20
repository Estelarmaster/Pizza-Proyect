import { Injectable } from "@angular/core";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

function readGlobal(key: string): string | null {
  const g: any = globalThis as any;
  const fromWindow = g[key] ?? g?.__env?.[key] ?? g?.__APP_CONFIG?.[key];
  if (typeof fromWindow === "string" && fromWindow.trim())
    return fromWindow.trim();
  const fromLocal =
    typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  if (fromLocal && fromLocal.trim()) return fromLocal.trim();
  return null;
}

export function readSupabaseConfig(): SupabaseConfig | null {
  const url = readGlobal("SUPABASE_URL");
  const anonKey = readGlobal("SUPABASE_ANON_KEY");
  if (url && anonKey) {
    return { url, anonKey };
  }
  return null;
}
