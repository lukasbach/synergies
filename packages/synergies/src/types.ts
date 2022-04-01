import { MutableRefObject } from "react";
import { Atom } from "./atom";
import { Synergy } from "./synergy";
import { Draft } from "immer";

export type AtomTuple<T extends [...any[]]> = {
  [I in keyof T]: Atom<T[I]>;
} & { length: T["length"] };

export type DraftTuple<T extends [...any[]]> = {
  [I in keyof T]: AtomDraft<T[I]>;
} & { length: T["length"] } & any[];

export type SynergyTuple<T extends [...any[][]]> = {
  [I in keyof T]: Synergy<T[I][]>;
} & { length: T["length"] } & any[];

export type Flatten<
  Arr extends ReadonlyArray<unknown>,
  Result extends ReadonlyArray<unknown> = []
> =
  // if Arr is empty -> return Result
  Arr extends readonly []
    ? Result
    : // if Arr is not empty - destruct it
    Arr extends readonly [infer Head, ...infer Tail]
    ? // check if Head is an Array
      Head extends ReadonlyArray<any>
      ? // if it is -> call Reducer with flat Head and Tail
        Flatten<readonly [...Head, ...Tail], Result>
      : // otherwise call Reducer with Head without flattening
        Flatten<Tail, readonly [...Result, Head]>
    : never;

export type AtomDraft<T> = Draft<{
  current: T;
  trigger: () => AtomDraft<T>;
}>;

export type Listener = () => void;

export interface AtomContextData<T> {
  value: T;
  listeners: Set<Listener>;
}

export interface ProviderContextValue {
  atoms: MutableRefObject<Record<symbol, AtomContextData<any>>>;
  parent: ProviderContextValue | null;
}

export type AtomWithValueArray<T extends any[] = any[]> = {
  [I in keyof T]: { atom: Atom; value: T[I]; prev: T[I] };
} & { length: T["length"] };

export type MiddlewareNextFunction<T extends any[] = any[]> = (
  newUpdatedAtoms: AtomWithValueArray<T>
) => void;

export type Middleware<T extends any[] = any[]> = (
  next: MiddlewareNextFunction<T>
) => (updatedAtoms: AtomWithValueArray<T>) => void | Promise<void>;
