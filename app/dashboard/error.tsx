"use client";

import { ErrorState } from "@/components/shared/error-state";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="px-4 py-8">
      <ErrorState
        title="Dashboard unavailable"
        description={error.message || "Unable to load dashboard data."}
        actions={[
          { label: "Try again", onClick: reset },
          { label: "Go to dashboard", href: "/dashboard" },
          { label: "Action center", href: "/client" },
        ]}
      />
    </div>
  );
}
