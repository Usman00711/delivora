import Link from "next/link";
import { projectSubNavItems } from "@/lib/constants";

export function ProjectSubNav({
  baseHref,
}: {
  baseHref: string;
}) {
  return (
    <div className="overflow-x-auto border-b">
      <nav className="flex min-w-max gap-1 pb-2">
        {projectSubNavItems.map((item) => {
          const href = item.segment ? `${baseHref}/${item.segment}` : baseHref;

          return (
            <Link
              key={item.segment || "overview"}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
