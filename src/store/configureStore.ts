/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  transforms: [
    createTransform(
      (inboundState: any, key: string) => {
        return {
          ...inboundState,
          isRefreshing: false,
          resetRequested: false,
          error: undefined,
        };
      },
      (outboundState: any, key: string) => {
        return {
          ...outboundState,
          isRefreshing: false,
          resetRequested: false,
          error: undefined,
        };
      },
    ),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = (initialState: {
  [x: string]: any;
  _persist: { version: number; rehydrated: boolean };
}) => {
  const middlewares = [sagaMiddleware];

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
