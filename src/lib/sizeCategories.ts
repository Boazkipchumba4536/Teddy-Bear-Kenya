import type { BearSize } from "@/types/product";

export type SizeGroup = {
  size: BearSize;
  label: string;
  description: string;
  href: string;
};

export const SIZE_GROUPS: SizeGroup[] = [
  { size: "S", label: "Small", description: "30–40 cm", href: "/shop?size=S" },
  { size: "M", label: "Medium", description: "45–55 cm", href: "/shop?size=M" },
  { size: "L", label: "Large", description: "60–80 cm", href: "/shop?size=L" },
  { size: "Giant", label: "Giant", description: "100 cm+", href: "/shop?size=Giant" },
];

export function getSizeLabel(size: BearSize): string {
  return SIZE_GROUPS.find((g) => g.size === size)?.label ?? size;
}
