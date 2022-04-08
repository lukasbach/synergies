# Synergies

> Create a performant distributed context state for React and compose reusable state logic.

![Testing](https://github.com/lukasbach/synergies/workflows/Testing/badge.svg)
![Pretty](https://github.com/lukasbach/synergies/workflows/Pretty/badge.svg)
![Storybook Deployment](https://github.com/lukasbach/synergies/workflows/Storybook%20Deployment/badge.svg)
![NPM Version](https://badgen.net/npm/v/synergies)
![NPM Typings](https://badgen.net/npm/types/synergies)
![Minzipped size](https://badgen.net/bundlephobia/minzip/synergies)
![Treeshaking Report](https://badgen.net/bundlephobia/tree-shaking/synergies)
![Packagephobia Report](https://badgen.net/packagephobia/install/synergies)

Find out more at [synergies.js.org](https://synergies.js.org/)!

`synergies` is a tiny (~3kB), yet powerful state management library for React. It allows you to
specify small state atoms, that you can combine into Synergies of multiple atoms that define shared state logic. 
Features include

- __Distributed state__: You can inject individual atoms at multiple arbitrary points in your component hierarchy.
  This allows you to both define unique global state logic in your application root, and smaller reusable components 
  that have their own context-based state. Your state logic can not only read and write to the atoms
  provided by the closest provider, but to all atoms provided upwards in the component hierarchy.
- __Immutable update logic__: `synergies` uses `immer` to provide drafts of your state in your update handlers,
  so you can more easily update state.
- __Performant update-triggers__: Even though a synergy provider can provide several atoms and can access any atoms
  from other providers upwards the hierarchy, calling update logic will only trigger updates on components
  that read from atoms that were actually changed. Again `immer` is used to let you update drafts of your state,
  and smartly detects which atoms were actually changed and which ones were only read from during the update.
- __Asynchronous update logic__: No more thunk plugins! Update handlers can be asynchronous, and you can even 
  manually trigger updates on certain atoms while still being in the middle of the update handler.
- __Reusable state logic__: Since you can provide atom state rather low down in the hierarchy, you can reuse small
  pieces of state between components, while still maintaining more global parts of your app state farther up
  in the component hierarchy.
- __Typed__: Full type safety for everything.
- __Tiny package__: 3kB + immer. Use it for your global app state, or just replace small context providers with
  `synergies` to simplify your codebase and speed up your state.

[![Product Hunt](https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=339769&theme=light)](https://www.producthunt.com/posts/synergies?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-synergies)

## Usage

Get started by installing the library:

```bash
yarn add synergies immer
```

Create your first state atoms:

```typescript jsx
const valueAtom = createAtom("");
const isInitialStateAtom = createAtom(true);
```

Synergyze your atoms to create React Hooks:

```typescript jsx
const useSetValue = createSynergy(valueAtom, isInitialStateAtom).createAction(
  (newValue: string) => (valueDraft, isInitialStateDraft) => {
    // Components that read from the value atom will be updated.
    valueDraft.current = newValue;
    
    if (isInitialStateDraft.current) {
      // If isInitialState is already false, then the draft will not be updated,
      // and components that read from it will not trigger a rerender.
      isInitialStateDraft.current = false;
    }
  }
);

// Every atom is also a synergy of itself, so we can call `createSelector` also on atoms.
const useValue = valueAtom.createSelector(value => value);
const useIsInitialState = isInitialStateAtom.useValue; // shortcut for directly reading atom state
```

Provide your atoms:

```typescript jsx
<SynergyProvider atoms={[valueAtom, isInitialStateAtom]}>
  {/* Components that consume value and isInitialState... */}

  {/* We can also nest other synergy providers */}
  <SynergyProvider atoms={[moreLocalizedAtom]}>
    {/* Can read from and write to all three atoms. */}
  </SynergyProvider>
  
  {/* Reuse providers with more localized state */}
  <SynergyProvider atoms={[moreLocalizedAtom]}>
    {/* ... */}
  </SynergyProvider>
</SynergyProvider>
```

Use your hooks:

```typescript jsx
const Component = () => {
  const setValue = useSetValue();
  const value = useValue();
  return (
    <input 
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}
```

You can find more examples and details at [synergies.js.org](https://synergies.js.org/)!

## More advanced examples

### Async update logic

`synergies` supports asynchronous update actions. You can also trigger atoms 
in the middle of an update handler, so that their subscribers get rerendered before
the action has completed.

This is shown in the following example, where an API fetch call is dispatched in a 
action handler. The `isLoading` atom is updated to true immediately when the fetch
is dispatched, while the update call continues to load the data from the server.
Components reading the `isLoading` atom will be rerendered immediately. Once the data
has loaded, we update the `data` atom with the fetched result, and update the `isLoading`
atom is updated to false, triggering rerenders of all components that read from either
the `data` or the `isLoading` atom.

Note that, if the `isLoading` atom would not rerender a second time at the end, only
components subscribing to the `data` atom would be rerendered.

```typescript jsx
const isLoadingAtom = createAtom(false);
const dataAtom = createAtom(null);

// Async update handler
const useFetchData = createSynergy(dataAtom, isLoadingAtom).createAction(
  () => async (data, isLoading) => {
    isLoading.current = true;
    
    // Trigger rerenders of all components that read from the `isLoading` atom.
    // The `isLoading` draft will be discarded, so we need to use the new one
    // that the `trigger` method returns.
    isLoading = isLoading.trigger();
    
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
    
    // Update the `data` and `isLoading` atoms
    data.current = await res.json();
    isLoading.current = false;
  }
);

// For simplicity, read from both atoms at once
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
    </div>
  );
};
```

### Nested synergy providers

```typescript jsx
// ---------------------
// Atoms
// ---------------------
const filterAtom = createAtom(false);
const itemsAtom = createAtom([
  { todo: "First Todo", checked: true },
  { todo: "Second Todo", checked: false },
  { todo: "Third Todo", checked: false },
]);
const inputValueAtom = createAtom("");

// ---------------------
// Selectors and state actions
// ---------------------
const useFilteredItems = createSynergy(itemsAtom, filterAtom).createSelector(
  (items, filter) => items.filter(({ checked }) => !filter || checked)
);

const useAddTodo = createSynergy(itemsAtom, inputValueAtom).createAction(
  () => (items, input) => {
    items.current.push({ todo: input.current, checked: false });
    input.current = "";
  }
);

const useToggleTodo = itemsAtom.createAction((id: number) => items => {
  items.current[id].checked = !items.current[id].checked;
});

const useToggleFilter = filterAtom.createAction(() => filter => {
  filter.current = !filter.current;
});

// ---------------------
// Components that use the hooks
// ---------------------
const List = () => {
  const items = useFilteredItems();
  const toggle = useToggleTodo();

  return (
    <>
      {items.map((item, index) => (
        <Checkbox
          key={index}
          checked={item.checked}
          label={item.todo}
          onChange={() => toggle(index)}
        />
      ))}
    </>
  );
};

const TodoInput = () => {
  const [value] = inputValueAtom.useValue();
  const setValue = inputValueAtom.useSet();
  const addTodo = useAddTodo();

  return (
    <ControlGroup>
      <InputGroup
        placeholder="Add a todo"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button onClick={addTodo}>Add</Button>
    </ControlGroup>
  );
};

const FilterButton = () => {
  const toggle = useToggleFilter();
  const [isToggled] = filterAtom.useValue();
  return (
    <Button onClick={toggle} active={isToggled}>
      Only show completed todos
    </Button>
  );
};

// ---------------------
// App container
// ---------------------
export const App = () => (
  // We don't have to nest the providers so extremely, but this demonstrates how you can inject
  // atoms at any place in the hierarchy and they can still communicate upwards with other
  // atoms.
  <SynergyProvider atoms={[filterAtom]}>
    <FilterButton />
    <SynergyProvider atoms={[itemsAtom]}>
      <List />
      <SynergyProvider atoms={[inputValueAtom]}>
        <TodoInput />
      </SynergyProvider>
    </SynergyProvider>
  </SynergyProvider>
);
```

## Maintenance

When developing locally, run in the root directory...

- `yarn` to install dependencies
- `yarn test` to run tests in all packages
- `yarn build` to build distributables and typings in `packages/{package}/out`
- `yarn storybook` to run a local storybook server
- `yarn build-storybook` to build the storybook
- [`npx lerna version`](https://github.com/lerna/lerna/tree/main/commands/version#readme) to interactively bump the
  packages versions. This automatically commits the version, tags the commit and pushes to git remote.
- [`npx lerna publish`](https://github.com/lerna/lerna/tree/main/commands/publish#readme) to publish all packages
  to NPM that have changed since the last release. This automatically bumps the versions interactively.
