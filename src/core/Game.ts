import { Subject } from 'rxjs';

export type GameChange = {
  type: 'batch';
  changedProperties: Record<string, any>;
};

export type GameWithBatching = {
  changes$: Subject<GameChange>;
};

export function createReactiveGame<T extends object>(instance: T): T & GameWithBatching {
  const changes$ = new Subject<GameChange>();

  let isBatching = false;
  //eslint-disable-next-line
  let batchChanges: Record<string, any> = {};

  const batchStart = () => {
    isBatching = true;
    batchChanges = {};
  };

  const batchEnd = () => {
    if (Object.keys(batchChanges).length > 0) {
      changes$.next({ type: 'batch', changedProperties: { ...batchChanges } });
    }
    batchChanges = {};
    isBatching = false;
  };
  let batchDepth = 0;
  //eslint-disable-next-line
  const proxy = new Proxy(instance as any, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      // Автообертка для функций (методов)
      if (typeof value === 'function' && prop !== 'constructor') {
        //eslint-disable-next-line

        return (...args: any[]) => {
          if (batchDepth === 0) batchStart();
          batchDepth++;

          try {
            const result = value.apply(receiver, args);
            // Если метод асинхронный — ждём завершения
            if (result instanceof Promise) {
              batchDepth--;
              return result.finally(() => {
                if (batchDepth === 0) batchEnd();
              });
            } else {
              batchDepth--;
              if (batchDepth === 0) batchEnd();
              return result;
            }
          } catch (error) {
            batchDepth--;
            if (batchDepth === 0) batchEnd();
            throw error;
          }
        };
      }

      return value;
    },

    set(target, prop: string, value, receiver) {
      const oldValue = target[prop];
      if (oldValue !== value) {
        Reflect.set(target, prop, value, receiver);
        if (isBatching) {
          batchChanges[prop] = value;
        } else {
          changes$.next({ type: 'batch', changedProperties: { [prop]: value } });
        }
      }
      return true;
    },
  });

  return Object.assign(proxy, { changes$ });
}
