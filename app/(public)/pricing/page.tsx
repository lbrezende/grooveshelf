"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: "R$0",
    period: "/mês",
    description: "Para começar sua coleção",
    features: [
      "Até 20 álbuns na wishlist",
      "3 alertas de preço ativos",
      "Biblioteca de artistas e álbuns",
      "Diário de escuta",
    ],
    limitations: ["Sem lista de compras mensal"],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "R$14,90",
    period: "/mês",
    description: "Para colecionadores sérios",
    features: [
      "Wishlist ilimitada",
      "Alertas de preço ilimitados",
      "Lista de compras mensal automática",
      "Biblioteca completa",
      "Diário de escuta com analytics",
      "Suporte prioritário",
    ],
    limitations: [],
    cta: "Começar trial de 14 dias",
    highlighted: true,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleUpgrade() {
    if (!session) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "checkout" }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border px-6 py-4">
        <a href="/" className="text-xl font-bold text-primary">
          GrooveShelf
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Planos simples, sem surpresas</h1>
          <p className="text-muted-foreground text-lg">
            Comece grátis. Faça upgrade quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Mais popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-primary">&#10003;</span>
                      {f}
                    </li>
                  ))}
                  {plan.limitations.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-muted-foreground">
                      <span>&#10007;</span>
                      {l}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => {
                    if (plan.highlighted) {
                      handleUpgrade();
                    } else {
                      router.push(session ? "/dashboard" : "/login");
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
