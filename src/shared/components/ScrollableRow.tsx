import React, { useRef, useState, useEffect, useCallback } from "react";

type ScrollableRowProps = {
  children: React.ReactNode;
  height?: string;
};

const ArrowRight = () => (
  <svg width="9" height="17" viewBox="0 0 9 17" fill="none">
    <path
      d="M1 1L8 8.5L1 16"
      stroke="#F1F1F1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeft = () => (
  <svg width="9" height="17" viewBox="0 0 9 17" fill="none">
    <path
      d="M8 1L1 8.5L8 16"
      stroke="#F1F1F1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ScrollableRow({
  children,
  height = "180px",
}: ScrollableRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;

    const { scrollLeft, scrollWidth, clientWidth } = c;

    setCanLeft(scrollLeft > 0);
    setCanRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  }, []);

  useEffect(() => {
    update();
  }, [children, update]);

  // molette → scroll horizontal
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    const wheel = (e: WheelEvent) => {
      // Si on scroll principalement horizontalement (trackpad), on laisse le natif (inertie, fluidité)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      // Sinon (souris verticale), on transforme le vertical en horizontal manuellement
      e.preventDefault();
      c.scrollLeft += e.deltaY;
    };

    c.addEventListener("wheel", wheel, { passive: false });
    c.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    update(); // initial update

    return () => {
      c.removeEventListener("wheel", wheel);
      c.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (x: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: x, behavior: "smooth" });
  };

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
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

  const gradientStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "200px",
    zIndex: 5,
    pointerEvents: "none",
  };

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      {/* bouton gauche */}
      {canLeft && (
        <>
          <button onClick={() => scroll(-300)} style={{ ...buttonStyle, left: 0 }}>
            <ArrowLeft />
          </button>
          <div
            style={{
              ...gradientStyle,
              left: 0,
              background:
                "linear-gradient(90deg, #181818 0%, #181818 15%, rgba(24,24,24,0) 100%)",
            }}
          />
        </>
      )}

      {/* zone scrollable */}
      <div
        ref={containerRef}
        className="hide-scrollbar"
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          gap: "20px",
          height: "100%",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>

      {/* cacher la scrollbar chrome */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* bouton droite */}
      {canRight && (
        <>
          <div
            style={{
              ...gradientStyle,
              right: 0,
              background:
                "linear-gradient(-90deg, #181818 0%, #181818 15%, rgba(24,24,24,0) 100%)",
            }}
          />
          <button onClick={() => scroll(300)} style={{ ...buttonStyle, right: 0 }}>
            <ArrowRight />
          </button>
        </>
      )}
    </div>
  );
}
