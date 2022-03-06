import { Facility } from '#services/commonTypes';
import { actionSpreader } from '#store/helpers';
import { FacilityWiseConstantsAction } from './types';

export const setInitialFacilityWiseConstants = (facilities: Facility[]) => {
  const data = facilities.map((facilityData) => {});
  const initialFacilityWiseConstants = facilities.reduce(
    (data, facilityData) => ({
      ...data,
      [facilityData.id]: {
        timeStampFormat: 'MMM DD, YYYY HH:mm',
      },
    }),
    {},
  );
  return actionSpreader(
    FacilityWiseConstantsAction.SET_INITIAL_FACILITY_WISE_CONSTANTS,
    {
      initialFacilityWiseConstants,
    },
  );
};

export const setFacilityTimeStampFormat = (
  timeStampFormat: string,
  facilityId: string,
) =>
  actionSpreader(FacilityWiseConstantsAction.SET_FACILITY_TIMESTAMP, {
    facilityId,
    timeStampFormat,
  });
