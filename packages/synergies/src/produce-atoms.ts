import { AtomDraft, DraftTuple } from "./types";
import { createDraft, finishDraft } from "immer";
import { NO_UPDATE } from "./helpers";

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
