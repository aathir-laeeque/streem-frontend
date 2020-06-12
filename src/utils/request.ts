import axios from 'axios';

// function checkStatus(response) {
//   if (response.status === 204 || response.status === 205) {
//     return null;
//   }
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }

//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

export const request = (method, url, options) => {
  // console.log('params', method, url, options); // NOTE: intentional log
  return axios({
    method,
    url,
    withCredentials: true,
    ...options,
  });
};
