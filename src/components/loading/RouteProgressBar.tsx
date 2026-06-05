"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Lightweight top bar — no framer-motion on every navigation. */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const done = window.setTimeout(() => setActive(false), 400);
    return () => window.clearTimeout(done);
  }, [pathname]);

  return (
    <div
      className={`route-progress fixed top-0 left-0 right-0 z-[100] h-0.5 origin-left bg-gradient-to-r from-caramel via-blush-dark to-caramel pointer-events-none transition-opacity duration-200 ${
        active ? "route-progress-active opacity-100" : "opacity-0"
      }`}
      aria-hidden
    />
  );
}
