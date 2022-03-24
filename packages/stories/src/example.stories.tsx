import React from "react";
import {
  BooleanAtomSwitch,
  NumberAtomSwitch,
  VisualAtomContents,
  VisualBox,
  VisualSynergyProvider,
} from "./helpers";
import { createAtom } from "synergies";

export default {
  title: "Example",
};

const numberAtom = createAtom(42, "numberAtom");
const stringAtom = createAtom("Hello", "stringAtom");
const booleanAtom1 = createAtom(true, "booleanAtom1");
const booleanAtom2 = createAtom(true, "booleanAtom2");

export const NestedExample = () => (
  <div>
    <VisualSynergyProvider
      title="Provides number and string atoms"
      atoms={[numberAtom, stringAtom]}
    >
      <VisualAtomContents atomName="numberAtom" atom={numberAtom} />
      <VisualAtomContents atomName="stringAtom" atom={stringAtom} />
      <NumberAtomSwitch atomName="numberAtom" atom={numberAtom} />
      <VisualSynergyProvider
        title="Provides number and boolean1 atoms"
        atoms={[numberAtom, booleanAtom1]}
      >
        <VisualAtomContents atomName="numberAtom" atom={numberAtom} />
        <VisualAtomContents atomName="stringAtom" atom={stringAtom} />
        <VisualAtomContents atomName="booleanAtom1" atom={booleanAtom1} />
        <NumberAtomSwitch atomName="numberAtom" atom={numberAtom} />
        <VisualSynergyProvider
          title="Provides boolean2 atom"
          atoms={[booleanAtom2]}
        >
          <VisualAtomContents atomName="numberAtom" atom={numberAtom} />
          <VisualAtomContents atomName="stringAtom" atom={stringAtom} />
          <VisualAtomContents atomName="booleanAtom1" atom={booleanAtom1} />
          <VisualAtomContents atomName="booleanAtom2" atom={booleanAtom2} />
          <BooleanAtomSwitch atomName="booleanAtom1" atom={booleanAtom1} />
          <BooleanAtomSwitch atomName="booleanAtom2" atom={booleanAtom2} />
          <NumberAtomSwitch atomName="numberAtom" atom={numberAtom} />
        </VisualSynergyProvider>
      </VisualSynergyProvider>
    </VisualSynergyProvider>
  </div>
);

export const NormalExample = () => (
  <div>
    <VisualSynergyProvider
      title="Provides all atoms"
      atoms={[numberAtom, booleanAtom1, stringAtom, booleanAtom2]}
    >
      <VisualAtomContents atomName="numberAtom" atom={numberAtom} />
      <VisualAtomContents atomName="stringAtom" atom={stringAtom} />
      <NumberAtomSwitch atomName="numberAtom" atom={numberAtom} />
      <VisualAtomContents atomName="numberAtom" atom={numberAtom} />
      <VisualAtomContents atomName="stringAtom" atom={stringAtom} />
      <VisualAtomContents atomName="booleanAtom1" atom={booleanAtom1} />
      <NumberAtomSwitch atomName="numberAtom" atom={numberAtom} />
      <VisualAtomContents atomName="numberAtom" atom={numberAtom} />
      <VisualAtomContents atomName="stringAtom" atom={stringAtom} />
      <VisualAtomContents atomName="booleanAtom1" atom={booleanAtom1} />
      <VisualAtomContents atomName="booleanAtom2" atom={booleanAtom2} />
      <BooleanAtomSwitch atomName="booleanAtom1" atom={booleanAtom1} />
      <BooleanAtomSwitch atomName="booleanAtom2" atom={booleanAtom2} />
      <NumberAtomSwitch atomName="numberAtom" atom={numberAtom} />
    </VisualSynergyProvider>
  </div>
);
