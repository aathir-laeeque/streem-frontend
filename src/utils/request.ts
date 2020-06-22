// TODO: use generic here to make API response type-safe
export const request = async (method: string, url: string, options?: any) =>
  await fetch(url, {
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    ...options,
  }).then((res) => res.json());
