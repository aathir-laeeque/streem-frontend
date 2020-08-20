import { Reducer } from 'react';
import { AuthAction, AuthActionType, AuthState } from './types';

const initialState: AuthState = {
  isLoggedIn: false,
  loading: false,
  error: undefined,
  profile: null,
};

const reducer: Reducer<AuthState, AuthActionType> = (
  state = initialState,
  action: AuthActionType,
) => {
  switch (action.type) {
    case AuthAction.LOGIN:
      return { ...state, loading: true };
    case AuthAction.REFRESH_TOKEN:
      return { ...state, loading: true };
    case AuthAction.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case AuthAction.LOGIN_ERROR:
      return { ...state, loading: false, error: action.payload?.error };

    default:
      return { ...state };
  }
};

export { reducer as AuthReducer };
