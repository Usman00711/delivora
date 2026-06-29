"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, CircleX } from "lucide-react";

type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: number;
  title?: string;
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  showToast: (toast: {
    title?: string;
    message: string;
    kind?: ToastKind;
    durationMs?: number;
  }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastIcon({ kind }: { kind: ToastKind }) {
  if (kind === "success") return <CheckCircle2 className="size-4 text-emerald-500" />;
  if (kind === "error") return <CircleX className="size-4 text-destructive" />;
  return <AlertCircle className="size-4 text-amber-500" />;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (
    toast: {
      title?: string;
      message: string;
      kind?: ToastKind;
      durationMs?: number;
    }
  ) => {
    const id = Date.now();
    const item: ToastItem = {
      id,
      title: toast.title,
      message: toast.message,
      kind: toast.kind ?? "success",
    };

    setToasts((current) => [...current, item]);

    const timeout = toast.durationMs ?? 3500;
    window.setTimeout(() => {
      setToasts((current) => current.filter((entry) => entry.id !== id));
    }, timeout);
  };

  const dismiss = (id: number) =>
    setToasts((current) => current.filter((entry) => entry.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-2 rounded-lg border border-border bg-background p-3 shadow-lg"
          >
            <ToastIcon kind={toast.kind} />
            <div className="min-w-0 flex-1">
              {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
              <p className="text-sm text-muted-foreground">{toast.message}</p>
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
              onClick={() => dismiss(toast.id)}
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
