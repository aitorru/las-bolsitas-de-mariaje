import type { Metadata } from "next";
import CartaClient from "./CartaClient";

export const metadata: Metadata = {
  title: "Carta",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartaPage() {
  return <CartaClient />;
}
