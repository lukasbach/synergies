import { MiddlewareContext } from "./context";
import React, { memo, ReactNode } from "react";
import { Middleware } from "./types";

export interface MiddlewareProviderProps {
  middlewares: Middleware[];
  children?: ReactNode | undefined;
}

export const MiddlewareProvider = memo(
  function MiddlewareProvider(props: MiddlewareProviderProps) {
    return (
      <MiddlewareContext.Provider value={props.middlewares}>
        {props.children}
      </MiddlewareContext.Provider>
    );
  },
  (prev, next) => {
    // ignore changes in the middlewares array. Middlewares should be passed statically.
    return prev.children === next.children;
  }
);
