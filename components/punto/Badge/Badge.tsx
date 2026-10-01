import type { HTMLAttributes } from "react";
import { cx } from "../cx";
import "./Badge.css";

export type BadgeTone = "neutral" | "accent" | "positive" | "negative" | "glass";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Leading status dot. `pulse` makes it breathe (live / running). */
  dot?: boolean | "pulse";
}

export function Badge({ tone = "neutral", dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx("pt-badge", `pt-badge--${tone}`, className)} {...rest}>
      {dot && <span className={cx("pt-badge__dot", dot === "pulse" && "pt-badge__dot--pulse")} />}
      {children}
    </span>
  );
}
