import React from "react";
import { createAtom, createSynergy, SynergyProvider } from "synergies";
import { StorybookMiddlewareProvider } from "synergies-storybook-middleware";
import { Button } from "@blueprintjs/core";

const isLoadingAtom = createAtom(false, "isLoading");
const dataAtom = createAtom<{
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  name: string;
  height: number;
} | null>(null, "data");

const useFetchData = createSynergy(dataAtom, isLoadingAtom).createAction(
  () => async (data, isLoading) => {
    isLoading.current = true;
    isLoading = isLoading.trigger();
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    await new Promise(r => setTimeout(r, 2000)); // simulate a long request
    data.current = await res.json();
    isLoading.current = false;
  }
);

const useReset = dataAtom.createAction(() => data => {
  data.current = null;
});

const usePokemonData = createSynergy(dataAtom, isLoadingAtom).createSelector(
  (data, isLoading) => ({ data, isLoading })
);

export const Example = () => {
  const { data, isLoading } = usePokemonData();
  const fetchData = useFetchData();
  const resetData = useReset();
  return !data && !isLoading ? (
    <Button onClick={fetchData}>Load Pokemon</Button>
  ) : isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {data.name} has a height of {data.height} and the abilities{" "}
      {data.abilities.map(({ ability }) => ability.name).join(", ")}
      <Button onClick={resetData}>Reset</Button>
    </div>
  );
};

export default {
  title: "Async Server Calls",
  decorators: [
    Story => (
      <StorybookMiddlewareProvider>
        <SynergyProvider atoms={[isLoadingAtom, dataAtom]}>
          <Story />
        </SynergyProvider>
      </StorybookMiddlewareProvider>
    ),
  ],
};
