import "../components/punto";
import "../styles/index.css";
import "../styles/site.css";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Las bolsitas de Mariaje",
    template: "%s | Las bolsitas de Mariaje",
  },
  description:
    "Bolsas artesanales de tela con calidad y buen gusto: bolsitas de tela, mochilas, bolsos, bolsas de costado, bolsas para bebes personalizadas, bolsas de pan, fundas para robot de cocina, delantales, gorro de cocinero, gorro higienico, fundas de gafas, soportes para movil, complementos, diadema turbante, coleteros, buf y mucho mas.",
  keywords: [
    "Bolsas",
    "Tela",
    "Mochilas",
    "Bolsos",
    "Bolsas de costado",
    "Gorros",
    "Diademas",
    "Coleteros",
  ],
  authors: [{ name: "Aitor Ruiz Garcia" }],
  openGraph: {
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#eeecf5",
};

// Punto's two voices: a quiet serif to say, a tight sans to do.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
});

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body data-pt-theme="light" className="pt-dot-paper">
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
