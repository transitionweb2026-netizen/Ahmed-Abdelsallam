import "server-only";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Anonymous client for the public website. It carries no cookies, so pages
 * stay statically rendered, and Row Level Security only lets it read
 * published / visible content (and send contact-form messages).
 */
export const publicSupabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;
