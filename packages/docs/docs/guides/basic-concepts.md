---
sidebar_position: 1
---

# Basic Concepts

The following will explain the basic concepts of synergies and how they are used.

## Atoms

An atom is an abstract unit of data. It defines a kind of data, and can be used 
at one or several different points in your application to store different values of the same type
of data.

One example for a reusable state atom is an `isExpandedAtom` that stores whether a popover
menu is expanded or not. This atom can be used for arbitrarily many different menus to determine
whether the respective menu is expanded or not. All instances of this atom will store the same kind
of data, but can still have differing values between each other. For the atom to be used at different
points in your application, it needs to be provided in disjunctive subtrees within your React component tree.

State atoms don't need to focus on reusability. You can also define atoms that are meant for storing
global information, such as authentication data or user information. You will need to provide those
atoms at the top of your component tree to make sure they are available everywhere.

To create atoms, you can use the `createAtom` utility with an initial value and an optional name that is
used for debugging.

```typescript jsx
const valueAtom = createAtom("Initial Value");
const todosAtom = createAtom([], "todos"); // second parameter is an optional name
```

## Synergies

When interacting with state, you typically do not use single atoms at once. You usually specify
how multiple atoms work together, and you can do so by creating a synergy of them and acting on
the synergy instead of the atom.

You can create a new synergy of atoms by using the `createSynergy` utility.

```typescript jsx
const synergy = createSynergy(valueAtom, todosAtom);
```

You can synergyze as many atoms as you want. When synergyzing atoms, the order in which the atoms
are passed is important: When you use the synergy to define actions or selectors, those will receive
the state of the atoms in the same order as specified when creating the synergy.

One important thing to note is that synergies themselves are stateless; You do not need to create them
once and define your interaction logic on one and the same synergy. You can create new synergies on the
fly, and choose differing combinations of atoms for each of them.

```typescript jsx
// Works, but not necessary
const synergy = createSynergy(valueAtom, todosAtom);
const useAddTodo = synergy.createAction(...);
const useClearInput = synergy.createAction(...);

// Create synergies on the fly, always use the atoms you really need
const useAddTodo = createSynergy(valueAtom, todosAtom).createAction(...);
const useClearInput = createSynergy(valueAtom, focusAtom).createAction(...);
const useFetchTodos = createSynergy(todosAtom, bearerTokenAtom).createAction(...);
```

You might have seen that atoms and synergies share a lot of methods. This is because every atom
is also a synergy of itself. This means you can directly create interactions on an atom if you don't
need the interaction to depend on the state of other atoms, instead of creating a new synergy.

```typescript jsx
const useCurrentValue = createSynergy(valueAtom).createSelector(...);
// is the same as
const useCurrentValue = valueAtom.createSelector(...);
```

## Selectors

To read data from state, define a selector on a synergy of atoms, and use the created React hook
in your component to read the current value of the selector.

```typescript jsx
const useFilteredTodos = createSynergy(searchAtom, todosAtom)
  .createSelector((search, todos) => 
    todos.filter(todo => todo.includes(search))
  );
```

You can now use the `useFilteredTodos` hook in any component to read the current value of the
selector result. Whenever any atom, that is part of the synergy on which the selector was created
on, is updated, the hook will be re-rendered with the new value of the selector.

If you just want to read the value of a single atom without any selector logic, you can also use
`searchAtom.useValue()` as React hook to directly subscribe to a single atoms state value.

## Actions

To update state, define an action on a synergy of atoms, and use the created React hook
in your component to get an action handler that dispatches the action. The basic gist is
similar to selectors, with some very important differences:

- Actions can require arguments to be called which are used in their implementation. 
  Selectors always statically return state.
- Selectors directly return a reference for each atom. Actions return an immutable draft for
  every atom state, that can be directly modified or read.
- Selectors are synchronous hooks that directly return the value. Actions can be asynchronous
  handlers that can be called and waited on.
- Synergies always rerender whenever any of the atoms in the synergy changes. Actions only
  trigger rerenders for atoms that they actually change.

For now, we will focus on synchronous actions. How asynchronous actions work will be detailed
in [the section about asynchronous handlers](async).

The final bullet point is particularly important for performance: Since action handlers use
drafts of each atom state, they will detect which atoms are changed and which are not. If an 
action uses one atom only to read its value, but do not modify it, this atom will not be updated
and components reading from it will not be re-rendered. This is important to avoid unnecessary
re-renders.

```typescript jsx
const useTickTodo = createSynergy(todosAtom, tickedTodosAtom)
  .createAction(index => (todos, tickedTodos) => {
    // tickedTodosAtom was updated and will trigger a re-render
    // todosAtom was only read from and will not trigger a re-render
    tickedTodos.current.push(todos[index]);
  });
```

You can then use the hook to get an action handler that dispatches the action.

```typescript jsx
const Todo = ({ value, index }) => {
  // highlight-next-line
  const tick = useTickTodo();
  return (
    <TodoItem onClick={() => tick(index)}>
      { value }
    </TodoItem>
  )
}
```

## Providers and Provider Nesting

The state of atoms is stored in React Context, which is supplied by Synergy Providers.
Mount a provider in your component tree, to make a number of atoms available in any components
within its subtree.

```typescript jsx
<SynergyProvider atoms={[todosAtom, tickedTodosAtom, inputAtom]}>
  <TodoList />
  <TodoInput />
</SynergyProvider>
```

If the list becomes too long, you can also combine atoms into synergies beforehand
and pass in synergies instead of atoms:

```typescript jsx
const todosSynergy = createSynergy(todosAtom, tickedTodosAtom, inputAtom);

<SynergyProvider atoms={[todosSynergy]}>
  <TodoList />
  <TodoInput />
</SynergyProvider>
```

You can mount as many synergy providers as you want. Each provider will pass through
state of atoms of other providers further up the component hierarchy. When you create
a synergy, it doesn't have to exclusively use atoms from the same provider. You can
mix and match atoms from different providers, as long as they are all available in the
component where the action or selector hooks are used.

```typescript jsx
// highlight-next-line
<SynergyProvider atoms={[todosAtom, tickedTodosAtom]}>
  {/* Can use only todosAtom and tickedTodosAtom */}
  <TodoList />
  // highlight-next-line
  <SynergyProvider atoms={[inputAtom]}>
    {/* Can use all three atoms */}
    <TodoInput />
  </SynergyProvider>
</SynergyProvider>
```

More details on nested providers and localized state reuse is given
in [the section about nested providers](nesting).
