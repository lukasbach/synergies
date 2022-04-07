import { Middleware, MiddlewareProvider } from "synergies";

import { action } from "@storybook/addon-actions";
import React, { FC, ReactNode } from "react";

export const StorybookMiddleware: Middleware = next => updates => {
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

  action(message)(updates);
  next(updates);
};

export const StorybookMiddlewareProvider: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <MiddlewareProvider middlewares={[StorybookMiddleware]}>
    {children}
  </MiddlewareProvider>
);
