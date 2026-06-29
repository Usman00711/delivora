import type { HandoverItem } from "@prisma/client";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListItemBox } from "@/components/ui/list-item-box";

export function HandoverVaultList({ items }: { items: HandoverItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">Handover Vault</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {items.map((item) => (
          <ListItemBox key={item.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge variant={item.isVisibleToClient ? "secondary" : "outline"}>
                  {item.type.replace("_", " ")}
                </Badge>
                {item.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={item.url} target="_blank" />}
                  >
                    Open
                    {item.url.includes("res.cloudinary.com") ? (
                      <Download className="size-3.5" />
                    ) : (
                      <ExternalLink className="size-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </ListItemBox>
        ))}
      </CardContent>
    </Card>
  );
}
