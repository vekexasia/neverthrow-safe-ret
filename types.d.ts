import {Ok, Err} from 'neverthrow';

declare module "neverthrow" {
  export interface Err<T, E> {
    safeRet(): E extends never ? [E, T] : [E, undefined];
  }

  export interface Ok<T, E> {
    safeRet(): T extends never ? [E, T] : [undefined, T];
  }
}
