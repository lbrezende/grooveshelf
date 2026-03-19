"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaywallGateProps {
  hasAccess: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function PaywallGate({
  hasAccess,
  children,
  title = "Recurso exclusivo do plano Pro",
  description = "Faca upgrade para desbloquear todos os recursos e aproveitar o maximo da sua colecao.",
}: PaywallGateProps) {
  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md border-0 bg-card text-center ring-white/5">
        <CardHeader>
          {/* Lock icon */}
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl" aria-hidden>
              &#128274;
            </span>
          </div>
          <CardTitle className="text-lg text-white">{title}</CardTitle>
          <CardDescription className="text-zinc-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/pricing">
            <Button className="h-10 w-full bg-primary text-white hover:bg-primary/90">
              Ver planos e fazer upgrade
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
