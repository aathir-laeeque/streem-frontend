import { store } from '../App';
import { apiForgotPassword, apiLogin } from './apiUrls';
import { persistor } from '../App';
import { closeAllOverlayAction } from '#components/OverlayContainer/actions';

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
      const resu = await res.json();
      if (resu && resu.errors && resu.errors[0].code === '1101') {
        store.dispatch(closeAllOverlayAction());
        persistor.purge();
        window.location.href = '/auth/login/tokenRevoked';
        throw 'Token Revoked';
      }
      return resu;
    })
    .catch((e) => {
      console.error('Error in Request :', e);
    });
};
