import { useSynergyContext } from "./use-synergy-context";
import { useCallback } from "react";
import { Atom } from "./atom";
import { ProviderContextValue } from "./types";

export const useSetAtomValue = () => {
  const context = useSynergyContext();
  const recursiveResolve = useCallback(
    (
      atom: Atom,
      value: any,
      /** @internal */
      parent?: ProviderContextValue | null
    ) => {
      if (parent === null) {
        throw new Error("Atom provider not found");
      }

      const target = parent ?? context;
      if (Object.prototype.hasOwnProperty.call(target.value.current, atom.id)) {
        target.value.current[atom.id] = value;
      } else {
        recursiveResolve(atom, target.parent);
      }
    },
    [context]
  );
  return recursiveResolve;
};
