import { roles } from '#services/uiPermissions';
import { FacilitiesAction } from '#store/facilities/types';

import {
  AuthAction,
  AuthActionType,
  AuthState,
  LicenseState,
  LicenseType,
  LicenseWorkflowType,
} from './types';

const initialState: AuthState = {
  userId: null,
  isLoggedIn: false,
  isIdle: false,
  profile: null,
  accessToken: '',
  refreshToken: '',
  loading: false,
  facilities: [],
  NonGenuineLicenseMap: {},
};

const reducer = (state = initialState, action: AuthActionType): AuthState => {
  switch (action.type) {
    case AuthAction.RESET_PASSWORD:
    case AuthAction.LOGIN:
      return { ...state, loading: true };

    case AuthAction.LOGIN_SUCCESS:
      const getNonGenuineLicenseHashMap = (
        licesneArr: LicenseType[],
      ): { [facilityId: string]: LicenseType } => {
        return licesneArr.reduce((acc, { facilityId, ...rest }) => {
          if (
            rest.state === LicenseState.GENUINE ||
            rest.workflow === LicenseWorkflowType.NONE
          ) {
            return acc;
          }
          return { ...acc, [facilityId]: { ...rest } };
        }, {});
      };

      return {
        ...state,
        isIdle: false,
        loading: false,
        isLoggedIn: true,
        userId: action.payload.id,
        ...action.payload,
        selectedFacility:
          action.payload?.facilities?.length < 2 ||
          action.payload.roles.some((r) => r === roles.SYSTEM_ADMIN)
            ? action.payload?.facilities[0]
            : state.selectedFacility,
        facilities: action.payload.facilities,
        ...(!!action.payload.licenses && {
          NonGenuineLicenseMap: getNonGenuineLicenseHashMap(
            action.payload.licenses,
          ),
        }),
      };

    case AuthAction.SET_IDLE:
      return {
        ...state,
        isIdle: action.payload,
      };

    case AuthAction.CLEANUP:
      return {
        ...initialState,
      };
    case AuthAction.AUTH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case AuthAction.FETCH_PROFILE_SUCCESS:
      return { ...state, profile: action.payload };
    case AuthAction.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
      };
    case AuthAction.SET_IDENTITY_TOKEN:
      return {
        ...state,
        ...action.payload,
        error: undefined,
      };

    case AuthAction.RESET_ERROR:
      return { ...state, error: undefined };

    case AuthAction.SET_CHALLENGE_QUESTION_SUCCESS:
      return { ...state, hasSetChallengeQuestion: true, token: undefined };

    case FacilitiesAction.SWITCH_FACILITY_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        selectedFacility: state.facilities.find(
          (facility) => facility.id === action.payload.facilityId,
        ),
      };

    default:
      return state;
  }
};

export { reducer as AuthReducer };
