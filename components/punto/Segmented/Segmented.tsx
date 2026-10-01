"use client";

import { type CSSProperties, useId } from "react";
import { cx } from "../cx";
import "./Segmented.css";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Pill switch for 2–5 mutually exclusive views (scenarios, periods…). Built on native
 * radio inputs, so arrow keys and screen readers work without extra code.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className,
}: SegmentedProps<T>) {
  const name = useId();
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  return (
    <fieldset
      className={cx("pt-segmented", `pt-segmented--${size}`, className)}
      style={{ "--n": options.length, "--i": index } as CSSProperties}
    >
      <legend className="pt-sr-only">{label}</legend>
      <span className="pt-segmented__thumb" aria-hidden="true" />
      {options.map((o) => (
        <label key={o.value} className={cx("pt-segmented__item", o.value === value && "is-active")}>
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={o.value === value}
            onChange={() => onChange(o.value)}
            className="pt-segmented__input"
          />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}
