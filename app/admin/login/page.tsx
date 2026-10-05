import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/AuthCard";
import { LoginForm } from "@/components/admin/AuthForms";
import { SetupScreen } from "@/components/admin/Screens";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  "not-admin": "This account does not have access to the CMS.",
  link: "The link is invalid or has expired. Request a new one.",
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  if (!isSupabaseConfigured) return <SetupScreen />;
  const { next, error } = await searchParams;
  return (
    <AuthCard title="Sign in" description="Content management for the website.">
      <LoginForm next={next} initialError={error ? ERRORS[error] : undefined} />
    </AuthCard>
  );
}
