import type { Metadata } from "next";
import FireClient from "./FireClient";

export const metadata: Metadata = {
  title: "Fire handle",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FirePage() {
  return <FireClient />;
}
