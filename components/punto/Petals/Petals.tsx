import type { CSSProperties } from "react";
import { cx } from "../cx";
import "./Petals.css";

export type PetalsTone = "bloom" | "aurora" | "mist" | "ink" | "mariaje";

export interface PetalsProps {
  tone?: PetalsTone;
  /** Space between tiles, as a fraction of the shorter side. The star grows with it. */
  gap?: number;
  /** Corner radius as a fraction of the shorter side (0.25 ≈ circles on a square). */
  roundness?: number;
  /** Slow shimmer of the light between the tiles. */
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Punto's mark: four soft tiles whose rounded corners leave a glowing sparkle between
 * them. Works at any aspect ratio (corners stay round); keep it square for the logo.
 */
export function Petals({
  tone = "bloom",
  gap = 0.006,
  roundness = 0.22,
  animated = false,
  className,
  style,
}: PetalsProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "pt-petals",
        `pt-petals--${tone}`,
        animated && "pt-petals--animated",
        className,
      )}
      style={{ ...style, "--gap": gap, "--round": roundness } as CSSProperties}
    >
      <div className="pt-petals__grid">
        <span className="pt-petals__tile" />
        <span className="pt-petals__tile" />
        <span className="pt-petals__tile" />
        <span className="pt-petals__tile" />
      </div>
    </div>
  );
}
