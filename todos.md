# Todos

- Support actions with return values
- Add tests to verify that unnecessary rerenders are avoided
- Document recipes for reusable atoms
- Add `createDynamicAtom` or `createDerivedAtom` or `synergy.deriveAtom()`

  e.g. atoms that cannot directly be written to, but derive state from existing synergies
  and update based on custom update logic from the synergy state. Could be used to subscribe
  to an array item of an array kept within an atom, without rerendering everytime some
  random array item changes.
- Use hooks of atoms/synergies directly, like `const action = createAction()`, then `useAction(action)`?
- Provide initial state in providers.
