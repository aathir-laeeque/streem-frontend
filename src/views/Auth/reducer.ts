import { roles } from '#services/uiPermissions';
import { FacilitiesAction } from '#store/facilities/types';
import { keyBy } from 'lodash';

import {
  AuthAction,
  AuthActionType,
  AuthState,
  LicenseState,
  LicenseType,
  LicenseWorkflowType,
} from './types';

export const authInitialState: AuthState = {
  userId: null,
  isLoggedIn: false,
  isIdle: false,
  profile: null,
  accessToken: '',
  refreshToken: '',
  loading: false,
  facilities: [],
  NonGenuineLicenseMap: {},
  useCaseMap: {},
  fetchingUseCaseList: false,
};

const reducer = (state = authInitialState, action: AuthActionType): AuthState => {
  switch (action.type) {
    case AuthAction.ACCOUNT_LOOKUP:
    case AuthAction.RESET_PASSWORD:
    case AuthAction.LOGIN:
      return { ...state, loading: true };

    case AuthAction.LOGIN_SUCCESS:
      const getNonGenuineLicenseHashMap = (
        licesneArr: LicenseType[],
      ): { [facilityId: string]: LicenseType } => {
        return licesneArr.reduce((acc, { facilityId, ...rest }) => {
          if (rest.state === LicenseState.GENUINE || rest.workflow === LicenseWorkflowType.NONE) {
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
          NonGenuineLicenseMap: getNonGenuineLicenseHashMap(action.payload.licenses),
        }),
      };

    case AuthAction.SET_IDLE:
      return {
        ...state,
        isIdle: action.payload,
      };

    case AuthAction.CLEANUP:
      return {
        ...authInitialState,
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
        selectedUseCase: undefined,
      };

    case AuthAction.FETCH_USE_CASE_LIST_ONGOING:
      return { ...state, fetchingUseCaseList: true };

    case AuthAction.FETCH_USE_CASE_LIST_SUCCESS:
      return {
        ...state,
        fetchingUseCaseList: false,
        useCaseMap: keyBy(action.payload.useCases, 'id'),
      };

    case AuthAction.SET_SELECTED_USE_CASE:
      return { ...state, selectedUseCase: action.payload.selectedUseCase };

    case AuthAction.FETCH_USE_CASE_LIST_ERROR:
      return { ...state, error: action.payload?.error };

    case AuthAction.ACCOUNT_LOOKUP_SUCCESS:
      return {
        ...state,
        loading: false,
        userType: action.payload.type,
        email: action.payload.username,
      };

    default:
      return state;
  }
};

export { reducer as AuthReducer };
