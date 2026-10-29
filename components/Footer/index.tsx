import { Chat, Facebook, Heart, Mail } from "../Icons";
import { ButtonLink, DotField, Petals } from "../punto";

const Footer = () => {
  return (
    <footer data-pt-theme="dark" className="lb-footer">
      <DotField
        palette="night"
        motion="breathe"
        gap={9}
        dotSize={0.5}
        seed={5}
        className="lb-footer__field"
      >
        <div className="lb-footer__inner">
          <div className="lb-footer__brand">
            <span className="lb-brand__mark lb-footer__mark">
              <Petals tone="mariaje" />
            </span>
            <p className="pt-display lb-footer__title">
              Las bolsitas <em>de Mariaje</em>
            </p>
            <p className="pt-body">
              Bolsas artesanales de tela con calidad y buen gusto.
            </p>
          </div>
          <div className="lb-footer__links">
            <ButtonLink
              href="https://wa.me/34697820927/?text=Hola!"
              target="_blank"
              rel="noreferrer"
              variant="glass"
              size="sm"
              icon={<Chat />}
            >
              WhatsApp
            </ButtonLink>
            <ButtonLink
              href="mailto:lasbolsitasdemariaje@gmail.com"
              variant="glass"
              size="sm"
              icon={<Mail />}
            >
              Correo
            </ButtonLink>
            <ButtonLink
              href="https://www.facebook.com/LasBolsitasDeMariaje/"
              target="_blank"
              rel="noreferrer"
              variant="glass"
              size="sm"
              icon={<Facebook />}
            >
              Facebook
            </ButtonLink>
          </div>
          <p className="lb-footer__credit">
            Hecho con <Heart size={12} aria-label="cariño" /> por{" "}
            <a href="https://github.com/aitorru">Aitor Ruiz</a>
          </p>
        </div>
      </DotField>
    </footer>
  );
};

export default Footer;
