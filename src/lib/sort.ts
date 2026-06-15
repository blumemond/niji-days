import type { Liver, SortDirection, SortKey } from "../types";
import { calculateDayNumber, getNextAnniversary } from "./anniversaries";

export function sortLivers(
  livers: Liver[],
  sortKey: SortKey,
  direction: SortDirection,
  today: string
): Liver[] {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...livers].sort((a, b) => {
    const result = compareLivers(a, b, sortKey, today);
    if (result !== 0) {
      return result * multiplier;
    }

    return a.displayNameKana.localeCompare(b.displayNameKana, "ja");
  });
}

function compareLivers(a: Liver, b: Liver, sortKey: SortKey, today: string): number {
  switch (sortKey) {
    case "kana":
      if (a.sortOrderRuby !== undefined && b.sortOrderRuby !== undefined) {
        return a.sortOrderRuby - b.sortOrderRuby;
      }

      return a.displayNameKana.localeCompare(b.displayNameKana, "ja");
    case "debutDate":
      return a.debutDate.localeCompare(b.debutDate);
    case "dayNumber":
      return calculateDayNumber(a.debutDate, today) - calculateDayNumber(b.debutDate, today);
    case "nextAnniversary": {
      const aNext = getNextAnniversary(a, today)?.daysUntil ?? Number.MAX_SAFE_INTEGER;
      const bNext = getNextAnniversary(b, today)?.daysUntil ?? Number.MAX_SAFE_INTEGER;
      return aNext - bNext;
    }
    default:
      return 0;
  }
}
