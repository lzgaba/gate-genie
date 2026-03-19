import { useRef, useCallback, useState } from "react";
import type { Position } from "@/types/circuit";

interface DraggableNodeProps {
  id: string;
  position: Position;
  onMove: (id: string, pos: Position) => void;
  children: React.ReactNode;
  className?: string;
}

const DraggableNode = ({ id, position, onMove, children, className = "" }: DraggableNodeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
      const parentRect = ref.current?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        offsetRef.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        };
      }

      const handleMouseMove = (ev: MouseEvent) => {
        const newX = Math.max(0, ev.clientX - offsetRef.current.x);
        const newY = Math.max(0, ev.clientY - offsetRef.current.y);
        onMove(id, { x: newX, y: newY });
      };

      const handleMouseUp = () => {
        setDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [id, position, onMove]
  );

  return (
    <div
      ref={ref}
      className={`absolute select-none ${dragging ? "cursor-grabbing z-20" : "cursor-grab z-10"} ${className}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default DraggableNode;
