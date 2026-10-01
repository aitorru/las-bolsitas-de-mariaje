import Image from "next/image";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Chat, Mail } from "../../components/Icons";
import { ButtonLink, DotField, GlassCard } from "../../components/punto";
import { Category } from "../../utils/types/types";
import QR from "../../public/qr-code.png";

interface Props {
  categories: Category[];
}

export default function ContactView({ categories }: Props) {
  return (
    <>
      <Header categories={categories} />
      <DotField
        palette="mariaje"
        surface="theme"
        motion="breathe"
        gap={9}
        dotSize={0.5}
        intensity={0.55}
        seed={23}
        className="lb-hero lb-contact"
      >
        <div className="lb-contact__inner">
          <GlassCard tone="clear" padding="lg" className="lb-contact__card">
            <div className="lb-contact__copy">
              <span className="pt-eyebrow">Contacto</span>
              <h1 className="pt-display lb-contact__title">
                ¿Quieres contactar <em>conmigo?</em>
              </h1>
              <p className="pt-body">
                Pregúntame por cualquier bolsa o encargo por WhatsApp o por
                correo electrónico.
              </p>
              <div className="lb-contact__options">
                <div className="lb-contact__option">
                  <span className="pt-eyebrow">Por WhatsApp</span>
                  <ButtonLink
                    href={
                      "https://wa.me/34697820927/?text=" +
                      encodeURIComponent("Hola Mariaje,")
                    }
                    target="_blank"
                    rel="noreferrer"
                    variant="aurora"
                    size="lg"
                    icon={<Chat />}
                  >
                    697 820 927
                  </ButtonLink>
                </div>
                <div className="lb-contact__option">
                  <span className="pt-eyebrow">Por correo electrónico</span>
                  <ButtonLink
                    href={
                      "mailto:lasbolsitasdemariaje@gmail.com?subject=Contacto&body=" +
                      encodeURIComponent("Hola Mariaje,")
                    }
                    variant="ghost"
                    size="lg"
                    icon={<Mail />}
                    className="lb-contact__mail"
                  >
                    lasbolsitasdemariaje@gmail.com
                  </ButtonLink>
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard tone="clear" padding="md" className="lb-contact__qr">
            <Image
              alt="Código QR para contactar"
              src={QR}
              sizes="240px"
              className="lb-contact__qr-img"
            />
            <span className="pt-eyebrow">Escanea el código</span>
          </GlassCard>
        </div>
      </DotField>
      <Footer />
    </>
  );
}
