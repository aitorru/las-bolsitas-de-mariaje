"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ArrowUp } from "./Icons";
import { Button } from "./punto";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  const [passTheVisiblePoint, setPassTheVisiblePoint] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setPassTheVisiblePoint(
        window.scrollY > window.screen.availHeight / 2.3,
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {children}
      <Button
        variant="primary"
        aria-label="Volver arriba"
        icon={<ArrowUp size={18} />}
        className={`lb-top ${passTheVisiblePoint ? "is-visible" : ""}`}
        tabIndex={passTheVisiblePoint ? 0 : -1}
        onClick={() => {
          window.scrollTo({ top: 0 });
        }}
      />
    </>
  );
}
