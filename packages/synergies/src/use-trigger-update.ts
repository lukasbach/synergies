import { useCallback } from "react";
import { Atom } from "./atom";
import { useAtomLookup } from "./use-atom-lookup";

export const useTriggerUpdate = () => {
  const lookupAtom = useAtomLookup();
  return useCallback((atoms: Atom[]) => {
    const listeners = atoms.map(atom => lookupAtom(atom).listeners);
    for (const listenerSet of listeners) {
      listenerSet.forEach(listener => listener());
    }
  }, []);
};
