import {
  FaciltyWiseConstantsState,
  FacilityWiseConstantsActionType,
  FacilityWiseConstantsAction,
} from './types';

const initialState: FaciltyWiseConstantsState = {};

const reducer = (
  state = initialState,
  action: FacilityWiseConstantsActionType,
): FaciltyWiseConstantsState => {
  switch (action.type) {
    case FacilityWiseConstantsAction.SET_INITIAL_FACILITY_WISE_CONSTANTS:
      return {
        ...state,
        ...action.payload.initialFacilityWiseConstants,
      };
    case FacilityWiseConstantsAction.SET_FACILITY_TIMESTAMP:
      return {
        ...state,
        [action.payload.facilityId]: {
          timeStampFormat: action.payload.timeStampFormat,
        },
      };

    default:
      return state;
  }
};

export { reducer as FacilityWiseConstantsReducer };
