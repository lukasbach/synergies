import { Atom } from "./atom";
import { SynergyTuple } from "./types";
import { Synergy } from "./synergy";

export const ATOM_CONSTRUCTOR = Symbol("ATOM_CONSTRUCTOR") as any;
export const NO_UPDATE = Symbol("NO_UPDATE") as any;

export const createAtom = <T>(defaultValue: T, name?: string) =>
  new Atom<T>(defaultValue, name);
export const createSynergy = <T extends any[]>(...atoms: SynergyTuple<T>) =>
  new Synergy<T>(atoms);
export const arrayIdentity = <T extends any[]>(...x: T) => x;
