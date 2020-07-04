import { store } from './configureStore';
import { rootReducer } from './rootReducer';

export type RootState = ReturnType<typeof rootReducer>;

// TODO: remove this as this is not needed
export type AppDispatch = typeof store.dispatch;
