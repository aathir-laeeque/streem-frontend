import { rootReducer } from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

export interface BaseAction<T, P> {
  type: T;
  payload?: P;
}
