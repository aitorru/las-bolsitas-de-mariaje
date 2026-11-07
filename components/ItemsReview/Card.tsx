import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "../Icons";
import { formatPrice } from "../../utils/price";
import { Badge, GlassCard } from "../punto";

interface Props {
  nombre: string;
  image: string;
  blur: string;
  precio?: string;
}

const Card = ({ nombre, image, blur, precio }: Props) => {
  return (
    <Link
      href={"/p/" + encodeURIComponent(nombre)}
      className="lb-card pt-focusable"
    >
      <GlassCard tone="solid" padding="sm" interactive className="lb-card__glass">
        <div className="lb-card__media">
          <Image
            alt={nombre}
            src={image}
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur}
            fill
            style={{ objectFit: "contain" }}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          />
        </div>
        <div className="lb-card__body">
          <h3 className="pt-display lb-card__title">{nombre}</h3>
          <div className="lb-card__foot">
            {precio ? <Badge>{formatPrice(precio)}</Badge> : <span />}
            <span className="lb-card__more">
              Ver <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
};

export default Card;
