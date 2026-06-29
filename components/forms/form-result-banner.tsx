type ActionState = {
  error?: string;
  success?: string;
};

export function FormResultBanner({ state }: { state?: ActionState }) {
  if (!state?.error && !state?.success) return null;

  return (
    <div
      className={
        state.success
          ? "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          : "rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      }
    >
      {state.error ?? state.success}
    </div>
  );
}
