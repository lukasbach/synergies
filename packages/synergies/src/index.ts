import { enablePatches } from "immer";

export * from "./atom";
export * from "./synergy";
export * from "./provider";
export { createAtom, createSynergy } from "./helpers";
export { Provider as SynergyProvider } from "./provider";

enablePatches();
