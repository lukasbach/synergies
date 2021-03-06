import {
  AtomContextData,
  AtomTuple,
  DraftTuple,
  Flatten,
  SynergyTuple,
} from "./types";
import { arrayIdentity, ATOM_CONSTRUCTOR, NO_UPDATE } from "./helpers";
import { useSubscribe } from "./use-subscribe";
import { useCallback, useMemo, useReducer } from "react";
import { useTriggerUpdate } from "./use-trigger-update";
import { useAtomLookup } from "./use-atom-lookup";
import { produceAtoms } from "./produce-atoms";
import { useMiddlewarePipe } from "./use-middleware-pipe";

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
      const lookupAtom = useAtomLookup<T[number]>();
      const fetch = useCallback(
        () => this.atoms.map(atom => lookupAtom(atom).value),
        [lookupAtom]
      );
      const [atomState, listener] = useReducer<() => T>(
        fetch as () => T,
        fetch() as T
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
      const lookupAtom = useAtomLookup();
      const middlewarePipe = useMiddlewarePipe();
      return useCallback(
        async (...args: A) => {
          const lookedupAtoms = this.atoms.map(atom => lookupAtom(atom));
          const result = await produceAtoms(
            lookedupAtoms.map(atom => atom.value) as T,
            handler(...args),
            (triggeredAtomIndex: number, updatedValue: any) => {
              lookedupAtoms[triggeredAtomIndex].value = updatedValue;
              triggerUpdate([this.atoms[triggeredAtomIndex]]);
            }
          );
          const pipedAtoms = await middlewarePipe(
            result.map((value, index) => ({
              atom: this.atoms[index],
              prev: lookedupAtoms[index].value,
              value,
            }))
          );
          const updatedAtoms = pipedAtoms
            .map(({ value }) => value)
            .map((updatedValue, index) => {
              if (updatedValue === NO_UPDATE) {
                return null;
              } else {
                const atom = this.atoms[index];
                lookedupAtoms[index].value = updatedValue;
                return atom;
              }
            })
            .filter(atom => !!atom);
          if (updatedAtoms.length > 0) {
            triggerUpdate(updatedAtoms);
          }
        },
        [handler, triggerUpdate, lookupAtom]
      );
    };
    return useAction;
  }

  /** @internal */
  createProviderState(initialState?: Record<symbol, any>) {
    return this.atoms.reduce<Record<symbol, AtomContextData<T[number]>>>(
      (acc, atom) => {
        acc[atom.id] = {
          listeners: new Set(),
          value: initialState?.[atom.id] ?? atom.defaultValue,
        };
        return acc;
      },
      {}
    );
  }

  useValue() {
    return this.createSelector(arrayIdentity)();
  }

  useSet() {
    return this.createAction((...values: T) => (...drafts) => {
      drafts.forEach((draft, index) => {
        drafts[index].current = values[index];
      });
    })();
  }
}
