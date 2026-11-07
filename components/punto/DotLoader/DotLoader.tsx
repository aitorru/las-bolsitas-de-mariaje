import type { CSSProperties } from "react";
import { cx } from "../cx";
import "./DotLoader.css";

export type DotLoaderVariant = "wave" | "pulse" | "orbit";

export interface DotLoaderProps {
  /** `wave` diagonal sweep · `pulse` whole grid breathes · `orbit` a dot circles the edge. */
  variant?: DotLoaderVariant;
  size?: "sm" | "md" | "lg";
  /** `accent` uses the aurora gradient; `current` follows the text colour. */
  tone?: "current" | "accent";
  /** Accessible status text. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Wave order: dots on the same anti-diagonal light up together. */
const WAVE = [0, 1, 2, 1, 2, 3, 2, 3, 4];
/** Orbit order: clockwise around the rim, centre stays dim. */
const ORBIT = [0, 1, 2, 7, -1, 3, 6, 5, 4];

/** A 3×3 dot grid. The loading state of every Punto component. */
export function DotLoader({
  variant = "wave",
  size = "md",
  tone = "current",
  label = "Cargando",
  className,
  style,
}: DotLoaderProps) {
  const order = variant === "orbit" ? ORBIT : WAVE;
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(
        "pt-dotloader",
        `pt-dotloader--${variant}`,
        `pt-dotloader--${size}`,
        `pt-dotloader--${tone}`,
        className,
      )}
      style={style}
    >
      {order.map((step, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed 3×3 grid
          key={i}
          className={cx("pt-dotloader__dot", step < 0 && "pt-dotloader__dot--idle")}
          style={{ "--i": step, "--p": i / 8 } as CSSProperties}
        />
      ))}
    </span>
  );
}
