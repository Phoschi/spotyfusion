import React, { useRef, useState, useEffect } from "react";

type ScrollableRowProps = {
  children: React.ReactNode;
  height?: string;
};

const ArrowRight = () => (
  <svg
    width="9"
    height="17"
    viewBox="0 0 9 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
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
  <svg
    width="9"
    height="17"
    viewBox="0 0 9 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1L1 8.5L8 16"
      stroke="#F1F1F1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
      
      {canScrollLeft && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "40px",
            background: "linear-gradient(to right,rgba(24, 24, 24, 1) 0%, rgba(24, 24, 24, 0.85) 40%,rgba(24, 24, 24, 0.5) 70%, transparent 100% )",
            pointerEvents: "none",
          }}
        />
      )}

      {canScrollLeft && (
        <button onClick={() => scrollByOffset(-300)} style={{ ...buttonStyle, left: 0, bottom: 100 }}>
          <ArrowLeft />
        </button>
      )}

      <div
        ref={containerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          gap: "20px",
          scrollBehavior: "smooth",
          padding: "0 0",
          height,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="no-scrollbar"
      >
        {children}
      </div>

      {canScrollRight && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "40px",
            background: "linear-gradient(to left,rgba(24, 24, 24, 1) 0%, rgba(24, 24, 24, 0.85) 40%,rgba(24, 24, 24, 0.5) 70%, transparent 100% )",
            pointerEvents: "none",
          }}
        />
      )}

      <button onClick={() => scrollByOffset(300)} style={{ ...buttonStyle, right: 0, bottom: 100 }}>
        <ArrowRight />
      </button>
    </div>
  );
}
