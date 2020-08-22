import { AuthAction, AuthActionType, AuthState } from './types';

const initialState: AuthState = {
  userId: null,
  isLoggedIn: false,
  profile: null,
  token: '',
  refreshToken: '',
  loading: false,
  isRefreshing: false,
  error: undefined,
};

const reducer = (state = initialState, action: AuthActionType): AuthState => {
  switch (action.type) {
    case AuthAction.REFRESH_TOKEN_POLL:
      return { ...state, isRefreshing: true };
    case AuthAction.LOGIN:
      return { ...state, loading: true };
    case AuthAction.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        userId: action.payload?.id,
        token: action.payload?.token,
        refreshToken: action.payload?.refreshToken,
      };
    case AuthAction.LOGIN_ERROR:
      return { ...state, loading: false, error: action.payload?.error };
    case AuthAction.FETCH_PROFILE_SUCCESS:
      return { ...state, profile: action.payload };
    case AuthAction.UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case AuthAction.REFRESH_TOKEN_SUCCESS:
      return { ...state, token: action.payload?.token };
    default:
      return state;
  }
};

export { reducer as AuthReducer };
