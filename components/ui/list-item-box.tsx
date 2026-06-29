import { cn } from "@/lib/utils";

export function ListItemBox({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-border/80 bg-muted/30 p-4 transition-colors hover:bg-muted/50",
        className
      )}
    >
      {children}
    </div>
  );
}
