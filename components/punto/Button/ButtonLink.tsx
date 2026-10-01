import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { type ButtonProps, type ButtonVariant, buttonClassName } from "./Button";

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonProps["size"];
  icon?: ReactNode;
  iconAfter?: ReactNode;
}

/**
 * A link that looks like a `Button`. Internal paths go through `next/link`; absolute
 * URLs, `mailto:` and in-page anchors stay plain `<a>`.
 */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconAfter,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const content = (
    <>
      {icon && <span className="pt-button__icon">{icon}</span>}
      {children != null && <span className="pt-button__label">{children}</span>}
      {iconAfter && <span className="pt-button__icon">{iconAfter}</span>}
    </>
  );
  const classes = buttonClassName(variant, size, className);
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {content}
    </a>
  );
}
