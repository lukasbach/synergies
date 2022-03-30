import { SynergyContext } from "./context";
import React, { memo, ReactNode, useContext, useMemo, useRef } from "react";
import { Synergy } from "./synergy";
import { useSynergyContext } from "./use-synergy-context";

export interface ProviderProps {
  atoms: Synergy[];
  children?: ReactNode | undefined;
}

export const Provider = memo(
  function SynergyProvider(props: ProviderProps) {
    const parent = useSynergyContext();
    const atoms = useRef(new Synergy(props.atoms).createProviderState());

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
  },
  (prev, next) => {
    // ignore changes in the atoms array. Atoms should be passed statically.
    return prev.children === next.children;
  }
);
