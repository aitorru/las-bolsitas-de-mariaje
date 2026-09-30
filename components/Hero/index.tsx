import Image from "next/image";
import Logo from "../../public/logo.png";
import { ArrowDown } from "../Icons";
import { ButtonLink, DotField, GlassCard } from "../punto";

const Hero = () => {
  return (
    <DotField
      palette="mariaje"
      surface="theme"
      pixel={2}
      gap={8}
      seed={11}
      speed={0.8}
      className="lb-hero"
    >
      <div className="lb-hero__inner">
        <GlassCard tone="clear" padding="lg" className="lb-hero__card">
          <div className="lb-hero__copy">
            <span className="pt-eyebrow">Hecho a mano · Artesanía en tela</span>
            <h1 className="pt-display lb-hero__title">
              Bolsas artesanales de tela con calidad y <em>buen gusto</em>
            </h1>
            <p className="pt-body lb-hero__body">
              Bolsitas de tela, mochilas, bolsos, bolsas de costado, bolsas para
              bebés personalizadas, bolsas de pan, fundas para robot de cocina,
              delantales, gorros de cocinero, fundas de gafas, soportes para
              móvil, diademas turbante, coleteros, buf y mucho más.
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
        </GlassCard>
        <GlassCard tone="clear" padding="md" className="lb-hero__logo">
          <Image
            alt="Logo de Las bolsitas de Mariaje"
            src={Logo}
            placeholder="blur"
            priority
            sizes="(min-width: 1024px) 26vw, 0px"
          />
        </GlassCard>
      </div>
    </DotField>
  );
};

export default Hero;
