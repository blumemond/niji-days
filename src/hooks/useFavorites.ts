import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "niji-days:favorites";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  return useMemo(
    () => ({
      favoriteIds,
      isFavorite: (id: string) => favoriteIds.includes(id),
      toggleFavorite: (id: string) => {
        setFavoriteIds((current) =>
          current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]
        );
      }
    }),
    [favoriteIds]
  );
}
