import { ResponseObj } from '#utils/globalTypes';
import { apiGetObjects, apiQrShortCode } from '#utils/apiUrls';
import { getErrorMsg, request } from '#utils/request';
import { store } from '../../App';
import { Object } from './types';

export const getObjectData = async (data: Record<string, string | number | undefined>) => {
  try {
    const { id, ...params } = data;
    const response: ResponseObj<Object> = await request('GET', apiGetObjects(id as string), {
      params,
    });
    if (response.data) {
      return response.data;
    }
    throw response?.errors;
  } catch (error) {
    console.error('Error in get objects data function :: ', error);
    throw getErrorMsg(error as any);
  }
};

export const qrCodeValidator = async ({
  data,
  callBack,
  objectTypeValidation,
}: {
  data: Record<string, string>;
  callBack: () => void;
  objectTypeValidation: boolean;
}) => {
  if (objectTypeValidation && data?.entityType === 'OBJECTS') {
    const fetchedData = await getObjectData({
      id: data.objectId,
      collection: data.collection,
    });
    const {
      auth: { selectedFacility },
    } = store.getState();
    if (selectedFacility?.id === fetchedData?.facilityId) {
      callBack();
    } else {
      throw "Object doesn't belong in the facility";
    }
  } else {
    throw 'Resource Not Found';
  }
};

export const getQrCodeData = async (params: any) => {
  const { data, errors } = await request('GET', apiQrShortCode(), {
    params,
  });
  if (data) {
    return data;
  }
  if (errors) {
    throw getErrorMsg(errors as any);
  }
};

// TODO : Seems like a duplicate and wrongly implemented version of : 'FlagPositions' 'getBooleanFromDecimal'
export enum PropertyFlags {
  SYSTEM = 1,
  EXTERNAL_ID = 27,
  EXTERNAL_ID_AUTO_GENERATE = 59,
  DISPLAY_NAME = 21,
  MANDATORY = 16,
  OPTIONAL = 0,
}
