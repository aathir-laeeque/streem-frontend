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
