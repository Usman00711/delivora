"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type SubmittingButtonProps = ComponentProps<typeof Button> & {
  pendingLabel?: string;
};

export function SubmittingButton({
  children,
  pendingLabel = "Saving...",
  ...props
}: SubmittingButtonProps) {
  const status = useFormStatus();
  const pending = status.pending;

  return (
    <Button disabled={pending || props.disabled} {...props}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
