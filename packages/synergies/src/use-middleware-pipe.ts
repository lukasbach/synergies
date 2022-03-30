import { useMiddlewareContext } from "./use-middleware-context";
import { Middleware, MiddlewarePipingFunction } from "./types";
import { useCallback } from "react";

type InferPipeProps<T> = T extends MiddlewarePipingFunction<infer P>
  ? P
  : never;

async function compose<T extends any[]>(
  funcs: Array<ReturnType<MiddlewarePipingFunction<T>>>,
  props: T
) {
  if (funcs.length === 0) {
    return props;
  }

  const result = await new Promise<T>((res, rej) => {
    try {
      funcs.pop()((...values) => res(values))(...props);
    } catch (e) {
      rej(e);
    }
  });

  return compose(funcs, result);
}

export const useMiddlewarePipe = () => {
  const context = useMiddlewareContext();
  return useCallback(
    async <T extends keyof Middleware, P extends InferPipeProps<Middleware[T]>>(
      handlerName: T,
      entityName: string | null,
      props: P
    ): Promise<P> => {
      const handlers = (context ?? [])
        .map(middleware => middleware[handlerName]?.(entityName))
        .filter(handler => !!handler);
      return await compose(handlers, props);
    },
    [context]
  );
};
