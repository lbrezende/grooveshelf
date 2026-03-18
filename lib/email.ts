import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceAlertEmail(
  to: string,
  albumTitle: string,
  currentPrice: number,
  targetPrice: number,
  amazonUrl: string
) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "GrooveShelf <noreply@grooveshelf.com>",
    to,
    subject: `🔴 Alerta de preço: ${albumTitle} está R$${currentPrice.toFixed(2)}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E94560;">Alerta de Preço — GrooveShelf</h2>
        <p><strong>${albumTitle}</strong> atingiu o preço de <strong>R$${currentPrice.toFixed(2)}</strong>.</p>
        <p>Seu preço-alvo era R$${targetPrice.toFixed(2)}.</p>
        <a href="${amazonUrl}" style="display: inline-block; padding: 12px 24px; background: #E94560; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Ver na Amazon
        </a>
      </div>
    `,
  });
}
