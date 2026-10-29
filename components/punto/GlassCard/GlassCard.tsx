import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";
import "./GlassCard.css";

export type GlassTone = "clear" | "bloom" | "aurora" | "solid";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** `clear` frosted glass · `bloom`/`aurora` tinted glass · `solid` for dense UI. */
  tone?: GlassTone;
  padding?: "none" | "sm" | "md" | "lg";
  /** Rendered behind the content, clipped to the card (e.g. `<Petals />`). */
  backdrop?: ReactNode;
  /** Lifts slightly on hover; for cards that are links or buttons. */
  interactive?: boolean;
}

/** The frosted pane from the poster. Put it over a `DotField` to see it breathe. */
export function GlassCard({
  tone = "clear",
  padding = "md",
  backdrop,
  interactive = false,
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cx(
        "pt-glass",
        `pt-glass--${tone}`,
        `pt-glass--pad-${padding}`,
        interactive && "pt-glass--interactive",
        className,
      )}
      {...rest}
    >
      {backdrop && <div className="pt-glass__backdrop">{backdrop}</div>}
      <div className="pt-glass__body">{children}</div>
    </div>
  );
}
