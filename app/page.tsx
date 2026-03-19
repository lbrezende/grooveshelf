"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Gravity, { MatterBody } from "@/components/fancy/physics/gravity";
import Link from "next/link";

const gravityWords = [
  { text: "disco", color: "bg-primary", x: "15%", y: "5%" },
  { text: "vinil", color: "bg-[#533483]", x: "75%", y: "8%" },
  { text: "música", color: "bg-primary", x: "40%", y: "3%" },
  { text: "paixão", color: "bg-[#0F3460]", x: "60%", y: "10%" },
  { text: "favorito", color: "bg-[#533483]", x: "25%", y: "6%" },
];

const features = [
  {
    title: "Biblioteca de Gostos",
    description:
      "Cadastre suas bandas, álbuns e faixas favoritas. Conecte YouTube e Spotify. O sistema destaca o que você mais ouve.",
    icon: "🎵",
  },
  {
    title: "Wishlist Inteligente",
    description:
      "Organize sua lista de desejos com prioridade automática baseada nas suas faixas mais ouvidas.",
    icon: "💿",
  },
  {
    title: "Radar de Preços",
    description:
      "Monitore preços na Amazon. Receba alertas quando um vinil atingir seu preço-alvo.",
    icon: "📉",
  },
  {
    title: "Lista de Compras Mensal",
    description:
      "Todo mês receba uma sugestão de compras baseada no seu orçamento e nos preços atuais.",
    icon: "🛒",
  },
  {
    title: "Diário de Escuta",
    description:
      "Registre sessões de escuta com notas e ratings. Refine suas recomendações de compra.",
    icon: "📖",
  },
];

const pricingFeatures = {
  free: [
    "Até 20 álbuns na wishlist",
    "3 alertas de preço",
    "Biblioteca completa",
    "Diário de escuta",
  ],
  pro: [
    "Tudo ilimitado",
    "Lista de compras mensal",
    "Alertas ilimitados",
    "Suporte prioritário",
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">GrooveShelf</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Preços
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-0 px-6 relative">
        <div className="max-w-5xl mx-auto relative" style={{ height: "600px" }}>
          {/* Gravity falling words */}
          <Gravity gravity={{ x: 0, y: 1 }} className="absolute inset-0 z-0" grabCursor>
            {gravityWords.map((word) => (
              <MatterBody
                key={word.text}
                x={word.x}
                y={word.y}
                matterBodyOptions={{ friction: 0.5, restitution: 0.3, density: 0.002 }}
                isDraggable
              >
                <span
                  className={`${word.color} text-white text-sm md:text-base font-bold px-5 py-2.5 rounded-full select-none cursor-grab active:cursor-grabbing shadow-lg`}
                >
                  {word.text}
                </span>
              </MatterBody>
            ))}
          </Gravity>

          {/* Hero content on top */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="inline-block mb-6 text-6xl">🎸</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">
              Sua coleção de vinil
              <br />
              <span className="text-primary">começa antes da compra</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-center">
              Descubra, acompanhe e priorize os vinis que você realmente quer —
              com base no que você mais ouve.
            </p>
            <div className="flex gap-4 justify-center pointer-events-auto">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Começar grátis
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Ver features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Tudo que você precisa para curar sua coleção
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Do descobrimento à compra — acompanhe cada passo da sua jornada vinílica.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots placeholder */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Veja como funciona</h2>
          <p className="text-muted-foreground mb-12">
            Interface escura e imersiva — como uma loja de vinil à noite.
          </p>
          <div className="bg-card border border-border rounded-2xl p-8 aspect-video flex items-center justify-center">
            <p className="text-muted-foreground">
              Screenshots do app serão adicionados aqui
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Preços simples
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Comece grátis, faça upgrade quando quiser.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-border">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-1">Free</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">R$0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {pricingFeatures.free.map((f) => (
                    <li key={f} className="text-sm flex items-center gap-2">
                      <span className="text-primary">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Começar grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg shadow-primary/10">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-1">Pro</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">R$14,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {pricingFeatures.pro.map((f) => (
                    <li key={f} className="text-sm flex items-center gap-2">
                      <span className="text-primary">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block">
                  <Button className="w-full">Trial grátis de 14 dias</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-primary font-bold">GrooveShelf</span>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GrooveShelf. Feito para colecionadores de vinil.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground">
              Preços
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
