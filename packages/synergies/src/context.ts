import React from "react";
import { Middleware, ProviderContextValue } from "./types";

export const SynergyContext = React.createContext<ProviderContextValue | null>(
  null
);
export const MiddlewareContext = React.createContext<Middleware[] | null>(null);
