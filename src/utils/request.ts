interface RequestOptions {
  data: Record<string | number, any>;
  params: Record<string | number, any>;
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
  let apiUrl = url;

  if (options?.params) {
    apiUrl +=
      (url.indexOf('?') === -1 ? '?' : '&') + buildQueryParams(options?.params);
  }

  return await fetch(apiUrl, {
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    // TODO: check this when using POST request
    ...(options?.data && { body: JSON.stringify(options?.data) }),
  }).then((res) => res.json());
};
