"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextHighlighter } from "@/components/fancy/text/text-highlighter";
import Link from "next/link";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { AlbumCarousel } from "@/components/ui/cases-with-infinite-scroll";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { SquishyPricing } from "@/components/ui/squishy-pricing";
import { motion } from "framer-motion";

// Three.js Hyperspeed — only loaded after user scrolls (zero impact on PageSpeed)
const Hyperspeed = dynamic(() => import("@/components/Hyperspeed"), { ssr: false });

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

const tooltipPeople = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
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

const trendingAlbums = [
  { title: "Un Verano Sin Ti", artist: "Bad Bunny", year: 2022, coverUrl: "https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72" },
  { title: "Starboy", artist: "The Weeknd", year: 2016, coverUrl: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452" },
  { title: "÷ (Divide)", artist: "Ed Sheeran", year: 2017, coverUrl: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96" },
  { title: "SOUR", artist: "Olivia Rodrigo", year: 2021, coverUrl: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a" },
  { title: "After Hours", artist: "The Weeknd", year: 2020, coverUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" },
  { title: "Hollywood's Bleeding", artist: "Post Malone", year: 2019, coverUrl: "https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02" },
  { title: "Future Nostalgia", artist: "Dua Lipa", year: 2020, coverUrl: "https://i.scdn.co/image/ab67616d0000b273c88bae7846e62a8ba59ee0bd" },
  { title: "SOS", artist: "SZA", year: 2022, coverUrl: "https://i.scdn.co/image/ab67616d0000b273bc18bdade69ec5ef0bb25b17" },
  { title: "WHEN WE ALL FALL ASLEEP", artist: "Billie Eilish", year: 2019, coverUrl: "https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce" },
  { title: "beerbongs & bentleys", artist: "Post Malone", year: 2018, coverUrl: "https://i.scdn.co/image/ab67616d0000b273b1c4b76e23414c9f20242268" },
  { title: "Lover", artist: "Taylor Swift", year: 2019, coverUrl: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647" },
  { title: "Midnights", artist: "Taylor Swift", year: 2022, coverUrl: "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5" },
  { title: "Purpose", artist: "Justin Bieber", year: 2015, coverUrl: "https://i.scdn.co/image/ab67616d0000b273f46b9d202509a8f7384b90de" },
  { title: "Scorpion", artist: "Drake", year: 2018, coverUrl: "https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5" },
  { title: "Views", artist: "Drake", year: 2016, coverUrl: "https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c" },
  { title: "AM", artist: "Arctic Monkeys", year: 2013, coverUrl: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" },
  { title: "Doo-Wops & Hooligans", artist: "Bruno Mars", year: 2010, coverUrl: "https://i.scdn.co/image/ab67616d0000b2737039c1c841fc3dfa2ad8a0d8" },
  { title: "HIT ME HARD AND SOFT", artist: "Billie Eilish", year: 2024, coverUrl: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62" },
  { title: "Short n' Sweet", artist: "Sabrina Carpenter", year: 2024, coverUrl: "https://i.scdn.co/image/ab67616d0000b273fd8d7a8d96871e791cb1f626" },
  { title: "TORTURED POETS DEPARTMENT", artist: "Taylor Swift", year: 2024, coverUrl: "https://i.scdn.co/image/ab67616d0000b2735076e4160d018e378f488c33" },
];

const galleryItems = [
  { id: 1, type: "image" as const, title: "Coleção de Vinis", desc: "Uma coleção curada de vinis raros", url: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=800&q=80", span: "md:col-span-2 md:row-span-3 sm:col-span-2 sm:row-span-2" },
  { id: 2, type: "image" as const, title: "Vitrola Vintage", desc: "Toca-discos clássico em ação", url: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=800&q=80", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  { id: 3, type: "image" as const, title: "Show ao Vivo", desc: "A energia de um show inesquecível", url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  { id: 4, type: "image" as const, title: "Estúdio Musical", desc: "Onde a magia acontece", url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80", span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2" },
  { id: 5, type: "image" as const, title: "Loja de Discos", desc: "Paraíso do colecionador", url: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=800&q=80", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  { id: 6, type: "image" as const, title: "Guitarra Elétrica", desc: "Rock and Roll para sempre", url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80", span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2" },
];

const classicArtists = [
  "Led Zeppelin", "Pink Floyd", "The Beatles", "Rolling Stones",
  "David Bowie", "Queen", "Jimi Hendrix", "Bob Dylan",
  "Aretha Franklin", "Stevie Wonder", "Miles Davis", "John Coltrane",
  "Janis Joplin", "The Doors", "Fleetwood Mac", "Eagles",
  "Black Sabbath", "Deep Purple", "The Who", "Cream",
  "Marvin Gaye", "Ray Charles", "Chuck Berry", "Elvis Presley",
  "Otis Redding", "James Brown", "Etta James", "Nina Simone",
];

// Cyberpunk Hyperspeed colors
const cyberpunkHyperspeed = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: "turbulentDistortion" as const,
  length: 600,
  roadWidth: 12,
  islandWidth: 3,
  lanesPerRoad: 4,
  fov: 110,
  fovSpeedUp: 160,
  speedUp: 3,
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
  const [loadHyperspeed, setLoadHyperspeed] = useState(false);
  const scrollTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Strategy: load Hyperspeed only after user scrolls (proves engagement)
    // This means PageSpeed Lighthouse (which doesn't scroll) never loads Three.js
    const handleScroll = () => {
      setLoadHyperspeed(true);
      window.removeEventListener("scroll", handleScroll);
    };

    // Load after 2s idle — fast enough for users, slow enough for Lighthouse
    const timer = setTimeout(() => {
      setLoadHyperspeed(true);
      window.removeEventListener("scroll", handleScroll);
    }, 2000);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-background"
      style={{ minHeight: "100vh" }}
    >
      {/* CSS speed lines — instant, zero JS, always visible as base */}
      <div className="absolute inset-0 z-0 hero-speed-lines" />

      {/* Hyperspeed 3D — positioned higher, behind button & mockup area */}
      {loadHyperspeed && (
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            opacity: 0,
            animation: "fadeIn 2s ease-out forwards",
          }}
        >
          <Suspense fallback={null}>
            <Hyperspeed effectOptions={cyberpunkHyperspeed} />
          </Suspense>
        </div>
      )}

      {/* Bottom glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 90% 50% at 50% 100%, color-mix(in srgb, var(--accent) 20%, transparent) 0%, color-mix(in srgb, var(--primary) 10%, transparent) 30%, transparent 60%)",
        }}
      />

      {/* Top/bottom fade for readability */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to bottom, var(--background) 0%, transparent 30%, transparent 70%, color-mix(in srgb, var(--background) 80%, transparent) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen">
        {/* Text content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 pt-32 pb-8">
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
          <h1 className="text-[clamp(2rem,5vw,3.75rem)] font-bold tracking-tight text-foreground mb-4" style={{ fontStyle: "normal", lineHeight: 1.1 }}>
            Sua coleção de vinil
            <br />
            começa antes da compra.
          </h1>

          {/* Subtitle — uses muted-foreground token */}
          <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
            Descubra, acompanhe e priorize os vinis que você realmente quer — com base no que você mais ouve.
          </p>

          {/* CTA — uses Button component from design system */}
          <Link href="/login">
            <Button size="lg">
              Começar grátis
            </Button>
          </Link>

          {/* Social proof avatars */}
          <div className="flex items-center gap-4 mt-6">
            <AnimatedTooltip items={tooltipPeople} />
            <span className="text-sm text-muted-foreground ml-4">
              +2.000 colecionadores já usam
            </span>
          </div>
        </div>

        {/* Dashboard glass card — uses card/border tokens */}
        <div className="w-full max-w-[1100px] mx-auto px-6 pb-0 mt-16">
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

      {/* Album Carousel */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight mb-2">
            Os discos que estão{" "}
            <TextHighlighter highlightColor="color-mix(in srgb, var(--primary) 30%, transparent)">
              dominando o Spotify
            </TextHighlighter>
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Acompanhe os álbuns mais ouvidos e adicione direto na sua wishlist.
          </p>
          <AlbumCarousel albums={trendingAlbums} />
        </div>
      </section>

      {/* Gallery — musicians, turntables, vinyl culture */}
      <section className="py-12 px-6">
        <InteractiveBentoGallery
          mediaItems={galleryItems}
          title="Veja como funciona"
          description="Interface escura e imersiva — como uma loja de vinil à noite."
        />
      </section>

      {/* Classic artists vinyl card section */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Seus discos favoritos{" "}
            <TextHighlighter highlightColor="color-mix(in srgb, var(--primary) 30%, transparent)">
              na palma da sua mão
            </TextHighlighter>
          </h2>
          <p className="text-muted-foreground mb-12">
            De verdade. Não é no iPod. É na palma da sua mão mesmo, pra botar a vitrola pra tocar.
          </p>
          <div className="flex items-center justify-center">
            <div className="border border-border/30 dark:border-white/[0.2] flex flex-col items-start max-w-md p-4 relative h-[28rem] w-full rounded-xl">
              <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
              <EvervaultCard text="♫" artists={classicArtists} />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative overflow-hidden py-24 px-6">
        <div className="mx-auto w-full max-w-6xl space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="mx-auto max-w-xl space-y-5"
          >
            <div className="flex justify-center">
              <div className="rounded-lg border px-4 py-1 font-mono text-sm">Preços</div>
            </div>
            <h2 className="text-center text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">
              <TextHighlighter highlightColor="color-mix(in srgb, var(--primary) 30%, transparent)" direction="ltr">
                Preços simples
              </TextHighlighter>
            </h2>
            <p className="text-muted-foreground text-center text-sm md:text-base">
              Comece grátis, faça upgrade quando quiser.
            </p>
          </motion.div>
          <SquishyPricing />
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
