import { store } from './configureStore';
import { rootReducer } from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

export interface BaseAction<T, P> {
  type: T;
  payload?: P;
}

export type AppDispatch = typeof store.dispatch;
