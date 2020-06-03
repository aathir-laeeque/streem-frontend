import { BaseAction } from './types';

export const actionSpreader = <T extends string, P extends any>(
  type: T,
  payload?: P,
): BaseAction<T, P> => ({ type, payload });
