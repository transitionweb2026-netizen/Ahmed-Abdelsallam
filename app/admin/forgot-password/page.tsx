import type { Metadata } from "next";
import { AuthCard } from "@/components/admin/AuthCard";
import { ForgotPasswordForm } from "@/components/admin/AuthForms";
import { SetupScreen } from "@/components/admin/Screens";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  if (!isSupabaseConfigured) return <SetupScreen />;
  return (
    <AuthCard title="Reset your password" description="Enter your email. If it belongs to an administrator, you will receive a link to choose a new password.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
