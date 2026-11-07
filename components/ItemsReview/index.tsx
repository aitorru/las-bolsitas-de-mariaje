import { Item } from "../../utils/types/types";
import { ButtonLink, Sparkle } from "../punto";
import Card from "./Card";

interface Props {
  title: string;
  eyebrow?: string;
  items: Item[];
}

const ItemsReview = ({ items, title, eyebrow }: Props) => {
  return (
    <section className="lb-section">
      <div className="lb-section__head">
        <div>
          {eyebrow && <span className="pt-eyebrow">{eyebrow}</span>}
          <h2 className="pt-display lb-section__title">{title}</h2>
        </div>
        {items.length > 0 && (
          <span className="lb-section__meta">
            {items.length} {items.length === 1 ? "artículo" : "artículos"}
          </span>
        )}
      </div>
      {items.length > 0 ? (
        <div className="lb-grid">
          {items.map((item) => (
            <Card
              key={item.id}
              nombre={item.nombre}
              image={item.imageUrl}
              blur={item.blur}
              precio={item.precio}
            />
          ))}
        </div>
      ) : (
        <div className="lb-empty">
          <Sparkle size={28} className="lb-empty__mark" />
          <p className="pt-body">Todavía no hay artículos aquí.</p>
          <ButtonLink href="/" variant="ghost" size="sm">
            Volver al inicio
          </ButtonLink>
        </div>
      )}
    </section>
  );
};

export default ItemsReview;
