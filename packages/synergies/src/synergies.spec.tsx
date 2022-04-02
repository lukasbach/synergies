import {
  createAtom,
  SynergyProvider,
  createSynergy,
  Middleware,
  MiddlewareProvider,
} from ".";
import { renderHook, act } from "@testing-library/react-hooks";
import { WrapperComponent } from "@testing-library/react-hooks/src/types/react";
import React from "react";
import { RenderHookResult } from "@testing-library/react-hooks/src/types";
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

  const renderHooks = <T extends Record<string, any>>(
    hooks: {
      [K in keyof T]: () => T[K];
    },
    wrapper = defaultWrapper
  ) => {
    // TODO additionally render a useEffect hook with the result as dependency, to check for unnecessary rerenders
    return renderHook(
      () => {
        return Object.entries(hooks).reduce(
          (acc, [key, hook]) => ({
            ...acc,
            [key]: hook(),
          }),
          {}
        );
      },
      { wrapper }
    ) as RenderHookResult<any, T, any>;
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

      expect(result.current.selectorA).toBe(1);
      expect(result.current.selectorB).toBe(2);
      expect(result.current.selectorC).toBe(3);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selectorA).toBe(2);
      expect(result.current.selectorB).toBe(4);
      expect(result.current.selectorC).toBe(6);
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

      expect(result.current.selectorA).toBe(1);
      expect(result.current.selectorB).toBe(2);
      expect(result.current.selectorC).toBe(3);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selectorA).toBe(7);
      expect(result.current.selectorB).toBe(2);
      expect(result.current.selectorC).toBe(3);
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
      });

      expect(result.current.selectorA).toBe(1);

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selectorA).toBe(13);
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

      act(() => {
        result.current.action();
      });

      await waitForNextUpdate();
      expect(result.current.selectorParentA).toBe(13);
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
