import { decrement, increment, reset } from './actions';

export interface CounterState {
  readonly count: number;
}

export enum CounterActionTypes {
  INCREMENT = '@@test/INCREMENT',
  DECREMENT = '@@test/DECREMENT',
  RESET = '@@test/RESET',
}

export type CounterAction = ReturnType<
  typeof increment | typeof decrement | typeof reset
>;
