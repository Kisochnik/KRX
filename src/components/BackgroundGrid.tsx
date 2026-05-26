"use client";

import React, { useEffect, useState } from "react";

export default function BackgroundGrid() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Fade in background grid slowly on mount
    const timer = setTimeout(() => setOpacity(1), 100);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-50 overflow-hidden bg-black transition-opacity duration-1000 ease-out"
      style={{ opacity }}
    >
      {/* Radial spotlight glow following the mouse cursor */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.045), transparent 80%)`,
        }}
      />
      
      {/* Mobile static glow in center */}
      <div
        className="pointer-events-none absolute inset-0 block md:hidden"
        style={{
          background: "radial-gradient(350px circle at 50% 40%, rgba(255, 255, 255, 0.04), transparent 80%)",
        }}
      />

      {/* Cybernetic grid overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-grid-pulse" 
      />

      {/* Horizontal subtle light glow bar at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_1px_15px_rgba(255,255,255,0.1)]" />
    </div>
  );
}