"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useFormState } from "react-dom";
import { useState, useTransition } from "react";
import { registerAction } from "@/lib/actions/auth";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField, FormSection } from "@/components/forms/form-field";
import { Separator } from "@/components/ui/separator";
import { SubmittingButton } from "@/components/forms/submitting-button";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerState, registerFormAction] = useFormState(registerAction, {});
  const router = useRouter();
  const [isSigningIn, startSignInTransition] = useTransition();
  const isLogin = mode === "login";
  const isPending = isLogin && isSigningIn;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    const formData = new FormData(e.currentTarget);
    startSignInTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
        callbackUrl: "/dashboard",
      });

      setIsLoading(false);

      if (result?.error) {
        setLoginError("Invalid email or password.");
        return;
      }

      router.push(result?.url ?? "/dashboard");
      router.refresh();
    });
  }

  return (
    <Card className="border-border/80 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold">
          {isLogin ? "Welcome back" : "Create your account"}
        </CardTitle>
        <CardDescription className="text-base">
          {isLogin
            ? `Sign in to your ${APP_NAME} workspace`
            : "Start managing client delivery in one place"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          action={isLogin ? undefined : registerFormAction}
          onSubmit={isLogin ? handleSubmit : undefined}
          className="space-y-6"
        >
          <FormSection>
            {!isLogin && (
              <>
                <FormField label="Full name" htmlFor="name">
                  <Input
                    id="name"
                    name="name"
                    placeholder="Alex Rivera"
                    autoComplete="name"
                    required
                    disabled={isLoading}
                  />
                </FormField>
                <FormField label="Agency name" htmlFor="agencyName">
                  <Input
                    id="agencyName"
                    name="agencyName"
                    placeholder="Nova Digital Studio"
                    autoComplete="organization"
                    required
                    disabled={isLoading}
                  />
                </FormField>
              </>
            )}

            <FormField label="Email address" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="owner@clouddesk.dev"
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              hint={!isLogin ? "Must be at least 8 characters" : undefined}
            >
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                disabled={isLoading}
              />
            </FormField>

            {(loginError || registerState.error) && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {loginError ?? registerState.error}
              </div>
            )}
          </FormSection>

          {isLogin ? (
            <Button
              type="submit"
              className="h-10 w-full text-sm font-medium"
              disabled={isPending || isLoading}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          ) : (
            <SubmittingButton type="submit" pendingLabel="Creating account...">
              Create account
            </SubmittingButton>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>

          {isLogin && (
            <>
              <Separator />
              <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
                <p className="text-xs font-medium text-foreground">Demo credentials (Phase 2)</p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Agency:</span>{" "}
                    owner@clouddesk.dev / password123
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Client:</span>{" "}
                    client@clouddesk.dev / password123
                  </p>
                </div>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
