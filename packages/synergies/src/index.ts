import { enablePatches } from "immer";

export * from "./atom";
export * from "./synergy";
export * from "./provider";
export { Provider as SynergyProvider } from "./provider";

enablePatches();
