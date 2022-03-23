import { Draft } from "immer";

export type ActionKey = string;

export type BaseActionMap = Record<ActionKey, any>;

export interface Synergy<T extends BaseActionMap> {
  createSelector: () => <R>(values: BaseActionMap) => R;
  createAction: <A extends any[]>(
    ...args: A
  ) => (drafts: { [K in keyof T]: Draft<T[K]> }) => Promise<void>;
  combine: <R extends BaseActionMap>(otherSynergies: {
    [K in keyof R]: Synergy<R[K]>;
  }) => Synergy<T & R>;
  atoms: {
    [K in keyof T]: Atom<T[K]>;
  };
  useValue: () => T;
}

export interface Atom<T = any> extends Synergy<[T]> {
  atomId: symbol;
  useSet: (draft: Draft<T>) => Promise<T | void>;
}

export interface Listener {
  triggerUpdate: () => void;
  detach: () => void;
}

export interface ProviderContextValue {
  valueRef: Record<symbol, any>;
  listenersRef: Record<string, Listener[]>;
  parentProviderRef: ProviderContextValue;
}

const a: Atom<string> = null as any;
const b: Atom<number> = null as any;
a.combine({ b }).createAction(() => ({}) => {});
