"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({
  children,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      className={`page-transition ${
        visible ? "page-transition-visible" : ""
      }`}
    >
      {children}
    </div>
  );
}