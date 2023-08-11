import { ResponseObj } from '#utils/globalTypes';
import { apiGetObjects, apiQrShortCode, baseUrl } from '#utils/apiUrls';
import { getErrorMsg, request } from '#utils/request';
import { Object } from './types';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '#utils/constants';

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

export const getObjectPartialCall = async (data: Record<string, any>) => {
  try {
    const response: ResponseObj<Object> = await request('GET', `${baseUrl}/objects/partial`, {
      params: { page: DEFAULT_PAGE_NUMBER, size: DEFAULT_PAGE_SIZE, ...data },
    });
    if (response.data) {
      return response.data;
    }
    throw response?.errors;
  } catch (error) {
    throw getErrorMsg(error as any);
  }
};

export const qrCodeValidator = async ({
  data,
  callBack,
  objectTypeValidation,
  filters = {},
}: {
  data: Record<string, string>;
  callBack: () => void;
  objectTypeValidation: boolean;
  filters: any;
}) => {
  if (objectTypeValidation && data?.entityType === 'OBJECTS') {
    const fetchedData = await getObjectPartialCall({ collection: data.collection, filters });
    if (fetchedData?.length > 0) {
      callBack();
    } else {
      throw 'Resource Not Found';
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
