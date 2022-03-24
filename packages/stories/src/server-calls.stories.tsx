import React from "react";
import { createAtom, createSynergy, SynergyProvider } from "synergies";
import { Button } from "@blueprintjs/core";

const isLoadingAtom = createAtom(false);
const dataAtom = createAtom<{
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  name: string;
  height: number;
} | null>(null);

const useFetchData = createSynergy(dataAtom, isLoadingAtom).createAction(
  () => async (data, isLoading) => {
    isLoading.current = true;
    isLoading.trigger();
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    data.current = await res.json();
    isLoading.current = false;
  }
);

const usePokemonData = createSynergy(dataAtom, isLoadingAtom).createSelector(
  (data, isLoading) => ({ data, isLoading })
);

export const Example = () => {
  const { data, isLoading } = usePokemonData();
  const fetchData = useFetchData();
  return !data ? (
    <Button onClick={fetchData}>Load Pokemon</Button>
  ) : isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {data.name} has a height of {data.height} and the abilities{" "}
      {data.abilities.map(({ ability }) => ability.name).join(", ")}
    </div>
  );
};

export default {
  title: "Async Server Calls",
  decorators: [
    Story => (
      <SynergyProvider atoms={[isLoadingAtom, dataAtom]}>
        <Story />
      </SynergyProvider>
    ),
  ],
};
