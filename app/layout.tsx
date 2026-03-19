import type { Metadata } from "next";
import { Nunito_Sans, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrooveShelf — Sua coleção de vinil começa antes da compra",
  description:
    "Descubra, acompanhe e priorize os vinis que você realmente quer — com base no que você mais ouve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunitoSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
