import { store } from '../App';
import { apiForgotPassword, apiLogin } from './apiUrls';
import { closeAllOverlayAction } from '#components/OverlayContainer/actions';
import { logOutSuccess } from '#views/Auth/actions';
import { NotificationType } from '#components/Notification/types';
import { LoginErrorCodes } from './constants';

interface RequestOptions {
  data?: Record<string | number, any>;
  formData?: FormData;
  params?: Record<string | number, any>;
  headers?: Record<string, string>;
}

const buildQueryParams = (params: any) =>
  Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

// TODO: use generic here to make API response type-safe
export const request = async (
  method: string,
  url: string,
  options?: RequestOptions,
) => {
  const {
    auth: { accessToken },
  } = store.getState();

  let apiUrl = url;
  if (options?.params) {
    apiUrl +=
      (url.indexOf('?') === -1 ? '?' : '&') + buildQueryParams(options?.params);
  }

  return await fetch(apiUrl, {
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...(apiUrl !== apiForgotPassword() &&
        apiUrl !== apiLogin() &&
        accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...(!options?.formData && { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
    // TODO: check this when using POST request
    ...(options?.data && { body: JSON.stringify(options?.data) }),
    ...(options?.formData && { body: options?.formData }),
  })
    .then(async (res) => {
      const result = await res.json();
      if (
        result?.errors?.[0]?.code === LoginErrorCodes.TOKEN_REVOKED.toString()
      ) {
        const msg = 'Token Revoked';
        store.dispatch(closeAllOverlayAction());
        store.dispatch(
          logOutSuccess({
            msg,
            type: NotificationType.ERROR,
          }),
        );
      }
      return result;
    })
    .catch((e) => {
      console.error('Error in Request :', e);
    });
};
