import { Atom } from "./atom";
import { AtomDraft, AtomTuple, DraftTuple, SynergyTuple } from "./types";
import { Synergy } from "./synergy";
import { createDraft, finishDraft } from "immer";

export const ATOM_CONSTRUCTOR = Symbol("ATOM_CONSTRUCTOR") as any;
export const NO_UPDATE = Symbol("NO_UPDATE") as any;

export const createAtom = <T>(defaultValue: T, name?: string) =>
  new Atom<T>(defaultValue, name);
export const createSynergy = <T extends any[]>(...atoms: SynergyTuple<T>) =>
  new Synergy<T>(atoms);
export const arrayIdentity = <T extends any[]>(...x: T) => x;

const createCustomDraft = (
  current: any,
  onTrigger: (value: any, newDraft: AtomDraft<any>) => void
) => {
  const draft = createDraft({
    current,
    trigger: () => {
      const value = finishDraft(draft);
      const newDraft = createCustomDraft(value, onTrigger);
      onTrigger(value.current, newDraft);
      return newDraft;
    },
  });
  return draft;
};

export const produceAtoms = async <T extends any[]>(
  atomBaseValues: T,
  updater: (...drafts: DraftTuple<T>) => void | Promise<void>,
  onTrigger: (atomIndex: number, value: T[number]) => void
) => {
  const drafts = atomBaseValues.map((current, index) =>
    createCustomDraft(current, (value, newDraft) => {
      onTrigger(index, value);
      drafts[index] = newDraft;
    })
  ) as any;
  const updateResult = updater(...drafts);
  if (updateResult instanceof Promise) {
    await updateResult;
  }
  return drafts.map(draft => {
    let hasChanged = false;
    const value = finishDraft(draft, patches => {
      hasChanged = patches.length > 0;
    });
    return hasChanged ? value.current : NO_UPDATE;
  });
};
