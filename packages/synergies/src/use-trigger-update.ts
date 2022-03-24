import { useSynergyContext } from "./use-synergy-context";
import { useCallback } from "react";
import { Atom } from "./atom";
import { Listener, ProviderContextValue } from "./types";

export const useTriggerUpdate = () => {
  const context = useSynergyContext();
  const recursiveResolveListeners = useCallback(
    (atom: Atom, parent?: ProviderContextValue | null) => {
      if (parent === null) {
        throw new Error("Atom provider not found");
      }

      const target = parent ?? context;
      return Object.prototype.hasOwnProperty.call(
        target.listeners.current,
        atom.id
      )
        ? target.listeners.current[atom.id]
        : recursiveResolveListeners(atom, target.parent);
    },
    [context]
  );

  return useCallback((atoms: Atom[]) => {
    for (const listenerSet of atoms.map<Set<Listener>>(
      recursiveResolveListeners
    )) {
      listenerSet.forEach(listener => listener());
    }
  }, []);
};
