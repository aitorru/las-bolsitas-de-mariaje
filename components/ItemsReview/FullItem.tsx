import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../../utils/price";
import { Item } from "../../utils/types/types";
import { Chat, ChevronRight, Mail } from "../Icons";
import { ButtonLink, GlassCard } from "../punto";

interface Props {
  item: Item;
}

const FullItem = ({ item }: Props) => {
  const saludo = `Hola! Estoy interesado/a en ${item.nombre}.`;
  return (
    <main className="lb-product">
      <nav aria-label="Ruta" className="lb-crumbs">
        <Link href="/">Inicio</Link>
        {item.categoria && (
          <>
            <ChevronRight size={12} />
            <Link href={"/c/" + encodeURIComponent(item.categoria)}>
              {item.categoria}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span aria-current="page">{item.nombre}</span>
      </nav>
      <div className="lb-product__grid">
        <GlassCard tone="solid" padding="none" className="lb-product__media">
          <Image
            priority
            alt={item.nombre}
            src={item.imageUrl}
            placeholder={item.blur ? "blur" : "empty"}
            blurDataURL={item.blur}
            fill
            style={{ objectFit: "contain" }}
            sizes="(min-width: 900px) 50vw, 92vw"
          />
        </GlassCard>
        <div className="lb-product__info">
          {item.categoria && (
            <span className="pt-eyebrow">{item.categoria}</span>
          )}
          <h1 className="pt-display lb-product__title">{item.nombre}</h1>
          {item.descripcion && (
            <p className="pt-body lb-product__desc">{item.descripcion}</p>
          )}
          <div className="lb-product__price">
            <span className="pt-eyebrow">Precio</span>
            <p className="pt-display">{formatPrice(item.precio)}</p>
          </div>
          <div className="lb-actions">
            <ButtonLink
              href={"https://wa.me/34697820927/?text=" + encodeURIComponent(saludo)}
              target="_blank"
              rel="noreferrer"
              variant="aurora"
              size="lg"
              icon={<Chat />}
            >
              Pedir por WhatsApp
            </ButtonLink>
            <ButtonLink
              href={
                "mailto:lasbolsitasdemariaje@gmail.com?subject=" +
                encodeURIComponent(item.nombre) +
                "&body=" +
                encodeURIComponent(saludo)
              }
              variant="ghost"
              size="lg"
              icon={<Mail />}
            >
              Por correo
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FullItem;
