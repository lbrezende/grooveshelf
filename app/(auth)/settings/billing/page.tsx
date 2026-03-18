"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Crown,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: [
    "Ate 10 itens na wishlist",
    "Biblioteca de artistas e albuns",
    "Diario de escuta basico",
  ],
  TRIAL: [
    "Todos os recursos PRO",
    "Lista mensal de compras",
    "Prioridade inteligente",
    "14 dias gratis",
  ],
  PRO: [
    "Wishlist ilimitada",
    "Lista mensal de compras",
    "Prioridade inteligente",
    "Alertas de preco ilimitados",
    "Suporte prioritario",
  ],
};

const PLAN_LABELS: Record<string, string> = {
  FREE: "Gratuito",
  TRIAL: "Teste",
  PRO: "Pro",
};

export default function BillingPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [hasShownToast, setHasShownToast] = useState(false);

  const user = session?.user as unknown as {
    plan?: string;
    trialEndsAt?: string;
    stripeCurrentPeriodEnd?: string;
  };
  const userPlan = user?.plan ?? "FREE";
  const trialEndsAt = user?.trialEndsAt;
  const stripeCurrentPeriodEnd = user?.stripeCurrentPeriodEnd;

  // Handle Stripe redirect query params
  useEffect(() => {
    if (hasShownToast) return;

    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      toast.success("Assinatura ativada com sucesso! Bem-vindo ao PRO.");
      setHasShownToast(true);
    } else if (canceled === "true") {
      toast.info("Checkout cancelado. Voce pode tentar novamente quando quiser.");
      setHasShownToast(true);
    }
  }, [searchParams, hasShownToast]);

  // Calculate trial days left
  const trialDaysLeft =
    userPlan === "TRIAL" && trialEndsAt
      ? Math.max(
          0,
          Math.ceil(
            (new Date(trialEndsAt).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  // Checkout mutation
  const checkout = useMutation({
    mutationFn: () =>
      fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkout" }),
      }).then(async (r) => {
        if (!r.ok) throw new Error("Erro ao iniciar checkout");
        return r.json();
      }),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error("Erro ao iniciar checkout. Tente novamente.");
    },
  });

  // Portal mutation
  const portal = useMutation({
    mutationFn: () =>
      fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "portal" }),
      }).then(async (r) => {
        if (!r.ok) throw new Error("Erro ao acessar portal");
        return r.json();
      }),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error("Erro ao acessar portal. Tente novamente.");
    },
  });

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Plano & <span className="text-primary">Assinatura</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seu plano e metodo de pagamento.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Current Plan Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  {userPlan === "PRO" ? (
                    <Crown className="h-5 w-5 text-primary" />
                  ) : userPlan === "TRIAL" ? (
                    <Clock className="h-5 w-5 text-primary" />
                  ) : (
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  )}
                  Plano {PLAN_LABELS[userPlan] ?? userPlan}
                </CardTitle>
                <CardDescription className="mt-1">
                  {userPlan === "FREE" &&
                    "Voce esta no plano gratuito com recursos limitados."}
                  {userPlan === "TRIAL" &&
                    `Seu periodo de teste termina em ${trialDaysLeft} dia${trialDaysLeft !== 1 ? "s" : ""}.`}
                  {userPlan === "PRO" &&
                    "Voce tem acesso completo a todos os recursos."}
                </CardDescription>
              </div>
              <Badge
                variant={userPlan === "PRO" ? "default" : "secondary"}
                className="text-sm"
              >
                {PLAN_LABELS[userPlan] ?? userPlan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(PLAN_FEATURES[userPlan] ?? []).map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* PRO renewal info */}
            {userPlan === "PRO" && stripeCurrentPeriodEnd && (
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-primary font-medium">
                  Assinatura ativa
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Proxima renovacao:{" "}
                  {new Date(stripeCurrentPeriodEnd).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trial Warning */}
        {userPlan === "TRIAL" && (
          <Card className="bg-card border-primary/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {trialDaysLeft} dia{trialDaysLeft !== 1 ? "s" : ""} restante
                  {trialDaysLeft !== 1 ? "s" : ""} no teste
                </p>
                <p className="text-sm text-muted-foreground">
                  Faca upgrade para o PRO antes que seu teste expire e mantenha
                  acesso a todos os recursos.
                </p>
              </div>
              <Button
                onClick={() => checkout.mutate()}
                disabled={checkout.isPending}
                className="shrink-0"
              >
                {checkout.isPending ? "Carregando..." : "Fazer Upgrade"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upgrade CTA for FREE */}
        {userPlan === "FREE" && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Upgrade para o PRO
              </CardTitle>
              <CardDescription>
                Desbloqueie todos os recursos e leve sua colecao ao proximo
                nivel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {PLAN_FEATURES.PRO.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => checkout.mutate()}
                disabled={checkout.isPending}
                className="w-full gap-2"
                size="lg"
              >
                <CreditCard className="h-4 w-4" />
                {checkout.isPending
                  ? "Redirecionando..."
                  : "Assinar PRO — R$14,90/mes"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Manage Subscription for PRO */}
        {userPlan === "PRO" && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Gerenciar Assinatura
              </CardTitle>
              <CardDescription>
                Acesse o portal do Stripe para gerenciar sua assinatura, atualizar
                metodo de pagamento ou cancelar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => portal.mutate()}
                disabled={portal.isPending}
                className="gap-2"
              >
                <CreditCard className="h-4 w-4" />
                {portal.isPending
                  ? "Abrindo portal..."
                  : "Gerenciar no Stripe"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
