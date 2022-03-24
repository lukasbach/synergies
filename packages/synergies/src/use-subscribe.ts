import { AtomTuple } from "./types";
import { useEffect } from "react";
import { useAtomLookup } from "./use-atom-lookup";

export const useSubscribe = <T extends any[]>(
  atoms: AtomTuple<T>,
  listener: () => void
) => {
  const lookupAtom = useAtomLookup();
  useEffect(() => {
    for (const atom of atoms) {
      lookupAtom(atom).listeners.add(listener);
    }
    return () => {
      for (const atom of atoms) {
        lookupAtom(atom).listeners.delete(listener);
      }
    };
  }, [lookupAtom]);
};
