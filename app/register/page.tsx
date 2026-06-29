import { AuthForm } from "@/components/forms/auth-form";
import { AuthLayout } from "@/components/layout/auth-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthForm mode="register" />
    </AuthLayout>
  );
}
