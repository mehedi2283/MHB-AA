"use client";

import { useEffect, useState } from "react";
import { PixelArrowUp } from "./PixelIcons";
import { PixelCard } from "./PixelCard";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <PixelCard
      as="button"
      variant="glass"
      gridSize={6}
      onClick={scrollToTop}
      className="back-to-top-btn"
      aria-label="Back to top"
    >
      <span>BACK TO TOP</span>
      <PixelArrowUp size={13} />
    </PixelCard>
  );
}
