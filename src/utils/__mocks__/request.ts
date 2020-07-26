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
  console.log('INSIDE MOCK REQUEST : FULL URL', fullUrl);
  if (apiGetChecklists() + queryStrings === fullUrl) {
    data = {
      object: 'list',
      status: 'ok',
      message: 'success',
      data: [
        {
          id: 1,
          name: 'Fuild Bed Dryer Checklist',
          code: 'CHK-JUN10-1',
          noOfJobs: 13,
          version: 1,
          archived: false,
          properties: {
            TYPE: 'Group',
            'SOP NO': 'ZYD/SOP/CLN/FBD/002',
            'EQUIPMENT ID': 'ZYD/SOP/001',
          },
        },
      ],
      pageable: {
        page: 0,
        pageSize: 10,
        numberOfElements: 1,
        totalPages: 1,
        totalElements: 1,
        first: true,
        last: true,
        empty: false,
      },
      errors: null,
    };
  } else if (apiGetJobs() + queryStrings === fullUrl) {
    data = {
      object: 'list',
      status: 'ok',
      message: 'success',
      data: [
        {
          id: 9,
          code: 'JOB-JUL20-9',
          totalTasks: 17,
          completedTasks: 0,
          status: 'unassigned',
          checklist: { id: 1, name: 'Fuild Bed Dryer Checklist' },
          users: [],
        },
        {
          id: 7,
          code: 'JOB-JUL20-7',
          totalTasks: 17,
          completedTasks: 0,
          status: 'unassigned',
          checklist: { id: 1, name: 'Fuild Bed Dryer Checklist' },
          users: [],
        },
        {
          id: 6,
          code: 'JOB-JUL20-6',
          totalTasks: 17,
          completedTasks: 0,
          status: 'unassigned',
          checklist: { id: 1, name: 'Fuild Bed Dryer Checklist' },
          users: [],
        },
        {
          id: 5,
          code: 'JOB-JUL20-5',
          totalTasks: 17,
          completedTasks: 5,
          status: 'unassigned',
          checklist: { id: 1, name: 'Fuild Bed Dryer Checklist' },
          users: [],
        },
      ],
      pageable: {
        page: 0,
        pageSize: 10,
        numberOfElements: 4,
        totalPages: 1,
        totalElements: 4,
        first: true,
        last: true,
        empty: false,
      },
      errors: null,
    };
  } else if (apiGetProperties() === url) {
    if (apiGetProperties() + '?type=job' === fullUrl) {
      data = {
        object: 'list',
        status: 'ok',
        message: 'success',
        data: [
          {
            id: 4,
            name: 'PRODUCT MANUFACTURED',
            placeHolder: 'Name of the Product being cleaned',
            orderTree: 1,
            mandatory: true,
          },
          {
            id: 5,
            name: 'BATCH NO',
            placeHolder: 'Batch No. of the manufactured Product',
            orderTree: 2,
            mandatory: true,
          },
          {
            id: 6,
            name: 'ROOM ID',
            placeHolder: 'Room ID for the Equipment',
            orderTree: 3,
            mandatory: false,
          },
        ],
        pageable: {
          page: 0,
          pageSize: 25,
          numberOfElements: 3,
          totalPages: 1,
          totalElements: 3,
          first: true,
          last: true,
          empty: false,
        },
        errors: null,
      };
    } else {
      data = {
        object: 'list',
        status: 'ok',
        message: 'success',
        data: [
          {
            id: 1,
            name: 'EQUIPMENT ID',
            placeHolder: 'Equipment Id',
            orderTree: 1,
            mandatory: false,
          },
          {
            id: 2,
            name: 'TYPE',
            placeHolder: 'Type of checklist',
            orderTree: 2,
            mandatory: false,
          },
          {
            id: 3,
            name: 'SOP NO',
            placeHolder: 'SOP NO',
            orderTree: 3,
            mandatory: false,
          },
        ],
        pageable: {
          page: 0,
          pageSize: 25,
          numberOfElements: 3,
          totalPages: 1,
          totalElements: 3,
          first: true,
          last: true,
          empty: false,
        },
        errors: null,
      };
    }
  }
  return mockedResponse(data);
};
