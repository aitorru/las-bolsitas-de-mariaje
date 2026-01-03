import "../styles/index.css";
import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
