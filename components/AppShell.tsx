"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  const [passTheVisiblePoint, setPassTheVisiblePoint] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.screen.availHeight / 2.3) {
        setPassTheVisiblePoint(true);
      } else {
        setPassTheVisiblePoint(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="h-0 sticky origin-right top-[90vh] z-10 overflow-x-clip flex justify-end">
        <BackToTop visible={passTheVisiblePoint} />
      </div>
      {children}
    </>
  );
}

function BackToTop({ visible }: { visible: boolean }) {
  return (
    <button
      className={`sticky h-min z-20 right-6 p-2 rounded-xl bg-blue-700 shadow-blue-700/50 text-white transition-all duration-700 hover:scale-105 ${
        visible ? "shadow-sm" : "scale-0 opacity-0 hover:scale-0"
      }`}
      onClick={() => {
        window.scrollTo({ top: 0 });
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-[2rem] w-[2rem]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7l4-4m0 0l4 4m-4-4v18"
        />
      </svg>
    </button>
  );
}
