import { Middleware, MiddlewareProvider } from "synergies";
import React, { FC, ReactNode } from "react";

export const LoggingMiddleware: Middleware = next => updates => {
  const namedAtoms = updates.filter(({ atom }) => atom.name !== undefined);
  let message = `${updates.length} atoms updated`;

  if (namedAtoms.length > 0) {
    const names = namedAtoms.map(({ atom }) => atom.name).join(", ");
    message += `: ${names}`;

    if (namedAtoms.length < updates.length) {
      const otherCount = updates.length - namedAtoms.length;
      message += `, and ${otherCount} unnamed atoms`;
    }
  }

  console.groupCollapsed(message);
  for (const { atom, value, prev } of updates) {
    console.log(
      `Updated atom ${atom.name ?? `with default value ${atom.defaultValue}`}:`,
      prev,
      "->",
      value
    );
  }
  console.groupEnd();
  next(updates);
};

export const LoggingMiddlewareProvider: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <MiddlewareProvider middlewares={[LoggingMiddleware]}>
    {children}
  </MiddlewareProvider>
);
