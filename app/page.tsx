"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Shield,
  Brain,
  Cpu,
  Lock,
  Eye,
  GitBranch,
  Database,
  Zap,
  Network,
  Bot,
  Fingerprint,
  FileSearch,
  KeyRound,
  ClipboardList,
  Users,
  Layers,
  Terminal,
  Radar,
  Cog,
  Workflow,
  AudioLines,
  ChevronDown,
} from "lucide-react";

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const engines = [
  {
    icon: GitBranch,
    name: "Routing Engine",
    desc: "Roteamento semantico que direciona demandas para os agentes, squads ou engines mais adequados.",
    color: "text-primary",
  },
  {
    icon: Database,
    name: "Memory Engine",
    desc: "Persistencia contextual que mantem historico, aprendizado e continuidade entre interacoes.",
    color: "text-accent",
  },
  {
    icon: Layers,
    name: "Skill Index",
    desc: "Repositorio estruturado de habilidades reutilizaveis para modularidade e consistencia.",
    color: "text-primary",
  },
  {
    icon: Bot,
    name: "Incubation System",
    desc: "Ambiente isolado de experimentacao para validacao de agentes antes da producao.",
    color: "text-accent",
  },
  {
    icon: Radar,
    name: "Agents Sandbox",
    desc: "Zona de quarentena onde agentes sao analisados, testados e classificados.",
    color: "text-primary",
  },
  {
    icon: Shield,
    name: "Cybersecurity Engine",
    desc: "Analise de risco, deteccao de vulnerabilidades e protecao contra ameacas estruturais.",
    color: "text-accent",
  },
  {
    icon: FileSearch,
    name: "Repository Inspector",
    desc: "Inspecao profunda de repositorios avaliando integridade, dependencias e vetores de ataque.",
    color: "text-primary",
  },
  {
    icon: Eye,
    name: "Agent Inspector",
    desc: "Auditoria comportamental de agentes identificando padroes suspeitos e riscos.",
    color: "text-accent",
  },
  {
    icon: KeyRound,
    name: "Secret Vault Engine",
    desc: "Gestao centralizada de credenciais que elimina exposicao de dados sensiveis.",
    color: "text-primary",
  },
  {
    icon: ClipboardList,
    name: "Secret Audit Log",
    desc: "Registro imutavel de acesso a credenciais garantindo rastreabilidade e accountability.",
    color: "text-accent",
  },
];

const capabilities = [
  { icon: Brain, label: "Agentes IA", value: "100+" },
  { icon: Shield, label: "Cyberseguranca", value: "24/7" },
  { icon: Users, label: "Multi-cliente", value: "Isolado" },
  { icon: Lock, label: "Protecao API", value: "Total" },
  { icon: Workflow, label: "Processos", value: "40+" },
  { icon: AudioLines, label: "Voz (Audio)", value: "Ativo" },
];

const securityFeatures = [
  {
    title: "Isolamento de Dados",
    desc: "Cada cliente opera em um espaco completamente isolado. Zero conflito de informacoes entre projetos.",
    icon: Fingerprint,
  },
  {
    title: "Protecao Anti-Vazamento",
    desc: "Agentes nao conversam com APIs externas sozinhos. Dados protegidos mesmo com conexoes ativas.",
    icon: Lock,
  },
  {
    title: "Governanca Hierarquica",
    desc: "Processos rigorosos com cadeia de comando definida. Jeffrey comanda, squads executam.",
    icon: Users,
  },
  {
    title: "Auditoria Continua",
    desc: "Cada acao, cada acesso, cada decisao e registrada. Rastreabilidade total e imutavel.",
    icon: ClipboardList,
  },
];

/* ──────────────────────────────────────────────
   COMPONENTS
   ────────────────────────────────────────────── */

function GlitchText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="glitch-text">{children}</span>
    </span>
  );
}

function TypewriterText({ text, className = "" }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayed}
      {!done && <span className="cursor-blink text-primary">|</span>}
    </span>
  );
}

function StatusBadge({ status, label }: { status: "online" | "secure"; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-mono uppercase tracking-wider">
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            status === "online" ? "bg-green-400" : "bg-primary"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            status === "online" ? "bg-green-400" : "bg-primary"
          }`}
        />
      </span>
      {label}
    </div>
  );
}

function SectionHeading({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <span className="inline-block text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4 border border-primary/30 px-3 py-1 rounded-full">
        {tag}
      </span>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{subtitle}</p>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────── */

export default function AIBOSSLanding() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              AI<span className="text-primary">BOSS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#system" className="text-muted-foreground hover:text-foreground transition-colors">
              Sistema
            </a>
            <a href="#engines" className="text-muted-foreground hover:text-foreground transition-colors">
              Engines
            </a>
            <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
              Seguranca
            </a>
            <a href="#architecture" className="text-muted-foreground hover:text-foreground transition-colors">
              Arquitetura
            </a>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status="online" label="Jeffrey Online" />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex items-center justify-center px-6 pt-20 grid-pattern scanlines overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <StatusBadge status="secure" label="Sistema Protegido" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-6xl md:text-8xl font-bold leading-none tracking-tighter"
          >
            <GlitchText className="text-primary">AIBOSS</GlitchText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            O sistema operacional empresarial de IA.{" "}
            <span className="text-foreground font-semibold">
              Comandado por Jeffrey.
            </span>{" "}
            100+ agentes. Cyberseguranca. Governanca.
            <br />
            <span className="text-accent">Semi-automatico. Protegido. Inteligente.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 font-mono text-sm text-muted-foreground"
          >
            <TypewriterText text="> jeffrey.boot() — initializing 100+ agents across squads..." />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {capabilities.map((cap) => (
              <div
                key={cap.label}
                className="group relative rounded-lg border border-border bg-card/50 p-4 hover:border-primary/50 transition-all duration-300"
              >
                <cap.icon className="w-5 h-5 text-primary mb-2" />
                <div className="text-2xl font-bold font-mono text-foreground">
                  {cap.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{cap.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16"
          >
            <a href="#system" className="inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <span className="text-xs font-mono uppercase tracking-wider">Explorar</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* SYSTEM OVERVIEW */}
      <section id="system" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="// Sistema"
            title="Mais que agentes de IA"
            subtitle="AIBOSS e um sistema operacional empresarial completo com cyberseguranca, governanca, hierarquia e processos definidos."
          />

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-primary/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  jeffrey@aiboss ~ /core
                </span>
              </div>
              <div className="p-6 font-mono text-sm space-y-2 text-muted-foreground">
                <p><span className="text-primary">$</span> jeffrey.status()</p>
                <p className="text-green-400">[OK] Commander online</p>
                <p className="text-green-400">[OK] 100+ agents deployed across 12 squads</p>
                <p className="text-green-400">[OK] Cybersecurity engine active</p>
                <p className="text-green-400">[OK] Memory engine synced</p>
                <p className="text-green-400">[OK] Secret vault sealed</p>
                <p className="text-accent">[OK] Multi-client isolation verified</p>
                <p className="text-primary">[OK] API leak protection enabled</p>
                <p className="mt-4"><span className="text-primary">$</span> jeffrey.ready()</p>
                <p className="text-foreground">
                  Sistema operacional pronto. Aguardando comandos.
                  <span className="cursor-blink text-primary">|</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {[
                {
                  title: "Comandante Jeffrey",
                  desc: "Um nucleo de inteligencia que coordena todos os agentes. Ele fala, decide, roteia e protege.",
                  icon: Brain,
                },
                {
                  title: "Multi-cliente Isolado",
                  desc: "Opera com varios clientes simultaneamente sem conflitar informacoes. Cada projeto e um universo.",
                  icon: Network,
                },
                {
                  title: "40+ Protocolos",
                  desc: "Processos rigorosos que garantem que cada acao e auditavel, segura e inteligente.",
                  icon: Cog,
                },
                {
                  title: "Fala em Audio",
                  desc: "Jeffrey se comunica por voz. Relatorios, alertas e briefings — tudo audivel.",
                  icon: AudioLines,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group flex gap-4 p-4 rounded-lg border border-border bg-card/30 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ENGINES & PROTOCOLS */}
      <section id="engines" className="py-32 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="// Engines & Protocolos"
            title="10 dos 40+ protocolos"
            subtitle="Cada engine foi projetada para operar de forma autonoma, segura e integrada ao ecossistema AIBOSS."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {engines.map((engine, i) => (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500" />
                <div className="relative z-10">
                  <engine.icon className={`w-6 h-6 ${engine.color} mb-3`} />
                  <h3 className="font-semibold text-foreground text-sm mb-1 font-mono">
                    {engine.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {engine.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <span className="text-sm font-mono text-muted-foreground">
              + 30 protocolos adicionais no sistema completo
            </span>
          </motion.div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="// Seguranca"
            title="Blindado por design"
            subtitle="Protecao contra vazamento de dados via API. Agentes nao conversam com APIs externas sozinhos."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group gradient-border rounded-xl p-6 bg-card hover:bg-card/80 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs font-mono text-green-400">
                SECURITY AUDIT — ALL CLEAR
              </span>
            </div>
            <div className="p-6 font-mono text-xs space-y-1 text-muted-foreground">
              <p><span className="text-green-400">[PASS]</span> API leak protection .............. <span className="text-green-400">ACTIVE</span></p>
              <p><span className="text-green-400">[PASS]</span> Client data isolation ............ <span className="text-green-400">VERIFIED</span></p>
              <p><span className="text-green-400">[PASS]</span> Agent sandbox quarantine ......... <span className="text-green-400">ENFORCED</span></p>
              <p><span className="text-green-400">[PASS]</span> Secret vault encryption .......... <span className="text-green-400">AES-256</span></p>
              <p><span className="text-green-400">[PASS]</span> Audit log integrity ............. <span className="text-green-400">IMMUTABLE</span></p>
              <p><span className="text-green-400">[PASS]</span> External API restrictions ........ <span className="text-green-400">BLOCKED</span></p>
              <p><span className="text-green-400">[PASS]</span> Repository threat scan .......... <span className="text-green-400">0 THREATS</span></p>
              <p className="mt-3 text-accent">
                All 40+ protocols operational. System integrity: 100%
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="py-32 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tag="// Arquitetura"
            title="7 dias de infraestrutura"
            subtitle="Antes de criar, foquei em estruturar. Infraestrutura segura e inteligente primeiro. Criacao depois."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                phase: "Fase 1",
                title: "Fundacao",
                items: ["Cybersecurity Engine", "Secret Vault", "Audit Logging", "API Protection"],
                color: "border-primary/50",
                icon: Shield,
              },
              {
                phase: "Fase 2",
                title: "Inteligencia",
                items: ["Routing Engine", "Memory Engine", "Skill Index", "40+ Protocolos"],
                color: "border-accent/50",
                icon: Brain,
              },
              {
                phase: "Fase 3",
                title: "Operacao",
                items: ["100+ Agentes", "Multi-squad", "Multi-cliente", "Voz (Audio)"],
                color: "border-green-500/50",
                icon: Zap,
              },
            ].map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className={`rounded-xl border ${phase.color} bg-card p-6`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <phase.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {phase.phase}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Terminal className="w-3 h-3 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-primary font-mono text-sm mb-6">
              <Cpu className="w-4 h-4" />
              <span>SISTEMA OPERACIONAL DE IA</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Pronto para o{" "}
              <span className="text-primary neon-glow">campo de criacao</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              7 dias construindo a infraestrutura. Agora, com a base blindada,
              AIBOSS entra em modo de producao.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#system"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <Zap className="w-5 h-5" />
                Explorar o Sistema
              </a>
              <a
                href="#engines"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-border text-foreground font-semibold hover:border-primary/50 hover:bg-card transition-all"
              >
                <Terminal className="w-5 h-5" />
                Ver Protocolos
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">
              AI<span className="text-primary">BOSS</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} AIBOSS. Comandado por Jeffrey.
          </p>
          <div className="flex items-center gap-4">
            <StatusBadge status="online" label="Operacional" />
          </div>
        </div>
      </footer>
    </div>
  );
}
