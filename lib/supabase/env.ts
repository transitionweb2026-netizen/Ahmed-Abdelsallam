/**
 * Public Supabase settings. NEXT_PUBLIC_* values must be referenced
 * literally so Next.js can inline them in the browser bundle. Only the
 * publishable (anon) key belongs here — it is safe in the browser because
 * Row Level Security decides what it can do. The secret / service-role key
 * is never read by the application (only by scripts/, from .env.local).
 */
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** False until the project's Supabase URL and publishable key are provided. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

/** Public URL prefix of Storage objects, e.g. https://abc.supabase.co/storage/v1/object/public */
export const storagePublicBaseUrl = supabaseUrl ? `${supabaseUrl}/storage/v1/object/public` : null;

/** The public bucket that holds website images and videos (supabase/migrations/*_cms_storage.sql). */
export const MEDIA_BUCKET = "media";
