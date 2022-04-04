import { SynergyContext } from "./context";
import React, { memo, ReactNode, useMemo, useRef } from "react";
import { Synergy } from "./synergy";
import { useSynergyContext } from "./use-synergy-context";
import { SynergyTuple } from "./types";
import { Atom } from "./atom";

type InitialAtomValue<A extends Atom> = Record<
  A["id"],
  A extends Atom<infer V> ? V : never
>;

export interface ProviderProps<T extends any[]> {
  atoms: SynergyTuple<T>;
  children?: ReactNode | undefined;
  initialValue?: InitialAtomValue<any>;
}

function SynergyProvider<T extends any[]>(props: ProviderProps<T>) {
  const parent = useSynergyContext();
  const atoms = useRef(
    new Synergy(props.atoms).createProviderState(props.initialValue)
  );

  const contextValue = useMemo(
    () => ({
      parent,
      atoms,
    }),
    []
  );

  return (
    <SynergyContext.Provider value={contextValue}>
      {props.children}
    </SynergyContext.Provider>
  );
}

export const Provider = memo(SynergyProvider, (prev, next) => {
  // ignore changes in the atoms array. Atoms should be passed statically.
  return prev.children === next.children;
}) as typeof SynergyProvider;
