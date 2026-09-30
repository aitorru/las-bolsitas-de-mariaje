import type { SVGProps } from "react";
import { cx } from "../cx";
import "./Sparkle.css";

export interface SparkleProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number;
  /** Slow scale + fade. Off by default: sparkles are punctuation, not decoration. */
  twinkle?: boolean;
  /** Accessible name. Without it the sparkle is decorative. */
  title?: string;
}

/**
 * The four-point star with concave sides: the shape left between four rounded tiles
 * (see `Petals`). Used as Punto's logo glyph, bullet and "AI / simulated" marker.
 */
export function Sparkle({ size = 24, twinkle = false, title, className, ...rest }: SparkleProps) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative unless `title` is given (then it renders one)
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={cx("pt-sparkle", twinkle && "pt-sparkle--twinkle", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d="M12 0C12 6.6 17.4 12 24 12C17.4 12 12 17.4 12 24C12 17.4 6.6 12 0 12C6.6 12 12 6.6 12 0Z" />
    </svg>
  );
}
