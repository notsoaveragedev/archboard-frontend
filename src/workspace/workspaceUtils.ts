export const TILE_COLORS = ["bg-ink", "bg-[#8E4EC6]", "bg-[#12A594]", "bg-[#F76B15]", "bg-brand", "bg-[#E93D82]"];

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
