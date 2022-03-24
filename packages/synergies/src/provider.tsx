import { Context } from "./context";
import React, {
  memo,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
} from "react";
import { Synergy } from "./synergy";

export const Provider = memo(
  function SynergyProvider(props: PropsWithChildren<{ atoms: Synergy[] }>) {
    const parent = useContext(Context);
    const value = useRef(new Synergy(props.atoms).getDefaultValue());
    const listeners = useRef(new Synergy(props.atoms).getEmptyListenerObject());

    const contextValue = useMemo(
      () => ({
        parent,
        value,
        listeners,
      }),
      []
    );

    return (
      <Context.Provider value={contextValue}>{props.children}</Context.Provider>
    );
  },
  (prev, next) => {
    // ignore changes in the atoms array. Atoms should be passed statically.
    return prev.children === next.children;
  }
);
