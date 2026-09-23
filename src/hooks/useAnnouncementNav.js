import { useEffect, useState } from "react";
import { getAllCompetitionResults } from "../services/eventService";

/**
 * Manual override flag:
 * - null: auto-detect dynamically from backend results API (recommended)
 * - true: force champions mode (/champions and "Juara dan Finalist")
 * - false: force finalist mode (/finalist and "Finalist")
 */
export const FORCE_CHAMPIONS_DROPPED = null;

const STORAGE_KEY = "ittod_announcement_nav_state";

export async function fetchAnnouncementNavState() {
  if (FORCE_CHAMPIONS_DROPPED !== null) {
    return {
      isChampion: FORCE_CHAMPIONS_DROPPED,
      path: FORCE_CHAMPIONS_DROPPED ? "/champions" : "/finalist",
      navLabel: FORCE_CHAMPIONS_DROPPED ? "Juara dan Finalist" : "Finalist",
      sidebarLabel: FORCE_CHAMPIONS_DROPPED ? "Juara dan Finalist" : "Finalis Lomba",
    };
  }

  try {
    const res = await getAllCompetitionResults();
    const hasActualChampions = Boolean(
      res?.success &&
      (
        res?.data?.champion_revealed ||
        res?.data?.competitions?.some((c) => c.champion_revealed && c.champions?.length > 0)
      )
    );

    const result = {
      isChampion: hasActualChampions,
      path: hasActualChampions ? "/champions" : "/finalist",
      navLabel: hasActualChampions ? "Juara dan Finalist" : "Finalist",
      sidebarLabel: hasActualChampions ? "Juara dan Finalist" : "Finalis Lomba",
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch {
      // Ignore storage errors
    }

    return result;
  } catch {
    return {
      isChampion: false,
      path: "/finalist",
      navLabel: "Finalist",
      sidebarLabel: "Finalis Lomba",
    };
  }
}

export function useAnnouncementNav() {
  const [navState, setNavState] = useState(() => {
    if (FORCE_CHAMPIONS_DROPPED !== null) {
      return {
        isChampion: FORCE_CHAMPIONS_DROPPED,
        path: FORCE_CHAMPIONS_DROPPED ? "/champions" : "/finalist",
        navLabel: FORCE_CHAMPIONS_DROPPED ? "Juara dan Finalist" : "Finalist",
        sidebarLabel: FORCE_CHAMPIONS_DROPPED ? "Juara dan Finalist" : "Finalis Lomba",
      };
    }

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }

    return {
      isChampion: false,
      path: "/finalist",
      navLabel: "Finalist",
      sidebarLabel: "Finalis Lomba",
    };
  });

  useEffect(() => {
    let isMounted = true;
    fetchAnnouncementNavState().then((state) => {
      if (isMounted && state) {
        setNavState(state);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return navState;
}