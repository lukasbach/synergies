import {
  createAtom,
  MiddlewareProvider,
  Middleware,
  SynergyProvider,
} from "synergies";
import { Button, Checkbox, ControlGroup, InputGroup } from "@blueprintjs/core";
import React from "react";
import { action } from "@storybook/addon-actions";

const countAtom = createAtom(0, "count");
const useIncrease = countAtom.createAction(
  () => value => {
    value.current++;
  },
  "increase"
);

const CounterButton = () => {
  const increase = useIncrease();
  const [value] = countAtom.useValue();
  return <Button onClick={increase}>Click to increase {value}</Button>;
};

const middleware1: Middleware = {
  onFinishAction:
    entityName =>
      next =>
        (...values) => {
          action(`middleware1 finished action ${entityName}`)();
          next(...values);
        },
};

const middleware2: Middleware = {
  onFinishAction:
    entityName =>
      next =>
        (...values) => {
          const crash = Math.random() > 0.6;
          action(
            `middleware2 finished action ${entityName} ${
              crash ? "and decided to crashed" : "and continued"
            }`
          )();
          if (crash) {
            throw new Error("middleware2 crashed");
          } else {
            next(...values);
          }
        },
};

const middleware3: Middleware = {
  onFinishAction:
    entityName =>
      next =>
        (...values) => {
          action(`middleware3 finished action ${entityName}`)();
          next(...values);
        },
};

export const Example = () => (
  <MiddlewareProvider middlewares={[middleware3, middleware2, middleware1]}>
    <SynergyProvider atoms={[countAtom]}>
      <CounterButton />
      <br />
      Demo shows how multiple middlewars can be applied, and they are called in
      sequence. In this example, the second middleware randomly crashes, causing
      the third middleware to be skipped and the action will not further be
      processed.
    </SynergyProvider>
  </MiddlewareProvider>
);

export default {
  title: "Multiple Middlewares",
};
