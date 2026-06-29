"use client";

import { ErrorState } from "@/components/shared/error-state";

type ClientErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ClientError({ error, reset }: ClientErrorProps) {
  return (
    <div className="px-4 py-8">
      <ErrorState
        title="Client portal unavailable"
        description={error.message || "Unable to load client content."}
        actions={[
          { label: "Try again", onClick: reset },
          { label: "Back to action center", href: "/client" },
          { label: "Dashboard", href: "/dashboard" },
        ]}
      />
    </div>
  );
}
