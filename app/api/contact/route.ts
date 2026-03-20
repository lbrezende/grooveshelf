import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nome, email e mensagem são obrigatórios." },
        { status: 400 }
      );
    }

    const resendKey = process.env.AUTH_RESEND_KEY;
    if (!resendKey) {
      console.warn("AUTH_RESEND_KEY not set — contact form disabled");
      return NextResponse.json(
        { error: "Serviço de email não configurado." },
        { status: 503 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const payload = {
      from: fromEmail,
      to: process.env.CONTACT_EMAIL || "lbrezende@gmail.com",
      subject: `[GrooveShelf] Contato de ${name}`,
      reply_to: email,
      html: `
        <h2>Novo contato via GrooveShelf</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    };

    console.log("Sending email with from:", fromEmail);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify(payload),
    });

    const responseBody = await res.text();

    if (!res.ok) {
      console.error("Resend error:", res.status, responseBody);
      return NextResponse.json(
        { error: `Falha ao enviar email: ${responseBody}` },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", responseBody);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
