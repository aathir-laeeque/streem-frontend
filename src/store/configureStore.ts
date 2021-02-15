import { applyMiddleware, compose, createStore, Middleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';
import { AuthAction } from '#views/Auth/types';
import { OverlayContainerAction } from '#components/OverlayContainer/types';

const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'activityFilters'],
  transforms: [
    createTransform(
      (inboundState: any, key: string) => {
        switch (key) {
          case 'auth':
            return {
              ...inboundState,
              isRefreshing: false,
              error: undefined,
              isTokenExpired: undefined,
            };
          default:
            return inboundState;
        }
      },
      (outboundState: any) => {
        return {
          ...outboundState,
        };
      },
    ),
  ],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

let onIdleRequests: any[] = [];
let previousIdle = true;

const handleOnIdle: Middleware = (store) => (next) => (action) => {
  const {
    auth: { isIdle, isLoggedIn },
  } = store.getState();

  if (isIdle) {
    if (
      action.type !== AuthAction.LOGIN &&
      action.type !== OverlayContainerAction.OPEN_OVERLAY &&
      !action['@@redux-saga/SAGA_ACTION']
    ) {
      previousIdle = isIdle;
      onIdleRequests.push(action);
      return false;
    }
  } else {
    if (previousIdle && isLoggedIn) {
      previousIdle = false;
      onIdleRequests.forEach((action) => store.dispatch(action));
      onIdleRequests = [];
    }
  }

  previousIdle = isIdle;
  next(action);
};

export const configureStore = (initialState: {
  [x: string]: any;
  _persist: { version: number; rehydrated: boolean };
}) => {
  const middlewares = [handleOnIdle, sagaMiddleware];

  const composeEnhancers =
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          actionSanitizer: (action: any) =>
            action.type === '@@overlay/Container/OPEN_OVERLAY'
              ? {
                  ...action,
                  payload: { ...action.payload, popOverAnchorEl: '<<EVENT>>' },
                }
              : action,
          stateSanitizer: (state: any) =>
            state.overlayContainer
              ? {
                  ...state,
                  overlayContainer: state.overlayContainer.currentOverlays.map(
                    (overlay: any) => ({
                      ...overlay,
                      popOverAnchorEl: '<<EVENT>>',
                    }),
                  ),
                }
              : state,
        })
      : compose;

  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};
