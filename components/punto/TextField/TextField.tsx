"use client";

import { type InputHTMLAttributes, type ReactNode, type Ref, useId } from "react";
import { cx } from "../cx";
import "./TextField.css";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Visually hide the label (it stays for screen readers). */
  hideLabel?: boolean;
  leading?: ReactNode;
  /** Forwarded to the `<input>` (React 19 passes `ref` as a regular prop). */
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  label,
  hint,
  error,
  hideLabel = false,
  leading,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const noteId = `${inputId}-note`;
  const note = error ?? hint;
  return (
    <div className={cx("pt-field", error != null && "pt-field--error", className)}>
      <label htmlFor={inputId} className={cx("pt-field__label", hideLabel && "pt-sr-only")}>
        {label}
      </label>
      <div className="pt-field__control">
        {leading && <span className="pt-field__leading">{leading}</span>}
        <input
          id={inputId}
          className="pt-field__input"
          aria-invalid={error != null || undefined}
          aria-describedby={note != null ? noteId : undefined}
          {...rest}
        />
      </div>
      {note != null && (
        <p id={noteId} className="pt-field__note">
          {note}
        </p>
      )}
    </div>
  );
}
