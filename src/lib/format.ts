export function formatKES(amount: number): string {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    "teddy-bear": "Classic & Medium",
    "big-teddy-bear": "Big Teddy Bears",
    "giant-teddy-bear": "Giant Teddy Bears",
    panda: "Panda Teddy Bears",
    personalized: "Personalized",
  };
  return labels[cat] ?? cat;
}
