import { apiGetObjects } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
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
  validateObjectType,
}: {
  data: Record<string, string>;
  callBack: () => void;
  validateObjectType: boolean;
}) => {
  if (validateObjectType && data?.entityType === 'object') {
    const fetchedData = await getObjectData({
      id: data.id,
      collection: data.collection,
      usageStatus: 1,
    });
    const {
      auth: { selectedFacility },
    } = store.getState();
    if (selectedFacility?.id === fetchedData?.facilityId) {
      callBack();
    } else {
      throw 'Object not found';
    }
  } else {
    throw 'Invalid QR Code';
  }
};
