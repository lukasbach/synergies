import React, { FC, useEffect, useState } from "react";
import { Box } from "react-boxx";
import { Atom, MiddlewareProvider, Synergy, SynergyProvider } from "synergies";
import { action } from "@storybook/addon-actions";

export const VisualBox: FC<{ title: string }> = props => (
  <Box
    backgroundColor="black"
    borderRadius="24px"
    padding="8px"
    margin="20px"
    color="white"
  >
    Container: {props.title}
    <br />
    <Box
      backgroundColor="white"
      borderRadius="16px"
      padding="8px"
      color="black"
      marginTop="8px"
    >
      {props.children}
    </Box>
  </Box>
);

export const VisualSynergyProvider: FC<{
  title: string;
  atoms: Synergy[];
}> = props => (
  <VisualBox title={props.title}>
    <SynergyProvider atoms={props.atoms}>{props.children}</SynergyProvider>
  </VisualBox>
);

export const VisualAtomContents: FC<{
  atomName: string;
  atom: Atom;
}> = props => {
  const [value] = props.atom.useValue();
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    setHasUpdated(true);
    setTimeout(() => setHasUpdated(false), 500);
  }, [value]);

  return (
    <VisualBox
      title={`Current content of ${props.atomName}${
        hasUpdated ? " (UPDATED!)" : ""
      }`}
    >
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </VisualBox>
  );
};

export const BooleanAtomSwitch: FC<{
  atomName: string;
  atom: Atom<boolean>;
}> = props => {
  const update = props.atom.createAction((value: boolean) => draft => {
    draft.current = value;
  })();
  return (
    <Box>
      Set Value of {props.atomName} to
      <button onClick={() => update(true)}>true</button> or{" "}
      <button onClick={() => update(false)}>false</button>
    </Box>
  );
};

export const NumberAtomSwitch: FC<{
  atomName: string;
  atom: Atom<number>;
}> = props => {
  const [tmpValue, setTmpValue] = useState(0);
  const update = props.atom.createAction((value: number) => draft => {
    draft.current = value;
  })();
  return (
    <Box>
      Set Value of {props.atomName} to
      <input
        type="number"
        value={tmpValue}
        onChange={e => setTmpValue(parseInt(e.target.value))}
      />
      <button onClick={() => update(tmpValue)}>Change!</button>
    </Box>
  );
};

export const StringAtomSwitch: FC<{
  atomName: string;
  atom: Atom<string>;
}> = props => {
  const [tmpValue, setTmpValue] = useState("value");
  const update = props.atom.createAction((value: string) => draft => {
    draft.current = value;
  })();
  return (
    <Box>
      Set Value of {props.atomName} to
      <input
        type="number"
        value={tmpValue}
        onChange={e => setTmpValue(e.target.value)}
      />
      <button onClick={() => update(tmpValue)}>Change!</button>
    </Box>
  );
};

export const StorybookActionsMiddleware: FC = ({ children }) => (
  <MiddlewareProvider
    middlewares={[
      {
        // onFinishAction:
        //   entityName =>
        //     next =>
        //       (...values) => {
        //     console.log(entityName, next, values);
        //         action(`Action ${entityName ?? "*Unnamed*"} has finished`)();
        //         next(...values);
        //       },
        onTriggerAtoms:
          () =>
            next =>
              (...values) => {
                action(
                  `Atoms ${values.map(atom => atom.name).join(", ")} were triggered`
                )();
                next(...values);
              },
      },
    ]}
  >
    {children}
  </MiddlewareProvider>
);
