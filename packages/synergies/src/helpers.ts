import { Atom } from "./atom";
import { AtomDraft, AtomTuple, DraftTuple, SynergyTuple } from "./types";
import { Synergy } from "./synergy";
import produce, { createDraft, finishDraft } from "immer";

export const ATOM_CONSTRUCTOR = Symbol() as any;
export const NO_UPDATE = Symbol() as any;

export const createAtom = <T>(defaultValue: T, name?: string) =>
  new Atom<T>(defaultValue, name);
export const createSynergy = <T extends any[]>(...atoms: SynergyTuple<T>) =>
  new Synergy<T>(atoms);
export const arrayIdentity = <T extends any[]>(...x: T) => x;
export const identity = <T>(x: T) => x;

export const produceAtoms = async <T extends any[]>(
  atomBaseValues: T,
  updater: (...drafts: DraftTuple<T>) => void | Promise<void>,
  onTrigger: (atomIndex: number, value: T[number]) => void
) => {
  const atomPatchCount = [];
  const drafts = atomBaseValues.map((current, index) => {
    atomPatchCount.push(0);
    const draft = createDraft({
      current,
      trigger: () => {
        const value = finishDraft(draft, patches => {
          atomPatchCount[index] -= patches.length;
        });
        onTrigger(index, value);
      },
    });
    return draft;
  }) as any;
  const updateResult = updater(...drafts);
  if (updateResult instanceof Promise) {
    await updateResult;
  }
  return drafts
    .map(draft =>
      finishDraft(draft, patches => {
        atomPatchCount[draft.atomIndex] += patches.length;
      })
    )
    .map((value, index) => (atomPatchCount[index] > 0 ? value : NO_UPDATE));
};

/*

  atomBaseValues.reduce(
    (acc, current, index) => {
      let hasChanged = false;
      results.push(
        produce(
          {
            current,
            trigger: (value?: T[number]) => onTrigger(index, value),
          },
          draft => {
            acc();
          },
          patches => {
            hasChanged = true;
          }
        )
      );
    },
    () => {}
  );
 */
