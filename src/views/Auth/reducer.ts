import { AuthAction, AuthActionType, AuthState } from './types';

const initialState: AuthState = {
  userId: null,
  isLoggedIn: false,
  isIdle: false,
  profile: null,
  accessToken: '',
  refreshToken: '',
  loading: false,
  isRefreshing: false,
  error: undefined,
  resetRequested: false,
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
        isIdle: false,
        loading: false,
        roles: action.payload.roles,
        userId: action.payload?.id,
        accessToken: action.payload?.accessToken,
        refreshToken: action.payload?.refreshToken,
        settings: action.payload?.settings,
        accessTokenExpirationInMinutes:
          action.payload?.accessTokenExpirationInMinutes,
        refreshTokenExpirationInMinutes:
          action.payload?.refreshTokenExpirationInMinutes,
        sessionIdleTimeoutInMinutes:
          action.payload?.sessionIdleTimeoutInMinutes,
      };
    case AuthAction.SET_IDLE:
      return {
        ...state,
        isIdle: action.payload,
      };
    case AuthAction.LOGOUT_SUCCESS:
      return {
        ...initialState,
      };
    case AuthAction.FORGOT_PASSWORD_SUCCESS:
      return { ...state, loading: false, resetRequested: true };
    case AuthAction.LOGIN_ERROR:
    case AuthAction.FORGOT_PASSWORD_ERROR:
    case AuthAction.RESET_PASSWORD_ERROR:
      return { ...state, loading: false, error: action.payload };
    case AuthAction.FETCH_PROFILE_SUCCESS:
      return { ...state, profile: action.payload };
    case AuthAction.UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case AuthAction.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload?.accessToken,
        refreshToken: action.payload?.refreshToken,
      };
    case AuthAction.CHECK_TOKEN_EXPIRY_SUCCESS:
      return {
        ...state,
        isTokenExpired: action.payload.isTokenExpired,
      };
    case AuthAction.RESET_ERROR:
      return { ...state, error: undefined };
    default:
      return state;
  }
};

export { reducer as AuthReducer };
