import { useMiddlewareContext } from "./use-middleware-context";
import { AtomWithValueArray, Middleware } from "./types";
import { useCallback } from "react";

async function compose<T extends any[]>(
  funcs: Array<Middleware<T>>,
  atoms: AtomWithValueArray<T>
) {
  if (funcs.length === 0) {
    return atoms;
  }

  const result = await new Promise<AtomWithValueArray<T>>((res, rej) => {
    try {
      funcs.pop()(updatedAtoms => res(updatedAtoms))(atoms);
    } catch (e) {
      rej(e);
    }
  });

  return compose(funcs, result);
}

export const useMiddlewarePipe = () => {
  const context = useMiddlewareContext();
  return useCallback(
    async <P extends AtomWithValueArray>(atoms: P): Promise<P> =>
      await compose(context ? [...context] : [], atoms),
    [context]
  );
};
