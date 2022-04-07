import {
  createAtom,
  MiddlewareProvider,
  Middleware,
  SynergyProvider,
} from "synergies";
import { Button } from "@blueprintjs/core";
import React from "react";
import { action } from "@storybook/addon-actions";
import { StorybookMiddlewareProvider } from "synergies-storybook-middleware";
import { LoggingMiddlewareProvider } from "synergies-logging-middleware";

const countAtom = createAtom(0, "count");
const useIncrease = countAtom.createAction(() => value => {
  value.current++;
});

const CounterButton = () => {
  const increase = useIncrease();
  const [value] = countAtom.useValue();
  return <Button onClick={increase}>Click to increase {value}</Button>;
};

const middleware1: Middleware = next => atoms => {
  action(
    `middleware1 handled actions ${atoms
      .map(({ atom }) => atom.name)
      .join(", ")}`
  )();
  next(atoms);
};

const middleware2: Middleware = next => atoms => {
  const crash = Math.random() > 0.6;
  action(
    `middleware2 handled actions ${atoms
      .map(({ atom }) => atom.name)
      .join(", ")} ${crash ? "and decided to crashed" : "and continued"}`
  )();
  if (crash) {
    throw new Error("middleware2 crashed");
  } else {
    next(atoms);
  }
};

const middleware3: Middleware = next => atoms => {
  action(
    `middleware3 handled actions ${atoms
      .map(({ atom }) => atom.name)
      .join(", ")}`
  )();
  next(atoms);
};

export const MultiMiddlewares = () => (
  <MiddlewareProvider middlewares={[middleware3, middleware2, middleware1]}>
    <SynergyProvider atoms={[countAtom]}>
      <CounterButton />
      <br />
      Demo shows how multiple middlewares can be applied, and they are called in
      sequence. In this example, the second middleware randomly crashes, causing
      the third middleware to be skipped and the action will not further be
      processed.
    </SynergyProvider>
  </MiddlewareProvider>
);

export const LoggingMiddlewareExample = () => (
  <LoggingMiddlewareProvider>
    <SynergyProvider atoms={[countAtom]}>
      <CounterButton />
      See console for the middleware logs.
    </SynergyProvider>
  </LoggingMiddlewareProvider>
);

export const StorybookMiddlewareExample = () => (
  <StorybookMiddlewareProvider>
    <SynergyProvider atoms={[countAtom]}>
      <CounterButton />
      See actions tab for middleware action logs.
    </SynergyProvider>
  </StorybookMiddlewareProvider>
);

export default {
  title: "Middlewares",
};
