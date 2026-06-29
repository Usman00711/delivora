"use client";

import { useEffect, useRef } from "react";

import { useToast } from "@/components/ui/toaster";

type RouteToast = {
  message: string;
  kind?: "success" | "error" | "info";
};

export function RouteToasts({ toasts }: { toasts: RouteToast[] }) {
  const { showToast } = useToast();
  const shownKeys = useRef(new Set<string>());

  useEffect(() => {
    toasts.forEach((toast) => {
      const key = `${toast.message}:${toast.kind ?? "success"}`;
      if (shownKeys.current.has(key)) return;

      shownKeys.current.add(key);
      showToast({ message: toast.message, kind: toast.kind ?? "success" });
    });
  }, [toasts, showToast]);

  return null;
}
