"use client";

import { useEffect, useRef } from "react";
import type { ActionState } from "@/lib/actions/action-utils";
import { useToast } from "@/components/ui/toaster";
import { FormResultBanner } from "@/components/forms/form-result-banner";

export function ActionMessage({ state }: { state: ActionState }) {
  const { showToast } = useToast();
  const latestRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.error && latestRef.current !== `error:${state.error}`) {
      latestRef.current = `error:${state.error}`;
      showToast({ message: state.error, kind: "error" });
    }

    if (state.success && latestRef.current !== `success:${state.success}`) {
      latestRef.current = `success:${state.success}`;
      showToast({ message: state.success, kind: "success" });
    }
  }, [state.error, state.success, showToast]);

  if (!state.error && !state.success) return null;

  return <FormResultBanner state={state} />;
}
