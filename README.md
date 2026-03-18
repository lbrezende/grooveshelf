# GrooveShelf

Sua coleção de vinil começa antes da compra. Descubra, acompanhe e priorize os vinis que você realmente quer — com base no que você mais ouve.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** strict
- **Tailwind CSS 4** + shadcn/ui
- **Prisma 7** (PostgreSQL)
- **Auth.js v5** (Google OAuth + Email Magic Link)
- **Stripe** (Pagamentos + Subscriptions)
- **TanStack Query** (Data fetching)
- **Zod** (Validação)
- **Sonner** (Toast notifications)
- **Resend** (Emails transacionais)

## Setup

### 1. Clone e instale

```bash
git clone https://github.com/lbrezende/grooveshelf.git
cd grooveshelf
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env
```

Preencha as variáveis no `.env`:

| Variável | Onde conseguir |
|----------|---------------|
| `DATABASE_URL` | [Neon](https://neon.tech) — crie um projeto free |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com) — OAuth 2.0 |
| `AUTH_RESEND_KEY` | [Resend](https://resend.com) — API Key |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com) — test mode |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/stripe/webhook` |
| `STRIPE_PRICE_ID_PRO` | Crie um produto recorrente de R$14,90/mês no Stripe |
| `RESEND_API_KEY` | [Resend](https://resend.com) |

### 3. Configure o banco

```bash
npx prisma generate
npx prisma db push
```

### 4. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Features

- **Biblioteca de Gostos** — Cadastre artistas, álbuns e faixas. Links YouTube/Spotify.
- **Wishlist Inteligente** — Lista de desejos com prioridade automática.
- **Radar de Preços** — Monitore preços na Amazon com alertas.
- **Lista de Compras Mensal** — Sugestões baseadas no orçamento.
- **Diário de Escuta** — Registre sessões com rating e notas.

## Planos

| | Free | Pro (R$14,90/mês) |
|---|---|---|
| Wishlist | 20 álbuns | Ilimitado |
| Alertas de preço | 3 | Ilimitado |
| Lista mensal | Não | Sim |
| Trial | — | 14 dias grátis |

## Deploy (Vercel)

1. Conecte o repo no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente na Vercel
3. Deploy automático a cada push
