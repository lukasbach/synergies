import {
  createAtom,
  SynergyProvider,
  createSynergy,
  Middleware,
  MiddlewareProvider,
} from ".";
import {
  renderHook,
  act,
  WrapperComponent,
  RenderHookResult,
} from "@testing-library/react-hooks";
import React, { useEffect, useRef } from "react";
import { NO_UPDATE } from "./helpers";

describe("synergies", () => {
  const atomA = createAtom(1, "a");
  const atomB = createAtom(2, "b");
  const atomC = createAtom(3, "c");
  const parentAtomA = createAtom(10, "parentA");
  const parentAtomB = createAtom(20, "parentB");

  const defaultWrapper: WrapperComponent<any> = ({ children }) => (
    <SynergyProvider atoms={[parentAtomA, parentAtomB]}>
      <SynergyProvider atoms={[atomA, atomB, atomC]}>
        {children}
      </SynergyProvider>
    </SynergyProvider>
  );

  const wrapperWithInitialState: WrapperComponent<any> = ({ children }) => (
    <SynergyProvider atoms={[parentAtomA, parentAtomB]}>
      <SynergyProvider
        atoms={[atomA, atomB, atomC]}
        initialValue={{
          ...atomA.createInitialValue(42),
          ...atomB.createInitialValue(1337),
          ...atomC.createInitialValue(666),
        }}
      >
        {children}
      </SynergyProvider>
    </SynergyProvider>
  );

  const middlewareWrapper =
    (middlewares: Middleware[]) =>
    // eslint-disable-next-line react/display-name
    ({ children }) =>
      (
        <MiddlewareProvider middlewares={middlewares}>
          <SynergyProvider atoms={[parentAtomA, parentAtomB]}>
            <SynergyProvider atoms={[atomA, atomB, atomC]}>
              {children}
            </SynergyProvider>
          </SynergyProvider>
        </MiddlewareProvider>
      );

  type RenderHooksResult<T extends Record<string, any>> = RenderHookResult<
    any,
    T & Record<`${keyof T & string}UpdateCount`, { current: number }>,
    any
  >;

  const renderHooks = <T extends Record<string, any>>(
    hooks: {
      [K in keyof T]: () => T[K];
    },
    wrapper = defaultWrapper
  ) => {
    // TODO additionally render a useEffect hook with the result as dependency, to check for unnecessary rerenders
    return renderHook(
      () => {
        return Object.entries(hooks).reduce((acc, [key, hook]) => {
          const result = hook();
          const updateCount = useRef(-1);
          useEffect(() => {
            updateCount.current++;
          }, [result]);
          return {
            ...acc,
            [key]: result,
            [`${key}UpdateCount`]: updateCount,
          };
        }, {});
      },
      { wrapper }
    ) as RenderHooksResult<T>;
  };

  const expectSelectors = <T extends Record<string, any>>(
    result: Partial<RenderHooksResult<T>["result"]["current"]>,
    checkMap: Partial<{
      [K in keyof T]: [expectedValue: T[K], expectedUpdateCount?: number];
    }>
  ) => {
    for (const [key, check] of Object.entries(checkMap)) {
      const [expectedValue, expectedUpdateCount] = check;
      expect(result[key]).toEqual(expectedValue);
      if (expectedUpdateCount !== undefined) {
        expect(result[`${key}UpdateCount`].current).toEqual(
          expectedUpdateCount
        );
      }
    }
  };

  describe("basic logic", () => {
    it("updates subscribers on atom updates", async () => {
      const { result, waitForNextUpdate } = renderHooks({
        action: () =>
          atomA.createAction(() => a => {
            a.current = a.current + 1;
          })(),
        selector: () => atomA.createSelector(a => a)(),
      });

      expect(result.current.selector).toBe(1);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selector).toBe(2);
    });

    it("handles updates on synergies of multiple atoms", async () => {
      const { result, waitForNextUpdate } = renderHooks({
        action: () =>
          createSynergy(atomA, atomB, atomC).createAction(() => (a, b, c) => {
            a.current += 1;
            b.current += 2;
            c.current += 3;
          })(),
        selectorA: () => atomA.createSelector(a => a)(),
        selectorB: () => atomB.createSelector(a => a)(),
        selectorC: () => atomC.createSelector(a => a)(),
      });

      expectSelectors(result.current, {
        selectorA: [1, 0],
        selectorB: [2, 0],
        selectorC: [3, 0],
      });

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();

      expectSelectors(result.current, {
        selectorA: [2, 1],
        selectorB: [4, 1],
        selectorC: [6, 1],
      });
    });

    it("updates only written atoms", async () => {
      const { result, waitForNextUpdate } = renderHooks({
        action: () =>
          createSynergy(atomA, atomB, atomC).createAction(() => (a, b, c) => {
            a.current += a.current + b.current + c.current;
          })(),
        selectorA: () => atomA.createSelector(a => a)(),
        selectorB: () => atomB.createSelector(a => a)(),
        selectorC: () => atomC.createSelector(a => a)(),
      });

      expectSelectors(result.current, {
        selectorA: [1, 0],
        selectorB: [2, 0],
        selectorC: [3, 0],
      });

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expectSelectors(result.current, {
        selectorA: [7, 1],
        selectorB: [2, 0],
        selectorC: [3, 0],
      });
    });

    it("should handle selectors targeting multiple atoms", async () => {
      const { result, waitForNextUpdate } = renderHooks({
        action: () =>
          atomA.createAction(() => a => {
            a.current += 42;
          })(),
        selector: () =>
          createSynergy(atomA, atomB).createSelector((a, b) => [a, b])(),
      });

      expect(result.current.selector).toStrictEqual([1, 2]);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selector).toStrictEqual([43, 2]);
      expect(result.current.selectorUpdateCount.current).toEqual(1);
    });

    it("should handle actions with parameter", async () => {
      const { result, waitForNextUpdate } = renderHooks({
        action: () =>
          atomA.createAction((newValue: number) => a => {
            a.current = newValue;
          })(),
        selector: () => createSynergy(atomA).createSelector(a => a)(),
      });

      expect(result.current.selector).toBe(1);

      act(() => {
        result.current.action(42);
      });

      await waitForNextUpdate();
      expect(result.current.selector).toBe(42);
      expect(result.current.selectorUpdateCount.current).toEqual(1);
    });

    it("should handle providers with initial value", async () => {
      const { result, waitForNextUpdate } = renderHooks(
        {
          action: () =>
            atomA.createAction((newValue: number) => a => {
              a.current = newValue;
            })(),
          selectorA: () => createSynergy(atomA).createSelector(a => a)(),
          selectorB: () => createSynergy(atomB).createSelector(a => a)(),
          selectorC: () => createSynergy(atomC).createSelector(a => a)(),
        },
        wrapperWithInitialState
      );

      expectSelectors(result.current, {
        selectorA: [42, 0],
        selectorB: [1337, 0],
        selectorC: [666, 0],
      });

      act(() => {
        result.current.action(1);
      });

      await waitForNextUpdate();

      expectSelectors(result.current, {
        selectorA: [1, 1],
        selectorB: [1337, 0],
        selectorC: [666, 0],
      });
    });
  });

  describe("nested providers", () => {
    it("should be able to read from parent providers", async () => {
      const { result, waitForNextUpdate } = renderHooks({
        action: () =>
          createSynergy(atomA, atomB, parentAtomA).createAction(
            () => (a, b, parentA) => {
              a.current += b.current + parentA.current;
            }
          )(),
        selectorA: () => atomA.createSelector(a => a)(),
        selectorB: () => atomB.createSelector(a => a)(),
        selectorParetA: () => parentAtomA.createSelector(a => a)(),
      });

      expectSelectors(result.current, {
        selectorA: [1, 0],
        selectorB: [2, 0],
        selectorParetA: [10, 0],
      });
      expect(result.current.selectorA).toBe(1);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expectSelectors(result.current, {
        selectorA: [13, 1],
        selectorB: [2, 0],
        selectorParetA: [10, 0],
      });
    });

    it("should be able to write to parent providers", async () => {
      const { result, waitForNextUpdate } = renderHooks({
        action: () =>
          createSynergy(atomA, atomB, parentAtomA).createAction(
            () => (a, b, parentA) => {
              parentA.current += a.current + b.current;
            }
          )(),
        selectorParentA: () => parentAtomA.createSelector(a => a)(),
      });

      expect(result.current.selectorParentA).toBe(10);
      expect(result.current.selectorParentAUpdateCount.current).toBe(0);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selectorParentA).toBe(13);
      expect(result.current.selectorParentAUpdateCount.current).toBe(1);
    });
  });

  describe("middlewares", () => {
    it("should notify middlewares", async () => {
      const middleware1Spy = jest.fn();
      const middleware2Spy = jest.fn();
      const { result, waitForNextUpdate } = renderHooks(
        {
          action: () =>
            createSynergy(atomA, atomB).createAction(() => (a, b) => {
              a.current += b.current;
            })(),
          selectorA: () => atomA.createSelector(a => a)(),
        },
        middlewareWrapper([
          next => atoms => {
            middleware1Spy(atoms);
            return next(atoms);
          },
          next => atoms => {
            middleware2Spy(atoms);
            return next(atoms);
          },
        ])
      );

      expect(result.current.selectorA).toBe(1);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selectorA).toBe(3);
      expect(middleware1Spy).toHaveBeenCalledWith([
        expect.objectContaining({
          atom: expect.objectContaining({ name: "a" }),
          value: 3,
          prev: 1,
        }),
        expect.objectContaining({
          atom: expect.objectContaining({ name: "b" }),
          value: NO_UPDATE,
          prev: 2,
        }),
      ]);
      expect(middleware2Spy).toHaveBeenCalledWith([
        expect.objectContaining({
          atom: expect.objectContaining({ name: "a" }),
          value: 3,
          prev: 1,
        }),
        expect.objectContaining({
          atom: expect.objectContaining({ name: "b" }),
          value: NO_UPDATE,
          prev: 2,
        }),
      ]);
    });

    it("should be able to handle manipulating middlewares", async () => {
      const { result, waitForNextUpdate } = renderHooks(
        {
          action: () =>
            createSynergy(atomA, atomB).createAction(() => (a, b) => {
              a.current = 1337;
              b.current = 42;
            })(),
          selectorA: () => atomA.createSelector(a => a)(),
          selectorB: () => atomB.createSelector(a => a)(),
        },
        middlewareWrapper([
          next => atoms => {
            return next(
              atoms
                .filter(({ atom }) => atom.name === "a")
                .map(atom => ({ ...atom, value: atom.value + 1 }))
            );
          },
        ])
      );

      expect(result.current.selectorA).toBe(1);
      expect(result.current.selectorB).toBe(2);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selectorA).toBe(1338);
      expect(result.current.selectorB).toBe(2);
    });
  });
});
