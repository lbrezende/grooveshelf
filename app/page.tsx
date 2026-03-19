"use client";

import { useRef, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Gravity, { MatterBody } from "@/components/fancy/physics/gravity";
import { TextHighlighter } from "@/components/fancy/text/text-highlighter";
import Link from "next/link";

const Hyperspeed = dynamic(() => import("@/components/Hyperspeed"), { ssr: false });

const gravityWords = [
  { text: "disco", color: "bg-primary", x: "20%", y: "2%", angle: -12 },
  { text: "vinil", color: "bg-chart-2", x: "65%", y: "5%", angle: 8 },
  { text: "música", color: "bg-primary", x: "42%", y: "0%", angle: -5 },
  { text: "paixão", color: "bg-chart-3", x: "55%", y: "3%", angle: 15 },
  { text: "favorito", color: "bg-chart-2", x: "30%", y: "1%", angle: -20 },
];

const features = [
  {
    title: "Biblioteca de Gostos",
    description:
      "Cadastre suas bandas, álbuns e faixas favoritas. Conecte YouTube e Spotify. O sistema destaca o que você mais ouve.",
    icon: "🎵",
    highlightColor: "color-mix(in srgb, var(--chart-2) 30%, transparent)",
  },
  {
    title: "Wishlist Inteligente",
    description:
      "Organize sua lista de desejos com prioridade automática baseada nas suas faixas mais ouvidas.",
    icon: "💿",
    highlightColor: "color-mix(in srgb, var(--primary) 30%, transparent)",
  },
  {
    title: "Radar de Preços",
    description:
      "Monitore preços na Amazon. Receba alertas quando um vinil atingir seu preço-alvo.",
    icon: "📉",
    highlightColor: "color-mix(in srgb, var(--chart-3) 40%, transparent)",
  },
  {
    title: "Lista de Compras Mensal",
    description:
      "Todo mês receba uma sugestão de compras baseada no seu orçamento e nos preços atuais.",
    icon: "🛒",
    highlightColor: "color-mix(in srgb, var(--chart-2) 30%, transparent)",
  },
  {
    title: "Diário de Escuta",
    description:
      "Registre sessões de escuta com notas e ratings. Refine suas recomendações de compra.",
    icon: "📖",
    highlightColor: "color-mix(in srgb, var(--primary) 30%, transparent)",
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

// Cyberpunk Hyperspeed — purple/cyan/magenta like reactbits.dev
const cyberpunkHyperspeed = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: "turbulentDistortion" as const,
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5] as [number, number],
  lightStickHeight: [1.3, 1.7] as [number, number],
  movingAwaySpeed: [60, 80] as [number, number],
  movingCloserSpeed: [-120, -160] as [number, number],
  carLightsLength: [400 * 0.03, 400 * 0.2] as [number, number],
  carLightsRadius: [0.05, 0.14] as [number, number],
  carWidthPercentage: [0.3, 0.5] as [number, number],
  carShiftX: [-0.8, 0.8] as [number, number],
  carFloorSeparation: [0, 5] as [number, number],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0x131318,
    brokenLines: 0x131318,
    leftCars: [0xff00ff, 0xcc00ff, 0xff66cc, 0xff33aa],
    rightCars: [0x00ffff, 0x00ccff, 0x33ffff, 0x00e5ff],
    sticks: 0x5500aa,
  },
};

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-background"
      style={{ minHeight: "100vh" }}
    >
      {/* Hyperspeed 3D background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-background" />}>
          <Hyperspeed effectOptions={cyberpunkHyperspeed} />
        </Suspense>
      </div>

      {/* Gradient overlay for readability */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--background) 60%, transparent) 0%, transparent 40%, transparent 60%, color-mix(in srgb, var(--background) 80%, transparent) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen">
        {/* Text content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 pt-24 pb-8">
          {/* Pill tag — uses border/muted tokens */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/30 border border-border mb-10 backdrop-blur-sm">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary">
              GrooveShelf
            </span>
            <span className="text-sm text-muted-foreground">
              Sua coleção começa aqui &rarr;
            </span>
          </div>

          {/* Headline — uses foreground token */}
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.1] tracking-tight text-foreground mb-6">
            Sua coleção de vinil
            <br />
            começa antes da compra.
          </h1>

          {/* Subtitle — uses muted-foreground token */}
          <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Descubra, acompanhe e priorize os vinis que você realmente quer — com base no que você mais ouve.
          </p>

          {/* CTA — uses Button component from design system */}
          <Link href="/login">
            <Button size="lg">
              Começar grátis
            </Button>
          </Link>
        </div>

        {/* Dashboard glass card — uses card/border tokens */}
        <div className="w-full max-w-[1100px] mx-auto px-6 pb-0">
          <Card className="rounded-t-[20px] rounded-b-none border-b-0 bg-card/50 backdrop-blur-xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">G</span>
                </div>
                <span className="text-sm font-semibold text-foreground/80">GrooveShelf</span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">💬</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">🔔</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-primary/30" />
              </div>
            </div>

            {/* Sidebar + Content */}
            <div className="flex" style={{ height: "320px" }}>
              {/* Sidebar */}
              <div className="w-[240px] border-r border-border/30 p-4 flex flex-col gap-1">
                {[
                  { label: "Dashboard", active: true },
                  { label: "Library", active: false },
                  { label: "Wishlist", active: false },
                  { label: "Listening Diary", active: false },
                  { label: "Monthly List", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                      item.active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                        item.active ? "bg-primary/20" : "bg-muted/30"
                      }`}
                    >
                      {item.active ? "🏠" : "·"}
                    </div>
                    {item.label}
                    {item.label === "Wishlist" && (
                      <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">
                        4
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Main content area — skeleton using muted tokens */}
              <div className="flex-1 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-foreground/10" />
                  <div className="flex flex-col gap-1.5">
                    <div className="w-32 h-3 rounded bg-foreground/15" />
                    <div className="w-20 h-2.5 rounded bg-foreground/8" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-3 rounded bg-foreground/12" />
                  <div className="w-[85%] h-3 rounded bg-foreground/8" />
                  <div className="w-[70%] h-3 rounded bg-foreground/12" />
                  <div className="w-[60%] h-3 rounded bg-foreground/6" />
                </div>
                <div className="mt-6">
                  <div className="w-24 h-8 rounded-lg bg-foreground/10" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

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

      {/* Hero — Figma Feature 23 inspired */}
      <HeroSection />

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Tudo que você precisa para{" "}
            <TextHighlighter highlightColor="color-mix(in srgb, var(--primary) 30%, transparent)">
              curar sua coleção
            </TextHighlighter>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Do descobrimento à compra — acompanhe cada passo da sua jornada vinílica.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">
                    <TextHighlighter highlightColor={f.highlightColor} triggerType="hover">
                      {f.title}
                    </TextHighlighter>
                  </h3>
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
          <h2 className="text-3xl font-bold mb-4">
            Veja{" "}
            <TextHighlighter highlightColor="color-mix(in srgb, var(--primary) 30%, transparent)" direction="ltr">
              como funciona
            </TextHighlighter>
          </h2>
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
            <TextHighlighter highlightColor="color-mix(in srgb, var(--primary) 30%, transparent)" direction="ltr">
              Preços simples
            </TextHighlighter>
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
                  <span className="text-3xl font-bold">
                    <TextHighlighter highlightColor="var(--primary)" triggerType="inView">
                      R$14,90
                    </TextHighlighter>
                  </span>
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
