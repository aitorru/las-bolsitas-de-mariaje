"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink, Petals } from "../punto";

type Categories = {
  nombre: string;
};
interface Props {
  categories: Categories[];
}

const Header = ({ categories }: Props) => {
  const pathname = usePathname();
  // Category paths are URL-encoded; compare against the decoded name.
  const current = pathname?.startsWith("/c/")
    ? safeDecode(pathname.slice(3))
    : null;

  return (
    <header className="lb-nav">
      <div className="lb-nav__bar">
        <Link href="/" className="lb-brand pt-focusable" aria-label="Inicio">
          <span className="lb-brand__mark">
            <Petals tone="mariaje" />
          </span>
          <span className="lb-brand__name">
            Las bolsitas <em>de Mariaje</em>
          </span>
        </Link>
        <ButtonLink
          href="/contactar"
          size="sm"
          aria-current={pathname === "/contactar" ? "page" : undefined}
        >
          Contactar
        </ButtonLink>
      </div>
      {categories.length > 0 && (
        <nav aria-label="Categorías" className="lb-cats">
          <ul className="lb-cats__list">
            {categories.map((category) => (
              <li key={category.nombre}>
                <Link
                  href={"/c/" + encodeURIComponent(category.nombre)}
                  className="lb-chip pt-focusable"
                  aria-current={current === category.nombre ? "page" : undefined}
                >
                  {category.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default Header;
