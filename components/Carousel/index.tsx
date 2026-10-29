"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "../../utils/types/types";
import { ChevronLeft, ChevronRight } from "../Icons";
import { Button } from "../punto";

interface Props {
  carousel: Carousel[];
}

/** Scroll-snap strip of promotions with a row of dots that follows the slide in view. */
const CarouselElement = ({ carousel }: Props) => {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = track.current;
    if (!root) return;
    // The slide whose left edge is closest to the track's start is the current one; at the end
    // of the strip the last slides can't reach the start, so the last one wins there.
    const update = () => {
      const slides = root.querySelectorAll<HTMLElement>("[data-index]");
      if (slides.length === 0) return;
      if (root.scrollLeft >= root.scrollWidth - root.clientWidth - 2) {
        setActive(slides.length - 1);
        return;
      }
      const start = root.scrollLeft + parseFloat(getComputedStyle(root).paddingLeft);
      let best = 0;
      slides.forEach((slide, index) => {
        if (
          Math.abs(slide.offsetLeft - start) <
          Math.abs(slides[best].offsetLeft - start)
        ) {
          best = index;
        }
      });
      setActive(best);
    };
    update();
    root.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      root.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [carousel.length]);

  const goTo = (index: number) => {
    const root = track.current;
    const slide = root?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!root || !slide) return;
    root.scrollTo({
      left: slide.offsetLeft - parseFloat(getComputedStyle(root).paddingLeft),
      behavior: "smooth",
    });
  };

  if (carousel.length === 0) return null;

  return (
    <div className="lb-carousel">
      <div
        ref={track}
        className="lb-carousel__track"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Promociones"
        tabIndex={0}
      >
        {carousel.map((item, index) => (
          <div
            key={item.id}
            data-index={index}
            className="lb-carousel__slide"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${carousel.length}`}
          >
            <Image
              fill
              style={{ objectFit: "contain" }}
              sizes="(min-width: 768px) 60vw, 88vw"
              alt="Promoción"
              placeholder={item.blur ? "blur" : "empty"}
              blurDataURL={item.blur}
              src={item.imageUrl ?? ""}
            />
          </div>
        ))}
      </div>
      {carousel.length > 1 && (
        <div className="lb-carousel__controls">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Anterior"
            icon={<ChevronLeft />}
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
          />
          <div className="lb-carousel__dots">
            {carousel.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="lb-carousel__dot pt-focusable"
                aria-label={`Ir a la promoción ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Siguiente"
            icon={<ChevronRight />}
            disabled={active === carousel.length - 1}
            onClick={() => goTo(active + 1)}
          />
        </div>
      )}
    </div>
  );
};

export default CarouselElement;
