"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Plus, Minus, ChevronDown } from "lucide-react";

/* ─── Data ─── */
const services = [
  {
    title: "Curadoria de Vinil",
    description: "O GrooveShelf analisa sua biblioteca de gostos e monta uma wishlist inteligente priorizando os vinis que mais combinam com você.",
    points: ["Análise de hábitos de escuta", "Priorização por artista e faixa", "Integração Spotify e YouTube", "Recomendações personalizadas"],
  },
  {
    title: "Radar de Preços",
    description: "Monitore preços de vinil na Amazon e receba alertas quando o preço cair ao ponto ideal para compra.",
    points: ["Monitoramento contínuo Amazon", "Alertas de preço-alvo", "Histórico de variação", "Lista de compras mensal"],
  },
  {
    title: "Design System Cyberpunk",
    description: "Interface escura e imersiva construída com um design system proprietário, tokens semânticos e componentes reutilizáveis.",
    points: ["Tema dark cyberpunk", "Tokens de cor semânticos", "Componentes shadcn/ui", "Storybook documentado"],
  },
  {
    title: "Stack Moderna",
    description: "Construído com as melhores tecnologias do ecossistema React — performance, DX e escalabilidade desde o dia 1.",
    points: ["Next.js + TypeScript", "Prisma + PostgreSQL", "NextAuth + Stripe", "Tailwind CSS + Framer Motion"],
  },
];

const results = [
  { metric: "20+", label: "Componentes UI", desc: "Design system completo" },
  { metric: "5", label: "Seções Landing Page", desc: "Hero, features, gallery, pricing, contact" },
  { metric: "20", label: "Álbuns no Carousel", desc: "Top Spotify em tempo real" },
  { metric: "100%", label: "Dark Mode", desc: "Interface cyberpunk imersiva" },
  { metric: "3", label: "Planos de Preço", desc: "Free, Colecionador, Obsessivo" },
  { metric: "<2s", label: "Tempo de Carregamento", desc: "Lazy loading + code splitting" },
];

const faqs = [
  { q: "Quem criou o GrooveShelf?", a: "O GrooveShelf foi concebido e desenvolvido por Leandro Rezende como um projeto pessoal para colecionadores de vinil que querem organizar sua jornada de descoberta e compra." },
  { q: "Quais tecnologias foram usadas?", a: "Next.js 15, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, NextAuth, Stripe, Framer Motion, shadcn/ui e Storybook. Deploy via Vercel." },
  { q: "O design system é open source?", a: "O design system foi construído do zero com tokens semânticos e componentes documentados no Storybook. A paleta cyberpunk com magenta, ciano e preto é exclusiva do GrooveShelf." },
  { q: "Posso contribuir com o projeto?", a: "No momento o projeto é closed-source, mas estamos avaliando abrir partes do design system e componentes UI para a comunidade." },
  { q: "Como funciona o radar de preços?", a: "O sistema monitora preços na Amazon periodicamente. Quando um vinil da sua wishlist atinge o preço-alvo que você definiu, enviamos um alerta por email." },
];

const testimonials = [
  { quote: "Finalmente consigo acompanhar os vinis que quero sem perder nenhuma promoção.", name: "Rafael M.", role: "Colecionador desde 2018" },
  { quote: "A interface é linda. Parece que estou numa loja de discos à noite. Muito imersivo.", name: "Juliana S.", role: "DJ e produtora" },
  { quote: "A lista mensal de compras mudou meu jogo. Agora gasto menos e compro melhor.", name: "Carlos T.", role: "Audiófilo" },
];

const techLogos = [
  "Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL", "Vercel",
  "Stripe", "Framer Motion", "shadcn/ui", "Storybook", "NextAuth", "Resend",
];

/* ─── Components ─── */

function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="flex flex-col items-center gap-2 text-muted-foreground"
    >
      <span className="text-xs uppercase tracking-widest">Scroll</span>
      <ChevronDown className="w-4 h-4" />
    </motion.div>
  );
}

function LogoTicker() {
  return (
    <div className="overflow-hidden py-8 border-y border-border/30">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...techLogos, ...techLogos].map((logo, i) => (
          <span key={i} className="text-sm font-mono text-muted-foreground/60 uppercase tracking-wider">
            {logo}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border border-border/30 rounded-xl p-8 bg-card/30 hover:border-primary/40 transition-colors group"
    >
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-bold">{service.title}</h3>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="text-muted-foreground text-sm mb-6">{service.description}</p>
      <ul className="space-y-2">
        {service.points.map((point) => (
          <li key={point} className="text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function FAQItem({ item, isOpen, onClick }: { item: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border/30">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left hover:text-primary transition-colors"
      >
        <span className="text-lg font-medium pr-4">{item.q}</span>
        {isOpen ? <Minus className="w-5 h-5 shrink-0" /> : <Plus className="w-5 h-5 shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground text-sm pb-6">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative max-w-2xl mx-auto text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
            &ldquo;{testimonials[current].quote}&rdquo;
          </p>
          <p className="text-sm font-semibold">{testimonials[current].name}</p>
          <p className="text-xs text-muted-foreground">{testimonials[current].role}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)}
          className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/20"}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((c) => (c + 1) % testimonials.length)}
          className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function WhoBuiltGroovPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">GrooveShelf</Link>
          <div className="flex items-center gap-6 text-sm">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Serviços</a>
            <a href="#results" className="text-muted-foreground hover:text-foreground transition-colors">Resultados</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            <Link href="/">
              <Button size="sm">Voltar ao site</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Avatar */}
          <div className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary/60 to-primary/20 ring-2 ring-primary/30 ring-offset-4 ring-offset-background flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">LR</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Quem construiu o
            <br />
            <span className="text-primary">GrooveShelf</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Um projeto de produto digital criado por Leandro Rezende — do conceito ao deploy, design system ao código de produção.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/#pricing">
              <Button size="lg">
                Ver planos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="outline" size="lg">Ver serviços</Button>
            </a>
          </div>
        </motion.div>

        <div className="mt-16">
          <ScrollIndicator />
        </div>
      </section>

      {/* Logo ticker */}
      <LogoTicker />

      {/* Services */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Serviços</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">
              O que o GrooveShelf faz por você
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Resultados</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">
              Números que importam
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {results.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="border border-border/30 rounded-xl p-6 bg-background/50"
              >
                <span className="text-4xl md:text-5xl font-black text-primary">{r.metric}</span>
                <p className="text-sm font-semibold mt-3">{r.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Depoimentos</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">
              O que dizem os colecionadores
            </h2>
          </motion.div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-4">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                item={faq}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Pronto para começar sua coleção?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Crie sua conta grátis e descubra os vinis que combinam com você.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg">
                  Começar grátis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">Voltar ao site</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-primary font-bold">GrooveShelf</span>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GrooveShelf. Feito por Leandro Rezende.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/login" className="hover:text-foreground">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
