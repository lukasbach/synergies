import { enablePatches } from "immer";

export * from "./atom";
export * from "./synergy";
export * from "./provider";
export * from "./middleware-provider";
export * from "./types";
export { createAtom, createSynergy } from "./helpers";
export { Provider as SynergyProvider } from "./provider";

enablePatches();
