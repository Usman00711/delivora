"use client";

import { ErrorState } from "@/components/shared/error-state";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-background px-4 py-10">
          <div className="mx-auto max-w-2xl">
            <ErrorState
              title="Application error"
              description={error.message || "We could not load the app right now."}
              actions={[
                { label: "Try again", onClick: reset },
                { label: "Restart app", href: "/" },
              ]}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
