"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await signIn("email", { email, callbackUrl: "/dashboard" });
      setEmailSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#E94560]/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#E94560]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Branding */}
        <div className="mb-8 text-center">
          {/* Vinyl record decorative icon */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1A1A2E] to-[#0F0F0F] ring-2 ring-[#E94560]/30">
              {/* Outer grooves */}
              <div className="absolute h-16 w-16 rounded-full border border-white/5" />
              <div className="absolute h-12 w-12 rounded-full border border-white/5" />
              {/* Center label */}
              <div className="h-6 w-6 rounded-full bg-[#E94560]" />
              {/* Spindle hole */}
              <div className="absolute h-1.5 w-1.5 rounded-full bg-[#0F0F0F]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">GrooveShelf</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Sua colecao de vinil comeca antes da compra
          </p>
        </div>

        <Card className="border-0 bg-[#1A1A2E] ring-white/5">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-white">Entrar</CardTitle>
            <CardDescription className="text-zinc-400">
              Escolha como deseja acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Google OAuth */}
            <Button
              variant="outline"
              className="h-10 w-full gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() =>
                signIn("google", { callbackUrl: "/dashboard" })
              }
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar com Google
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-white/10" />
              <span className="text-xs text-zinc-500">ou</span>
              <Separator className="flex-1 bg-white/10" />
            </div>

            {/* Email Magic Link */}
            {emailSent ? (
              <div className="rounded-lg border border-[#E94560]/20 bg-[#E94560]/5 p-4 text-center">
                <p className="text-sm font-medium text-[#E94560]">
                  Link enviado!
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Verifique sua caixa de entrada para acessar sua conta.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus-visible:border-[#E94560] focus-visible:ring-[#E94560]/20"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 w-full bg-[#E94560] text-white hover:bg-[#E94560]/90"
                >
                  {loading ? "Enviando..." : "Entrar com magic link"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Ao continuar, voce concorda com nossos{" "}
          <a href="/terms" className="text-[#E94560] hover:underline">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="/privacy" className="text-[#E94560] hover:underline">
            Politica de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}
