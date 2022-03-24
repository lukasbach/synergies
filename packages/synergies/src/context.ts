import React from "react";
import { ProviderContextValue } from "./types";

export const Context = React.createContext<ProviderContextValue | null>(null);
