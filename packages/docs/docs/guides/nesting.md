---
sidebar_position: 3
---

# Nested Providers

As mentioned in [the section about basic concepts](docs/guides/basic-concepts), one important
feature of synergies is the ability to have multiple state providers, and nest them based on
the hierarchical structure of your app.

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

In this example, there are two nested providers, the upper one provides the atoms `todosAtom` and
`tickedTodosAtom`, and the lower one provides the atom `inputAtom`. The component `<TodoInput />`
and everything else within the lower provider has access to all three atoms, whereas components
that are in the upper provder, but not the lower one, such as `<TodoList />`, will only have access
to the atoms `todosAtom` and `tickedTodosAtom`.

Consider the following actions derived from certain synergies:

```typescript jsx
const useAddTodo = createSynergy(todosAtom, inputAtom)
  .createAction(() => (todos, input) => {
    todos.current.push(input.current);
    input.current = "";
  });
```

The hook `useAddTodo` will be able to be called within the `<TodoInput />` component and everything
else in the lower provider, because it has all atoms available. It doesn't matter that the atoms
it synergizes, `todosAtom` and `inputAtom`, are in different providers, it suffices that they are in
the same React subtree. However, the hook will not be able to be called in `<TodoList />`, since
it doesn't have access to the atom `inputAtom`.

One benefit of that is that you get to keep your global state clean. You can still provide global
state at the top of your component hierarchy, like user information or authentication details,
but get to keep more localized state in the lower providers. Furthermore, it allows you to reuse
local state information in multiple places, as long as are mounted in disjunct subtrees.


## Reuse of Local State

A common use case for reusing local state in React context is to store information of small contained
component compositions, which serve a very specific purpose, but still are composed of several components.
This allows the consumer of the components to still mount them with more control over how they are organized.

```typescript jsx
<SynergyProvider atoms={[authAtom, userDataAtom]}>
  // highlight-next-line
  <SynergyProvider atoms={[selectedItemAtom, isExpandedAtom]}>
    <MenuImplementation name="File" />
  </SynergyProvider>

  // highlight-next-line
  <SynergyProvider atoms={[selectedItemAtom, isExpandedAtom]}>
    <MenuImplementation name="Edit" />
  </SynergyProvider>
</SynergyProvider>
```

[chakra-ui](https://chakra-ui.com/) is a good example for this pattern, since they use it a lot in their
components. Consider a menu component similar to [chakra-ui's implementation](https://chakra-ui.com/docs/components/overlay/menu#usage):

```typescript jsx
<Menu>
  <MenuButton>
    Menu Button
  </MenuButton>
  <MenuList>
    <MenuItem>Download</MenuItem>
    <MenuItem>Create a Copy</MenuItem>
    <hr />
    <MenuItem>Mark as Draft</MenuItem>
  </MenuList>
</Menu>
```

In this case, you can define state information in the menu container component, that will
be provided through React context to child components within that container. Here, synergies
can be used to easily define this localized state that will be used only in that component,
without interfering with other menu instances within the same page.

```typescript jsx
const isOpenAtom = createAtom(false);
const focusedItemAtom = createAtom(-1);
const buttonRefAtom = createAtom(null);
```

```typescript jsx
const Menu = ({ children }) => (
  <SynergyProvider atoms={[isOpenAtom, focusedItemAtom, buttonRefAtom]}>
    {children}
  </SynergyProvider>
);
```

That is all you need to do to define your context state and pass it to children. The usual
boilerplate stuff like defining the context, defining custom context hooks, defining a custom
context provider and memoizing the context state is all done for you. And even then performance
will be better than with native contexts since synergies still optimizes state updates in cases
of multiple atoms. 

Then, create action and selector hooks to interact with the context state, and use the state
in the child components.

```typescript jsx
const MenuButton = ({ children }) => {
  const setRef = buttonRefAtom.useSet();
  const setIsOpen = isOpenAtom.useSet();
  const [isOpen] = isOpenAtom.useValue();
  
  return (
    <Button
      pressed={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      ref={setRef}
    >
      {children}
    </Button>
  )
}
```
