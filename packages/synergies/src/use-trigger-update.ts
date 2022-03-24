import { useCallback } from "react";
import { Atom } from "./atom";
import { useAtomLookup } from "./use-atom-lookup";

export const useTriggerUpdate = () => {
  const lookupAtom = useAtomLookup();
  return useCallback((atoms: Atom[]) => {
    console.log(`Updated atoms: ${atoms.map(a => a.id.toString()).join(", ")}`);
    const listeners = atoms.map(atom => lookupAtom(atom).listeners);
    for (const listenerSet of listeners) {
      listenerSet.forEach(listener => listener());
    }
  }, []);
};
