"use client";

import { ErrorState } from "@/components/shared/error-state";

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <ErrorState
          title="Something went wrong"
          description={error.message || "An unexpected error happened. Please try again."}
          actions={[
            { label: "Try again", onClick: reset },
            { label: "Home", href: "/" },
            { label: "Go to dashboard", href: "/dashboard" },
          ]}
        />
      </div>
    </div>
  );
}
