import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}

export function FormField({ label, htmlFor, children, hint, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ children, className }: FormSectionProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}
