import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "./env";

let client: ReturnType<typeof createBrowserClient> | undefined;

/** Browser client for the admin dashboard (sign-in session, direct-to-Storage uploads). */
export function getSupabaseBrowserClient() {
  client ??= createBrowserClient(supabaseUrl, supabasePublishableKey);
  return client;
}
