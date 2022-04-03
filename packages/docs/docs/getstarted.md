---
sidebar_position: 1
---

# Get Started

To start, you will need to install it and `immer` to your React project.

```bash
$ yarn add synergies immer
```

You can then import the `Synergies` package and start using it:

```typescript
import { createAtom, createSynergy, SynergyProvider } from "synergies";
```

## Basic Usage

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
