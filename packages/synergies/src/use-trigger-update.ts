import { useCallback } from "react";
import { Atom } from "./atom";
import { useAtomLookup } from "./use-atom-lookup";
import { useMiddlewarePipe } from "./use-middleware-pipe";
import { middlewareOnOnTriggerAtomsName } from "./types";

export const useTriggerUpdate = () => {
  const lookupAtom = useAtomLookup();
  const middlewarePipe = useMiddlewarePipe();
  return useCallback(async (atoms: Atom[]) => {
    const pipedAtoms = await middlewarePipe(
      middlewareOnOnTriggerAtomsName,
      null,
      atoms
    );
    const listeners = pipedAtoms.map(atom => lookupAtom(atom).listeners);
    for (const listenerSet of listeners) {
      listenerSet.forEach(listener => listener());
    }
  }, []);
};
