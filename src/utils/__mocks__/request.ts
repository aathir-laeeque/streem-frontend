import {
  apiGetUsers,
  apiGetChecklists,
  apiGetChecklist,
  apiGetJobs,
  apiAssignUser,
  apiUnAssignUser,
  apiGetSelectedJob,
  apiExecuteActivity,
  apiCompleteTask,
  apiGetProperties,
} from '#utils/apiUrls';

import {
  checklists,
  jobs,
  jobsProperties,
  checklistsProperties,
  users,
} from '#mocks';

interface RequestOptions {
  data?: Record<string | number, any>;
  params?: Record<string | number, any>;
  headers?: Record<string, string>;
}

const mockedResponse = (data: any, valid = true) => {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      valid ? resolve(data) : reject(data);
    });
  });
};

const buildQueryParams = (params: any) =>
  Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

export const request = async (
  method: string,
  url: string,
  options?: RequestOptions,
) => {
  let queryStrings;
  let data;

  if (options?.params) {
    queryStrings =
      (url.indexOf('?') === -1 ? '?' : '&') + buildQueryParams(options?.params);
  }
  const fullUrl = url + queryStrings;
  if (apiGetChecklists() + queryStrings === fullUrl) {
    data = checklists;
  } else if (apiGetJobs() + queryStrings === fullUrl) {
    data = jobs;
  } else if (apiGetUsers() + queryStrings === fullUrl) {
    data = users;
  } else if (apiGetProperties() === url) {
    if (apiGetProperties() + '?type=job' === fullUrl) {
      data = jobsProperties;
    } else {
      data = checklistsProperties;
    }
  }
  return mockedResponse(data);
};
