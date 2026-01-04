import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import FirePlace from "../../components/Fireplace";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carta",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartaPage() {
  const carta = `Hola, Amatxu

Aunque ya tengamos a tus dos hijis independizados, seguimos sintiendo tu cariño y tu amor como si aún viviéramos contigo. Nos has dado todo lo que hemos deseado y mucho más, pero, sobre todo, un amor incondicional e infinito.

Tu amor nos guía y nos da esperanza en los días en los que más lo necesitamos. Siempre tenemos una madre con la que poder contar para todo: desde esos días en los que puedo estar más triste y necesito a alguien que me escuche, hasta los días en los que estoy eufórico y necesito compartirlo con alguien.

Esta página, junto con la vela que te he regalado, simbolizan tu luz. La luz que emanas. Esa luz que te hace especial.`;
  const parrafos = carta.split(/\n\s*\n/).map((parrafo) => parrafo.trim());

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_60%),radial-gradient(circle_at_70%_30%,_rgba(234,88,12,0.15),_transparent_55%),radial-gradient(circle_at_20%_80%,_rgba(120,113,108,0.2),_transparent_50%)]" />
      <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-10 px-6 py-16 md:py-24">
        <div className="relative h-40 w-40">
          <div className="absolute bottom-0 left-1/2 h-20 w-12 -translate-x-1/2 rounded-full bg-stone-200 shadow-[0_20px_50px_-20px_rgba(120,113,108,0.45)]" />
          <div className="absolute bottom-0 left-1/2 h-12 w-16 -translate-x-1/2 rounded-3xl bg-stone-100 shadow-inner shadow-amber-100/80" />
          <div className="absolute bottom-10 left-1/2 h-8 w-[2px] -translate-x-1/2 bg-stone-500/60" />
          <div className="relative h-full w-full">
            <FirePlace />
          </div>
        </div>

        <div className="text-center">
          <h1
            className={`${playfair.className} mt-4 text-4xl font-semibold text-stone-800 md:text-6xl`}
          >
            Para ama, nuestra luz
          </h1>
          <p
            className={`${manrope.className} mt-4 text-base text-stone-600 md:text-lg`}
          >
            Esta página guarda un mensaje pensado para ti. Eres la llama que nos
            guia y nos recuerda todo lo que haces por nosotros.
          </p>
        </div>
        <section className="w-full rounded-3xl border border-amber-100/80 bg-white/80 p-8 shadow-[0_30px_60px_-40px_rgba(120,113,108,0.7)] backdrop-blur md:p-10">
          {parrafos.map((parrafo, index) => (
            <p
              key={`${index}-${parrafo.slice(0, 12)}`}
              className={`${playfair.className} text-2xl leading-relaxed text-stone-700 md:text-3xl ${
                index > 0 ? "mt-6" : ""
              }`}
            >
              {parrafo}
            </p>
          ))}
          <p
            className={`${manrope.className} mt-6 text-sm uppercase tracking-[0.35em] text-stone-400`}
          >
            Con todo nuestro carino
          </p>
        </section>
      </main>
    </div>
  );
}
