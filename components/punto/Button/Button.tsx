import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";
import { DotLoader } from "../DotLoader/DotLoader";
import "./Button.css";

export type ButtonVariant = "primary" | "aurora" | "glass" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` ink pill · `aurora` gradient (one per screen) · `glass` over imagery · `ghost` quiet. */
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  /** Swaps the leading icon for a dot loader and disables the button. */
  loading?: boolean;
  icon?: ReactNode;
  iconAfter?: ReactNode;
}

/** Class list shared by `Button` and `ButtonLink`. */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonProps["size"] = "md",
  ...extra: (string | false | null | undefined)[]
): string {
  return cx("pt-button", "pt-focusable", `pt-button--${variant}`, `pt-button--${size}`, ...extra);
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconAfter,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, size, loading && "pt-button--loading", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <DotLoader size="sm" label="Procesando" />
      ) : (
        icon && <span className="pt-button__icon">{icon}</span>
      )}
      {children != null && <span className="pt-button__label">{children}</span>}
      {iconAfter && <span className="pt-button__icon">{iconAfter}</span>}
    </button>
  );
}
