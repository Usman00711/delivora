import { AuthForm } from "@/components/forms/auth-form";
import { AuthLayout } from "@/components/layout/auth-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
