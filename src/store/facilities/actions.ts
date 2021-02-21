import { actionSpreader } from '../helpers';
import { Facilities, FacilitiesAction } from './types';

export const fetchFacilities = () =>
  actionSpreader(FacilitiesAction.FETCH_FACILITIES);

export const fetchFacilitiesOngoing = () =>
  actionSpreader(FacilitiesAction.FETCH_FACILITIES_ONGOING);

export const fetchFacilitiesSuccess = (facilities: Facilities) =>
  actionSpreader(FacilitiesAction.FETCH_FACILITIES_SUCCESS, {
    facilities,
  });

export const fetchFacilitiesError = (error: string) =>
  actionSpreader(FacilitiesAction.FETCH_FACILITIES_ERROR, { error });
