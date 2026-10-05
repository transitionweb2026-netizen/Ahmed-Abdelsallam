import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./env";

const LOGIN_PATH = "/admin/login";
/** Reachable without a session: sign-in, password reset and the auth callback. */
const PUBLIC_ADMIN_PATHS = new Set([LOGIN_PATH, "/admin/forgot-password", "/admin/auth/confirm"]);

/**
 * Runs for every /admin request: refreshes the Supabase session cookie and
 * sends signed-out visitors to the login page. This is only the first
 * gate — admin rights are checked again on the server in the admin layout
 * and in every Server Action, and Row Level Security enforces them in the
 * database.
 */
export async function guardAdmin(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublic = PUBLIC_ADMIN_PATHS.has(pathname);
  if (!isSupabaseConfigured) return isPublic ? NextResponse.next() : redirect(request, LOGIN_PATH);

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value);
      },
    },
  });

  // getUser() validates the token with Supabase Auth (getSession() would trust the cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublic) return redirect(request, LOGIN_PATH, `${pathname}${search}`);
  if (user && pathname === LOGIN_PATH) return redirect(request, "/admin");
  return response;
}

function redirect(request: NextRequest, path: string, next?: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = next && next !== "/admin" ? `?next=${encodeURIComponent(next)}` : "";
  return NextResponse.redirect(url);
}
