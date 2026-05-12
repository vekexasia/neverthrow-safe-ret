import {Ok, Err, Result} from 'neverthrow';

declare module "neverthrow" {
  export interface Err<T, E> {
    safeRet(): E extends never ? [E, T] : [E, undefined];
  }

  export interface Ok<T, E> {
    safeRet(): T extends never ? [E, T] : [undefined, T];
  }
}

Ok.prototype.safeRet = function () {
  return [undefined, this.value];
};

Err.prototype.safeRet = function () {
  return [this.error, undefined];
};

/**
 * Async safeRet for PromiseLike<Result<T, E>>.
 * Works with both ResultAsync and Promise<Result<T, E>>.
 *
 * @example
 * ```ts
 * // With ResultAsync
 * const [e, v] = await safeRet(fetchUser(id));
 * if (e) return err(e);
 *
 * // With Promise<Result>
 * const [e, v] = await safeRet(myAsyncFn());
 * if (e) return err(e);
 * ```
 */
export function safeRet<T, E>(promise: PromiseLike<Result<T, E>>): Promise<[E, undefined] | [undefined, T]> {
  return Promise.resolve(promise).then((res) => res.safeRet() as [E, undefined] | [undefined, T]);
}
