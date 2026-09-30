"use client";

import { useState } from "react";
import FirePlace from "../../components/Fireplace";
import { DotField, GlassCard, Segmented } from "../../components/punto";

export default function CartaClient() {
  const cartas = {
    Aitor: `Hola, Amatxu:

Aunque ya tengas a tus dos hijis independizados, sigo sintiendo tu cariño y tu amor como si aún viviéramos juntos. Me has dado todo lo que he deseado y mucho más, pero, sobre todo, un amor incondicional e infinito.

Tu amor me guía y me da esperanza en los días en los que más lo necesito. Siempre tengo una madre con la que puedo contar para todo: desde esos días en los que estoy más triste y necesito a alguien que me escuche, hasta los días en los que estoy eufórico y necesito compartirlo contigo.

Esta página, junto con la vela que te he regalado, simbolizan tu luz. La luz que emanas, esa luz que te hace especial. Todo lo que soy hoy tiene mucho de ti, de tu manera de querer, de cuidar y de estar siempre presente.`,
    Adrian: `Ama, muchas gracias por todo lo que nos ayudas cada día con Beni, con comida o trayendo y llevando tantas cosas.

Gracias por seguir siempre de buen humor incluso cuando te fallamos o cuando Iñigo te hace rabiar escondiendote a Benito.

Que nunca nos falte tu sonrisa :)`,
  };
  const [autor, setAutor] = useState<keyof typeof cartas>("Aitor");
  const parrafos = cartas[autor]
    .split(/\n\s*\n/)
    .flatMap((parrafo) => parrafo.split(/;;;/))
    .map((parrafo) => parrafo.trim())
    .filter(Boolean);

  return (
    <DotField
      palette="ember"
      motion="breathe"
      pixel={2}
      gap={9}
      seed={4}
      intensity={0.7}
      className="lb-fullscreen"
    >
      <main className="lb-carta">
        <div className="lb-candle lb-candle--lg" aria-hidden="true">
          <span className="lb-candle__plate" />
          <span className="lb-candle__wax" />
          <FirePlace />
        </div>
        <div className="lb-carta__head">
          <span className="pt-eyebrow">Una carta</span>
          <h1 className="pt-display lb-carta__title">
            Para ama, <em>nuestra luz</em>
          </h1>
          <p className="pt-body">
            Esta página guarda un mensaje pensado para ti. Eres la llama que nos
            guía y nos recuerda todo lo que haces por nosotros.
          </p>
        </div>
        <GlassCard tone="clear" padding="lg" className="lb-carta__card">
          <div className="lb-carta__bar">
            <span className="pt-eyebrow">Selecciona la carta</span>
            <Segmented
              options={[
                { value: "Aitor", label: "Aitor" },
                { value: "Adrian", label: "Adrian" },
              ]}
              value={autor}
              onChange={setAutor}
              label="Autor de la carta"
              size="sm"
            />
          </div>
          <div className="lb-carta__text">
            {parrafos.map((parrafo, index) => (
              <p key={`${index}-${parrafo.slice(0, 12)}`} className="pt-display">
                {parrafo}
              </p>
            ))}
          </div>
          <p className="pt-eyebrow lb-carta__sign">Con todo nuestro cariño</p>
        </GlassCard>
      </main>
    </DotField>
  );
}
