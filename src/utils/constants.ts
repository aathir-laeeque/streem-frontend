export const fetchBaseUrl = () => {
  const { hostname, protocol } = window.location;

  let apiUrl = '';

  if (hostname === 'localhost') {
    apiUrl = `https://api.dev.streem.leucinetech.com/v1`;
  } else {
    apiUrl = `${protocol}//api.${hostname}/v1`;
  }

  return apiUrl;
};

export enum LoginErrorCodes {
  BLOCKED = 1004,
  INCORRECT = 1005,
  EXPIRED = 1007,
}
