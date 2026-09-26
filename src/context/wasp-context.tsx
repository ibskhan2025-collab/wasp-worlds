"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadState, saveState } from "@/lib/storage";
import { track } from "@/lib/track";
import { defaultState, type Feel, type Intent, type MotionPref, type WaspState, type WorldId } from "@/lib/types";

type WaspContextValue = WaspState & {
  ready: boolean;
  enter: () => void;
  visit: (id: WorldId) => void;
  setIntent: (intent: Intent | null) => void;
  setFeel: (feel: Feel) => void;
  setMotion: (motion: MotionPref) => void;
  markHolyShit: () => void;
  discover: (id: string) => void;
  patch: (partial: Partial<WaspState>) => void;
};

const WaspContext = createContext<WaspContextValue | null>(null);

export function WaspProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WaspState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Dataset flags apply instantly (cheap); persistence is debounced so
    // rapid interactions (typing in builder, canvas discoveries) don't
    // JSON-stringify + write localStorage on every keystroke.
    document.documentElement.dataset.feel = state.feel;
    document.documentElement.dataset.motion = state.motion;
    document.documentElement.dataset.intent = state.intent ?? "none";
    const id = window.setTimeout(() => saveState(state), 250);
    return () => window.clearTimeout(id);
  }, [state, ready]);

  const patch = useCallback((partial: Partial<WaspState>) => {
    setState((current) => ({ ...current, ...partial }));
  }, []);

  const enter = useCallback(() => patch({ entered: true }), [patch]);

  const visit = useCallback((id: WorldId) => {
    setState((current) => {
      const visited = current.visited.includes(id) ? current.visited : [...current.visited, id];
      return {
        ...current,
        visited,
        interest: { ...current.interest, [id]: (current.interest[id] ?? 0) + 1 },
      };
    });
  }, []);

  const setIntent = useCallback((intent: Intent | null) => {
    patch({ intent });
    track("preference_set", { kind: "intent", value: intent ?? "none" });
  }, [patch]);
  const setFeel = useCallback((feel: Feel) => {
    patch({ feel });
    track("preference_set", { kind: "feel", value: feel });
  }, [patch]);
  const setMotion = useCallback((motion: MotionPref) => {
    patch({ motion });
    track("preference_set", { kind: "motion", value: motion });
  }, [patch]);
  const markHolyShit = useCallback(() => patch({ holyShitSeen: true }), [patch]);
  const discover = useCallback((id: string) => {
    setState((current) =>
      current.discoveries.includes(id)
        ? current
        : { ...current, discoveries: [...current.discoveries, id] },
    );
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      ready,
      enter,
      visit,
      setIntent,
      setFeel,
      setMotion,
      markHolyShit,
      discover,
      patch,
    }),
    [state, ready, enter, visit, setIntent, setFeel, setMotion, markHolyShit, discover, patch],
  );

  return <WaspContext.Provider value={value}>{children}</WaspContext.Provider>;
}

export function useWasp() {
  const ctx = useContext(WaspContext);
  if (!ctx) throw new Error("useWasp must be used inside WaspProvider");
  return ctx;
}
