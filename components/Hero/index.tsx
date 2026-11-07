import Image from "next/image";
import Logo from "../../public/logo.png";
import { ArrowDown } from "../Icons";
import { ButtonLink, DotField, GlassCard } from "../punto";

// The copy sits on plain paper; the dots live in their own window beside it, faded at the
// edges, so they decorate instead of competing with the text.
const Hero = () => {
  return (
    <section className="lb-intro">
      <div className="lb-intro__copy">
        <span className="pt-eyebrow">Hecho a mano · Artesanía en tela</span>
        <h1 className="pt-display lb-intro__title">
          Bolsas artesanales de tela con calidad y <em>buen gusto</em>
        </h1>
        <p className="pt-body lb-intro__body">
          Bolsitas de tela, mochilas, bolsos, bolsas de costado, bolsas para
          bebés personalizadas, bolsas de pan, fundas para robot de cocina,
          delantales, gorros de cocinero, fundas de gafas, soportes para móvil,
          diademas turbante, coleteros, buf y mucho más.
        </p>
        <div className="lb-actions">
          <ButtonLink
            href="#destacados"
            variant="aurora"
            size="lg"
            iconAfter={<ArrowDown />}
          >
            Ver la tienda
          </ButtonLink>
          <ButtonLink href="/contactar" variant="ghost" size="lg">
            Contactar
          </ButtonLink>
        </div>
      </div>
      <DotField
        palette="mariaje"
        surface="theme"
        gap={9}
        dotSize={0.5}
        intensity={0.7}
        seed={11}
        speed={0.5}
        className="lb-intro__window"
      >
        <GlassCard tone="clear" padding="md" className="lb-intro__logo">
          <Image
            alt="Logo de Las bolsitas de Mariaje"
            src={Logo}
            placeholder="blur"
            priority
            sizes="(min-width: 960px) 300px, 220px"
          />
        </GlassCard>
      </DotField>
    </section>
  );
};

export default Hero;
