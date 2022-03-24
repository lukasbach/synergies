import { AtomTuple, DraftTuple, Flatten, SynergyTuple } from "./types";
import {
  arrayIdentity,
  ATOM_CONSTRUCTOR,
  NO_UPDATE,
  produceAtoms,
} from "./helpers";
import { useSubscribe } from "./use-subscribe";
import { useCallback, useMemo, useReducer } from "react";
import { useGetAtomValue } from "./use-get-atom-value";
import { useTriggerUpdate } from "./use-trigger-update";
import { useSetAtomValue } from "./use-set-atom-value";

export class Synergy<T extends any[] = any[]> {
  public readonly atoms: AtomTuple<T>;

  constructor(atoms: SynergyTuple<T> | typeof ATOM_CONSTRUCTOR) {
    if (atoms === ATOM_CONSTRUCTOR) {
      this.atoms = [this] as any;
    } else {
      this.atoms = (atoms as SynergyTuple<T>)
        .map(atom => atom.atoms)
        .reduce((acc, cur) => acc.concat(cur), [] as any);
    }
  }

  combine<R extends any[]>(
    ...otherSynergies: SynergyTuple<R>
  ): Synergy<[...T, ...Flatten<R>]> {
    return new Synergy(
      otherSynergies.reduce((acc, s) => acc.concat(s.atoms), this.atoms) as any
    );
  }

  createSelector<R>(selectorFn: (...args: T) => R) {
    const useSelector = () => {
      const getValue = useGetAtomValue();
      console.log(this.atoms, this);
      const [atomState, listener] = useReducer<() => T>(
        () => this.atoms.map(getValue) as T,
        this.atoms.map(getValue) as T
      );
      useSubscribe(this.atoms, listener);
      return useMemo(() => selectorFn(...atomState), [atomState]);
    };
    return useSelector;
  }

  createAction<A extends any[]>(
    handler: (...args: A) => (...drafts: DraftTuple<T>) => void | Promise<void>
  ) {
    const useAction = () => {
      const triggerUpdate = useTriggerUpdate();
      const getValue = useGetAtomValue();
      const setValue = useSetAtomValue();
      return useCallback(
        async (...args: A) => {
          const result = await produceAtoms(
            this.atoms.map(getValue) as T,
            handler(...args),
            (triggeredAtomIndex: number, updatedValue: any) => {
              const atom = this.atoms[triggeredAtomIndex];
              setValue(atom, updatedValue);
              triggerUpdate([atom]);
            }
          );
          const updatedAtoms = result
            .map((updatedValue, index) => {
              if (updatedValue === NO_UPDATE) {
                return null;
              } else {
                const atom = this.atoms[index];
                setValue(atom, updatedValue);
                return atom;
              }
            })
            .filter(atom => !!atom);
          if (updatedAtoms.length > 0) {
            triggerUpdate(updatedAtoms);
          }
        },
        [handler, triggerUpdate, getValue, setValue]
      );
    };
    return useAction;
  }

  getDefaultValue() {
    return this.atoms.reduce((acc, atom) => {
      acc[atom.id] = atom.defaultValue;
      return acc;
    }, {});
  }

  getEmptyListenerObject() {
    return this.atoms.reduce((acc, atom) => {
      acc[atom.id] = new Set();
      return acc;
    }, {});
  }

  useValue() {
    return this.createSelector(arrayIdentity)();
  }
}
