import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex size-8 items-center justify-center overflow-hidden rounded-lg bg-background shadow-sm ring-1 ring-border",
        className
      )}
    >
      <Image
        src="/brand/delivora-logo.png"
        alt=""
        fill
        sizes="40px"
        className="object-cover"
        priority
      />
    </div>
  );
}
