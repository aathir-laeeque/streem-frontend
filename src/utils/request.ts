import axios, { AxiosRequestConfig } from 'axios';

const checkStatus = (response: any) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    const error = new Error(response.error);

    throw error;
  }
};

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} method       The method of the XHR call Eg: GET, POST, PUT, DELETE etc.
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export const request = (
  method: AxiosRequestConfig['method'],
  url: string,
  options: any,
) =>
  axios({
    method,
    url,
    withCredentials: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    ...options,
  }).then(checkStatus);
