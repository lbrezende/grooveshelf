'use client';
import React from 'react';
import { PlusIcon, ShieldCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './border-trail';
import Link from 'next/link';

export function PricingCard() {
  return (
    <div className="relative">
      <div
        className={cn(
          'z--10 pointer-events-none absolute inset-0 size-full',
          'bg-[linear-gradient(to_right,--theme(--color-foreground/.2)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.2)_1px,transparent_1px)]',
          'bg-[size:32px_32px]',
          '[mask-image:radial-gradient(ellipse_at_center,var(--background)_10%,transparent)]',
        )}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="mx-auto w-full max-w-2xl space-y-2"
      >
        <div className="grid md:grid-cols-2 bg-background relative border p-4">
          <PlusIcon className="absolute -top-3 -left-3 size-5.5" />
          <PlusIcon className="absolute -top-3 -right-3 size-5.5" />
          <PlusIcon className="absolute -bottom-3 -left-3 size-5.5" />
          <PlusIcon className="absolute -right-3 -bottom-3 size-5.5" />
          <div className="w-full px-4 pt-5 pb-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold">Free</h3>
              </div>
              <p className="text-muted-foreground text-sm">Comece sem pagar nada.</p>
            </div>
            <div className="mt-10 space-y-4">
              <div className="text-muted-foreground flex items-end gap-0.5 text-xl">
                <span>R$</span>
                <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                  0
                </span>
                <span>/mês</span>
              </div>
              <Link href="/login">
                <Button className="w-full" variant="outline">Começar grátis</Button>
              </Link>
            </div>
          </div>
          <div className="relative w-full rounded-lg border px-4 pt-5 pb-4">
            <BorderTrail
              style={{
                boxShadow:
                  '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
              }}
              size={100}
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold">Pro</h3>
                <div className="flex items-center gap-x-1">
                  <span className="text-muted-foreground text-sm line-through">R$19,90</span>
                  <Badge>25% off</Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">Desbloqueie tudo, sem limites.</p>
            </div>
            <div className="mt-10 space-y-4">
              <div className="text-muted-foreground flex items-end text-xl">
                <span>R$</span>
                <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                  14,90
                </span>
                <span>/mês</span>
              </div>
              <Link href="/login">
                <Button className="w-full">Trial grátis de 14 dias</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="text-muted-foreground flex items-center justify-center gap-x-2 text-sm">
          <ShieldCheckIcon className="size-4" />
          <span>Acesso a todos os recursos sem taxas ocultas</span>
        </div>
      </motion.div>
    </div>
  );
}
