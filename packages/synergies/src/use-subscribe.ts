import { useSynergyContext } from "./use-synergy-context";
import { AtomTuple } from "./types";
import { useEffect } from "react";

export const useSubscribe = <T extends any[]>(
  atoms: AtomTuple<T>,
  listener: () => void
) => {
  const context = useSynergyContext();

  useEffect(() => {
    for (const atom of atoms) {
      context.listeners.current[atom.id].add(listener);
    }
    return () => {
      for (const atom of atoms) {
        context.listeners.current[atom.id].delete(listener);
      }
    };
  });
};
