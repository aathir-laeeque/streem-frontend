import { users, jobs } from '#mocks';

import { ModalContainer } from '#components';
import { configureStore } from '#store';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

describe('<ModalContainer />', () => {
  let store: Store;

  it('CREATE_JOB_MODAL and match the snapshot', () => {
    store = configureStore({
      modalContainer: {
        currentModals: [
          {
            type: 'CREATE_JOB_MODAL',
            props: {
              selectedChecklist: {
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
              properties: [
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
            },
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <ModalContainer />
      </Provider>,
    );
    expect(screen).toMatchSnapshot();
  });

  it('JOB_USER_ASSIGN_MODAL and match the snapshot', () => {
    store = configureStore({
      modalContainer: {
        currentModals: [
          {
            type: 'JOB_USER_ASSIGN',
            props: {
              selectedJobIndex: 0,
            },
          },
        ],
      },
      users: {
        list: users.data,
        pageable: users.pageable,
      },
      jobListView: {
        loading: false,
        selectedStatus: 'unassigned',
        jobs: {
          assigned: {
            list: [],
            pageable: {
              page: 0,
              pageSize: 10,
              numberOfElements: 0,
              totalPages: 0,
              totalElements: 0,
              first: true,
              last: true,
              empty: true,
            },
          },
          unassigned: {
            list: jobs.data,
            pageable: jobs.pageable,
          },
        },
      },
    });
    render(
      <Provider store={store}>
        <ModalContainer />
      </Provider>,
    );
    expect(screen).toMatchSnapshot();
  });
});
