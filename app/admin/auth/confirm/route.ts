import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const OTP_TYPES: EmailOtpType[] = ["recovery", "invite", "email", "magiclink", "signup", "email_change"];

/**
 * Target of the links in Supabase Auth emails (password reset, invitation).
 * Supports both link styles: `?code=` (PKCE, the default template) and
 * `?token_hash=&type=` (custom templates, works in any browser). Signs the
 * user in, then continues inside the dashboard only.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = searchParams.get("next") ?? "/admin";
  const target = /^\/admin(\/[A-Za-z0-9/_-]*)?$/.test(next) ? next : "/admin";
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    if (code) ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
    else if (tokenHash && type && OTP_TYPES.includes(type)) ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }

  const url = request.nextUrl.clone();
  url.search = "";
  if (ok) {
    // Invitations and resets arrive with next=/admin/account, where the password is set.
    url.pathname = target;
    return NextResponse.redirect(url);
  }
  url.pathname = "/admin/login";
  url.searchParams.set("error", "link");
  return NextResponse.redirect(url);
}
