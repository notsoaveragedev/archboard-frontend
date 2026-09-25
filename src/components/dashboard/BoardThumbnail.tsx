import type { ReactNode } from "react";
import type { ThumbnailShape } from "../../types/workspace";

const dotGrid = {
  backgroundImage: "radial-gradient(circle, var(--color-line-strong) 0.0625rem, transparent 0.07rem)",
  backgroundSize: "0.75rem 0.75rem",
};

type BoardThumbnailProps = {
  shapes: ThumbnailShape[];
  highlightIndex?: number;
  children?: ReactNode;
};

export function BoardThumbnail({ shapes, highlightIndex, children }: BoardThumbnailProps) {
  return (
    <div style={dotGrid} className="relative h-39 border-b border-line bg-app transition-colors group-hover:bg-hover-subtle">
      {shapes.map((shape, index) => (
        <span
          key={index}
          style={{ left: `${shape.x}%`, top: `${shape.y}%`, width: `${shape.w}%`, height: `${shape.h}%` }}
          className={`absolute rounded-[0.1875rem] border ${
            shape.isSticky
              ? "border-[#F2D46B] bg-[#FFE58F]"
              : index === highlightIndex
                ? "border-brand bg-surface"
                : "border-[#CDD2DA] bg-surface"
          }`}
        />
      ))}
      {children}
    </div>
  );
}
