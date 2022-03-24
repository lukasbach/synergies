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
      parent: ProviderContextValue | null | number = 0
    ) => {
      if (!parent && typeof parent !== "number") {
        throw new Error(`Atom provider ${atom.id.description} not found`);
      }

      const target =
        typeof parent === "number" ? context : (parent as ProviderContextValue);

      return Object.prototype.hasOwnProperty.call(target.value.current, atom.id)
        ? target.value.current[atom.id]
        : recursiveResolve(atom, target.parent);
    },
    [context]
  );
  return recursiveResolve;
};
