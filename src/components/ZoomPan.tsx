"use client";
import { useRef, useState, useEffect } from "react";

export default function ZoomPan({
  children,
  min = 0.7,
  max = 2,
  className = "",
}: {
  children: React.ReactNode;
  min?: number; max?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<null | { x: number; y: number }> (null);

  useEffect(() => {
    const el = ref.current!;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey && !e.altKey) return; // zoom volontaire: Ctrl+molette
      e.preventDefault();
      const next = Math.min(max, Math.max(min, scale + (e.deltaY < 0 ? 0.1 : -0.1)));
      setScale(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scale, min, max]);

  const onMouseDown = (e: React.MouseEvent) => setDrag({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  const onMouseMove = (e: React.MouseEvent) => drag && setPos({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  const onMouseUp   = () => setDrag(null);

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-white ${className}`}
         ref={ref} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
      {/* Controls */}
      <div className="absolute right-3 top-3 z-10 flex gap-2 rounded-lg bg-white/90 p-2 shadow">
        <button className="rounded border px-2" onClick={() => setScale(s => Math.max(min, s - 0.1))}>–</button>
        <button className="rounded border px-2" onClick={() => setScale(s => Math.min(max, s + 0.1))}>+</button>
        <button className="rounded border px-2" onClick={() => setScale(1)}>100%</button>
        <button className="rounded border px-2" onClick={() => setPos({ x: 0, y: 0 })}>Centrer</button>
      </div>

      {/* Canvas */}
      <div
        role="region"
        aria-label="Plan zoomable"
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transformOrigin: "0 0" }}
      >
        {children}
      </div>
    </div>
  );
}
