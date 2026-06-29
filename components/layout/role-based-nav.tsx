import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoleBasedNavProps {
  className?: string;
}

export function RoleBasedNav({ className }: RoleBasedNavProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/dashboard" />}>
        Agency Portal
      </Button>
      <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/client" />}>
        Client Portal
      </Button>
    </div>
  );
}
