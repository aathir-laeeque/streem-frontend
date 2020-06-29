import { store } from './configureStore';
import { rootReducer } from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

export type Action<T> = { type: T };
export type ActionWithPayload<T, P> = { type: T; payload?: P };

export interface BaseAction<T, P> {
  type: T;
  payload?: P;
}

// TODO: remove this as this is not needed
export type AppDispatch = typeof store.dispatch;
