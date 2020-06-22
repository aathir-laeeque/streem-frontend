import { Dispatch } from 'redux';
import { store } from './configureStore';
import { rootReducer } from './rootReducer';
import { NotificationActionType } from '../components/Notification/types';

export type RootState = ReturnType<typeof rootReducer>;

export interface BaseAction<T, P> {
  type: T;
  payload?: P;
}

export type AppDispatch =
  | Dispatch<NotificationActionType>
  | typeof store.dispatch;
