import { useSynergyContext } from "./use-synergy-context";
import { AtomTuple } from "./types";
import { useEffect } from "react";

export const useSubscribe = <T extends any[]>(
  atoms: AtomTuple<T>,
  listener: () => void
) => {
  const context = useSynergyContext();

  useEffect(() => {
    // TODO!! resolve parent context
    for (const atom of atoms) {
      console.log(
        "xxx",
        context.listeners.current,
        atom.id,
        atom.id in context.listeners.current
      );
      context.listeners.current[atom.id].add(listener);
    }
    return () => {
      for (const atom of atoms) {
        context.listeners.current[atom.id].delete(listener);
      }
    };
  });
};
