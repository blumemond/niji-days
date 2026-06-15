export type LiverStatus = "active" | "graduated" | "paused" | "listed";

export interface LiverLink {
  type: "official" | "youtube" | "x" | "fanclub" | "officialShop" | "officialStoreEn" | "magazine";
  label: string;
  url: string;
}

export interface Liver {
  id: string;
  displayName: string;
  displayNameKana: string;
  sortOrderRuby?: number;
  sortOrderEnName?: number;
  debutDate: string;
  debutDateBasis: string;
  branch: string;
  status: LiverStatus;
  groupName?: string;
  generationName?: string;
  color: string;
  sourceNote: string;
  links: LiverLink[];
}

export type AnniversaryType =
  | "yearly"
  | "half-year"
  | "special-day"
  | "thousand-day"
  | "hundred-day"
  | "repeating-day";

export interface AnniversaryEvent {
  liverId: string;
  type: AnniversaryType;
  date: string;
  dayNumber: number;
  label: string;
  priority: number;
}

export interface DecoratedAnniversaryEvent extends AnniversaryEvent {
  liver: Liver;
  daysUntil: number;
}

export type SortKey = "kana" | "debutDate" | "dayNumber" | "nextAnniversary";
export type SortDirection = "asc" | "desc";
