---
sidebar_position: 2
---

# Asynchronous handlers

In most situations, you will have actions that run synchronously and directly update
changed atoms. However, you can also have actions that run asynchronously and which
depend on other delayed logic before changed atoms are updated. If you just need to
run asynchronous logic and update all atoms at the end, this is as easy as adding
the `async` keyword to the action handler.

```typescript jsx
const useFetchUser = createSynergy(userDataAtom, bearerTokenAtom)
  .createAction(() => async (userData, bearerToken) => {
    const user = await fetchUser(bearerToken.current);
    userData.current = user;
  });
```

However, there are situations in which you want to update certain updates before the
complete action has completed. You might be familiar with Hunks in Redux, which introduced
a similar concept. There, you could dispatch other synchronous actions while handling one
asynchronous hunk action, to update pieces of the state early before the handler has completed.

In synergies, this is done differently: Because you don't just return updated atom states at
the end of the action, but rather update pieces of each atom state by writing to the draft state,
the state of the draft will change between lines. You can now trigger an update to any of the atoms
within the synergy to flush any changes made to the draft so far to subscribing components, even
before completing the action. The handler will then continue to complete the remaining action, and
flush remaining atom changes at the end.

```typescript jsx
const useFetchUser = createSynergy(userDataAtom, bearerTokenAtom, isLoadingAtom)
  .createAction(() => async (userData, bearerToken, isLoading) => {
    isLoading.current = true;
    // highlight-next-line
    isLoading = isLoading.trigger();
    const user = await fetchUser(bearerToken.current);
    userData.current = user;
    isLoading.current = false;
  });
```

In this example, components subscribing to the `isLoading` atom will be updated at the beginning, and
again alongside components subscribing to the `userData` atom at the end. Note that, flushing an atom
state will also reset its change state, so if it is not changed again, it will not trigger a re-render
at the end again.

```typescript jsx
const useFetchUser = createSynergy(userDataAtom, isInitialRunAtom)
  .createAction(() => async (userData, bearerToken, isInitialRun) => {
    if (isInitialRun.current) return;

    isInitialRun.current = true;
    // highlight-next-line
    isInitialRun = isInitialRun.trigger(); // updates isInitialRunAtom
    
    const user = await fetchUser();
    userData.current = user;
    // highlight-next-line
    // Will update userDataAtom, but not isInitialRunAtom; That was updated earlier.
  });
```

:::caution

Always remember to reassign atom drafts to the return value of the `trigger()` function.
Flushing an atom state will complete the draft, and it will not be able to be written to
again, so you need to use the fresh draft copy of the atom state returned by `trigger()`
to update it again.

:::
