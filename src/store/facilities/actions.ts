import { FacilitiesAction, Facilities } from './types';
import { actionSpreader } from '../helpers';

export const fetchFacilities = () =>
  actionSpreader(FacilitiesAction.FETCH_FACILITIES);

export const fetchFacilitiesOngoing = () =>
  actionSpreader(FacilitiesAction.FETCH_FACILITIES_ONGOING);

export const fetchFacilitiesSuccess = (facilities: Facilities) =>
  actionSpreader(FacilitiesAction.FETCH_FACILITIES_SUCCESS, {
    facilities,
  });

export const fetchFacilitiesError = (error: any) =>
  actionSpreader(FacilitiesAction.FETCH_FACILITIES_ERROR, { error });
