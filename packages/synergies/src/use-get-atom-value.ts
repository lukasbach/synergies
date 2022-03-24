import { useCallback } from "react";
import { Atom } from "./atom";
import { useSynergyContext } from "./use-synergy-context";
import { ProviderContextValue } from "./types";

export const useGetAtomValue = () => {
  const context = useSynergyContext();
  const recursiveResolve = useCallback(
    (
      atom: Atom,
      /** @internal */
      parent?: ProviderContextValue | null
    ) => {
      if (parent === null) {
        throw new Error("Atom provider not found");
      }

      const target = parent ?? context;
      return Object.prototype.hasOwnProperty.call(target.value.current, atom.id)
        ? target.value.current[atom.id]
        : recursiveResolve(atom, target.parent);
    },
    [context]
  );
  return recursiveResolve;
};
