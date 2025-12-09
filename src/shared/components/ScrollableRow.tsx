import React, { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

type ScrollableRowProps = {
  children: React.ReactNode;
  height?: string;
};

export default function ScrollableRow({ children, height = "180px" }: ScrollableRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scrollByOffset = (offset: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  useEffect(() => {
    updateScroll();
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      if (e.deltaX !== 0) e.preventDefault();
    };

    container.addEventListener("scroll", updateScroll);
    window.addEventListener("resize", updateScroll);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const buttonStyle = {
    position: "absolute" as const,
    zIndex: 10,
    background: "#242424",
    borderRadius: "50%",
    border: "1px solid #383838",
    width: "48px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };

  return (
    <div style={{ position: "relative", width: "100%", height, display: "flex", alignItems: "center" }}>
      {/* Dégradé gauche */}
      {canScrollLeft && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "40px",
            background: "linear-gradient(to right, rgba(24,24,24,1), rgba(24,24,24,0.5) 30%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Bouton gauche */}
      {canScrollLeft && (
        <button onClick={() => scrollByOffset(-300)} style={{ ...buttonStyle, left: 0 }}>
          <ChevronLeft color="#F1F1F1" size={36} />
        </button>
      )}

      {/* Conteneur scrollable */}
      <div
        ref={containerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          gap: "20px",
          scrollBehavior: "smooth",
          padding: "0 20px",
          height,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="no-scrollbar"
      >
        {children}
      </div>

      {/* Dégradé droit */}
      {canScrollRight && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "40px",
            background: "linear-gradient(to left, rgba(24,24,24,1), rgba(24,24,24,0.5) 30%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Bouton droit */}
      {true && (
        <button onClick={() => scrollByOffset(300)} style={{ ...buttonStyle, right: 0 }}>
          <ChevronRight color="#F1F1F1" size={36} />
        </button>
      )}
    </div>
  );
}
