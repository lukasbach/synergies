import { useContext } from "react";
import { MiddlewareContext } from "./context";

export const useMiddlewareContext = () => useContext(MiddlewareContext);
