import { useSynergyContext } from "./use-synergy-context";
import { useCallback } from "react";
import { Atom } from "./atom";
import { AtomContextData, ProviderContextValue } from "./types";

export const useAtomLookup = <T>() => {
  const context = useSynergyContext();
  const recursiveResolve = useCallback(
    (atom: Atom<T>, target: ProviderContextValue | null) => {
      if (!target) {
        throw new Error(`Atom provider ${atom.id.description} not found`);
      }

      return Object.prototype.hasOwnProperty.call(target.atoms.current, atom.id)
        ? target.atoms.current[atom.id]
        : recursiveResolve(atom, target.parent);
    },
    [context]
  );
  return useCallback(
    (atom: Atom<T>): AtomContextData<T> => recursiveResolve(atom, context),
    [recursiveResolve]
  );
};
